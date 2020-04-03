import cases from 'jest-in-case';

import { dateToString } from '../..';
import { DateObj } from '../../../types';

interface Case {
  src: DateObj;
  dst: string;
}

cases(
  'dateToString(date)',
  ({ src, dst }: Case) => {
    expect(dateToString(src)).toBe(dst);
  },
  [
    { src: { year: 2017, month: 1, day: 1 }, dst: '2017-01-01' },
    { src: { year: 2017, month: 13, day: 32 }, dst: '2017-13-32' },
  ],
);

cases(
  'dateToString(date, { fixMonth: true })',
  ({ src, dst }: Case) => {
    expect(dateToString(src, { fixMonth: true })).toBe(dst);
  },
  [
    { src: { year: 2017, month: 1, day: 1 }, dst: '2017-02-01' },
    { src: { year: 2017, month: 13, day: 32 }, dst: '2017-14-32' },
  ],
);
