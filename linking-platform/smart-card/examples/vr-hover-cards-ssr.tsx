/** @jsx jsx */
import { jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client, ResolveResponse } from '../src';
import { Card } from '../src';
import {
  mockSSRResponse,
  mockConfluenceResponse,
} from '../src/view/HoverCard/__tests__/__mocks__/mocks';
import { CardProviderStoreOpts } from '@atlaskit/link-provider';

class CustomLoadingClient extends Client {
  async fetchData(url: string) {
    await new Promise(() => {});
    return Promise.resolve(mockConfluenceResponse as ResolveResponse);
  }
}
class CustomFailureClient extends Client {
  async fetchData(url: string) {
    return Promise.reject('something went wrong');
  }
}

const url = 'https://www.mockurl.com';

const mockState: any = {
  status: 'resolved',
  lastUpdatedAt: 1624877833614,
  details: mockSSRResponse,
};

const storeOptions: CardProviderStoreOpts = {
  initialState: {
    [url]: mockState,
  },
};

export default () => (
  <VRTestWrapper title="Hover Card">
    <Provider
      storeOptions={storeOptions}
      client={new CustomLoadingClient('staging')}
      featureFlags={{ enableImprovedPreviewAction: true }}
    >
      <Card
        url={url}
        appearance="inline"
        showHoverPreview={true}
        testId="ssr-hover-card-loading"
      />
    </Provider>
    <Provider
      storeOptions={storeOptions}
      client={new CustomFailureClient('staging')}
      featureFlags={{ enableImprovedPreviewAction: true }}
    >
      <Card
        url={url}
        appearance="inline"
        showHoverPreview={true}
        testId="ssr-hover-card-errored"
      />
    </Provider>
  </VRTestWrapper>
);
