import React from 'react';

import { render } from '@testing-library/react';

import TextArea from '../../text-area';

describe('Textarea should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-textarea';
    const { getByTestId } = render(<TextArea value="hello" testId={testId} />);

    expect(getByTestId(testId)).toBeTruthy();
  });
});
