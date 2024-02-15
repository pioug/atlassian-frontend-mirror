import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { ChartPlaceholder } from '../src/ui/ChartPlaceholder';

export default function ChartPlaceholderExample() {
  return (
    <IntlProvider locale="en">
      <div style={{ padding: `${token('space.600', '48px')}` }}>
        <ChartPlaceholder />
      </div>
    </IntlProvider>
  );
}
