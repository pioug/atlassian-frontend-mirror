import React from 'react';

import { render } from '@testing-library/react';

import FocusRing from '../../src';

describe('Focus Ring', () => {
  it('renders with basic usage', () => {
    const { getByTestId } = render(
      <FocusRing>
        <div data-testid="test" />
      </FocusRing>,
    );

    expect(getByTestId('test')).toBeDefined();
  });

  it('renders with inset prop', () => {
    const { getByTestId } = render(
      <FocusRing isInset>
        <div data-testid="test" />
      </FocusRing>,
    );

    expect(getByTestId('test')).toBeDefined();
  });
});
