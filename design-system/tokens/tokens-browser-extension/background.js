/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

// sync options settings
// Chrome.storage implementation has not been used, instead localStorage is used.
function setOptions(data = {}) {
  chrome.storage.sync.set(data, function () {
    console.log('Settings saved');
  });
}

function getOptions(keys, callback) {
  chrome.storage.sync.get(keys, function (data) {
    console.log('Settings retrieved', data);
    callback(data);
  });
}

function queryTheme() {
  const theme = window.localStorage && window.localStorage.theme;
  console.log('theme', theme);
  chrome.runtime.sendMessage({ theme });
}

// when the extension is loaded when opening devtools
chrome.runtime.onConnect.addListener(function (port) {
  // check for the theme in the running tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].id == null) {
      return;
    }
    chrome.tabs.executeScript(tabs[0].id, {
      code: `(${queryTheme})()`,
    });
  });
  const extensionListener = function (message, sender, sendResponse) {
    if (message.tabId && message.action) {
      // handle changing theme from extension into inspected page
      // these messages come from panel.js

      console.log('background', message);
      switch (message.action) {
        case 'removeTheme':
          chrome.tabs.sendMessage(message.tabId, 'none');
          break;
        case 'setTheme-light':
          chrome.tabs.sendMessage(message.tabId, 'light');
          break;
        case 'setTheme-dark':
          chrome.tabs.sendMessage(message.tabId, 'dark');
          break;
        default:
          break;
      }

      // This accepts messages from the inspected page and
      // sends them to the panel
      chrome.browserAction.setIcon({
        path: `./icon128${message.action === 'removeTheme' ? '-mono' : ''}.png`,
      });
      chrome.browserAction.setBadgeText({
        text: message.action === 'removeTheme' ? '' : 'ON',
      });
    } else {
      port.postMessage(message);
    }
    sendResponse(message);
  };

  // Listens to messages sent from the panel
  chrome.runtime.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function () {
    chrome.runtime.onMessage.removeListener(extensionListener);
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (sender.tab && request.theme) {
    chrome.browserAction.setIcon({
      path: `./icon128${request.theme === 'none' ? '-mono' : ''}.png`,
    });
    chrome.browserAction.setBadgeText({
      text: request.theme === 'none' ? '' : 'ON',
    });
  }
});
