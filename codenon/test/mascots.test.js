// Every mascot variant must render to a real, non-empty SVG.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');

const SRC = fs.readFileSync(path.join(__dirname, '../assets/mascots.js'), 'utf8');

// Run mascots.js against a one-element fake DOM and return the SVG it wrote.
function render(name) {
  const el = { innerHTML: '', getAttribute: (k) => (k === 'data-mascot' ? name : null) };
  const document = { querySelectorAll: (sel) => (sel === '[data-mascot]' ? [el] : []) };
  new Function('document', SRC)(document);
  return el.innerHTML;
}

// Share of pixels with any ink on a transparent background.
function coverage(svg) {
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: 200 } }).render();
  const px = img.pixels; // getter copies the buffer, so read it once
  let on = 0;
  for (let i = 3; i < px.length; i += 4) if (px[i] > 0) on++;
  return on / (img.width * img.height);
}

for (const name of ['null', 'void', 'null-x', 'void-x']) {
  test(`mascot "${name}" renders a drawn figure`, () => {
    const svg = render(name);
    assert.match(svg, /^<svg[\s\S]*<\/svg>$/);
    assert.ok(!svg.includes('undefined'), 'unknown mascot name');
    assert.ok(coverage(svg) > 0.1, 'figure is blank or tiny');
  });
}
