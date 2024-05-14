/** @jsx jsx */
import type { AISummaryState } from '../../src/state/hooks/use-ai-summary/ai-summary-service/types';
import { getJsonLdResponse } from '../utils/flexible-ui';
import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import { TitleBlock, SnippetBlock, Card, Provider } from '../../src/index';
import { jsx } from '@emotion/react';
import { CardClient } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { DiProvider, injectable } from 'react-magnetic-di';
import { useAISummary } from '../../src/state/hooks/use-ai-summary';

class MaximumResolvedCustomClient extends CardClient {
  fetchData(url: string) {
    return Promise.resolve(
      getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data),
    );
  }
}

const mockState: AISummaryState = {
  status: 'done',
  content: `Here's some test content to indicate a summary`,
};
const mockUseAiSummary = injectable(useAISummary, () => ({
  summariseUrl: () => Promise.resolve(mockState),
  state: mockState,
}));

const dependencies = [mockUseAiSummary];

export default () => (
  <DiProvider use={dependencies}>
    <VRTestWrapper>
      <Provider
        client={new MaximumResolvedCustomClient()}
        isAdminHubAIEnabled={true}
        product="JSM"
      >
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
