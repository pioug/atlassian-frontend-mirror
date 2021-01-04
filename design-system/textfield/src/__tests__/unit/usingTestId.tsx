import React from 'react';

import { render } from '@testing-library/react';

import Textfield from '../../index';

describe('Textfield should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-textfield';
    const { getByTestId } = render(
      <Textfield placeholder="hello" testId={testId} />,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });
});
