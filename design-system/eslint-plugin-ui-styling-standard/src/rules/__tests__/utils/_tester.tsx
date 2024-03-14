/* eslint-disable @repo/internal/fs/filename-pattern-match */
/* eslint-disable no-undef */
import { ESLintUtils } from '@typescript-eslint/utils';
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

export const typescriptEslintTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

export const tester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});
