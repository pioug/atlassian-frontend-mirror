import React from 'react';

import { render } from '@testing-library/react';

import Button from '../../button';

it('should support test id', async () => {
  const { getByTestId } = render(
    <Button testId="iamTheDataTestId">Button</Button>,
  );

  expect(getByTestId('iamTheDataTestId')).toBeTruthy();
});
