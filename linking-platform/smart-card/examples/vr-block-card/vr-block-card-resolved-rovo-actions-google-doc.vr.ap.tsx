import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { iconGoogleDrive } from '@atlaskit/link-test-helpers/smart-card/images';
import { GoogleDoc, GoogleDocUrl } from '@atlaskit/link-test-helpers/smart-card/mocks/gdrive';

import { Card } from '../../src';
import ExampleContainer from '../utils/example-container';

const googleDocResponse = {
	...GoogleDoc,
	data: {
		...GoogleDoc.data,
		// Replace remote images with local ones: VR fails on non-local network requests.
		icon: iconGoogleDrive,
		generator: { '@type': 'Application', name: 'Google Drive', icon: iconGoogleDrive },
		attributedTo: { '@type': 'Person', name: 'Atlas' },
		'atlassian:updatedBy': { '@type': 'Person', name: 'Atlas' },
	},
	meta: {
		...GoogleDoc.meta,
		supportedFeature: ['RovoActions'],
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;

class ProviderClient extends CardClient {
	fetchData(_: string) {
		return Promise.resolve(googleDocResponse);
	}
}

/**
 * Google Docs falls back to the Summarize Rovo action in block cards, so this
 * snapshot covers the Summarize action icon.
 */
const VRBlockCardResolvedRovoActionsGoogleDoc: {
	(): JSX.Element;
	displayName: string;
} = (): JSX.Element => {
	return (
		<ExampleContainer title="Block Card with Rovo Actions (Google Doc)">
			<SmartCardProvider
				client={new ProviderClient()}
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				product="CONFLUENCE"
			>
				<Card
					appearance="block"
					url={GoogleDocUrl}
					actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
				/>
			</SmartCardProvider>
		</ExampleContainer>
	);
};

VRBlockCardResolvedRovoActionsGoogleDoc.displayName = 'VRBlockCardResolvedRovoActionsGoogleDoc';

export default VRBlockCardResolvedRovoActionsGoogleDoc;
