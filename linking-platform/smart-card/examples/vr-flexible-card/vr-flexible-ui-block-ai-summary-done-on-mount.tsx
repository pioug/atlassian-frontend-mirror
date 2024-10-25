/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { CardClient } from '@atlaskit/link-provider';

import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import { Card, Provider, SnippetBlock, TitleBlock } from '../../src';
import useAISummaryAction from '../../src/state/hooks/use-ai-summary-action';
import type { AISummaryState } from '../../src/state/hooks/use-ai-summary/ai-summary-service/types';
import { getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class MaximumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data));
	}
}

const mockState: AISummaryState = {
	status: 'done',
	content: `Here's some test content to indicate a summary`,
};
const mockUseAiSummary = injectable(useAISummaryAction, () => ({
	summariseUrl: () => Promise.resolve(mockState),
	state: mockState,
}));

const dependencies = [mockUseAiSummary];

export default () => (
	<DiProvider use={dependencies}>
		<VRTestWrapper>
			<Provider client={new MaximumResolvedCustomClient()} isAdminHubAIEnabled={true} product="JSM">
				<Card
					appearance="block"
					url={'https://product-fabric.atlassian.net/wiki/spaces/EM'}
					showHoverPreview={true}
					isSelected={true}
				>
					<TitleBlock hideTitleTooltip={true} />
					<SnippetBlock />
				</Card>
			</Provider>
		</VRTestWrapper>
	</DiProvider>
);
