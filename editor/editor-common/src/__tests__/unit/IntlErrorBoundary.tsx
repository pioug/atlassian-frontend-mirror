import React from 'react';

import { render } from '@testing-library/react';
import { FormattedMessage, IntlProvider } from 'react-intl-next';

import { IntlErrorBoundary } from '../../ui/IntlErrorBoundary';

const TestComponent = () => {
  return (
    <div data-testid="test-component">
      <FormattedMessage id="testMessage" defaultMessage="Default Message" />
    </div>
  );
};

describe('IntlErrorBoundary', () => {
  it('should setup default IntlProvider if not wrapped in one', () => {
    const cmp = render(
      <IntlErrorBoundary>
        <TestComponent />
      </IntlErrorBoundary>,
    );
    const message = cmp.getByTestId('test-component');
    expect(message).toHaveTextContent('Default Message');
  });

  it('should re-use top level IntlProvider', () => {
    const cmp = render(
      <IntlProvider
        locale="fr"
        messages={{
          testMessage: 'Testing IntlErrorBoundary',
        }}
      >
        <IntlErrorBoundary>
          <TestComponent />
        </IntlErrorBoundary>
      </IntlProvider>,
    );
    const message = cmp.getByTestId('test-component');
    expect(message).toHaveTextContent('Testing IntlErrorBoundary');
  });
});
