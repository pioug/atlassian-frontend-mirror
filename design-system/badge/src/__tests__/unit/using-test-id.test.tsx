import React from 'react';

import { render } from '@testing-library/react';

import Badge from '../../index';

describe('Badge should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-badge';
    const { getByTestId } = render(
      <Badge appearance="added" max={99} testId={testId}>
        3000
      </Badge>,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });
});
