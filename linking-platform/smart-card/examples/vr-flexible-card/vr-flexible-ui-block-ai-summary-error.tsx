/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { Card, SnippetBlock, TitleBlock } from '@atlaskit/smart-card';

import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import useAISummaryAction from '../../src/state/hooks/use-ai-summary-action';
import type { AISummaryState } from '../../src/state/hooks/use-ai-summary/ai-summary-service/types';
import { getErrorMessage } from '../../src/view/FlexibleCard/components/actions/ai-summary-action/utils';
import { ActionFooter } from '../../src/view/FlexibleCard/components/blocks/action-block/action-footer';
import { getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class MaximumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data));
	}
}

const mockState: AISummaryState = {
	status: 'error',
	content: '',
	error: 'NETWORK_ERROR',
};

const mockUseAiSummary = injectable(useAISummaryAction, () => ({
	summariseUrl: () => Promise.resolve(mockState),
	state: mockState,
}));

const mockActionFooter = injectable(ActionFooter, (props) => {
	const message = getErrorMessage(mockState.error);

	return <ActionFooter {...props} message={message} />;
});

const dependencies = [mockUseAiSummary, mockActionFooter];

export default () => (
	<VRTestWrapper>
		<DiProvider use={dependencies}>
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
		</DiProvider>
	</VRTestWrapper>
);
