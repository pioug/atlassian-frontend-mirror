/** @jsx jsx */
import { getJsonLdResponse } from '../utils/flexible-ui';
import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import { TitleBlock, SnippetBlock, Card, Provider } from '../../src/index';
import { jsx } from '@emotion/react';
import { CardClient } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { DiProvider, injectable } from 'react-magnetic-di';
import { useAISummary } from '../../src/state/hooks/use-ai-summary';
import AIPrism from '../../src/view/common/ai-prism';

class MaximumResolvedCustomClient extends CardClient {
  fetchData(url: string) {
    return Promise.resolve(
      getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data),
    );
  }
}

const mockAIPrism = injectable(AIPrism, (props) => (
  <AIPrism {...props} isMoving={false} />
));

const mockUseAiSummary = injectable(useAISummary, () => ({
  summariseUrl: () => Promise.resolve(),
  state: {
    status: 'loading',
    content: `Here's some partial content`,
  },
}));

const dependencies = [mockUseAiSummary, mockAIPrism];

export default () => (
  <DiProvider use={dependencies}>
    <VRTestWrapper>
      <Provider
        client={new MaximumResolvedCustomClient()}
        isAdminHubAIEnabled={true}
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
