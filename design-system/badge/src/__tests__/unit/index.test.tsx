import React from 'react';

import { render } from '@testing-library/react';

import Badge from '../../index';

describe('badge component', () => {
  const testId = 'test';

  it('should render 0 by default', () => {
    const { getByText } = render(<Badge />);
    expect(getByText('0')).toBeInTheDocument();
  });

  it.each([0, 100, 12.34])(
    'should render positive numeric children (value=%p)',
    (value) => {
      const { getByText } = render(<Badge max={value}>{value}</Badge>);
      expect(getByText(value.toString())).toBeInTheDocument();
    },
  );

  it.each([-1, -100, -Infinity])(
    'should clamp negative numeric children (value=%p)',
    (value) => {
      const { getByText } = render(<Badge>{value}</Badge>);
      expect(getByText('0')).toBeInTheDocument();
    },
  );

  it.each(['-100', '0', '100', 'abc', '+100,000.333'])(
    'should render string children exactly (value=%p)',
    (value) => {
      const { getByText } = render(<Badge>{value}</Badge>);
      expect(getByText(value)).toBeInTheDocument();
    },
  );

  it('should have max=99 by default', () => {
    const { getByText } = render(<Badge>{100}</Badge>);
    expect(getByText('99+')).toBeInTheDocument();
  });

  it.each([
    [10, 100, '10'],
    [1000, 100, '100+'],
  ])(
    'should respect positive values of max (value=%p, max=%p, expected=%p)',
    (value, max, expected) => {
      const { getByText } = render(<Badge max={max}>{value}</Badge>);
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
      const { getByText } = render(<Badge max={max}>{value}</Badge>);
      expect(getByText(expected)).toBeInTheDocument();
    },
  );

  it.each([0, -100, -Infinity])(
    'should clamp negative numeric values (value=%p, expected="0")',
    (value) => {
      const { getByText } = render(<Badge>{value}</Badge>);
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
      const { getByText } = render(<Badge max={max}>{value}</Badge>);
      expect(getByText(expected)).toBeInTheDocument();
    },
  );

  it('should render with a given test id', () => {
    const { getByTestId } = render(<Badge testId={testId} />);
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
