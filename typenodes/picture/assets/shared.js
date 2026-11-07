/* Shared bits for every ad: the CODE: NON townsfolk sprites (same text maps as the landing page's townsfolk.js)
   and the TYPE: NODES icon (nfc-demo-hub-prototype/frontend/src/assets/type-node-icon.png). Any element with data-sprite="wizard" data-px="10" gets that character drawn into it. */
(function () {
  var HATS = {
    cap:   ['....hhhh....', '...hhhhhh...', '..hhhhhhhh..'],
    tall:  ['.....hh.....', '....hhhh....', '...hhhhhh...'],
    flat:  ['............', '..hhhhhhhh..', '..hhhhhhhh..'],
    wizard:['......hh....', '.....hhhh...', '..hhhhhhhh..'],
    plume: ['.......pp...', '...hhhhhh.p.', '..hhhhhhhh..']
  };
  var FACE      = ['...ssssss...', '...sesses...', '...ssssss...', '....ssss....'];
  var FACE_LONG = ['..hssssssh..', '..hsessesh..', '..hssssssh..', '...hssssh...'];
  var BODY      = ['..bbbbbbbb..', '.bbbbwwbbbb.', '.bbbbbbbbbb.', '.sbbbbbbbbs.', '..BBBBBBBB..', '..ll....ll..', '.fff....fff.'];
  var BODY_APRON= ['..bbbbbbbb..', '.bbbwwwwbbb.', '.bbbwwwwbbb.', '.sbbwwwwbbs.', '..BBBBBBBB..', '..ll....ll..', '.fff....fff.'];

  var NPC = {
    scheduler:{hat:'cap',  c:{h:'#ffc83d', s:'#c98f5d', b:'#2340e6', B:'#12296f'}},
    treasurer:{hat:'flat', c:{h:'#0b1b4d', s:'#a86f45', b:'#0b8577', B:'#08594f'}},
    recruiter:{hat:'cap',  long:true, c:{h:'#3a2417', s:'#d9a37a', b:'#d9352b', B:'#8f1f18'}},
    merchant: {hat:'flat', apron:true, c:{h:'#d9352b', s:'#b57c50', b:'#ffc83d', B:'#b98500'}},
    scribe:   {hat:'tall', c:{h:'#4632a8', s:'#c98f5d', b:'#6a4ad8', B:'#43298f'}},
    wizard:   {hat:'wizard', c:{h:'#c2338f', s:'#d9a37a', b:'#d94c9f', B:'#8f2368'}},
    herald:   {hat:'plume', long:true, c:{h:'#d9352b', p:'#ffc83d', s:'#e0b088', b:'#0b1b4d', B:'#050d2e'}}
  };

  function spriteSvg(id, px) {
    var n = NPC[id];
    var rows = HATS[n.hat].concat(n.long ? FACE_LONG : FACE, n.apron ? BODY_APRON : BODY);
    var pal = { h:n.c.h, s:n.c.s, b:n.c.b, B:n.c.B, l:'#26315e', f:'#3a2a20', e:'#1b1638', w:'#ffffff', p:n.c.p || '#ffc83d' };
    var out = '';
    rows.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var col = pal[row[x]];
        if (col) out += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + col + '"/>';
      }
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 ' + rows.length + '" width="' + 12 * px +
      '" height="' + rows.length * px + '" shape-rendering="crispEdges" aria-hidden="true">' + out + '</svg>';
  }

  document.querySelectorAll('[data-sprite]').forEach(function (el) {
    el.innerHTML = spriteSvg(el.getAttribute('data-sprite'), +el.getAttribute('data-px') || 8);
  });
  document.querySelectorAll('[data-tn-mark]').forEach(function (el) { el.innerHTML = '<img src="assets/typenodes-icon.png" alt="">'; });
})();
