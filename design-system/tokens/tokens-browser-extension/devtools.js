/* eslint-disable func-names */
/* eslint-disable no-undef */

// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create(
  'Tokens theming controls',
  'toast.png',
  'panel.html',
  function () {},
);
