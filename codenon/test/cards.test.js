// Structure of the card sheet: every set in sets/ is a full Null/Void pair with a QR on each back.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { build } = require('../build-sheet.js');

const HTML = build();

// The markup of set n, from its "<!-- nn -->" marker up to the next set.
function set(n) {
  const start = HTML.indexOf('<!-- ' + String(n).padStart(2, '0') + ' -->');
  assert.ok(start >= 0, 'set ' + n + ' missing');
  return HTML.slice(start, HTML.indexOf('</section>', start));
}

// Markup of one face: from its slot to the next slot (or the end of the set).
function face(src, id) {
  const start = src.indexOf('id="' + id + '"');
  assert.ok(start >= 0, id + ' missing');
  const next = src.indexOf('class="slot"', start);
  return src.slice(start, next < 0 ? undefined : next);
}

const NUMS = fs.readdirSync(path.join(__dirname, '../sets')).filter((f) => /^\d{2}-.+\.html$/.test(f)).map((f) => +f.slice(0, 2));

for (const n of NUMS) {
  test(`set ${n} is a Null/Void pair with a QR on each back`, () => {
    const src = set(n);
    for (const who of ['n', 'v']) {
      face(src, `${who}${n}-front`);
      assert.match(face(src, `${who}${n}-back`), /data-cnqr="https:\/\/|data-qr="https:\/\//, `${who}${n}-back has no QR`);
    }
  });
}

// v2 "Absence, engineered" collection: twenty-two character-free pairs, shared mail on both cards, full contact block on each back.
test('the v2 collection has its twenty-two designs', () => assert.deepStrictEqual(NUMS, Array.from({ length: 22 }, (_, i) => i + 1)));

for (const n of NUMS) {
  test(`set ${n} is character-free and carries the full contact block on both backs`, () => {
    const src = set(n);
    assert.ok(!src.includes('data-mascot') && !src.includes('data-badge'), 'no character art in v2');
    assert.ok(!/(null|void)@codenon\.io/.test(src), 'old placeholder mail');
    for (const who of ['n', 'v']) {
      const back = face(src, `${who}${n}-back`);
      for (const bit of ['codenon.null@gmail.com', 'codenon.pages.dev', '@codenon.io']) assert.ok(back.includes(bit), `${who}${n}-back missing ${bit}`);
      assert.ok(back.includes('data-cnqr="https://codenon-wormhole.pages.dev"'), `${who}${n}-back QR must point to the wormhole`);
    }
  });
}

// Identity batch (11+): every face carries the vector CODE: NON mark (assets/cnmark.js), never the low-res PNG.
for (const n of NUMS.filter((n) => n >= 11)) {
  test(`set ${n} puts the vector mark on all four faces`, () => {
    const src = set(n);
    for (const id of [`n${n}-front`, `n${n}-back`, `v${n}-front`, `v${n}-back`]) assert.match(face(src, id), /data-cnmark="(lines|solid|outline)"/, id + ' has no mark');
    assert.ok(!src.includes('codenon-logo.png'), 'use the vector mark, not the PNG');
  });
}

test('the sheet loads the vector mark script', () => assert.ok(HTML.includes('<script src="assets/cnmark.js"></script>')));
