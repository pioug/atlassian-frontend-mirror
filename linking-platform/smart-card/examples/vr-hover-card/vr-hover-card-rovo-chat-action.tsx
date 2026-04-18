import React from 'react';

import { DiProvider, injectable } from 'react-magnetic-di';

import type { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import {
	GoogleDoc,
	GoogleDocUrl,
	iconGoogleDrive,
	SlackMessage,
} from '@atlaskit/link-test-helpers';

import { CardSSR } from '../../src/ssr';
import useAISummaryAction from '../../src/state/hooks/use-ai-summary-action';
import type { AISummaryState } from '../../src/state/hooks/use-ai-summary/ai-summary-service/types';
import VRTestWrapper from '../utils/vr-test-wrapper';

const googleDocResponse = {
	...GoogleDoc,
	data: {
		...GoogleDoc.data,
		generator: {
			'@type': 'Application',
			name: 'Google Drive',
			icon: {
				'@type': 'Image',
				url: iconGoogleDrive,
			},
		},
		icon: iconGoogleDrive,
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;

const slackMessageResponse = {
	...SlackMessage,
	meta: {
		...SlackMessage.meta,
		supportedFeature: ['RovoActions'],
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;

const mockState: AISummaryState = {
	status: 'done',
	content: `Here's some test content to indicate a summary`,
};
const mockUseAiSummaryAction = injectable(useAISummaryAction, () => ({
	summariseUrl: () => Promise.resolve(mockState),
	state: mockState,
}));

const dependencies = [mockUseAiSummaryAction];

const createHoverCardRovoChatAction = (provider: 'google' | 'slack') => {
	class ProviderClient extends CardClient {
		fetchData(_: string) {
			return Promise.resolve(provider === 'google' ? googleDocResponse : slackMessageResponse);
		}
	}

	const url = provider === 'google' ? GoogleDocUrl : SlackMessage.data.url;

	const Component = (): React.JSX.Element => (
		<DiProvider use={dependencies}>
			<VRTestWrapper>
				<SmartCardProvider
					client={new ProviderClient()}
					product="CONFLUENCE"
					rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				>
					<CardSSR
						actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
						appearance="inline"
						hideIconLoadingSkeleton={true}
						showHoverPreview={true}
						url={url}
					/>
				</SmartCardProvider>
			</VRTestWrapper>
		</DiProvider>
	);

	Component.displayName = `HoverCardRovoChatAction_${provider}`;
	return Component;
};

export const HoverCardRovoChatActionGoogle = createHoverCardRovoChatAction('google');
export const HoverCardRovoChatActionSlack = createHoverCardRovoChatAction('slack');

export default HoverCardRovoChatActionGoogle;
