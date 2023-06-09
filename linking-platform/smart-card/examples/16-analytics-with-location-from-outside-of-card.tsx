import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import styled from '@emotion/styled';

import { Provider, Client, Card } from '../src';

const url = 'https://www.google.com';

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

  return (
    <AnalyticsContext data={{ attributes: { location } }}>
      <Card id={id} url={url} appearance="block" />
    </AnalyticsContext>
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
