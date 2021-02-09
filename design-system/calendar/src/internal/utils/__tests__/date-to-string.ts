import cases from 'jest-in-case';

import type { DateObj } from '../../types';
import dateToString from '../date-to-string';

cases(
  'dateToString(date, { fixMonth })',
  ({
    date,
    fixMonth,
    output,
  }: {
    date: DateObj;
    fixMonth: boolean;
    output: string;
  }) => {
    expect(dateToString(date, { fixMonth })).toBe(output);
  },
  [
    {
      date: { year: 2017, month: 1, day: 1 },
      output: '2017-01-01',
      fixMonth: false,
    },
    {
      date: { year: 2017, month: 13, day: 32 },
      output: '2017-13-32',
      fixMonth: false,
    },
    {
      date: { year: 2017, month: 1, day: 1 },
      output: '2017-02-01',
      fixMonth: true,
    },
    {
      date: { year: 2017, month: 13, day: 32 },
      output: '2017-14-32',
      fixMonth: true,
    },
  ],
);
