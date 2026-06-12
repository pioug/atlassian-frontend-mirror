import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { SlackMessage, GithubFile, GoogleDoc, GoogleDocUrl, iconGoogleDrive } from '@atlaskit/link-test-helpers';

import { Card } from '../src';

import ExampleContainer from './utils/example-container';

class ProviderClient extends CardClient {
	protected providerResponse: JsonLd.Response<JsonLd.Data.BaseData>
	constructor(response: JsonLd.Response<JsonLd.Data.BaseData>) {
		super();
		this.providerResponse = response
	}
	fetchData(_: string) {
		return Promise.resolve(this.providerResponse);
	}
}

const providers = [
	{
		url: SlackMessage.data.url,
		response: {
			...SlackMessage,
			meta: {
				...SlackMessage.meta,
				supportedFeature: ['RovoActions'],
			}
		} as JsonLd.Response<JsonLd.Data.BaseData>
	},
	{
		url: 'https://github.com/tuser/test-repo/blob/tuser-patch-1/test.txt',
		response: {
			...GithubFile,
			meta: {
				...GithubFile.meta,
				supportedFeature: ['RovoActions'],
			}
		} as JsonLd.Response<JsonLd.Data.BaseData>
	},
	{
		url: GoogleDocUrl,
		response: {
			...GoogleDoc,
			data: {
				...GoogleDoc.data,
				icon: iconGoogleDrive
			},
			meta: {
				...GoogleDoc.meta,
				supportedFeature: ['RovoActions'],
			}
		} as JsonLd.Response<JsonLd.Data.BaseData>
	}
]

/**
 * VR snapshot for the inline card treatment cohort of
 * rovogrowth-640-inline-action-nudge-exp.
 *
 * Uses the real Card component with appearance="inline" so the snapshot
 * reflects the actual rendering pipeline (provider → resolver → inline view).
 */
const VRInlineCardResolvedRovoActions: {
	(): JSX.Element;
	displayName: string;
} = (): JSX.Element => {
	return (
		<ExampleContainer title="Inline Card with Rovo Actions CTA">
			{providers.map(provider => (
				<SmartCardProvider
					client={new ProviderClient(provider.response)}
					rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				>
					<Card
						appearance="inline"
						url={provider.url}
						showHoverPreview={true}
						actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
					/>
				</SmartCardProvider>
			))}
		</ExampleContainer>
	);
};

VRInlineCardResolvedRovoActions.displayName = 'VRInlineCardResolvedRovoActions';

export default VRInlineCardResolvedRovoActions;
