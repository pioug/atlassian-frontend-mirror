import React from 'react';
import { render } from '@testing-library/react';

import Spinner from '../..';

describe('Spinner should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-spinner';
    const { getByTestId } = render(<Spinner testId={testId} />);
    expect(getByTestId(testId)).toBeTruthy();
  });
});
