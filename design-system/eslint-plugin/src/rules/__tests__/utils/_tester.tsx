/* eslint-disable @repo/internal/fs/filename-pattern-match */
/* eslint-disable no-undef */
import { RuleTester } from 'eslint';

import __noop from '@atlaskit/ds-lib/noop';

(RuleTester as any).describe = (text: string, method: Function) => {
  const origHasAssertions = expect.hasAssertions;
  describe(text, () => {
    beforeAll(() => {
      // Stub out expect.hasAssertions beforeEach from jest-presetup.js
      expect.hasAssertions = __noop;
    });
    afterAll(() => {
      expect.hasAssertions = origHasAssertions;
    });

    method();
  });
};

export const tester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});
