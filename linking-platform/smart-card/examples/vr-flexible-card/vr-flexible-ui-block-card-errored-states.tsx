import React from 'react';
import styled from '@emotion/styled';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { getCardState } from '../utils/flexible-ui';
import FlexibleErroredView from '../../src/view/BlockCard/views/flexible/FlexibleErroredView';
import FlexibleUnauthorisedView from '../../src/view/BlockCard/views/flexible/FlexibleUnauthorisedView';

import { AnalyticsFacade } from '../../src/state/analytics/useSmartLinkAnalytics';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
  width: '80%',
});

export default () => {
  const mockAnalytics = {} as AnalyticsFacade;
  return (
    <VRTestWrapper>
      <SmartCardProvider>
        <Container>
          <div style={{ padding: token('space.400', '32px') }}>
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
          </div>
        </Container>
      </SmartCardProvider>
    </VRTestWrapper>
  );
};
