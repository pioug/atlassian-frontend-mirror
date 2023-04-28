/** @jsx jsx */
import { jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { Card, Client, Provider, ResolveResponse } from '../src';
import { JiraIssue } from '../examples-helpers/_jsonLDExamples/provider.jira';
import './utils/fetch-mock-invoke';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(JiraIssue as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper title="Hover Card: Server Actions">
    <Provider
      client={new CustomClient('staging')}
      featureFlags={{ useLozengeAction: 'experiment' }}
    >
      <Card
        url="https://www.mockurl.com"
        appearance="inline"
        showHoverPreview={true}
        showServerActions={true}
      />
    </Provider>
  </VRTestWrapper>
);
