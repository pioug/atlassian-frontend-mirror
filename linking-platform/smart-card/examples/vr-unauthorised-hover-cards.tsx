import React from 'react';
import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client, ResolveResponse } from '../src';
import { Card } from '../src';
import { mockUnauthorisedResponse } from '../src/view/HoverCard/__tests__/__mocks__/mocks';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(mockUnauthorisedResponse as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper title="Unauthorised Hover Card (Tooltip)">
    <Provider
      client={new CustomClient('staging')}
      featureFlags={{ showAuthTooltip: 'experiment' }}
    >
      <Card url={'https://www.mockurl.com'} appearance="inline" />
    </Provider>
  </VRTestWrapper>
);
