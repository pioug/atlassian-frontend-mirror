import React from 'react';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import { Provider, ResolveResponse, Client } from '../../src';
import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(JiraIssue as ResolveResponse);
  }
}

export default () => (
  <VRTestWrapper>
    <Provider client={new CustomClient('staging')}>
      <HoverCardComponent url="https://www.mockurl.com" noFadeDelay={true}>
        <button>Hover over me!</button>
      </HoverCardComponent>
    </Provider>
  </VRTestWrapper>
);
