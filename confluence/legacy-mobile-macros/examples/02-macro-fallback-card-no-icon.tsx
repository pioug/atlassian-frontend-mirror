import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { MacroFallbackCard } from '../src/ui';

export default function MacroFallbackCardNoIconsExample() {
  return (
    <IntlProvider locale="en">
      <div style={{ padding: '50px' }}>
        <MacroFallbackCard
          macroName="Macro Name"
          extensionKey=""
          action="Cancel"
          loading={false}
          secondaryAction=""
        />
      </div>
    </IntlProvider>
  );
}
