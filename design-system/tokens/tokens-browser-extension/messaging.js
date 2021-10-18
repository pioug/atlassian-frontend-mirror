/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// This creates and maintains the communication channel between
// the inspectedPage and the dev tools panel.
//
// In this example, messages are JSON objects
// {
//   action: ['code'|'script'|'message'], // What action to perform on the inspected page
//   content: [String|Path to script|Object], // data to be passed through
//   tabId: [Automatically added]
// }

(function createChannel() {
  // Create a port with background page for continous message communication
  const port = chrome.runtime.connect({
    name: 'Theming Communication',
  });

  // Listen to messages from the background page
  port.onMessage.addListener(function (message) {
    // the theme value from local storage in the inspected page
    const theme = message.theme || 'none';
    // update the extension panel.html with the theme value
    document.querySelector('#selected-theme').innerHTML = theme;
  });
})();

// This sends an object to the background page
// where it can be relayed to the inspected page
function sendObjectToInspectedPage(message) {
  message.tabId = chrome.devtools.inspectedWindow.tabId;
  chrome.runtime.sendMessage(message);
}
