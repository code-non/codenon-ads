/* CODE: NON branded QR. CNQR.svg(text, opts) returns an SVG string:
   round dot modules, rounded finder "eyes", optional centre badge (the data is error-corrected at level H so the badge can cover the middle).
   Works in the browser (needs qrcode-generator loaded as window.qrcode) and in node (test/cnqr.test.js decodes every style). */
(function (root, make) {
  if (typeof module === 'object' && module.exports) module.exports = make(require('qrcode-generator'));
  else root.CNQR = make(root.qrcode);
})(this, function (qrcode) {
  var Q = 4; // quiet zone, in modules

  // Alignment pattern centres per version (QR spec table), versions 1-10 are plenty for a URL.
  var ALIGN = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

  function inFinder(r, c, n) {
    return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  }

  // Centres of the 5x5 alignment patterns. Scanners lock onto these, so they're drawn solid, not as dots.
  function aligns(n) {
    var p = ALIGN[(n - 17) / 4], out = [];
    if (!p) throw new Error('CNQR: text too long (QR version > 10)');
    p.forEach(function (r) { p.forEach(function (c) { if (!inFinder(r, c, n)) out.push([r, c]); }); });
    return out;
  }

  function eye(x, y, fg, eyeFg) {
    return '<rect x="' + (x + .5) + '" y="' + (y + .5) + '" width="6" height="6" rx="1.9" fill="none" stroke="' + fg + '" stroke-width="1"/>' +
      '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" rx="1" fill="' + eyeFg + '"/>';
  }

  // Mascot heads for the centre badge, drawn in a 100x100 box. {f} = ink, {b} = paper, {e} = opts.accent (badge only, so it may be light).
  var BADGES = {
    // NULL: an android with an empty-set visor.
    null: '<rect x="18" y="26" width="64" height="58" rx="18" fill="{f}"/><path d="M50 26V12" stroke="{f}" stroke-width="5"/><circle cx="50" cy="10" r="6" fill="{e}"/>' +
      '<rect x="27" y="41" width="46" height="27" rx="13.5" fill="{b}"/><circle cx="50" cy="54.5" r="8.5" fill="none" stroke="{f}" stroke-width="4"/>' +
      '<path d="M40 66 60 43" stroke="{e}" stroke-width="4.5" stroke-linecap="round"/>',
    // VOID: a hood around a black hole, two eyes floating inside.
    void: '<path d="M50 8C75 8 88 34 88 60V90H12V60C12 34 25 8 50 8z" fill="{f}"/><ellipse cx="50" cy="57" rx="25" ry="23" fill="#05070f" stroke="{e}" stroke-width="3.5"/>' +
      '<circle cx="41" cy="55" r="4" fill="{b}"/><circle cx="59" cy="55" r="4" fill="{b}"/>'
  };

  function svg(text, opts) {
    opts = opts || {};
    var fg = opts.fg || '#0b1b4d', bg = opts.bg || '#ffffff', eyeFg = opts.eye || fg, acc = opts.accent || eyeFg;
    var q = qrcode(0, 'H'); q.addData(text); q.make();
    var n = q.getModuleCount(), dots = '', small = '', badge = '';
    // Badge hole: an odd number of modules, about a quarter of the width (under 7% of the area, well inside level H's 30%).
    var k = opts.badge ? (Math.round(n * .26) | 1) : 0, lo = (n - k) / 2, hi = lo + k;
    function inBadge(r, c) { return k && r >= lo && r < hi && c >= lo && c < hi; }
    var al = aligns(n).filter(function (a) { return !inBadge(a[0], a[1]); });
    if (k) {
      badge = '<g data-badge="' + opts.badge + '"><rect x="' + lo + '" y="' + lo + '" width="' + k + '" height="' + k + '" rx="' + k * .28 + '" fill="' + bg + '"/>' +
        '<g transform="translate(' + (lo + .5) + ' ' + (lo + .5) + ') scale(' + (k - 1) / 100 + ')">' +
        BADGES[opts.badge].replace(/\{f\}/g, fg).replace(/\{b\}/g, bg).replace(/\{e\}/g, acc) + '</g></g>';
    }
    al.forEach(function (a) {
      small += '<rect x="' + (a[1] - 1.5) + '" y="' + (a[0] - 1.5) + '" width="4" height="4" rx="1.3" fill="none" stroke="' + fg + '" stroke-width="1"/>' +
        '<circle cx="' + (a[1] + .5) + '" cy="' + (a[0] + .5) + '" r=".55" fill="' + eyeFg + '"/>';
    });
    function inAlign(r, c) { return al.some(function (a) { return Math.abs(r - a[0]) <= 2 && Math.abs(c - a[1]) <= 2; }); }
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (inFinder(r, c, n) || inAlign(r, c) || inBadge(r, c) || !q.isDark(r, c)) continue;
      dots += 'M' + (c + .5) + ' ' + (r + .08) + 'a.42 .42 0 1 0 0 .84a.42 .42 0 1 0 0-.84z';
    }
    var s = n + 2 * Q;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + -Q + ' ' + -Q + ' ' + s + ' ' + s + '">' +
      '<rect x="' + -Q + '" y="' + -Q + '" width="' + s + '" height="' + s + '" fill="' + bg + '"/>' +
      '<path fill="' + fg + '" d="' + dots + '"/>' + small +
      eye(0, 0, fg, eyeFg) + eye(n - 7, 0, fg, eyeFg) + eye(0, n - 7, fg, eyeFg) + badge +
      '</svg>';
  }

  return { svg: svg };
});
