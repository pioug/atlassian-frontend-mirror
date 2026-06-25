import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { SlackMessage } from '@atlaskit/link-test-helpers';

import { Card } from '../../src';
import ExampleContainer from '../utils/example-container';

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
 * Uses the real Card component with appearance="block" so the snapshot
 * reflects the actual rendering pipeline (provider → resolver → block view).
 */
const VRBlockCardResolvedRovoActions: {
	(): JSX.Element;
	displayName: string;
} = (): JSX.Element => {
	return (
		<ExampleContainer title="Block Card with Rovo Actions">
			<SmartCardProvider
				client={new ProviderClient()}
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				product={'CONFLUENCE'}
			>
				<Card
					appearance="block"
					url={SlackMessage.data.url}
					actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
				/>
			</SmartCardProvider>
		</ExampleContainer>
	);
};

VRBlockCardResolvedRovoActions.displayName = 'VRBlockCardResolvedRovoActions';

export default VRBlockCardResolvedRovoActions;
