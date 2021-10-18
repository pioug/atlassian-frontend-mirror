/* eslint-disable func-names */
/* eslint-disable no-undef */

document.querySelector('button').addEventListener('click', function () {
  sendObjectToDevTools({ content: 'Changed by page' });
});
function sendObjectToDevTools(message) {
  // The callback here can be used to execute something on receipt
  chrome.extension.sendMessage(message, function () {});
}
