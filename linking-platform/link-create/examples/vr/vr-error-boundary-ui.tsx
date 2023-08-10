import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ErrorBoundaryUI } from '../../src/ui/link-create/error-boundary/error-boundary-ui';

const createExample = (): React.ComponentType => {
  return function Example() {
    return (
      <IntlProvider locale="en">
        <ErrorBoundaryUI />
      </IntlProvider>
    );
  };
};

export const DefaultErrorBoundary = createExample();
