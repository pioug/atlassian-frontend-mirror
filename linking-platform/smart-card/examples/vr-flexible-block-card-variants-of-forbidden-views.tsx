import React from 'react';
import styled from '@emotion/styled';
import { getCardState } from './utils/flexible-ui';
import { VRTestWrapper } from './utils/vr-test';
import { AnalyticsFacade } from '../src/state/analytics/useSmartLinkAnalytics';
import { BlockCard } from '../src/view/BlockCard';

const Container = styled.div`
  width: 80%;
`;

const getMetadata = (accessType?: string) => {
  return {
    requestAccess: { accessType: accessType },
  };
};

export default () => {
  const mockAnalytics = {} as AnalyticsFacade;
  return (
    <VRTestWrapper title="Block Card with Flexible UI: Variations of Forbidden views">
      <Container>
        <div style={{ padding: '30px' }}>
          <h5>Default Forbidden view </h5>
          <BlockCard
            cardState={getCardState({ url: 'some-url' }, {}, 'forbidden')}
            url="some.url"
            handleAuthorize={() => {}}
            analytics={mockAnalytics}
            handleInvoke={() => Promise.resolve()}
            handleErrorRetry={() => {}}
            handleFrameClick={() => {}}
            id={'12344'}
            enableFlexibleBlockCard={true}
            testId={'default-forbidden-view'}
          />
          <h5>Forbidden view with 'DIRECT_ACCESS' </h5>
          <BlockCard
            cardState={getCardState(
              { url: 'some-url' },
              getMetadata('DIRECT_ACCESS'),
              'forbidden',
            )}
            url="some.url"
            handleAuthorize={() => {}}
            analytics={mockAnalytics}
            handleInvoke={() => Promise.resolve()}
            handleErrorRetry={() => {}}
            handleFrameClick={() => {}}
            id={'12344'}
            enableFlexibleBlockCard={true}
            testId={'direct-access-forbidden-view'}
          />
          <h5>Forbidden view with 'REQUEST_ACCESS' </h5>
          <BlockCard
            cardState={getCardState(
              { url: 'some-url' },
              getMetadata('REQUEST_ACCESS'),
              'forbidden',
            )}
            url="some.url"
            handleAuthorize={() => {}}
            analytics={mockAnalytics}
            handleInvoke={() => Promise.resolve()}
            handleErrorRetry={() => {}}
            handleFrameClick={() => {}}
            id={'12344'}
            enableFlexibleBlockCard={true}
            testId={'request-access-forbidden-view'}
          />
          <h5>Forbidden view with 'PENDING_REQUEST_EXISTS' </h5>
          <BlockCard
            cardState={getCardState(
              { url: 'some-url' },
              getMetadata('PENDING_REQUEST_EXISTS'),
              'forbidden',
            )}
            url="some.url"
            handleAuthorize={() => {}}
            analytics={mockAnalytics}
            handleInvoke={() => Promise.resolve()}
            handleErrorRetry={() => {}}
            handleFrameClick={() => {}}
            id={'12344'}
            enableFlexibleBlockCard={true}
            testId={'pending-request-forbidden-view'}
          />
          <h5>Forbidden view with 'FORBIDDEN' </h5>
          <BlockCard
            cardState={getCardState(
              { url: 'some-url' },
              getMetadata('FORBIDDEN'),
              'forbidden',
            )}
            url="some.url"
            handleAuthorize={() => {}}
            analytics={mockAnalytics}
            handleInvoke={() => Promise.resolve()}
            handleErrorRetry={() => {}}
            handleFrameClick={() => {}}
            id={'12344'}
            enableFlexibleBlockCard={true}
            testId={'forbidden-forbidden-view'}
          />
          <h5>Forbidden view with 'DENIED_REQUEST_EXISTS' </h5>
          <BlockCard
            cardState={getCardState(
              { url: 'some-url' },
              getMetadata('DENIED_REQUEST_EXISTS'),
              'forbidden',
            )}
            url="some.url"
            handleAuthorize={() => {}}
            analytics={mockAnalytics}
            handleInvoke={() => Promise.resolve()}
            handleErrorRetry={() => {}}
            handleFrameClick={() => {}}
            id={'12344'}
            enableFlexibleBlockCard={true}
            testId={'denied-request-forbidden-view'}
          />
        </div>
      </Container>
    </VRTestWrapper>
  );
};
