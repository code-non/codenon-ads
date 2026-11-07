(function () {
  // QR: dark modules as one path in currentColor, 4-module quiet zone built in.
  document.querySelectorAll('[data-qr]').forEach(function (el) {
    var q = qrcode(0, 'M'); q.addData(el.getAttribute('data-qr')); q.make();
    var n = q.getModuleCount(), d = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z';
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ' + (n + 8) + ' ' + (n + 8) +
      '" shape-rendering="crispEdges"><path fill="currentColor" d="' + d + '"/></svg>';
  });

  // Founder name candidates: .fn shows it as written, .fnl lowercase (for the code-style card).
  var NAMES = ['Alteisen', 'Weißritter', 'Persönlichkeit'], hooks = [], cur;
  function setName(i) {
    document.querySelectorAll('.fn').forEach(function (el) { el.textContent = NAMES[i]; });
    document.querySelectorAll('.fnl').forEach(function (el) { el.textContent = NAMES[i].toLowerCase(); });
    document.querySelectorAll('.gl.fn').forEach(function (el) { el.setAttribute('data-t', NAMES[i]); });
    cur = NAMES[i]; hooks.forEach(function (f) { f(cur); });
    document.querySelectorAll('.names button').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-n') === i); });
  }
  document.querySelectorAll('.names button').forEach(function (b) {
    b.addEventListener('click', function () { setName(+b.getAttribute('data-n')); });
  });
  var n = +(new URLSearchParams(location.search).get('n') || 0);
  setName(NAMES[n] ? n : 0);

  // Name-dependent drawings (punch holes, passport MRZ) redraw whenever the founder name changes.
  function fold(s) { return s.replace(/ß/g, 'SS').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase(); }
  function onName(f) { hooks.push(f); f(cur); }

  // Punch card: 40 columns x 12 rows (12, 11, 0-9); the holes are the Hollerith code of the printed line.
  function holler(ch) {
    var k = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(ch);
    if (ch >= '0' && ch <= '9') return [2 + +ch];
    if (k >= 0 && k < 9) return [0, 3 + k];
    if (k >= 9 && k < 18) return [1, 3 + k - 9];
    if (k >= 18) return [2, 4 + k - 18];
    return { ':': [4, 10], '-': [1], '.': [0, 5, 10] }[ch] || [];
  }
  document.querySelectorAll('svg[data-punch]').forEach(function (svg) {
    onName(function (name) {
      var t = fold(svg.getAttribute('data-punch').replace('{n}', name)).slice(0, 40), x0 = 54, cw = 22.6, y0 = 160, rh = 37.5, out = '';
      for (var c = 0; c < 40; c++) {
        var x = x0 + c * cw + cw / 2, ch = t[c] || ' ', holes = holler(ch);
        out += '<text x="' + x + '" y="128" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="19" fill="#2a1d14">' + ch + '</text>';
        for (var r = 0; r < 12; r++) {
          var y = y0 + r * rh + rh / 2;
          if (holes.indexOf(r) >= 0) out += '<rect x="' + (x - 6) + '" y="' + (y - 14) + '" width="12" height="28" rx="2" fill="#2a1d14"/>';
          else if (r >= 2) out += '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="#7a2d1c" opacity=".65">' + (r - 2) + '</text>';
        }
      }
      svg.innerHTML = out;
    });
  });

  // Contour map: wobbly concentric rings round the marker, plus the two grid lines through it.
  document.querySelectorAll('svg[data-topo]').forEach(function (svg) {
    var k = +svg.getAttribute('data-topo'), cx = 720, cy = 300, nemo = svg.closest('.c15v'), ln = 'style="stroke:var(--ln)"', out = '';
    out += '<path d="M0 ' + cy + 'H1011M' + cx + ' 0V638" ' + ln + ' stroke-width="2" stroke-dasharray="8 8" opacity=".45"/>';
    for (var i = 1; i <= 13; i++) {
      var d = '';
      for (var a = 0; a <= 72; a++) {
        var t = a / 72 * Math.PI * 2, r = 26 + i * 36 * (1 + .09 * Math.sin(3 * t + i * .6 + k) + .05 * Math.sin(5 * t - i * .4));
        d += (a ? 'L' : 'M') + (cx + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * .82 * Math.sin(t)).toFixed(1);
      }
      out += '<path d="' + d + 'Z" fill="none" ' + ln + ' stroke-width="' + (i % 4 ? 1.6 : 3) + '" opacity="' + (i % 4 ? .28 : .5) + '"/>';
    }
    var lab = 'font-family="JetBrains Mono" font-size="15" letter-spacing="2" style="fill:var(--ln)" opacity=".7"';
    out += '<text x="990" y="' + (cy - 10) + '" text-anchor="end" ' + lab + '>' + (nemo ? '48°52′36″S' : 'EQUATOR') + '</text>';
    out += '<text x="' + (cx + 10) + '" y="40" ' + lab + '>' + (nemo ? '123°23′36″W' : 'PRIME MERIDIAN') + '</text>';
    out += nemo
      ? '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="none" stroke="#ffc83d" stroke-width="4"/><path d="M' + (cx - 54) + ' ' + cy + 'H' + (cx + 54) +
        'M' + cx + ' ' + (cy - 54) + 'V' + (cy + 54) + '" stroke="#ffc83d" stroke-width="3"/>'
      : '<path d="M' + (cx - 24) + ' ' + (cy + 4) + 'q10 -22 32 -15q19 6 14 19q-8 14 -27 10q-17 -2 -19 -14z" fill="#ffc83d" stroke="#0b1b4d" stroke-width="3"/>' +
        '<text x="' + (cx + 34) + '" y="' + (cy - 22) + '" font-family="JetBrains Mono" font-weight="700" font-size="20" fill="#0b1b4d">0,0</text>';
    svg.innerHTML = out;
  });

  // LED dot-matrix: 5x7 glyphs, one blank column between letters.
  var FONT = { N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'], U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
    L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'], V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'], I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
    D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'] };
  document.querySelectorAll('[data-led]').forEach(function (el) {
    var w = el.getAttribute('data-led').split(''), h = '';
    for (var r = 0; r < 7; r++) w.forEach(function (ch, j) {
      for (var c = 0; c < 5; c++) h += '<i' + (FONT[ch][r][c] === '1' ? ' class="on"' : '') + '></i>';
      if (j < w.length - 1) h += '<i></i>';
    });
    el.innerHTML = h;
  });

  // Passport machine-readable zone: two 44-character lines, "<" as filler, names folded to A-Z.
  document.querySelectorAll('[data-mrz]').forEach(function (el) {
    onName(function (name) {
      var p = el.getAttribute('data-mrz').split('|');
      function pad(s) { return (s + Array(45).join('<')).slice(0, 44); }
      el.textContent = pad('P<CDN' + fold(p[0]) + '<<' + fold(p[1].replace('{n}', name))) + '\n' + pad(p[2] + '0CDN2601010X3101011<<<<<<<<<<<<<<04');
    });
  });

  // Titles toggle (founder / co-founder). ?t=0 starts with them hidden.
  var ttl = document.getElementById('ttl'), qs = new URLSearchParams(location.search);
  function setTtl(on) { ttl.checked = on; document.body.classList.toggle('no-ttl', !on); }
  ttl.addEventListener('change', function () { setTtl(ttl.checked); });
  setTtl(qs.get('t') !== '0');

  // PDF export through the print dialog (choose "Save as PDF"). ?print=card|sheet|one&only=3 does the same for headless renders.
  // "one" = a single design: its four faces at real size on one A4 page.
  var sets = document.querySelectorAll('.set');
  function exportPdf(mode, only) {
    document.body.classList.add('pr-' + (mode === 'one' ? 'sheet' : mode));
    if (only) { document.body.classList.add('pr-one'); sets[only - 1].classList.add('pick'); }
  }
  function clearPdf() {
    document.body.classList.remove('pr-card', 'pr-sheet', 'pr-one');
    sets.forEach(function (s) { s.classList.remove('pick'); });
  }
  window.addEventListener('afterprint', clearPdf);
  document.querySelectorAll('.names [data-pr]').forEach(function (b) {
    b.addEventListener('click', function () { exportPdf(b.getAttribute('data-pr')); window.print(); });
  });
  sets.forEach(function (s, i) {
    var b = document.createElement('button');
    b.className = 'ex'; b.textContent = 'Export this design · PDF';
    b.addEventListener('click', function () { exportPdf('one', i + 1); window.print(); });
    s.querySelector('h2').appendChild(b);
  });
  if (qs.get('print')) exportPdf(qs.get('print'), +qs.get('only') || 0);

  // #n1-front etc: show that one face alone for rendering.
  var id = location.hash.slice(1), slot = id && document.getElementById(id);
  if (slot && slot.classList.contains('slot')) { document.body.classList.add('solo'); slot.classList.add('on'); }
})();
