import { render } from '@testing-library/react';
import React from 'react';

import Textfield from '../../Textfield';

describe('Textfield should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-textfield';
    const { getByTestId } = render(<Textfield value="hello" testId={testId} />);

    expect(getByTestId(testId)).toBeTruthy();
  });
});
