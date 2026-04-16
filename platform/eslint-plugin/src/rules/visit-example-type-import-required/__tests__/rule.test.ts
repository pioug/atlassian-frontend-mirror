import { RuleTester } from 'eslint';
import rule from '../index';

// Create a TypeScript-aware RuleTester
// (The shared tester uses Babel, but we need TypeScript parser for generics)
const tester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
	},
} as any);

// Patch RuleTester.describe for Jest compatibility (same approach as _tester.tsx)
(RuleTester as any).describe = (text: string, method: Function) => {
	const origHasAssertions = expect.hasAssertions;
	describe(text, () => {
		beforeAll(() => {
			// Stub out expect.hasAssertions beforeEach from jest-presetup.js
			(expect as any).hasAssertions = () => {};
		});
		afterAll(() => {
			(expect as any).hasAssertions = origHasAssertions;
		});

		method();
	});
};

tester.run('visit-example-type-import-required', rule, {
	valid: [
		{
			code: `await page.visitExample<typeof import('../examples/basic.tsx')>('commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
		},
		{
			code: `await this.page.visitExample<typeof import('../examples/load-time-area.tsx')>('apm', 'appmon-charts', 'load-time-area');`,
			filename: '/workspace/packages/apm/appmon-charts/integration-tests/test.spec.tsx',
		},
		{
			code: `await page.visitExample('commerce', 'quote-line-items', 'basic');`,
			filename: 'regular-file.ts',
		},
		{
			code: `await page.visitStorybook('some/path', 'StoryName');`,
			filename: '/workspace/test.spec.tsx',
		},
		{
			code: `
			test('example', () => {
				type ExamplesFile = typeof import('../examples/basic.tsx');
				await page.visitExample<ExamplesFile>('commerce', 'quote-line-items', 'basic');
			});
			`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
		},
		{
			code: `await page.visitExample<typeof import('../examples/testing-ddm-default.tsx')>('design-system', 'dropdown-menu', 'testing-ddm-default', { feature_flag: 'test' });`,
			filename: '/workspace/packages/design-system/dropdown-menu/integration-tests/test.spec.tsx',
		},
		{
			code: `await page.visitExample('commerce', 'quote-line-items', 'basic');`,
			filename: 'src/utils.ts',
		},
		{
			code: `await visitMockedExample<typeof import('../examples/basic.tsx')>(page, 'commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
		},
	],
	invalid: [
		{
			code: `await page.visitExample('commerce', 'quote-line-items', 'basic');`,
			output: `await page.visitExample<typeof import('../examples/basic.tsx')>('commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'missingTypeofImport' }],
		},
		{
			code: `
			type ExamplesType = typeof import('../examples/basic.tsx');
			await page.visitExample<ExamplesType>('commerce', 'quote-line-items', 'basic');
			`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'typeAliasNotInlined' }],
		},
		{
			code: `
			await page.visitExample<typeof import('@atlaskit/some-package/examples/basic.tsx')>('commerce', 'quote-line-items', 'basic');
			`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'noPackageImports' }],
		},
		{
			code: `await this.page.visitExample('apm', 'appmon-charts', 'load-time-area');`,
			output: `await this.page.visitExample<typeof import('../examples/load-time-area.tsx')>('apm', 'appmon-charts', 'load-time-area');`,
			filename: '/workspace/packages/apm/appmon-charts/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'missingTypeofImport' }],
		},
		{
			code: `await page.visitExample<typeof import('../examples/wrong-file.tsx')>('commerce', 'quote-line-items', 'basic');`,
			output: `await page.visitExample<typeof import('../examples/basic.tsx')>('commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'pathMismatch' }],
		},
		{
			code: `await page.visitExample<SomeRandomType>('commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'missingTypeofImport' }],
		},
		// visitMockedExample — valid calls should not trigger errors (covered in valid block)
		// visitMockedExample — missing generic
		{
			code: `await visitMockedExample(page, 'commerce', 'quote-line-items', 'basic');`,
			output: `await visitMockedExample<typeof import('../examples/basic.tsx')>(page, 'commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'missingTypeofImport' }],
		},
		// visitMockedExample — path mismatch
		{
			code: `await visitMockedExample<typeof import('../examples/wrong-file.tsx')>(page, 'commerce', 'quote-line-items', 'basic');`,
			output: `await visitMockedExample<typeof import('../examples/basic.tsx')>(page, 'commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'pathMismatch' }],
		},
		// visitMockedExample — package imports
		{
			code: `await visitMockedExample<typeof import('@atlaskit/some-package/examples/basic.tsx')>(page, 'commerce', 'quote-line-items', 'basic');`,
			filename: '/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			errors: [{ messageId: 'noPackageImports' }],
		},
	],
});
