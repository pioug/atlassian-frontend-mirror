import type { ExtensionManifest, MaybeADFEntity } from '@atlaskit/editor-common/extensions';
import enableGoogleDrive from './enable-googledrive';
import { inlineCard } from '@atlaskit/adf-utils/builders';
import type { InlineCardDefinition } from '@atlaskit/adf-schema';

declare global {
	interface Window {
		appKey?: string;
		clientID?: string;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		google: any;
		GooglePicker: {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			token_client: any;
			accessToken?: string;
		};
	}
}
const scopes = [
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.readonly',
];
let pickerResolve: (value: InlineCardDefinition) => void;
// Handle user's file selection and displays as a smart link
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickerCallback(data: { [x: string]: any[] }) {
	if (data[window.google.picker.Response.ACTION] !== window.google.picker.Action.PICKED) {
		return;
	}
	let url = 'nothing';
	if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
		let doc = data[window.google.picker.Response.DOCUMENTS][0];
		url = doc[window.google.picker.Document.URL];
	}
	const node = inlineCard({ url });
	pickerResolve(node);
}
// Create and render Picker object to browse files
function createPicker(appKey: string) {
	const showPicker = () => {
		const picker = new window.google.picker.PickerBuilder()
			.addView(window.google.picker.ViewId.DOCS)
			.setOAuthToken(window.GooglePicker.accessToken)
			.setDeveloperKey(appKey)
			.setCallback(pickerCallback)
			.build();
		picker.setVisible(true);
	};
	// Request an access token.
	window.appKey = appKey;
	window.GooglePicker.token_client.callback = async (response: {
		error: undefined;
		access_token: string | undefined;
		// Ignored via go/ees005
		// eslint-disable-next-line require-await
	}) => {
		try {
			if (response.error !== undefined) {
				throw response;
			}
			window.GooglePicker.accessToken = response.access_token;
			showPicker();
		} catch (error) {}
	};
	if (window.GooglePicker.accessToken === null) {
		// Prompt the user to select a Google Account and ask for consent to share their data
		// when establishing a new session.
		window.GooglePicker.token_client.requestAccessToken({ prompt: 'consent' });
	} else {
		// Skip display of account chooser and consent dialog for an existing session.
		window.GooglePicker.token_client.requestAccessToken({ prompt: '' });
	}
}
// Main function that calls the required initializations and implementations
async function pickFromGoogle(appKey: string, clientID: string): Promise<MaybeADFEntity | null> {
	window.GooglePicker = window.GooglePicker || {};
	await enableGoogleDrive({ clientID, scopes });
	return new Promise((resolve) => {
		pickerResolve = resolve;
		createPicker(appKey);
	});
}
// requires appKey and clientID parameters, which can be found through GCP
// appKey = APIKey, clientID = OAuth 2.0 Client ID
const manifestFunction = ({
	appKey,
	clientID,
}: {
	appKey: string;
	clientID: string;
}): ExtensionManifest => ({
	title: 'Google Drive',
	type: 'com.atlassian.tutorials.extensions',
	key: 'google-drive',
	description: 'Embed Google Drive file to collaborate with your team',
	icons: {
		'16': () =>
			import(
				/* webpackChunkName: "@atlaskit-internal_editor-googledrive" */ './icons/googledriveicon'
			).then((mod) => mod.default),
		'24': () =>
			import(
				/* webpackChunkName: "@atlaskit-internal_editor-googledrive" */ './icons/googledriveicon'
			).then((mod) => mod.default),
		'48': () =>
			import(
				/* webpackChunkName: "@atlaskit-internal_editor-googledrive" */ './icons/googledriveicon'
			).then((mod) => mod.default),
	},
	modules: {
		quickInsert: [
			{
				key: 'item',
				action: () =>
					// eslint-disable-next-line no-async-promise-executor
					new Promise(async (resolve, reject) => {
						try {
							const node = await pickFromGoogle(appKey, clientID);
							if (!node) {
								reject();
							} else {
								resolve(node);
							}
						} catch (e) {
							reject(e);
						}
					}),
			},
		],
	},
});
export default manifestFunction;
