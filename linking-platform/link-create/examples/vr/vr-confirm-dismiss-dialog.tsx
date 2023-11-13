import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ConfirmDismissDialog } from '../../src/ui/link-create/confirm-dismiss-dialog';

const createExample = (): React.ComponentType => {
  return function Example() {
    return (
      <IntlProvider locale="en">
        <ConfirmDismissDialog active={true} onClose={() => {}} />;
      </IntlProvider>
    );
  };
};

export const DefaultConfirmDismissDialog = createExample();
