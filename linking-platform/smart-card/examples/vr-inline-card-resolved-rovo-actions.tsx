import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { SlackMessage } from '@atlaskit/link-test-helpers';

import { Card } from '../src';

import ExampleContainer from './utils/example-container';

const slackMessageResponse = {
	...SlackMessage,
	meta: {
		...SlackMessage.meta,
		supportedFeature: ['RovoActions'],
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;

class ProviderClient extends CardClient {
	fetchData(_: string) {
		return Promise.resolve(slackMessageResponse);
	}
}

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
			<SmartCardProvider
				client={new ProviderClient()}
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
			>
				<Card
					appearance="inline"
					url={SlackMessage.data.url}
					showHoverPreview={true}
					actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
				/>
			</SmartCardProvider>
		</ExampleContainer>
	);
};

VRInlineCardResolvedRovoActions.displayName = 'VRInlineCardResolvedRovoActions';

export default VRInlineCardResolvedRovoActions;