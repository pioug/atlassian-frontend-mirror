import React from 'react';
import { md, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
This plugin is designed to make it easy to add a Google Drive experience to a
product. It uses Google Drive's Picker API and then renders a smart link on the
page after it is used.

## Installation

There are two parts to installing the Google Drive extension: getting the
plugin to run, and setting up your own Google Cloud Project.

### Installing the app

First, we assume you already have the editor set up - these are simply
instructions on adding the extension.

Install the extension package:

${code`yarn add @atlaskit/editor-extension-googledrive`}

Second, you need to add the extension to your editor.

${code`import googleDrivePluginManifest from "@atlaskit/editor-extension-googledrive"

pluginPlace: [googleDrivePluginManifest('KEY_TO_THE_KINGDOM', 'ID_TO_THE_KINGDOM')]`}

where \`KEY_TO_THE_KINGDOM\` is the API key and \`ID_TO_THE_KINGDOM\` is the
clientID of your Google Cloud Project.

### Setting up your Google Cloud Project

The plugin is designed to work with a Google Cloud Project. This means that the
maintainer needs access to a GCP.
Please reach out to a specific team to retrieve the API Key and OAuth 2.0
ClientID for their GCP.

Once you have access, make sure that the OAuth 2.0 Client ID includes the
appropriate Javascript origin and redirect URL.
If this has been properly set up, the Google Drive file picker should work
accordingly.

${(
	<>
		<p />
		<SectionMessage>
			You should likely set up two GCPs, one for local testing, and one for production - make sure
			both are verified and allow External user type under the OAuth consent screen.
		</SectionMessage>
	</>
)}
`;
