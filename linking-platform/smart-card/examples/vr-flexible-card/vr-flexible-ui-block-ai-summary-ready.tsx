/** @jsx jsx */
import { getJsonLdResponse } from '../utils/flexible-ui';
import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import { TitleBlock, SnippetBlock, Card, Provider } from '../../src/index';
import { jsx } from '@emotion/react';
import { CardClient } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';

class MaximumResolvedCustomClient extends CardClient {
  fetchData(url: string) {
    return Promise.resolve(
      getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data),
    );
  }
}

export default () => (
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
);
