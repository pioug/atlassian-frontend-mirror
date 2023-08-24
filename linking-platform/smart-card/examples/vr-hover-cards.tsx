/** @jsx jsx */
import { jsx } from '@emotion/react';

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
      <div style={{ marginTop: 250 }}>
        <Card
          url={'https://www.mockurl.com'}
          appearance="inline"
          showHoverPreview={true}
        />
      </div>
    </Provider>
  </VRTestWrapper>
);
