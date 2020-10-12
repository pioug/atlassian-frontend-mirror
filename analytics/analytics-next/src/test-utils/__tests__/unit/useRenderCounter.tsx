import React from 'react';

import { render } from '@testing-library/react';

import { useRenderCounter } from '../../useRenderCounter';

const ComponentUsingHook = () => {
  const renderCounter = useRenderCounter();
  return <span data-testid="span">{renderCounter}</span>;
};

describe('useRenderCounter', () => {
  it('should return the current render count', () => {
    const { rerender, getByTestId } = render(<ComponentUsingHook />);

    expect(getByTestId('span').textContent).toBe('1');

    for (let i = 2; i < 11; i++) {
      rerender(<ComponentUsingHook />);

      expect(getByTestId('span').textContent).toBe(i.toString());
    }
  });
});
