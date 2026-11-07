// Every styled QR must still scan: render the SVG to pixels and decode it.
const test = require('node:test');
const assert = require('node:assert');
const { Resvg } = require('@resvg/resvg-js');
const jsQR = require('jsqr');
const CNQR = require('../assets/cnqr.js');

function decode(svg) {
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: 600 }, background: '#ffffff' }).render();
  return jsQR(new Uint8ClampedArray(img.pixels), img.width, img.height);
}

test('default styled QR decodes to its URL', () => {
  const hit = decode(CNQR.svg('https://codenon.io/null'));
  assert.ok(hit, 'no QR found');
  assert.strictEqual(hit.data, 'https://codenon.io/null');
});

for (const badge of ['null', 'void']) {
  test(`QR with the ${badge} badge in the centre still decodes`, () => {
    const svg = CNQR.svg('https://codenon.io/' + badge, { badge });
    assert.match(svg, new RegExp(`data-badge="${badge}"`));
    assert.strictEqual(decode(svg)?.data, 'https://codenon.io/' + badge);
  });
}

test('long payload (several alignment patterns) with badge and brand colours decodes', () => {
  const url = 'https://codenon.io/contact/alteisen?ref=card&set=19&side=back&lang=en&v=2026-11';
  const hit = decode(CNQR.svg(url, { badge: 'null', fg: '#0b1b4d', bg: '#fff6dc', eye: '#d9352b' }));
  assert.strictEqual(hit?.data, url);
});

test('accent colours only the badge, so light accents never touch scanned modules', () => {
  const svg = CNQR.svg('https://codenon.io/void', { badge: 'void', accent: '#ffc83d' });
  const [codePart, badgePart] = svg.split('data-badge');
  assert.ok(!codePart.includes('#ffc83d'), 'accent leaked into the code');
  assert.ok(badgePart.includes('#ffc83d'), 'accent missing from the badge');
  assert.strictEqual(decode(svg)?.data, 'https://codenon.io/void');
});
