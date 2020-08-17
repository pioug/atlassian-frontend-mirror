import React from 'react';

import { render } from '@testing-library/react';

import Tag from '../../index';

describe('Tag should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'test-id';
    const { getByTestId } = render(<Tag text="hello world" testId={testId} />);
    expect(getByTestId(testId)).toBeTruthy();
  });
});
