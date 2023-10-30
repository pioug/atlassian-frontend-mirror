import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '../../../new-button/variants/default/button';

it('should render content in order: iconBefore, children, iconAfter', () => {
  render(
    <Button testId="button" iconBefore="before" iconAfter="after">
      children
    </Button>,
  );
  const button = screen.getByTestId('button');

  expect(button.innerText).toBe('beforechildrenafter');
});
