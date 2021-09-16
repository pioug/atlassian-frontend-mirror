import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import MacroComponent from '../../src/ui/MacroComponent';

import { macroComponentProps } from './props.mock';

describe('MacroComponent', () => {
  it('shoult show spinner while loading', () => {
    const { getByTestId, container } = render(
      <IntlProvider>
        <MacroComponent {...macroComponentProps} />
      </IntlProvider>,
    );

    const cardButton = container.querySelector('button');
    expect(cardButton).toBeTruthy();
    cardButton && cardButton.click();

    const cardSpinner = getByTestId('macro-card-spinner');
    expect(cardSpinner).toBeTruthy();
  });
});
