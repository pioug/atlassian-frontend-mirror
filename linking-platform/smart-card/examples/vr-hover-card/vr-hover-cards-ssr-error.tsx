/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Provider, Client } from '../../src';
import { Card } from '../../src';
import { mockSSRResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import { CardProviderStoreOpts } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';

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
  <VRTestWrapper>
    <Provider
      storeOptions={storeOptions}
      client={new CustomFailureClient('staging')}
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
