import React from 'react';

import { render } from '@testing-library/react';

import Format from '../format';

describe('Format format component', () => {
  it('should render 0 by default', () => {
    const { getByText } = render(<Format />);
    expect(getByText('0')).toBeInTheDocument();
  });

  it.each([0, 100, 12.34])(
    'should render positive numeric children (value=%p)',
    (value) => {
      const { getByText } = render(<Format max={value}>{value}</Format>);
      expect(getByText(value.toString())).toBeInTheDocument();
    },
  );

  it.each([-1, -100, -Infinity])(
    'should clamp negative numeric children (value=%p)',
    (value) => {
      const { getByText } = render(<Format>{value}</Format>);
      expect(getByText('0')).toBeInTheDocument();
    },
  );

  it.each([
    ['-100', '0'],
    ['0', '0'],
    ['abc', 'abc'],
    ['+100,000.333', '+100,000.333'],
    ['100000.333', '100000.333'],
  ])(
    'should interpret children as numbers where possible (value=%p)',
    (value, expected) => {
      const { getByText } = render(<Format>{value}</Format>);
      expect(getByText(expected)).toBeInTheDocument();
    },
  );

  it('should not have a max by default', () => {
    const { getByText } = render(<Format>{Infinity}</Format>);
    expect(getByText('∞')).toBeInTheDocument();
  });

  it.each([
    [10, 100, '10'],
    [1000, 100, '100+'],
  ])(
    'should respect positive values of max (value=%p, max=%p, expected=%p)',
    (value, max, expected) => {
      const { getByText } = render(<Format max={max}>{value}</Format>);
      expect(getByText(expected)).toBeInTheDocument();
    },
  );

  it.each([
    [0, -1, '0'],
    [10, -10, '10'],
    [-20, -10, '0'],
    [100, 0, '100'],
    [Infinity, -100, '∞'],
  ])(
    'should ignore non-positive values for max (value=%p, max=%p, expected=%p)',
    (value, max, expected) => {
      const { getByText } = render(<Format max={max}>{value}</Format>);
      expect(getByText(expected)).toBeInTheDocument();
    },
  );

  it.each([0, -100, -Infinity])(
    'should clamp negative numeric values (value=%p, expected="0")',
    (value) => {
      const { getByText } = render(<Format>{value}</Format>);
      expect(getByText('0')).toBeInTheDocument();
    },
  );

  it.each([
    [Infinity, -100, '∞'],
    [1000, Infinity, '1000'],
    [Infinity, 100, '100+'],
    [Infinity, Infinity, '∞'],
  ])(
    'should handle Infinity (value=%p, max=%p, expected=%p)',
    (value, max, expected) => {
      const { getByText } = render(<Format max={max}>{value}</Format>);
      expect(getByText(expected)).toBeInTheDocument();
    },
  );
});
