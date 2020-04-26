import React from 'react';
import { IntlProvider } from 'react-intl';

export const render = (child: React.ReactNode) => (
  <IntlProvider locale="en">{child}</IntlProvider>
);
