/* CODE: NON mascots, drawn as inline SVG (viewBox 0 0 400 520) so they print sharp at any size.
   <div data-mascot="null"></div>  NULL: a chunky android with an empty-set visor and a hollow core.
   <div data-mascot="void"></div>  VOID: a floating hood with a black hole for a face, pulling bits in.
   data-view="x y w h" crops (e.g. the head). Colours come from CSS variables on any parent:
   --m-ink (outlines, cloak), --m-shell (body panels), --m-acc (accent), --m-glow (eye glow), --m-hole (visor / black hole), --m-rim (optional outline round VOID's cloak, for dark cards). */
(function () {
  var T = { I: 'var(--m-ink,#0b1b4d)', S: 'var(--m-shell,#fff6dc)', A: 'var(--m-acc,#d9352b)', G: 'var(--m-glow,#7cc8ff)', H: 'var(--m-hole,#0b1b4d)' };
  // "{I}" etc. become style colours; fill:{x} / stroke:{x} keep var() inside style attributes, where every browser supports it.
  function paint(s) { return s.replace(/\{([ISAGH])\}/g, function (_, k) { return T[k]; }); }
  // Outlined capsule limb: thick ink stroke with a thinner shell stroke on top.
  function limb(d) {
    return '<path d="' + d + '" style="fill:none;stroke:{I};stroke-width:36;stroke-linecap:round"/>' +
      '<path d="' + d + '" style="fill:none;stroke:{S};stroke-width:22;stroke-linecap:round"/>';
  }

  var NULL =
    '<ellipse cx="200" cy="500" rx="118" ry="13" style="fill:{I};opacity:.16"/>' +
    // legs + boots
    limb('M176 356V418') + limb('M224 356V418') +
    '<rect x="132" y="410" width="66" height="38" rx="19" style="fill:{A};stroke:{I};stroke-width:7"/>' +
    '<rect x="202" y="410" width="66" height="38" rx="19" style="fill:{A};stroke:{I};stroke-width:7"/>' +
    '<path d="M146 438h38M216 438h38" style="stroke:{I};stroke-width:4;opacity:.35;stroke-linecap:round"/>' +
    // arms: left one waving, right one relaxed
    limb('M136 252Q92 240 80 190') + limb('M264 252Q304 274 302 318') +
    '<circle cx="78" cy="170" r="24" style="fill:{S};stroke:{I};stroke-width:7"/>' +
    '<circle cx="302" cy="334" r="24" style="fill:{S};stroke:{I};stroke-width:7"/>' +
    '<path d="M36 148l-16-8M34 178H16M44 122l-12-14" style="stroke:{I};stroke-width:6;stroke-linecap:round;opacity:.55"/>' +
    // torso with the hollow core
    '<rect x="182" y="206" width="36" height="22" style="fill:{I}"/>' +
    '<rect x="126" y="222" width="148" height="138" rx="40" style="fill:{S};stroke:{I};stroke-width:7"/>' +
    '<path d="M144 240q56-14 112 0" style="fill:none;stroke:{I};stroke-width:4;opacity:.25;stroke-linecap:round"/>' +
    '<circle cx="200" cy="286" r="32" style="fill:{H};stroke:{I};stroke-width:6"/>' +
    '<circle cx="200" cy="286" r="19" style="fill:none;stroke:{G};stroke-width:5;stroke-dasharray:7 6"/>' +
    '<rect x="172" y="328" width="56" height="20" rx="5" style="fill:{I}"/>' +
    '<text x="200" y="343" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="800" font-size="14" letter-spacing="1" style="fill:{S}">N-01</text>' +
    // antenna + head
    '<path d="M200 74V36" style="stroke:{I};stroke-width:7"/>' +
    '<circle cx="200" cy="26" r="14" style="fill:{A};stroke:{I};stroke-width:6"/>' +
    '<path d="M172 16l-12-7M228 16l12-7M200 -2v-8" style="stroke:{A};stroke-width:5;stroke-linecap:round"/>' +
    '<rect x="90" y="114" width="26" height="60" rx="11" style="fill:{A};stroke:{I};stroke-width:6"/>' +
    '<rect x="284" y="114" width="26" height="60" rx="11" style="fill:{A};stroke:{I};stroke-width:6"/>' +
    '<rect x="108" y="70" width="184" height="142" rx="54" style="fill:{S};stroke:{I};stroke-width:7"/>' +
    // visor with the empty-set eye
    '<rect x="130" y="98" width="140" height="86" rx="42" style="fill:{H}"/>' +
    '<path d="M150 116q12-9 30-9" style="fill:none;stroke:{S};stroke-width:6;stroke-linecap:round;opacity:.35"/>' +
    '<circle cx="200" cy="141" r="31" style="fill:none;stroke:{G};stroke-width:4;opacity:.25"/>' +
    '<circle cx="200" cy="141" r="21" style="fill:none;stroke:{G};stroke-width:7"/>' +
    '<path d="M176 168L224 114" style="stroke:{A};stroke-width:7;stroke-linecap:round"/>' +
    '<circle cx="138" cy="196" r="5" style="fill:{I};opacity:.3"/><circle cx="262" cy="196" r="5" style="fill:{I};opacity:.3"/>';

  // Hem zigzag of the cloak, with a few pixels breaking off underneath.
  var HEM = 'L334 404L312 436L288 410L262 446L238 414L212 452L188 414L162 446L138 410L114 436L90 404';
  var VOID =
    '<ellipse cx="200" cy="505" rx="82" ry="10" style="fill:{I};opacity:.12"/>' +
    '<rect x="196" y="466" width="12" height="12" style="fill:{I};opacity:.55"/><rect x="150" y="462" width="9" height="9" style="fill:{I};opacity:.4"/>' +
    '<rect x="252" y="460" width="10" height="10" style="fill:{I};opacity:.45"/><rect x="226" y="482" width="7" height="7" style="fill:{I};opacity:.25"/>' +
    '<rect x="172" y="486" width="6" height="6" style="fill:{I};opacity:.2"/>' +
    // particles spiralling into the face
    '<g style="fill:{A}"><rect x="352" y="96" width="14" height="14" transform="rotate(20 359 103)"/><rect x="326" y="58" width="9" height="9" transform="rotate(35 330 62)"/>' +
    '<circle cx="300" cy="40" r="4"/><rect x="40" y="250" width="12" height="12" transform="rotate(-25 46 256)"/><circle cx="30" cy="196" r="5"/>' +
    '<rect x="64" y="130" width="8" height="8" transform="rotate(15 68 134)"/></g>' +
    '<path d="M366 120Q340 150 300 170M34 210Q60 200 100 205" style="fill:none;stroke:{A};stroke-width:3;stroke-dasharray:2 9;stroke-linecap:round;opacity:.7"/>' +
    // cloak
    '<path d="M200 36C292 36 332 118 332 214C332 296 350 356 362 412' + HEM + 'C50 356 68 296 68 214C68 118 108 36 200 36Z" style="fill:{I};stroke:var(--m-rim,none);stroke-width:4"/>' +
    '<path d="M200 40Q194 70 200 96M120 270Q130 340 118 404M280 270Q270 340 284 404" style="fill:none;stroke:{S};stroke-width:4;opacity:.12;stroke-linecap:round"/>' +
    // hood opening: the black hole
    '<ellipse cx="200" cy="186" rx="96" ry="90" style="fill:{H};stroke:{S};stroke-width:3;stroke-opacity:.12"/>' +
    '<g transform="rotate(-12 200 192)">' +
    '<ellipse cx="200" cy="192" rx="88" ry="22" style="fill:none;stroke:{A};stroke-width:3;opacity:.35"/>' +
    '<ellipse cx="200" cy="192" rx="74" ry="17" style="fill:none;stroke:{A};stroke-width:7"/>' +
    '<circle cx="200" cy="186" r="46" style="fill:#03040a;stroke:{A};stroke-width:3"/>' +
    '<path d="M126 192A74 17 0 0 0 274 192" style="fill:none;stroke:{A};stroke-width:7"/>' +
    '</g>' +
    '<ellipse cx="183" cy="178" rx="8" ry="11" style="fill:{S}"/><ellipse cx="217" cy="178" rx="8" ry="11" style="fill:{S}"/>' +
    '<circle cx="186" cy="174" r="2.6" style="fill:#03040a"/><circle cx="220" cy="174" r="2.6" style="fill:#03040a"/>' +
    // clasp + hands, the right one holding a captured bit
    '<circle cx="200" cy="304" r="17" style="fill:{A};stroke:{H};stroke-width:5"/>' +
    '<text x="200" y="310" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="800" font-size="15" style="fill:{H}">02</text>' +
    '<circle cx="84" cy="322" r="21" style="fill:{S};stroke:{I};stroke-width:6"/>' +
    '<circle cx="318" cy="290" r="21" style="fill:{S};stroke:{I};stroke-width:6"/>' +
    '<circle cx="330" cy="246" r="22" style="fill:none;stroke:{G};stroke-width:4;opacity:.35"/>' +
    '<rect x="320" y="236" width="20" height="20" rx="3" transform="rotate(45 330 246)" style="fill:{G}"/>';

  // "-x" variants: the same two characters drawn realistically (no outlines, sculpted shading, rim light).
  // {U} is a per-instance suffix so each card's gradients pick up that card's CSS colours.
  var NULL_X =
    '<defs>' +
    '<linearGradient id="nxs{U}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:{S}"/><stop offset=".45" style="stop-color:{S};stop-opacity:.82"/><stop offset="1" style="stop-color:{I}"/></linearGradient>' +
    '<linearGradient id="nxn{U}" x1="0" x2="1"><stop offset="0" style="stop-color:{I}"/><stop offset=".45" style="stop-color:{S};stop-opacity:.7"/><stop offset="1" style="stop-color:{I}"/></linearGradient>' +
    '<linearGradient id="nxv{U}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:{H}"/><stop offset=".5" style="stop-color:#03040a"/><stop offset="1" style="stop-color:{H}"/></linearGradient>' +
    '<radialGradient id="nxg{U}"><stop offset="0" style="stop-color:{G};stop-opacity:.55"/><stop offset="1" style="stop-color:{G};stop-opacity:0"/></radialGradient>' +
    '</defs>' +
    '<ellipse cx="200" cy="180" rx="150" ry="70" style="fill:url(#nxg{U});opacity:.6"/>' +
    // shoulders + chest plate
    '<path d="M28 520C36 446 84 412 150 398H250C316 412 364 446 372 520Z" style="fill:url(#nxs{U})"/>' +
    '<path d="M150 398L176 452H224L250 398M92 430C110 456 122 486 126 520M308 430C290 456 278 486 274 520" style="fill:none;stroke:{H};stroke-width:2;opacity:.45"/>' +
    '<circle cx="200" cy="482" r="13" style="fill:none;stroke:{A};stroke-width:2.5"/><path d="M190 494L210 470" style="stroke:{A};stroke-width:2.5;stroke-linecap:round"/>' +
    // neck
    '<rect x="170" y="296" width="60" height="108" rx="8" style="fill:url(#nxn{U})"/>' +
    '<path d="M174 330H226M174 344H226M174 358H226M174 372H226M174 386H226" style="stroke:{H};stroke-width:2;opacity:.45"/>' +
    // head shell
    '<path d="M200 30C262 30 296 78 296 150C296 214 284 262 258 296C242 316 222 326 200 326C178 326 158 316 142 296C116 262 104 214 104 150C104 78 138 30 200 30Z" style="fill:url(#nxs{U})"/>' +
    '<path d="M200 30V128M116 112C150 124 250 124 284 112M150 236C170 250 230 250 250 236L240 290C226 306 174 306 160 290Z" style="fill:none;stroke:{H};stroke-width:2;opacity:.35"/>' +
    '<path d="M186 262H214M184 274H216M186 286H214" style="stroke:{H};stroke-width:3;opacity:.5;stroke-linecap:round"/>' +
    // ear modules
    '<rect x="94" y="168" width="18" height="56" rx="7" style="fill:{I};opacity:.85"/><rect x="288" y="168" width="18" height="56" rx="7" style="fill:{I};opacity:.85"/>' +
    '<path d="M296 178V214" style="stroke:{A};stroke-width:3;stroke-linecap:round"/>' +
    // visor slit with the empty-set glyph glowing behind the glass
    '<path d="M112 160C150 146 250 146 288 160L284 206C246 194 154 194 116 206Z" style="fill:url(#nxv{U})"/>' +
    '<ellipse cx="200" cy="178" rx="54" ry="20" style="fill:url(#nxg{U})"/>' +
    '<circle cx="200" cy="178" r="12" style="fill:none;stroke:{G};stroke-width:2.5"/><path d="M190 192L210 164" style="stroke:{G};stroke-width:2.5;stroke-linecap:round"/>' +
    '<path d="M124 162C160 152 214 150 252 154" style="fill:none;stroke:#fff;stroke-width:2;opacity:.25;stroke-linecap:round"/>' +
    // specular + rim light
    '<ellipse cx="160" cy="78" rx="34" ry="13" transform="rotate(-32 160 78)" style="fill:#fff;opacity:.16"/>' +
    '<path d="M266 58C290 88 298 138 294 186M284 236C276 264 266 284 252 302" style="fill:none;stroke:{A};stroke-width:3;opacity:.8;stroke-linecap:round"/>' +
    '<path d="M346 450C360 470 368 494 370 518" style="fill:none;stroke:{A};stroke-width:3;opacity:.6;stroke-linecap:round"/>';

  var VOID_X =
    '<defs>' +
    '<linearGradient id="vxc{U}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:{S};stop-opacity:.22"/><stop offset=".35" style="stop-color:{I}"/><stop offset="1" style="stop-color:#03040a"/></linearGradient>' +
    '<radialGradient id="vxg{U}"><stop offset="0" style="stop-color:{G};stop-opacity:.5"/><stop offset=".6" style="stop-color:{G};stop-opacity:.08"/><stop offset="1" style="stop-color:{G};stop-opacity:0"/></radialGradient>' +
    '<radialGradient id="vxh{U}"><stop offset=".55" style="stop-color:#000"/><stop offset="1" style="stop-color:{H}"/></radialGradient>' +
    '</defs>' +
    '<circle cx="200" cy="176" r="190" style="fill:url(#vxg{U})"/>' +
    // cloak base, then the draped cloak with folds
    '<path d="M200 24C262 24 300 70 308 140C314 196 320 240 344 300C366 356 374 430 380 520H20C26 430 34 356 56 300C80 240 86 196 92 140C100 70 138 24 200 24Z" style="fill:{I}"/>' +
    '<path d="M200 24C262 24 300 70 308 140C314 196 320 240 344 300C366 356 374 430 380 520H20C26 430 34 356 56 300C80 240 86 196 92 140C100 70 138 24 200 24Z" style="fill:url(#vxc{U})"/>' +
    '<path d="M132 268C120 340 108 430 104 520M168 286C164 360 160 440 162 520M236 286C240 360 246 440 246 520M270 268C284 340 296 430 304 520M200 300V520" style="fill:none;stroke:{S};stroke-width:3;opacity:.08;stroke-linecap:round"/>' +
    // hood opening: darkness falling inward, then the black hole
    '<ellipse cx="200" cy="168" rx="72" ry="84" style="fill:url(#vxh{U})"/>' +
    '<path d="M128 168C128 112 160 84 200 84C240 84 272 112 272 168" style="fill:none;stroke:{S};stroke-width:3;opacity:.22"/>' +
    '<g transform="rotate(-14 200 172)">' +
    '<ellipse cx="200" cy="172" rx="96" ry="18" style="fill:none;stroke:{A};stroke-width:9;opacity:.18"/>' +
    '<ellipse cx="200" cy="172" rx="84" ry="14" style="fill:none;stroke:{A};stroke-width:3;opacity:.55"/>' +
    '<circle cx="200" cy="168" r="34" style="fill:#000;stroke:{G};stroke-width:2"/>' +
    '<circle cx="200" cy="168" r="40" style="fill:none;stroke:{A};stroke-width:1.5;opacity:.5"/>' +
    '<path d="M116 172A84 14 0 0 0 284 172" style="fill:none;stroke:{A};stroke-width:4"/>' +
    '</g>' +
    // bits being pulled in
    '<g style="fill:{G}"><circle cx="318" cy="96" r="3" opacity=".9"/><circle cx="296" cy="122" r="2.2" opacity=".7"/><circle cx="278" cy="140" r="1.6" opacity=".5"/>' +
    '<rect x="70" y="232" width="7" height="7" transform="rotate(30 73 235)" opacity=".8"/><rect x="96" y="216" width="5" height="5" opacity=".55"/><circle cx="118" cy="204" r="1.6" opacity=".4"/></g>' +
    // rim light along the cloak edge
    '<path d="M246 32C284 50 304 96 308 140C314 196 320 240 344 300C362 346 370 410 376 470" style="fill:none;stroke:{G};stroke-width:2.5;opacity:.55;stroke-linecap:round"/>';

  var ART = { null: NULL, void: VOID, 'null-x': NULL_X, 'void-x': VOID_X };
  document.querySelectorAll('[data-mascot]').forEach(function (el, i) {
    var view = el.getAttribute('data-view') || '0 -14 400 534';
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + view + '" width="100%" height="100%" stroke-linejoin="round" aria-hidden="true">' +
      paint(ART[el.getAttribute('data-mascot')]).replace(/\{U\}/g, i) + '</svg>';
  });

  // Branded QR (assets/cnqr.js): <div data-cnqr="url" data-badge="null" data-fg data-bg data-eye data-accent></div>
  document.querySelectorAll('[data-cnqr]').forEach(function (el) {
    var d = el.dataset;
    el.innerHTML = CNQR.svg(d.cnqr, { badge: d.badge, fg: d.fg, bg: d.bg, eye: d.eye, accent: d.accent });
  });
})();
