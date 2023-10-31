import React from 'react';

import { IntlProvider } from 'react-intl-next';

import {
  ConfirmDismissDialog,
  ConfirmDismissDialogProps,
} from '../../src/ui/link-create/confirm-dismiss-dialog';

const createExample = (
  props: Partial<ConfirmDismissDialogProps> = {},
): React.ComponentType => {
  return function Example() {
    return (
      <IntlProvider locale="en">
        <ConfirmDismissDialog active={true} {...props} />;
      </IntlProvider>
    );
  };
};

export const DefaultConfirmDismissDialog = createExample();
