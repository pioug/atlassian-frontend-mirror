import { RuleTester } from 'eslint';
import rule, { RULE_NAME } from '../index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

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

// ── candidateRe tests (Phase 4) ───────────────────────────────────────────────
// RuleTester.run() calls describe()/it() at registration time — jest-circus
// forbids describe() inside an it() body, so all tester.run() calls MUST live
// at module scope (not inside it() callbacks).
//
// We install a single beforeAll spy on fs.readdirSync that dispatches on the
// examplesDir argument. Each set of cases uses a distinct package path so the
// spy can return per-case listings deterministically.
//
// Fixtures: package-path → array of filenames in that package's examples/ dir
const CANDIDATRE_FIXTURES = new Map([
	// positive cases — one file per package so candidateRe can match it
	[
		'/workspace/packages/commerce/quote-line-items/examples',
		['00-mocked-sculptor.AiMateCommerceQuoteLineItems.tsx'],
	],
	[
		'/workspace/packages/commerce/quote-line-items-role/examples',
		['00-foo.AiMateCommerceQuoteLineItemsRole.example.tsx'],
	],
	[
		'/workspace/packages/commerce/quote-line-items-stories/examples',
		['Foo.AiMateCommerceQuoteLineItemsStories.stories.tsx'],
	],
	[
		'/workspace/packages/commerce/quote-line-items-dup/examples',
		['00-foo.AiMateCommerceQuoteLineItemsDup.dup2.example.tsx'],
	],
	// negative case — file has 4 dot-segments → does NOT match {0,3} → fixer uses foo.tsx fallback
	['/workspace/packages/commerce/dot-cap/examples', ['foo.A.B.C.D.tsx']],
]);

beforeAll(() => {
	jest
		.spyOn(fs, 'readdirSync')
		.mockImplementation((dir: any) => (CANDIDATRE_FIXTURES.get(String(dir)) ?? []) as any);
});

afterAll(() => {
	jest.restoreAllMocks();
});

// 4 positive shapes — each using its own package path so the spy dispatches correctly
tester.run(`${RULE_NAME} — candidateRe post-rename shapes`, rule, {
	valid: [
		// bare shape: 00-id.AiMateXxx.tsx
		{
			filename:
				'/workspace/packages/commerce/quote-line-items/integration-tests/test.spec.tsx',
			code: `await visitMockedExample<typeof import('../examples/00-mocked-sculptor.AiMateCommerceQuoteLineItems.tsx')>(page, 'commerce', 'quote-line-items', 'mocked-sculptor');`,
		},
		// role shape: 00-id.AiMateXxx.example.tsx
		{
			filename:
				'/workspace/packages/commerce/quote-line-items-role/integration-tests/test.spec.tsx',
			code: `await visitMockedExample<typeof import('../examples/00-foo.AiMateCommerceQuoteLineItemsRole.example.tsx')>(page, 'commerce', 'quote-line-items-role', 'foo');`,
		},
		// stories shape: Id.AiMateXxx.stories.tsx
		{
			filename:
				'/workspace/packages/commerce/quote-line-items-stories/integration-tests/test.spec.tsx',
			code: `await visitMockedExample<typeof import('../examples/Foo.AiMateCommerceQuoteLineItemsStories.stories.tsx')>(page, 'commerce', 'quote-line-items-stories', 'Foo');`,
		},
		// dup2 collision shape: 00-id.AiMateXxx.dup2.example.tsx
		{
			filename:
				'/workspace/packages/commerce/quote-line-items-dup/integration-tests/test.spec.tsx',
			code: `await visitMockedExample<typeof import('../examples/00-foo.AiMateCommerceQuoteLineItemsDup.dup2.example.tsx')>(page, 'commerce', 'quote-line-items-dup', 'foo');`,
		},
	],
	invalid: [
		// >3 dot-segments: foo.A.B.C.D.tsx — 4 ident-segments does NOT match {0,3}
		// candidateRe rejects it → rule falls back to exampleId.tsx → fixer inserts fallback
		{
			filename: '/workspace/packages/commerce/dot-cap/integration-tests/test.spec.tsx',
			code: `await visitMockedExample(page, 'commerce', 'dot-cap', 'foo');`,
			output: `await visitMockedExample<typeof import('../examples/foo.tsx')>(page, 'commerce', 'dot-cap', 'foo');`,
			errors: [{ messageId: 'missingTypeofImport' }],
		},
	],
});

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
