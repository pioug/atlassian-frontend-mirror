import React from 'react';

import { render } from '@testing-library/react';

import { DateDiv, DateProps } from '../../Date';

const setup = (dateDivProps: DateProps = {}) =>
  render(<DateDiv {...dateDivProps} />);

test('cursor should be "default"', () => {
  const { container } = setup();

  expect(container.firstChild).toHaveStyle('cursor: pointer');
});

test('disabled - cursor should be "not-allowed"', () => {
  const { container } = setup({ disabled: true });

  expect(container.firstChild).toHaveStyle('cursor: not-allowed');
});
