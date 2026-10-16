// Monta o HTML dos cards de projeto. Usado pelo site (script.js).
(function () {
  var CATS = { front: 'Front-end', back: 'Back-end', full: 'Full stack' };
  var STATUS = {
    concluido: ['c200', '200 Concluído'],
    andamento: ['c102', '102 Em andamento'],
    planejado: ['c202', '202 Planejado']
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function safeUrl(u) {
    u = String(u || '').trim();
    return /^https?:\/\/\S+$/i.test(u) ? u : '';
  }

  function card(p) {
    var st = STATUS[p.status] || STATUS.concluido;
    var links = [];
    var repo = safeUrl(p.repo), demo = safeUrl(p.demo);
    if (repo) links.push('<a href="' + esc(repo) + '" target="_blank" rel="noopener">Código</a>');
    if (demo) links.push('<a href="' + esc(demo) + '" target="_blank" rel="noopener">Ver online</a>');
    var tags = (p.tags || []).filter(Boolean).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');

    return '<article class="proj">' +
      '<div class="meta"><span class="label">' + esc(CATS[p.cat] || 'Projeto') +
        (p.exemplo ? ' <span class="ex">exemplo</span>' : '') + '</span>' +
        '<span class="code ' + st[0] + '">' + st[1] + '</span></div>' +
      '<h3>' + esc(p.title || 'Projeto sem título') + '</h3>' +
      (p.desc ? '<p>' + esc(p.desc) + '</p>' : '') +
      (tags ? '<div class="tags">' + tags + '</div>' : '') +
      (links.length ? '<div class="links">' + links.join('') + '</div>' : '') +
    '</article>';
  }

  function renderCards(list) {
    return list && list.length
      ? list.map(card).join('\n')
      : '<p class="empty">Nenhum projeto publicado ainda.</p>';
  }

  window.DevJC = { CATS: CATS, STATUS: STATUS, esc: esc, card: card, renderCards: renderCards };
})();
