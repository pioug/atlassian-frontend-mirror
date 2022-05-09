/** @jsx jsx */
import { jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client, ResolveResponse } from '../src';
import { Card } from '../src';
import { mockConfluenceResponse } from '../src/view/HoverCard/__tests__/__mocks__/mocks';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(mockConfluenceResponse as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper title="Hover Card">
    <Provider client={new CustomClient('staging')}>
      <Card
        url={'https://www.mockurl.com'}
        appearance="inline"
        showHoverPreview={true}
      />
    </Provider>
  </VRTestWrapper>
);
