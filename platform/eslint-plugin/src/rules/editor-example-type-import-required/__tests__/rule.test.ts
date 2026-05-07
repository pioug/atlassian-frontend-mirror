import { RuleTester } from 'eslint';
import rule from '../index';

const tester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
	},
} as any);

(RuleTester as any).describe = (text: string, method: Function) => {
	const origHasAssertions = expect.hasAssertions;
	describe(text, () => {
		beforeAll(() => {
			(expect as any).hasAssertions = () => {};
		});
		afterAll(() => {
			(expect as any).hasAssertions = origHasAssertions;
		});
		method();
	});
};

tester.run('editor-example-type-import-required', rule, {
	valid: [
		// Non-spec file — rule doesn't apply
		{
			code: `
				import { editorTestCase as test } from '@af/editor-libra';
				test.use({ editorProps: {} });
			`,
			filename: '/workspace/packages/editor/editor-core/src/utils.ts',
		},
		// Excluded file — rule doesn't apply even though it's a spec file
		{
			code: `
				import { test } from '@playwright/test';
				test.use({ editorProps: {} });
			`,
			filename:
				'/workspace/packages/navigation/atlassian-switcher/src/__tests__/playwright/navigate-link-item.spec.ts',
		},
		// Valid: exampleName present anywhere in the file (with typeof import assertion)
		{
			code: `
				import { editorTestCase as test } from '@af/editor-libra';
				test.use({
					exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,
					editorProps: {},
				});
			`,
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
		},
		// Valid: exampleName present in one test.use(), other test.use() calls don't need it
		{
			code: `
				import { editorTestCase as test } from '@af/editor-libra';
				test.use({
					exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,
					editorProps: {},
				});
				test.describe('suite', () => {
					test.use({ editorProps: { appearance: 'full-page' } });
				});
			`,
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
		},
		// Valid: exampleName present only in a nested test.use(), passes file-level check
		{
			code: `
				import { editorTestCase as test } from '@af/editor-libra';
				test.describe('suite', () => {
					test.use({
						exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,
						editorProps: {},
					});
				});
			`,
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
		},
		// not-libra: valid — exampleName present with typeof import assertion
		{
			code: `
				import { rendererTestCase as test } from './not-libra';
				test.use({
					exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,
				});
			`,
			filename: '/workspace/packages/editor/renderer/src/__tests__/playwright/test.spec.ts',
		},
		// Valid: inline visitExample<typeof import(...)>(...) call — file-level typeof
		// import check satisfies the rule even though no test.use({ exampleName }) exists.
		{
			code: `
				import { test } from '@playwright/test';
				test('renders', async ({ page }) => {
					await page.visitExample<typeof import('../../../examples/01-basic.tsx')>(
						'group',
						'pkg',
						'basic',
					);
				});
			`,
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
		},
		// Valid: typeof import(...) anywhere in the file (e.g. a typed helper variable)
		// also satisfies the rule.
		{
			code: `
				import { test } from '@playwright/test';
				type ExampleModule = typeof import('../../../examples/01-basic.tsx');
				const exampleModule: ExampleModule | undefined = undefined;
				test('renders', async () => {
					expect(exampleModule).toBeUndefined();
				});
			`,
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
		},
	],
	invalid: [
		// Any spec file (regardless of imports) — rule now applies to all playwright specs
		{
			code: [
				`import { test } from '@playwright/test';`,
				`test.use({`,
				`\teditorProps: {},`,
				`});`,
			].join('\n'),
			output: [
				`import { test } from '@playwright/test';`,
				`test.use({`,
				`\texampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,`,
				`\teditorProps: {},`,
				`});`,
			].join('\n'),
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
			errors: [{ messageId: 'missingExampleName' }],
		},
		// exampleName present but missing typeof import assertion — invalid, autofix adds assertion
		{
			code: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\texampleName: 'testing',`,
				`\teditorProps: {},`,
				`});`,
			].join('\n'),
			output: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\texampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,`,
				`\teditorProps: {},`,
				`});`,
			].join('\n'),
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
			errors: [{ messageId: 'missingExampleName' }],
		},
		// Missing exampleName in any test.use() across entire file — autofix adds it to the first test.use()
		{
			code: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\teditorProps: {},`,
				`});`,
			].join('\n'),
			output: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\texampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,`,
				`\teditorProps: {},`,
				`});`,
			].join('\n'),
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
			errors: [{ messageId: 'missingExampleName' }],
		},
		// Multiple test.use() calls, none with exampleName — autofix adds it to the first one only
		{
			code: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\teditorProps: {},`,
				`});`,
				`test.describe('suite', () => {`,
				`\ttest.use({ editorProps: { appearance: 'full-page' } });`,
				`});`,
			].join('\n'),
			output: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\texampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,`,
				`\teditorProps: {},`,
				`});`,
				`test.describe('suite', () => {`,
				`\ttest.use({ editorProps: { appearance: 'full-page' } });`,
				`});`,
			].join('\n'),
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
			errors: [{ messageId: 'missingExampleName' }],
		},
		// No test.use() args at all — autofix inserts exampleName into empty object of first call
		{
			code: [`import { editorTestCase as test } from '@af/editor-libra';`, `test.use({});`].join(
				'\n',
			),
			output: [
				`import { editorTestCase as test } from '@af/editor-libra';`,
				`test.use({`,
				`\texampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx'),`,
				`});`,
			].join('\n'),
			filename: '/workspace/packages/editor/editor-core/src/__tests__/playwright/test.spec.ts',
			errors: [{ messageId: 'missingExampleName' }],
		},
		// not-libra: missing exampleName — rule applies and autofix adds it
		{
			code: [
				`import { rendererTestCase as test } from './not-libra';`,
				`test.use({`,
				`\tadf: undefined,`,
				`});`,
			].join('\n'),
			output: [
				`import { rendererTestCase as test } from './not-libra';`,
				`test.use({`,
				`\texampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ,`,
				`\tadf: undefined,`,
				`});`,
			].join('\n'),
			filename: '/workspace/packages/editor/renderer/src/__tests__/playwright/test.spec.ts',
			errors: [{ messageId: 'missingExampleName' }],
		},
	],
});
