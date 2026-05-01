import { TSESLint } from '@typescript-eslint/utils';
import { RuleTester } from 'eslint';

import noop from '@atlaskit/ds-lib/noop';

(RuleTester as any).describe = (text: string, method: Function) => {
	const origHasAssertions = expect.hasAssertions;
	describe(text, () => {
		beforeAll(() => {
			// Stub out expect.hasAssertions beforeEach from jest-presetup.js
			expect.hasAssertions = noop;
		});
		afterAll(() => {
			expect.hasAssertions = origHasAssertions;
		});

		method();
	});
};

export const typescriptEslintTester: TSESLint.RuleTester = new TSESLint.RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
});
