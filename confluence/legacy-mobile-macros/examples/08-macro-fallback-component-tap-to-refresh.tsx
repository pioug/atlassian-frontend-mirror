import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { MacroFallbackComponent } from '../src/ui';

export default function MacroFallbackComponentTapToRefreshExample() {
  const createPromise = () => ({
    submit: () => new Promise((resolve) => resolve(false)),
  });
  const eventDispatcher = {
    on: () => {},
    off: () => {},
    emit: () => {},
  };
  const extension = {
    extensionKey: 'toc',
    extensionType: 'macro',
    parameters: {
      macroMetadata: {
        macroId: 'MacroID',
        title: 'Click multiple times to fail out',
      },
    },
  };

  return (
    <IntlProvider locale="en">
      <div style={{ padding: '50px' }}>
        <MacroFallbackComponent
          createPromise={createPromise}
          eventDispatcher={eventDispatcher}
          extension={extension}
          openInBrowser={false}
        />
      </div>
    </IntlProvider>
  );
}
