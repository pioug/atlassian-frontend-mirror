import { render } from '@testing-library/react';
import React from 'react';

import Button from '../../Button';

describe('Button should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const { getByTestId } = render(
      <Button testId="iamTheDataTestId">Button</Button>,
    );

    expect(getByTestId('iamTheDataTestId')).toBeTruthy();
  });

  test('Using container snapshot', () => {
    const { container } = render(
      <Button testId="iamTheDataTestId">Button</Button>,
    );
    expect(container).toMatchSnapshot();
  });
});
