import React from 'react';

import { render } from '@testing-library/react';

import Button from '../../index';

it('should render a anchor if there is a href', () => {
  const { getByTestId } = render(
    <Button testId="button" href="http://google.com">
      Hello
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');
  expect(button.tagName.toLowerCase()).toBe('a');
});

it('should render a custom tag if provided', () => {
  const { getByTestId } = render(
    <Button testId="button" href="http://google.com" component="span">
      Hello
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');
  expect(button.tagName.toLowerCase()).toBe('span');
});
