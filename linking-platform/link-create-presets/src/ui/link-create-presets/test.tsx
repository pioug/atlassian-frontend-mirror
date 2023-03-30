import React from 'react';

import { render } from '@testing-library/react';

import LinkCreatePresets from './index';

describe('LinkCreatePresets', () => {
  it('should find LinkCreatePresets by its testid', async () => {
    const testId = 'link-create-presets';

    const { getByTestId } = render(<LinkCreatePresets testId={testId} />);

    expect(getByTestId(testId)).toBeTruthy();
  });

  it('should have a neutral border color', () => {
    const testId = 'link-create-presets';

    const { getByTestId } = render(<LinkCreatePresets testId={testId} />);

    expect(getByTestId(testId)).toHaveStyleDeclaration(
      'border-color',
      'var(--ds-border, #C1C7D0)',
    );
  });
});
