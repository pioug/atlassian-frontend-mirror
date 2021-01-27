import React from 'react';

import { render } from '@testing-library/react';

import { MacroComponent } from '../../src/ui/MacroComponent';

import { macroComponentProps } from './props.mock';

describe('MacroComponent', () => {
  it('shoult show spinner while loading', () => {
    const { getByTestId, container } = render(
      <MacroComponent {...macroComponentProps} />,
    );

    const cardButton = container.querySelector('button');
    expect(cardButton).toBeTruthy();
    cardButton && cardButton.click();

    const cardSpinner = getByTestId('macro-card-spinner');
    expect(cardSpinner).toBeTruthy();
  });
});
