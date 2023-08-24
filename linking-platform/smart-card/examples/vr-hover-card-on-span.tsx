/** @jsx jsx */
import { jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client, ResolveResponse } from '../src';
import { mockConfluenceResponse } from '../src/view/HoverCard/__tests__/__mocks__/mocks';
import { HoverCard } from '../src/hoverCard';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(mockConfluenceResponse as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper title="Hover Card">
    <Provider client={new CustomClient('staging')}>
      <HoverCard url="https://www.mockurl.com">
        <span data-testid="hover-test-span">Hover on me!</span>
      </HoverCard>
    </Provider>
  </VRTestWrapper>
);
