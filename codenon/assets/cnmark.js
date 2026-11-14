/* CODE: NON mark as vector, traced from assets/codenon-logo.png (test/cnmark.test.js checks the overlap) so it prints sharp at any size.
   One ribbon spells "un" (u bowl + n arch sharing the middle stem); the N's diagonal runs in front of the outer stems and behind the middle one.
   CNMARK.svg({ fg, bg, style: 'lines' | 'solid' | 'outline', sheen, crop }) returns an SVG string. bg paints the small gaps where strokes cross; sheen (a light colour) adds a foil sweep.
   In the browser: <div data-cnmark="lines" data-fg="#fff" data-bg="#000"></div>; add data-tile for a repeating background instead. */
(function (root, make) {
  if (typeof module === 'object' && module.exports) module.exports = make();
  else root.CNMARK = make();
})(this, function () {
  var W = 22, GAP = 5, uid = 0;
  var RIBBON = 'M41 52V125A28 28 0 0 0 97 125V69A27.5 27.5 0 0 1 152 69V142';
  var DIAG = 'M51 33L143 158';
  var MID = 'M41 125A28 28 0 0 0 97 125V69A27.5 27.5 0 0 1 152 69'; // bowl, middle stem, arch: drawn over the diagonal
  var MID_INK = 'M41 118V125A28 28 0 0 0 97 125V69A27.5 27.5 0 0 1 152 69V76'; // overruns its halo so the joins show no seam

  function svg(o) {
    o = o || {};
    var fg = o.fg || '#ffffff', bg = o.bg || '#000000', style = o.style || 'lines';
    var n = ++uid, paint = fg, defs = '', open = '', close = '';
    function stripes(id, c) { return '<pattern id="' + id + '" width="8" height="4" patternUnits="userSpaceOnUse"><rect width="8" height="2.5" fill="' + c + '"/></pattern>'; }
    if (o.sheen) {
      // Foil: a light sweep across the whole mark. The stripes then come from a mask, since a gradient inside a pattern would repeat per tile.
      defs = '<linearGradient id="cng' + n + '" gradientUnits="userSpaceOnUse" x1="24" y1="22" x2="168" y2="172">' +
        '<stop offset="0" stop-color="' + fg + '"/><stop offset=".5" stop-color="' + o.sheen + '"/><stop offset="1" stop-color="' + fg + '"/></linearGradient>';
      paint = 'url(#cng' + n + ')';
      if (style === 'lines') {
        defs += stripes('cnp' + n, '#fff') + '<mask id="cnm' + n + '" maskUnits="userSpaceOnUse" x="0" y="0" width="192" height="192"><rect width="192" height="192" fill="url(#cnp' + n + ')"/></mask>';
        open = '<g mask="url(#cnm' + n + ')">'; close = '</g>';
      }
    } else if (style === 'lines') {
      defs = stripes('cnm' + n, fg);
      paint = 'url(#cnm' + n + ')';
    }
    if (defs) defs = '<defs>' + defs + '</defs>';
    // One stroke layer: a bg halo to open the crossing gap, then the stroke itself (hollow for outline).
    // bg "none" (marks on gradients/photos): the crossing gaps are cut out of the layers below with masks instead of painted.
    var cut = bg === 'none', masks = '';
    // Everything drawn so far, with a gap opened along d: a painted bg halo, or a mask that cuts it.
    function gap(below, d, k) {
      if (!cut) return below + '<path d="' + d + '" fill="none" stroke="' + bg + '" stroke-width="' + (W + GAP * 2) + '"/>';
      var id = 'cnh' + n + k;
      masks += '<mask id="' + id + '" maskUnits="userSpaceOnUse" x="0" y="0" width="192" height="192"><rect width="192" height="192" fill="#fff"/>' +
        '<path d="' + d + '" fill="none" stroke="#000" stroke-width="' + (W + GAP * 2) + '"/></mask>';
      return '<g mask="url(#' + id + ')">' + below + '</g>';
    }
    // One stroke. Outline is hollow, and with len (the path length) the hollow stops 2.5 short of each end so the ends close.
    function ink(d, len) {
      if (style !== 'outline') return '<path d="' + d + '" fill="none" stroke="' + paint + '" stroke-width="' + W + '"/>';
      var dash = len ? ' stroke-dasharray="' + (len - 5) + ' 999" stroke-dashoffset="-2.5"' : '';
      return '<path d="' + d + '" fill="none" stroke="' + fg + '" stroke-width="' + W + '"/>' +
        '<path d="' + d + '" fill="none" stroke="' + bg + '" stroke-width="' + (W - 5) + '"' + dash + '/>';
    }
    var body = ink(RIBBON, 376.4);
    body = gap(body, DIAG, 'a') + ink(DIAG, 155.2);
    body = gap(body, MID, 'b') + ink(style === 'outline' ? MID : MID_INK);
    if (masks) defs += '<defs>' + masks + '</defs>';
    var box = o.crop === false ? '0 0 192 192' : '24 22 144 150';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + box + '" width="100%" height="100%">' + defs + open + body + close + '</svg>';
  }

  // The mark in its full 192 box (so it has breathing room) as a CSS background, for repeating monogram patterns.
  function tile(o) {
    var c = {}; for (var k in o) c[k] = o[k]; c.crop = false;
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg(c)) + '")';
  }

  if (typeof document !== 'undefined') {
    // data-tile: paint the element's background with the repeating mark (size and offset come from the set's CSS).
    document.querySelectorAll('[data-cnmark]').forEach(function (el) {
      var o = { style: el.getAttribute('data-cnmark') || 'lines', fg: el.getAttribute('data-fg'), bg: el.getAttribute('data-bg'), sheen: el.getAttribute('data-sheen') };
      if (el.hasAttribute('data-tile')) el.style.backgroundImage = tile(o);
      else el.innerHTML = svg(o);
    });
  }
  return { svg: svg, tile: tile };
});
