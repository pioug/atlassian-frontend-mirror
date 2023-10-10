import React from 'react';
import styled from '@emotion/styled';

import { SmartCardProvider } from '@atlaskit/link-provider';

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

/**
 * @private
 * @deprecated {@link https://product-fabric.atlassian.net/browse/EDM-7977 Internal documentation for deprecation (no external access)}\
 * @deprecated Replaced by test of same name in ../vr-block-card/vr-flexible-block-card-variants-of-forbidden-views.tsx
 */
export default () => {
  const mockAnalytics = {} as AnalyticsFacade;
  return (
    <VRTestWrapper title="Block Card with Flexible UI: Variations of Forbidden views">
      <SmartCardProvider>
        <Container>
          <div style={{ padding: '30px' }}>
            <h5>Default Forbidden view </h5>
            <BlockCard
              cardState={getCardState({
                data: { url: 'some-url' },
                status: 'forbidden',
              })}
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
              cardState={getCardState({
                data: { url: 'some-url' },
                meta: getMetadata('DIRECT_ACCESS'),
                status: 'forbidden',
              })}
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
              cardState={getCardState({
                data: { url: 'some-url' },
                meta: getMetadata('REQUEST_ACCESS'),
                status: 'forbidden',
              })}
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
              cardState={getCardState({
                data: { url: 'some-url' },
                meta: getMetadata('PENDING_REQUEST_EXISTS'),
                status: 'forbidden',
              })}
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
              cardState={getCardState({
                data: { url: 'some-url' },
                meta: getMetadata('FORBIDDEN'),
                status: 'forbidden',
              })}
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
              cardState={getCardState({
                data: { url: 'some-url' },
                meta: getMetadata('DENIED_REQUEST_EXISTS'),
                status: 'forbidden',
              })}
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
      </SmartCardProvider>
    </VRTestWrapper>
  );
};
