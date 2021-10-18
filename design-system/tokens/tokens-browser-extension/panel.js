/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

// handle interactivity for panel.html
const themeValue = document.querySelector('#selected-theme');

document.querySelector('#disable-theme').addEventListener(
  'click',
  function () {
    sendObjectToInspectedPage({
      action: 'removeTheme',
    });
    themeValue.innerText = 'none';
  },
  false,
);

document.querySelector('#enable-light-theme').addEventListener(
  'click',
  function () {
    sendObjectToInspectedPage({
      action: 'setTheme-light',
    });
    themeValue.innerText = 'light';
  },
  false,
);

document.querySelector('#enable-dark-theme').addEventListener(
  'click',
  function () {
    sendObjectToInspectedPage({
      action: 'setTheme-dark',
    });
    themeValue.innerText = 'dark';
  },
  false,
);
