/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { AISummaryState } from '../../src/state/hooks/use-ai-summary/ai-summary-service/types';
import { getJsonLdResponse } from '../utils/flexible-ui';
import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import { TitleBlock, SnippetBlock, Card, Provider } from '../../src/index';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { CardClient } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { DiProvider, injectable } from 'react-magnetic-di';
import useAISummaryAction from '../../src/state/hooks/use-ai-summary-action';
import { AISummaryBlockStatusIndicator } from '../../src/view/FlexibleCard/components/blocks/ai-summary-block/resolved';
import AISummary from '../../src/view/common/ai-summary';

class MaximumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data));
	}
}

const mockState: AISummaryState = {
	status: 'done',
	content: `Here's some test content to indicate a summary`,
};
const mockUseAISummaryAction = injectable(useAISummaryAction, () => ({
	summariseUrl: () => Promise.resolve(mockState),
	state: mockState,
}));

const mockAISummaryBlockStatusIndicator = injectable(AISummaryBlockStatusIndicator, (props) => (
	<AISummaryBlockStatusIndicator {...props} showStatusIndicator={true} />
));

const mockAISummary = injectable(AISummary, (props) => <AISummary {...props} showIcon={false} />);

const dependencies = [mockUseAISummaryAction, mockAISummaryBlockStatusIndicator, mockAISummary];

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
