/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import styled from '@emotion/styled';

import { Provider, Client, Card, useSmartLinkAnalytics } from '../src';
import { AnalyticsPayload } from '../src/utils/types';

const url =
  'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0';
const analyticsHandler = (event: AnalyticsPayload) => {
  console.log(event);
  console.log(event.attributes);
  console.log(
    'This event is being fired from',
    event.attributes.location,
    'with status',
    event.attributes.status,
    'and id',
    event.attributes.id,
  );
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

  // Sending clicked event!
  analytics.ui.cardClickedEvent(
    id,
    'block',
    'resolved',
    'This was a custom resolve!',
  );

  // Changing the rendered event!
  analytics.ui.renderSuccessEvent = () => {
    console.log('spaghetti rendered!');
  };

  return (
    <Card id={id} url={url} appearance="block" analyticsEvents={analytics} />
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
