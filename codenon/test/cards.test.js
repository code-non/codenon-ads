// Structure of the card sheet: every set is a full Null/Void pair, and the type-only sets carry no character art.
const test = require('node:test');
const assert = require('node:assert');
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

for (const n of [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]) {
  test(`set ${n} is a type-only Null/Void pair with a QR on each back`, () => {
    const src = set(n);
    for (const who of ['n', 'v']) {
      face(src, `${who}${n}-front`);
      assert.match(face(src, `${who}${n}-back`), /data-cnqr="https:\/\//, `${who}${n}-back has no QR`);
    }
    assert.ok(!src.includes('data-mascot'), 'set should not use character art');
  });
}

for (const n of [41, 42, 43, 44, 45]) {
  test(`set ${n} is a minimal character pair: mascot on each front, QR on each back`, () => {
    const src = set(n);
    for (const who of ['n', 'v']) {
      assert.match(face(src, `${who}${n}-front`), new RegExp(`data-mascot="${who === 'n' ? 'null' : 'void'}`), `${who}${n}-front has no character`);
      assert.match(face(src, `${who}${n}-back`), /data-cnqr="https:\/\//, `${who}${n}-back has no QR`);
    }
  });
}

for (const n of [46, 47, 48, 49, 50]) {
  test(`set ${n} is an elegant type-only pair using the shared gmail on both cards`, () => {
    const src = set(n);
    assert.ok(!src.includes('data-mascot'), 'set should not use character art');
    assert.ok(!/(null|void)@codenon\.io/.test(src), 'old placeholder mail still present');
    for (const who of ['n', 'v']) {
      assert.match(face(src, `${who}${n}-back`), /data-cnqr="https:\/\//, `${who}${n}-back has no QR`);
      assert.match(face(src, `${who}${n}-front`) + face(src, `${who}${n}-back`), /codenon\.null@gmail\.com/, `${who}${n} has no mail`);
    }
  });
}
