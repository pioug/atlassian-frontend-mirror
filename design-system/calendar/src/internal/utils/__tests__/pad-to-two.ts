import cases from 'jest-in-case';

import padToTwo from '../pad-to-two';

cases(
  'padToTwo(number)',
  ({ number, output }: { number: number; output: string }) => {
    expect(padToTwo(number)).toBe(output);
  },
  [
    { number: 9, output: '09' },
    { number: 12, output: '12' },
    { number: 99, output: '99' },
    { number: 100, output: '100' },
    { number: 1001, output: '1001' },
  ],
);
