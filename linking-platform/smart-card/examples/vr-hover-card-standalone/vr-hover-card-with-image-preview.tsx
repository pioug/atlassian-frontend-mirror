import React from 'react';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import { Provider, type ResolveResponse, Client } from '../../src';
import { TrelloBoard } from '../../examples-helpers/_jsonLDExamples';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(TrelloBoard as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper>
    <Provider
      client={new CustomClient('staging')}
      featureFlags={{ enableImprovedPreviewAction: true }}
    >
      <HoverCardComponent url="https://www.mockurl.com" noFadeDelay={true}>
        <button>Hover over me!</button>
      </HoverCardComponent>
    </Provider>
  </VRTestWrapper>
);
