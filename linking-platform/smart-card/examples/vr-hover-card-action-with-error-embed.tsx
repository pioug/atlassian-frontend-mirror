/** @jsx jsx */
import { jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { Card, Client, Provider, ResolveResponse } from '../src';
import { JiraIssue } from '../examples-helpers/_jsonLDExamples/provider.jira';
import fetchMock from 'fetch-mock/cjs/client';
import {
  getFetchMockInvokeOptions,
  mockSuccessfulLoadResponse,
  mockUpdateCustomErrorResponse,
} from './utils/invoke-error-responses';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(JiraIssue as ResolveResponse);
  }
}

fetchMock.mock(
  getFetchMockInvokeOptions(
    mockSuccessfulLoadResponse,
    mockUpdateCustomErrorResponse,
  ),
);

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
