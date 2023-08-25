import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ChartPlaceholder } from '../src/ui/ChartPlaceholder';

export default function ChartPlaceholderExample() {
  return (
    <IntlProvider locale="en">
      <div style={{ padding: '50px' }}>
        <ChartPlaceholder />
      </div>
    </IntlProvider>
  );
}
