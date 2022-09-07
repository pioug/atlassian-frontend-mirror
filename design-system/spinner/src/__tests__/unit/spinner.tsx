import React from 'react';

import { render } from '@testing-library/react';

import Spinner from '../../index';

it('should render the spinner at a custom size', () => {
  const { getByTestId } = render(<Spinner size={4000} testId="spinner" />);
  const el: HTMLElement = getByTestId('spinner');

  expect(el.getAttribute('width')).toBe('4000');
  expect(el.getAttribute('height')).toBe('4000');
  expect(getByTestId('spinner-wrapper')).toHaveStyle('height: 4000px;');
  expect(getByTestId('spinner-wrapper')).toHaveStyle('width: 4000px;');
});

it('should forward the ref to the underlying svg', () => {
  const ref = React.createRef<SVGSVGElement>();

  const { container } = render(<Spinner ref={ref} />);

  expect(container.querySelector('svg')).toBe(ref.current);
});
