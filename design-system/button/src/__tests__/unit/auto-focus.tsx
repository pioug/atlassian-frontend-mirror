import React from 'react';

import { render } from '@testing-library/react';

import Button from '../../index';

it('should not focus on the element if autoFocus is not set', () => {
  const { getByTestId } = render(<Button testId="button">Hello</Button>);
  const button: HTMLElement = getByTestId('button');
  expect(button).not.toBe(document.activeElement);
});

it('should focus on the element if autoFocus is set', () => {
  const { getByTestId } = render(
    <Button testId="button" autoFocus>
      Hello
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');
  expect(button).toBe(document.activeElement);
});

it('should only set auto focus based on initial render', () => {
  const { getByTestId, rerender } = render(
    <Button testId="button">Hello</Button>,
  );
  const button: HTMLElement = getByTestId('button');
  expect(button).not.toBe(document.activeElement);

  // setting autoFocus to true after an initial render
  rerender(
    <Button testId="button" autoFocus>
      Hello
    </Button>,
  );
  expect(button).not.toBe(document.activeElement);
});
