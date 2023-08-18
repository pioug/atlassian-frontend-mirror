// Callback after api.js is loaded
async function gapiLoaded() {
  window.gapi.load('client:picker', initializePicker);
}
// Callback after API client is loaded. Loads discovery doc to initialize API
async function initializePicker() {
  await window.gapi.client.load(
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  );
}
// Callback after Google Identity Services are loaded
function gisLoaded(clientID: string, scopes: string[]) {
  const tc = window.google.accounts.oauth2.initTokenClient({
    client_id: clientID,
    scope: scopes.join(' '),
    callback: '',
  });
  window.GooglePicker.token_client = tc;
  window.clientID = clientID;
}
// Main function that calls required helper functions to load Google Picker library
export default async function ({
  clientID,
  scopes,
}: {
  clientID: string;
  scopes: string[];
}) {
  await new Promise<void>((resolve, reject) => {
    const handleLoad = () => {
      let scriptLoaded = false;
      let script2Loaded = false;
      // Load Google API loader script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://apis.google.com/js/api.js`;
      script.onload = () => {
        scriptLoaded = true;
        gapiLoaded();
        if (scriptLoaded && script2Loaded) {
          resolve();
        }
      };
      script.onerror = reject;
      document.body.appendChild(script);
      // Load the client library
      const script2 = document.createElement('script');
      script2.src = 'https://accounts.google.com/gsi/client';
      script2.async = true;
      script2.defer = true;
      script2.onload = () => {
        script2Loaded = true;
        gisLoaded(clientID, scopes);
        if (scriptLoaded && script2Loaded) {
          resolve();
        }
      };
      script2.onerror = reject;
      document.body.appendChild(script2);
    };
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }
  });
}
