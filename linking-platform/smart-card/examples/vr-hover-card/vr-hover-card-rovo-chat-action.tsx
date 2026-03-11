import React from 'react';

import { DiProvider, injectable } from 'react-magnetic-di';

import type { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { GoogleDoc, GoogleDocUrl, iconGoogleDrive } from '@atlaskit/link-test-helpers';

import { CardSSR } from '../../src/ssr.tsx';
import useAISummaryAction from '../../src/state/hooks/use-ai-summary-action';
import type { AISummaryState } from '../../src/state/hooks/use-ai-summary/ai-summary-service/types.ts';
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

class CustomClient extends CardClient {
	fetchData(_: string) {
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

export default (): React.JSX.Element => (
	<DiProvider use={dependencies}>
		<VRTestWrapper>
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
			</SmartCardProvider>
		</VRTestWrapper>
	</DiProvider>
);
