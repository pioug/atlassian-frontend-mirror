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

import { CardSSR } from '../src/ssr';
import useAISummaryAction from '../src/state/hooks/use-ai-summary-action';
import type { AISummaryState } from '../src/state/hooks/use-ai-summary/ai-summary-service/types';

import ExampleContainer from './utils/example-container';

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

class CustomClient extends CardClient {
	fetchData(url: string) {
		if (url === SlackMessage.data['@id']) {
			return Promise.resolve(slackMessageResponse);
		}
		return Promise.resolve(googleDocResponse);
	}
}

const mockState: AISummaryState = {
	status: 'done',
	content: `Here's some test content to indicate a summary`,
};
const mockUseAiSummaryAction = injectable(useAISummaryAction, () => ({
	summariseUrl: () => Promise.resolve(mockState),
	state: mockState,
}));

const dependencies = [mockUseAiSummaryAction];

const VRHoverCardRovoChatAction: {
	(): JSX.Element;
	displayName: string;
} = (): JSX.Element => {
	return (
		<DiProvider use={dependencies}>
			<ExampleContainer title="Hover Card with Rovo Chat Action">
				<SmartCardProvider
					client={new CustomClient()}
					product="CONFLUENCE"
					rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				>
					<CardSSR
						actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
						appearance="inline"
						hideIconLoadingSkeleton={true}
						showHoverPreview={true}
						url={GoogleDocUrl}
					/>
					<CardSSR
						actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
						appearance="inline"
						hideIconLoadingSkeleton={true}
						showHoverPreview={true}
						url={SlackMessage.data.url}
					/>
				</SmartCardProvider>
			</ExampleContainer>
		</DiProvider>
	);
};

VRHoverCardRovoChatAction.displayName = 'VRHoverCardRovoChatAction';

export default VRHoverCardRovoChatAction;
