import cases from 'jest-in-case';

import getDaysInMonth from '../get-days-in-month';

cases(
  'getDaysInMonth(year, month)',
  ({
    year,
    month,
    output,
  }: {
    year: number;
    month: number;
    output: number;
  }) => {
    expect(getDaysInMonth(year, month)).toBe(output);
  },
  [
    {
      year: 2017,
      month: 1,
      output: 28,
    },
    {
      year: 2017,
      month: 0,
      output: 31,
    },
    {
      year: 2017,
      month: 12,
      output: 31,
    },
    {
      year: 2017,
      month: 3,
      output: 30,
    },
    {
      year: 2017,
      month: 13,
      output: 28,
    },
    {
      year: 2020,
      month: 13,
      output: 28,
    },
    {
      year: 2020,
      month: 1,
      output: 29,
    },
  ],
);
