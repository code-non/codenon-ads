// The vector CODE: NON mark must match the original logo (assets/codenon-logo.png) closely enough to replace it in print.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const CNMARK = require('../assets/cnmark.js');

const N = 192, B = 4; // compare on a 48x48 grid of 4px blocks, so the logo's scanline gaps don't count as holes

function blocks(svg) {
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: N }, background: '#000000' }).render();
  const lit = new Uint8Array((N / B) ** 2);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (img.pixels[(y * N + x) * 4] > 110) lit[(y / B | 0) * (N / B) + (x / B | 0)] = 1;
  }
  return lit;
}

const LOGO = blocks('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="192" height="192"><image width="192" height="192" xlink:href="data:image/png;base64,' +
  fs.readFileSync(path.join(__dirname, '../assets/codenon-logo.png')).toString('base64') + '"/></svg>');

test('the solid vector mark overlaps the original logo (IoU >= 0.8)', () => {
  const m = blocks(CNMARK.svg({ fg: '#ffffff', bg: '#000000', style: 'solid', crop: false }));
  let and = 0, or = 0;
  for (let i = 0; i < m.length; i++) { and += m[i] & LOGO[i]; or += m[i] | LOGO[i]; }
  assert.ok(and / or >= 0.8, 'IoU ' + (and / or).toFixed(3));
});

test('the lines style is the logo\'s scanline fill; each SVG gets its own pattern id', () => {
  const a = CNMARK.svg({ style: 'lines' }), b = CNMARK.svg({ style: 'lines' });
  assert.match(a, /<pattern id="cnm\d+"/);
  assert.notStrictEqual(a.match(/id="(cnm\d+)"/)[1], b.match(/id="(cnm\d+)"/)[1]);
});

test('outline style draws strokes only, no fill', () => {
  const s = CNMARK.svg({ style: 'outline', fg: '#123456' });
  assert.match(s, /stroke="#123456"/);
  assert.ok(!/fill="#123456"/.test(s));
});

test('sheen paints the mark with a foil gradient (fg -> sheen -> fg), no box around it', () => {
  const s = CNMARK.svg({ style: 'lines', fg: '#d8b66c', sheen: '#fff6dc' });
  assert.match(s, /<linearGradient id="cng\d+"/);
  assert.match(s, /stop-color="#fff6dc"/);
  assert.match(s, /stroke="url\(#cng\d+\)"/);
  assert.match(s, /<g mask="url\(#cnm\d+\)">/, 'stripes cut by a mask so the gradient spans the whole mark');
});

test('tile() gives a CSS background of the mark, for monogram patterns', () => {
  const t = CNMARK.tile({ style: 'solid', fg: '#5a1c20', bg: '#4a1418' });
  assert.match(t, /^url\("data:image\/svg\+xml,%3Csvg/);
  assert.ok(decodeURIComponent(t.slice(5, -2).replace('data:image/svg+xml,', '')).includes('stroke="#5a1c20"'));
});

test('bg "none" cuts the crossing gaps with masks instead of painting them, for marks on gradients', () => {
  const s = CNMARK.svg({ style: 'solid', fg: '#ffffff', bg: 'none' });
  assert.ok(!/stroke="none"/.test(s), 'no painted halo');
  assert.match(s, /<mask id="cnh\d+a"[^>]*><rect[^>]*fill="#fff"\/><path[^>]*stroke="#000"/);
  const img = new Resvg(CNMARK.svg({ style: 'solid', fg: '#ffffff', bg: 'none', crop: false }), { fitTo: { mode: 'width', value: 192 }, background: '#000000' }).render();
  let lit = 0; for (let i = 0; i < img.pixels.length; i += 4) lit += img.pixels[i] > 110;
  assert.ok(lit > 192 * 192 * 0.25, 'mark still drawn');
});

test('outline closes the open ends of the stems and diagonal', () => {
  const s = CNMARK.svg({ style: 'outline', fg: '#123456' });
  assert.equal((s.match(/stroke-dasharray/g) || []).length, 2, 'ribbon and diagonal inner strokes stop short of their ends');
});
