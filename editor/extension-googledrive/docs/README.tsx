import { md, code } from '@atlaskit/docs';
export default md`
This plugin is designed to make it easy to add a Google Drive experience to a pr
oduct. It uses
Google Drive's Picker API and then renders a smart link on the page after it is
used.
## Installation
There are two parts to installing the Google Drive extension: getting the plugin
 to run, and setting
up your own Google Cloud Project.
### Installing the app
First, we assume you already have the editor set up - these are simply instructi
ons on adding the extension.
Install the extension package:
${code`yarn add @atlaskit/editor-extension-googledrive`}
Second, you need to add the extension to your editor.
${code`import googleDrivePluginManifest from "@atlaskit/editor-extension-googleD
rive"
pluginPlace: [googleDrivePluginManifest('KEY_TO_THE_KINGDOM', 'ID_TO_THE_KINGDOM
)]`}
where the key to the \`KEY_TO_THE_KINGDOM\` is the key and \`ID_TO_THE_KINGDOM\`
 is the clientID of your Google Cloud Project.
### Setting up your Google Cloud Project
The plugin is designed to work with a Google Cloud Project. This means that the
maintainer needs access to a GCP.
Please reach out to a specific team to retrieve the API Key and OAuth 2.0 Client
 ID for their GCP.
`;
