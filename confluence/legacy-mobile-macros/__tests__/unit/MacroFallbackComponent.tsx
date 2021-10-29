import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { MacroFallbackComponent } from '../../src/ui/MacroFallbackComponent';

import { macroComponentProps } from './props.mock';

describe('MacroFallbackComponent', () => {
  it('should show spinner while loading', () => {
    const { getByTestId, container } = render(
      <IntlProvider>
        <MacroFallbackComponent {...macroComponentProps} />
      </IntlProvider>,
    );

    const cardButton = container.querySelector('button');
    expect(cardButton).toBeTruthy();
    cardButton && cardButton.click();

    const cardSpinner = getByTestId('macro-card-spinner');
    expect(cardSpinner).toBeTruthy();
  });
});
