import React from 'react';
import styled from '@emotion/styled';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { getCardState } from './utils/flexible-ui';
import FlexibleErroredView from '../src/view/BlockCard/views/flexible/FlexibleErroredView';
import FlexibleUnauthorisedView from '../src/view/BlockCard/views/flexible/FlexibleUnauthorisedView';
import FlexibleForbiddenView from '../src/view/BlockCard/views/flexible/FlexibleForbiddenView';
import FlexibleNotFoundView from '../src/view/BlockCard/views/flexible/FlexibleNotFoundView';
import { VRTestWrapper } from './utils/vr-test';
import { AnalyticsFacade } from '../src/state/analytics/useSmartLinkAnalytics';

const Container = styled.div`
  width: 80%;
`;

export default () => {
  const mockAnalytics = {} as AnalyticsFacade;
  return (
    <VRTestWrapper title="Block Card with Flexible UI: Unresolved states">
      <SmartCardProvider>
        <Container>
          <div style={{ padding: '30px' }}>
            <h5>Errored view</h5>
            <FlexibleErroredView
              cardState={getCardState({
                data: { url: 'some-url' },
                status: 'errored',
              })}
              url="some.url"
              onAuthorize={() => {}}
              analytics={mockAnalytics}
            />
            <h5> Unauthorised view</h5>
            <FlexibleUnauthorisedView
              cardState={getCardState({
                data: { url: 'some-url' },
                status: 'unauthorized',
              })}
              url="some.url"
              onAuthorize={() => {}}
              analytics={mockAnalytics}
            />
            <h5>Forbidden view </h5>
            <FlexibleForbiddenView
              cardState={getCardState({
                data: { url: 'some-url' },
                status: 'forbidden',
              })}
              url="some.url"
              onAuthorize={() => {}}
              analytics={mockAnalytics}
            />
            <h5>Not Found </h5>
            <FlexibleNotFoundView
              cardState={getCardState({
                data: { url: 'some-url' },
                status: 'not_found',
              })}
              url="some.url"
              analytics={mockAnalytics}
            />
          </div>
        </Container>
      </SmartCardProvider>
    </VRTestWrapper>
  );
};
