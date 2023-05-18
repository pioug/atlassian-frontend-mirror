/** @jsx jsx */
import { VRTestWrapper } from './utils/vr-test';
import { getJsonLdResponse } from './utils/flexible-ui';
import { JiraIssue } from '../examples-helpers/_jsonLDExamples';
import { TitleBlock, SnippetBlock, Card, Provider } from '../src/index';
import { jsx } from '@emotion/react';
import { CardClient } from '@atlaskit/link-provider';

class MaximumResolvedCustomClient extends CardClient {
  fetchData(url: string) {
    return Promise.resolve(
      getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data),
    );
  }
}

export default () => (
  <VRTestWrapper title="Flexible UI: Hover card - No preview button">
    <Provider
      client={new MaximumResolvedCustomClient()}
      featureFlags={{ enableImprovedPreviewAction: true }}
    >
      <Card
        appearance="block"
        url={'https://product-fabric.atlassian.net/wiki/spaces/EM'}
        showHoverPreview={true}
        ui={{ hideHoverCardPreviewButton: true }}
      >
        <TitleBlock />
        <SnippetBlock />
      </Card>
    </Provider>
  </VRTestWrapper>
);
