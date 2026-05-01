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

export const tester: RuleTester = new RuleTester({
	parser: require.resolve('@babel/eslint-parser'),
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
	},
});
