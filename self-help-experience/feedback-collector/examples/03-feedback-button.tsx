import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { FeedbackButton } from '../src';

export default () => (
  <IntlProvider locale={'en'}>
    <FeedbackButton embeddableKey={'key1'} requestTypeId={'100'} />
  </IntlProvider>
);
