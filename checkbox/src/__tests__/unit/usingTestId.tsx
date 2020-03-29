import { render } from '@testing-library/react';
import React from 'react';

import Checkbox from '../../Checkbox';

describe('Checkbox should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-checkbox';
    const labelTestId = `${testId}--checkbox-label`;
    const checkboxTestId = `${testId}--hidden-checkbox`;

    const { getByTestId } = render(
      <Checkbox
        value="Basic checkbox"
        label="Basic checkbox"
        name="checkbox-basic"
        testId={testId}
      />,
    );

    const checkbox = getByTestId(checkboxTestId) as HTMLInputElement;
    const label = getByTestId(labelTestId);
    expect(checkbox.checked).toBeFalsy();
    label.click();
    expect(checkbox.checked).toBeTruthy();
  });
});
