import React from 'react';

import { render } from '@testing-library/react';

import Button from '../../index';

it('should render content in order: iconBefore, children, iconAfter', () => {
  const { getByTestId } = render(
    <Button testId="button" iconBefore="before" iconAfter="after">
      children
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');

  expect(button.innerText).toBe('beforechildrenafter');
});
