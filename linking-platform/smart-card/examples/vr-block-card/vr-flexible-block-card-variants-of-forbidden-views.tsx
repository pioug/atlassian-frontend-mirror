import React from 'react';
import styled from '@emotion/styled';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { GetCardStateProps, getCardState } from './../utils/flexible-ui';
import VRTestWrapper from './../utils/vr-test-wrapper';
import { AnalyticsFacade } from '../../src/state/analytics/useSmartLinkAnalytics';
import { BlockCard } from '../../src/view/BlockCard';
import JiraPreviewImage from '../../examples/images/forbidden-jira.svg';
import { token } from '@atlaskit/tokens';

const Container = styled.div({
  width: '80%',
});

const getMetadata = (accessType?: string) => {
  return {
    requestAccess: { accessType: accessType },
  };
};

export const BlockCardForbiddenViews = () => {
  const mockAnalytics = {} as AnalyticsFacade;
  const mockUrl = 'https://some-url.com';
  const commonState: GetCardStateProps = {
    data: { url: mockUrl, image: JiraPreviewImage },
    status: 'forbidden',
  };

  return (
    <VRTestWrapper>
      <SmartCardProvider>
        <Container>
          <div style={{ padding: token('space.400', '32px') }}>
            <h5>Default Forbidden view </h5>
            <BlockCard
              cardState={getCardState(commonState)}
              url={mockUrl}
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
                ...commonState,
                meta: getMetadata('DIRECT_ACCESS'),
              })}
              url={mockUrl}
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
                ...commonState,
                meta: getMetadata('REQUEST_ACCESS'),
              })}
              url={mockUrl}
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
                ...commonState,
                meta: getMetadata('PENDING_REQUEST_EXISTS'),
              })}
              url={mockUrl}
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
                ...commonState,
                meta: getMetadata('FORBIDDEN'),
              })}
              url={mockUrl}
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
                ...commonState,
                meta: getMetadata('DENIED_REQUEST_EXISTS'),
              })}
              url={mockUrl}
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

export const BlockCardForbiddenViewsLegacy = () => {
  const mockAnalytics = {} as AnalyticsFacade;
  const mockUrl = 'https://some-url.com';
  const commonState: GetCardStateProps = {
    data: { url: mockUrl, image: JiraPreviewImage },
    status: 'forbidden',
  };

  return (
    <VRTestWrapper>
      <SmartCardProvider>
        <Container>
          <div style={{ padding: token('space.400', '32px') }}>
            <h5>Default Forbidden view </h5>
            <BlockCard
              cardState={getCardState(commonState)}
              url={mockUrl}
              handleAuthorize={() => {}}
              analytics={mockAnalytics}
              handleInvoke={() => Promise.resolve()}
              handleErrorRetry={() => {}}
              handleFrameClick={() => {}}
              id={'12344'}
              enableFlexibleBlockCard={false}
              testId={'default-forbidden-view'}
            />
            <h5>Forbidden view with 'DIRECT_ACCESS' </h5>
            <BlockCard
              cardState={getCardState({
                ...commonState,
                meta: getMetadata('DIRECT_ACCESS'),
              })}
              url={mockUrl}
              handleAuthorize={() => {}}
              analytics={mockAnalytics}
              handleInvoke={() => Promise.resolve()}
              handleErrorRetry={() => {}}
              handleFrameClick={() => {}}
              id={'12344'}
              enableFlexibleBlockCard={false}
              testId={'direct-access-forbidden-view'}
            />
            <h5>Forbidden view with 'REQUEST_ACCESS' </h5>
            <BlockCard
              cardState={getCardState({
                ...commonState,
                meta: getMetadata('REQUEST_ACCESS'),
              })}
              url={mockUrl}
              handleAuthorize={() => {}}
              analytics={mockAnalytics}
              handleInvoke={() => Promise.resolve()}
              handleErrorRetry={() => {}}
              handleFrameClick={() => {}}
              id={'12344'}
              enableFlexibleBlockCard={false}
              testId={'request-access-forbidden-view'}
            />
            <h5>Forbidden view with 'PENDING_REQUEST_EXISTS' </h5>
            <BlockCard
              cardState={getCardState({
                ...commonState,
                meta: getMetadata('PENDING_REQUEST_EXISTS'),
              })}
              url={mockUrl}
              handleAuthorize={() => {}}
              analytics={mockAnalytics}
              handleInvoke={() => Promise.resolve()}
              handleErrorRetry={() => {}}
              handleFrameClick={() => {}}
              id={'12344'}
              enableFlexibleBlockCard={false}
              testId={'pending-request-forbidden-view'}
            />
            <h5>Forbidden view with 'FORBIDDEN' </h5>
            <BlockCard
              cardState={getCardState({
                ...commonState,
                meta: getMetadata('FORBIDDEN'),
              })}
              url={mockUrl}
              handleAuthorize={() => {}}
              analytics={mockAnalytics}
              handleInvoke={() => Promise.resolve()}
              handleErrorRetry={() => {}}
              handleFrameClick={() => {}}
              id={'12344'}
              enableFlexibleBlockCard={false}
              testId={'forbidden-forbidden-view'}
            />
            <h5>Forbidden view with 'DENIED_REQUEST_EXISTS' </h5>
            <BlockCard
              cardState={getCardState({
                ...commonState,
                meta: getMetadata('DENIED_REQUEST_EXISTS'),
              })}
              url={mockUrl}
              handleAuthorize={() => {}}
              analytics={mockAnalytics}
              handleInvoke={() => Promise.resolve()}
              handleErrorRetry={() => {}}
              handleFrameClick={() => {}}
              id={'12344'}
              enableFlexibleBlockCard={false}
              testId={'denied-request-forbidden-view'}
            />
          </div>
        </Container>
      </SmartCardProvider>
    </VRTestWrapper>
  );
};
