import cases from 'jest-in-case';

import pad from '../pad';

cases(
  'pad(number)',
  ({ number, output }: { number: number; output: string | number }) => {
    expect(pad(number)).toBe(output);
  },
  [
    { number: 9, output: '09' },
    { number: 10, output: '10' },
    { number: 99, output: '99' },
  ],
);
