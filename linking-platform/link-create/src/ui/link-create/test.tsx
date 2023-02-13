import React from 'react';

import { render } from '@testing-library/react';

import LinkCreate from './index';

describe('LinkCreate', () => {
  it('should find LinkCreate by its testid', async () => {
    const testId = 'link-create';

    const { getByTestId } = render(<LinkCreate testId={testId} />);

    expect(getByTestId(testId)).toBeTruthy();
  });

  it('should have a neutral border color', () => {
    const testId = 'link-create';

    const { getByTestId } = render(<LinkCreate testId={testId} />);

    expect(getByTestId(testId)).toHaveStyleDeclaration(
      'border-color',
      'var(--ds-border, #C1C7D0)',
    );
  });
});
