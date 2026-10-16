(function () {
  /* ---------- Tema claro / escuro ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function updateButton() {
    if (!toggle) return;
    var t = current();
    toggle.dataset.mode = t;
    var label = t === 'dark' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  }

  if (toggle) {
    updateButton();
    if (mq && mq.addEventListener) mq.addEventListener('change', updateButton);
    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('devjc-tema', next); } catch (e) {}
      updateButton();
    });
  }

  /* ---------- Contato ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.dataset.copy);
      var txt = el.textContent.trim();
      function done() {
        btn.textContent = 'Copiado';
        setTimeout(function () { btn.textContent = 'Copiar'; }, 1600);
      }
      function fallback() {
        var r = document.createRange();
        r.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        btn.textContent = 'Selecionado';
      }
      try { navigator.clipboard.writeText(txt).then(done, fallback); } catch (e) { fallback(); }
    });
  });

  /* ---------- Níveis na página inicial ----------
     Os projetos ficam só no projetos.html. Aqui a página lê esse arquivo
     e mostra os projetos do nível clicado. Se não conseguir ler
     (ex.: abrindo o arquivo direto do computador), o clique só abre o projetos.html. */
  var meter = document.querySelector('.teaser .meter');
  var painel = document.getElementById('nivel-painel');
  if (meter && painel && window.fetch && window.DOMParser) {
    var niveis = null;

    function mostrar(n, animar) {
      var art = niveis && niveis.getElementById('nivel-' + n);
      if (!art) return false;
      var titulo = art.querySelector('.nivel-head h2');
      var sub = art.querySelector('.nivel-head p');
      var cards = art.querySelectorAll('.proj.destaque');
      if (!cards.length) cards = art.querySelectorAll('.proj');

      painel.innerHTML = '';
      var head = document.createElement('div');
      head.className = 'np-head';
      head.innerHTML = '<span class="n"></span><h3></h3><span class="sub"></span>';
      head.querySelector('.n').textContent = (n < 10 ? '0' : '') + n;
      head.querySelector('h3').textContent = titulo ? titulo.textContent : 'Nível ' + n;
      head.querySelector('.sub').textContent = sub ? sub.textContent : '';
      painel.appendChild(head);

      var grid = document.createElement('div');
      grid.className = 'np-cards';
      cards.forEach(function (c) { grid.appendChild(document.importNode(c, true)); });
      if (!cards.length) {
        var vazio = document.createElement('p');
        vazio.className = 'empty';
        vazio.textContent = 'Ainda não tem projetos neste nível. Volte em breve!';
        grid.appendChild(vazio);
      }
      painel.appendChild(grid);

      var mais = document.createElement('a');
      mais.className = 'np-more';
      mais.href = 'projetos.html#nivel-' + n;
      mais.textContent = 'Ver o nível ' + n + ' na página de projetos →';
      painel.appendChild(mais);

      meter.querySelectorAll('.m').forEach(function (m) {
        m.setAttribute('aria-pressed', m.dataset.n === String(n) ? 'true' : 'false');
      });
      if (animar) { painel.classList.remove('in'); void painel.offsetWidth; painel.classList.add('in'); }
      return true;
    }

    meter.addEventListener('click', function (e) {
      var m = e.target.closest('.m');
      if (!m || !niveis) return;              // sem dados: segue o link normal
      if (mostrar(+m.dataset.n, true)) e.preventDefault();
    });

    fetch('projetos.html')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (txt) {
        niveis = new DOMParser().parseFromString(txt, 'text/html');
        var atual = meter.querySelector('.m.c102') || meter.querySelector('.m');
        if (atual) mostrar(+atual.dataset.n, false);
      })
      .catch(function () {});
  }
})();
