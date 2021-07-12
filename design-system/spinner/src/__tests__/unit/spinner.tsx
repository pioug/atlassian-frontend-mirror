import React from 'react';

import { render } from '@testing-library/react';

import { presetSizes } from '../../constants';
import Spinner from '../../index';
import { PresetSize } from '../../types';

it('should render the spinner at a preset size', () => {
  const sizes: PresetSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
  sizes.forEach((size: PresetSize) => {
    const { getByTestId, unmount } = render(
      <Spinner size={size} testId="spinner" />,
    );
    const el: HTMLElement = getByTestId('spinner');

    expect(el.getAttribute('width')).toBe(String(presetSizes[size]));
    expect(el.getAttribute('height')).toBe(String(presetSizes[size]));
    expect(getByTestId('spinner-wrapper')).toHaveStyle(`height: ${size}px;`);
    expect(getByTestId('spinner-wrapper')).toHaveStyle(`width: ${size}px;`);
    unmount();
  });
});

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
