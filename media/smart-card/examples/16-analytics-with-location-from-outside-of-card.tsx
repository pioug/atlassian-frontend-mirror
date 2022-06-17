/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import styled from '@emotion/styled';

import { Provider, Client, Card, useSmartLinkAnalytics } from '../src';
import { AnalyticsPayload } from '../src/utils/types';

const url =
  'https://sdog.jira-dev.com/jira/software/projects/SLT/boards/574?selectedIssue=SLT-1';
const analyticsHandler = (event: AnalyticsPayload) => {
  console.log(event);
};

const ExampleWrapper = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CardWithLocationAnalytics = () => {
  const id = 'test-id';
  const location = 'this-is-a-test-product';
  const analytics = useSmartLinkAnalytics(
    url,
    analyticsHandler,
    undefined,
    location,
  );

  // Changing the rendered event!
  analytics.ui.renderSuccessEvent = () => {
    console.log('spaghetti rendered!');
  };

  return (
    <Card
      onClick={() => {
        analytics.ui.cardClickedEvent(
          id,
          'block',
          'resolved',
          'this-is-a-test-definition-id',
          'this-is-a-test-extension-key',
        );
      }}
      id={id}
      url={url}
      appearance="block"
      analyticsEvents={analytics}
    />
  );
};

export default () => (
  <IntlProvider locale="en">
    <Provider client={new Client('stg')}>
      <ExampleWrapper>
        Try clicking this link!
        <CardWithLocationAnalytics />{' '}
      </ExampleWrapper>
    </Provider>
  </IntlProvider>
);
