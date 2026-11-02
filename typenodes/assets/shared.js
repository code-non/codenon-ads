/* Shared bits for every ad: plain line icons for the services, and the TYPE: NODES icon
   (nfc-demo-hub-prototype/frontend/src/assets/type-node-icon.png).
   <i data-icon="calendar" data-size="64"></i> draws that icon in the element's text colour. */
(function () {
  var ICONS = {
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="m9 15 2 2 4-4"/>',
    money:    '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    team:     '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    box:      '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    file:     '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    chart:    '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 13v-3M11 13V7M15 13v-5"/>',
    code:     '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    tap:      '<path d="M8.5 7.5a6 6 0 0 1 0 9M12 5a10 10 0 0 1 0 14M15.5 2.5a14 14 0 0 1 0 19"/><path d="M4.5 12h.01"/>'
  };

  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var s = +el.getAttribute('data-size') || 48;
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + s + '" height="' + s +
      '" fill="none" stroke="currentColor" stroke-width="' + (el.getAttribute('data-stroke') || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[el.getAttribute('data-icon')] + '</svg>';
  });
  document.querySelectorAll('[data-tn-mark]').forEach(function (el) { el.innerHTML = '<img src="assets/typenodes-icon.png" alt="">'; });
})();
