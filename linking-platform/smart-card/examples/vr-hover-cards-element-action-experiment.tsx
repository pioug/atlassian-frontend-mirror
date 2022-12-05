/** @jsx jsx */
import { jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { Card, Client, Provider, ResolveResponse } from '../src';
import { JiraIssue } from '../examples-helpers/_jsonLDExamples/provider.jira';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(JiraIssue as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper title="Experiment: Actionable Element">
    <Provider
      client={new CustomClient('staging')}
      featureFlags={{ showHoverPreview: true, enableActionableElement: true }}
    >
      <Card url="https://www.mockurl.com" appearance="inline" />
    </Provider>
  </VRTestWrapper>
);
