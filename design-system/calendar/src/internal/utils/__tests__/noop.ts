import cases from 'jest-in-case';

import noop from '../noop';

cases(
  'noop()',
  ({ output }: { output: void }) => {
    expect(noop()).toBe(output);
  },
  [{ output: undefined }],
);
