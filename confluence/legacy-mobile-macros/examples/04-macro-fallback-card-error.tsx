import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { MacroFallbackCard } from '../src/ui';

export default function MacroFallbackCardErrorExample() {
  return (
    <IntlProvider locale="en">
      <div style={{ padding: '50px' }}>
        <MacroFallbackCard
          macroName="Macro Name"
          extensionKey="toc"
          action="Cancel"
          loading={false}
          errorMessage="Something bad happened"
          secondaryAction="Abort"
        />
      </div>
    </IntlProvider>
  );
}
