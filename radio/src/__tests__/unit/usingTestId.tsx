import { render } from '@testing-library/react';
import React from 'react';

import RadioGroup from '../../RadioGroup';
import { OptionsPropType } from '../../types';

describe('Radio should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const options: OptionsPropType = [
      { name: 'color', value: 'red', label: 'Red', testId: 'red' },
      { name: 'color', value: 'blue', label: 'Blue', testId: 'blue' },
    ];

    const { getByTestId } = render(<RadioGroup options={options} />);

    options.forEach(({ testId }) => {
      const radio = getByTestId(
        (testId as string) + '--hidden-radio',
      ) as HTMLInputElement;
      const label = getByTestId((testId as string) + '--radio-label');
      expect(radio.checked).toBeFalsy();
      label.click();
      expect(radio.checked).toBeTruthy();
    });
  });
});
