import { RuleTester } from 'eslint';
import { outdent } from 'outdent';

import rule from '../index';

const tester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
	},
} as any);

(RuleTester as any).describe = (text: string, method: () => void) => {
	const origHasAssertions = expect.hasAssertions;
	describe(text, () => {
		beforeAll(() => {
			(expect as any).hasAssertions = () => {};
		});
		afterAll(() => {
			expect.hasAssertions = origHasAssertions;
		});

		method();
	});
};

tester.run('no-double-type-assertions', rule, {
	valid: [
		{
			name: 'single type assertion is allowed',
			code: outdent`
				const value = input as string;
			`,
		},
		{
			name: 'double assertion through unknown is allowed in tests',
			filename: 'platform/packages/ai-mate/example/src/example.test.ts',
			code: outdent`
				const value = input as unknown as string;
			`,
		},
		{
			name: 'double assertion through unknown is allowed in mocks',
			filename: 'platform/packages/ai-mate/example/src/mocks.ts',
			code: outdent`
				const value = input as unknown as string;
			`,
		},
		{
			name: 'double assertion through unknown is allowed in mock files',
			filename: 'platform/packages/ai-mate/example/src/api.mock.ts',
			code: outdent`
				const value = input as unknown as string;
			`,
		},
	],
	invalid: [
		{
			name: 'double assertion through unknown is reported',
			code: outdent`
				const value = input as unknown as string;
			`,
			errors: [{ messageId: 'noDoubleUnknownAssertion' }],
		},
		{
			name: 'double assertion through any is reported',
			code: outdent`
				const value = input as any as string;
			`,
			errors: [{ messageId: 'noDoubleAnyAssertion' }],
		},
		{
			name: 'angle-bracket double assertion through unknown is reported',
			filename: 'platform/packages/ai-mate/example/src/example.ts',
			code: outdent`
				const value = <string>(<unknown>input);
			`,
			errors: [{ messageId: 'noDoubleUnknownAssertion' }],
		},
		{
			name: 'mixed assertion with angle-bracket inner assertion is reported',
			filename: 'platform/packages/ai-mate/example/src/example.ts',
			code: outdent`
				const value = (<unknown>input) as string;
			`,
			errors: [{ messageId: 'noDoubleUnknownAssertion' }],
		},
		{
			name: 'mixed assertion with angle-bracket outer assertion is reported',
			filename: 'platform/packages/ai-mate/example/src/example.ts',
			code: outdent`
				const value = <string>(input as unknown);
			`,
			errors: [{ messageId: 'noDoubleUnknownAssertion' }],
		},
		{
			name: 'triple assertion reports each double assertion',
			filename: 'platform/packages/ai-mate/example/src/example.ts',
			code: outdent`
				const value = input as unknown as unknown as string;
			`,
			errors: [
				{ messageId: 'noDoubleUnknownAssertion' },
				{ messageId: 'noDoubleUnknownAssertion' },
			],
		},
		{
			name: 'angle-bracket double assertion through any is reported',
			filename: 'platform/packages/ai-mate/example/src/example.ts',
			code: outdent`
				const value = <string>(<any>input);
			`,
			errors: [{ messageId: 'noDoubleAnyAssertion' }],
		},
	],
});
