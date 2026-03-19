import outdent from 'outdent';

// @ts-expect-error - ruleTester is untyped but comes from @atlassian/eslint-utils
import { ruleTester as atlaskitRuleTester } from '@atlassian/eslint-utils';

import type { FileSystem } from '../../shared/types';
import { createRule } from '../index';

/**
 * Creates a mock FileSystem for testing barrel file resolution.
 */
function createMockFs(files: Record<string, string>): FileSystem {
	const directories = new Set<string>();
	for (const filePath of Object.keys(files)) {
		let dir = filePath;
		while (dir !== '/') {
			dir = dir.substring(0, dir.lastIndexOf('/')) || '/';
			directories.add(dir);
		}
	}

	return {
		existsSync: (p: string) => files[p] !== undefined || directories.has(p),
		readFileSync: (p: string) => {
			if (files[p] !== undefined) {
				return files[p];
			}
			throw new Error(`ENOENT: ${p}`);
		},
		realpathSync: (p: string) => p,
		statSync: (p: string) => ({
			isFile: () => files[p] !== undefined,
			isDirectory: () => directories.has(p),
			mtimeMs: 0,
		}),
		execSync: (_cmd: string, _opts?: { cwd?: string }) => {
			return '/workspace';
		},
		readdirSync: (p: string, _opts: { withFileTypes: true }) => {
			const prefix = p.endsWith('/') ? p : p + '/';
			const entries: string[] = [];
			for (const filePath of Object.keys(files)) {
				if (filePath.startsWith(prefix)) {
					const rest = filePath.slice(prefix.length);
					const firstPart = rest.split('/')[0];
					if (firstPart && !entries.includes(firstPart)) {
						entries.push(firstPart);
					}
				}
			}
			const dirArray = Array.from(directories);
			for (const dir of dirArray) {
				if (dir.startsWith(prefix) && dir !== p) {
					const rest = dir.slice(prefix.length);
					const firstPart = rest.split('/')[0];
					if (firstPart && !entries.includes(firstPart)) {
						entries.push(firstPart);
					}
				}
			}
			return entries.map((name) => ({
				name,
				isFile: () => files[prefix + name] !== undefined,
				isDirectory: () => directories.has(prefix + name),
			}));
		},
		cache: {},
	};
}

/**
 * Tagged template literal for output with tabs.
 */
function tabindent(strings: TemplateStringsArray, ...values: unknown[]): string {
	const result = outdent(strings, ...values);
	return result
		.split('\n')
		.map((line) => {
			const match = line.match(/^( +)/);
			if (match) {
				const spaces = match[1].length;
				const tabs = Math.floor(spaces / 2);
				return '\t'.repeat(tabs) + line.slice(spaces);
			}
			return line;
		})
		.join('\n');
}

/**
 * Helper to run the rule with a custom file system using the atlaskit RuleTester.
 * The atlaskitRuleTester handles Jest integration properly.
 */
function runWithFs(
	name: string,
	fs: FileSystem,
	tests: { valid: unknown[]; invalid: unknown[] },
): void {
	const rule = createRule(fs);
	atlaskitRuleTester.run(name, rule, tests);
}

// Use unique paths for each test to avoid cache collisions
// All paths must be under ai-mate because that's where the rule is scoped
const W = '/workspace';
const BASE = `${W}/platform/packages/ai-mate`;

describe('no-relative-barrel-file-imports', () => {
	describe('valid cases', () => {
		const PKG = `${BASE}/pkg-valid`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export { helper } from './helper';`,
			[`${PKG}/src/utils/helper.ts`]: `export const helper = () => 'A';`,
			[CONSUMER]: '',
		});

		runWithFs('valid', fs, {
			valid: [
				// Non-relative imports are ignored
				{ code: `import { x } from '@atlassian/pkg';`, filename: CONSUMER },
				// Direct import to non-barrel file
				{ code: `import { helper } from './utils/helper';`, filename: CONSUMER },
			],
			invalid: [],
		});
	});

	describe('index.ts with direct exports (not a barrel)', () => {
		const PKG = `${BASE}/pkg-direct`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export const helperA = () => 'A';`,
			[CONSUMER]: '',
		});

		runWithFs('direct-exports', fs, {
			valid: [
				// No violation when index.ts defines exports directly
				{ code: `import { helperA } from './utils';`, filename: CONSUMER },
			],
			invalid: [],
		});
	});

	describe('basic barrel import detection', () => {
		const PKG = `${BASE}/pkg-basic`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export { helperA } from './helper-a';`,
			[`${PKG}/src/utils/helper-a.ts`]: `export const helperA = () => 'A';`,
			[CONSUMER]: '',
		});

		runWithFs('basic-detection', fs, {
			valid: [],
			invalid: [
				{
					code: `import { helperA } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `import { helperA } from './utils/helper-a';`,
				},
			],
		});
	});

	describe('multiple imports from different sources', () => {
		const PKG = `${BASE}/pkg-multi`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: outdent`
				export { helperA } from './helper-a';
				export { helperB } from './helper-b';
			`,
			[`${PKG}/src/utils/helper-a.ts`]: `export const helperA = () => 'A';`,
			[`${PKG}/src/utils/helper-b.ts`]: `export const helperB = () => 'B';`,
			[CONSUMER]: '',
		});

		runWithFs('multiple-sources', fs, {
			valid: [],
			invalid: [
				{
					code: `import { helperA, helperB } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: tabindent`
						import { helperA } from './utils/helper-a';
						import { helperB } from './utils/helper-b';
					`,
				},
			],
		});
	});

	describe('type imports', () => {
		const PKG = `${BASE}/pkg-types`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export type { MyType } from './types';`,
			[`${PKG}/src/utils/types.ts`]: `export interface MyType { value: string; }`,
			[CONSUMER]: '',
		});

		runWithFs('type-imports', fs, {
			valid: [],
			invalid: [
				{
					code: `import type { MyType } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `import type { MyType } from './utils/types';`,
				},
			],
		});
	});

	describe('aliased imports', () => {
		const PKG = `${BASE}/pkg-alias`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export { helperA } from './helper-a';`,
			[`${PKG}/src/utils/helper-a.ts`]: `export const helperA = () => 'A';`,
			[CONSUMER]: '',
		});

		runWithFs('aliased-imports', fs, {
			valid: [],
			invalid: [
				{
					code: `import { helperA as myHelper } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `import { helperA as myHelper } from './utils/helper-a';`,
				},
			],
		});
	});

	describe('barrel-side aliased re-exports', () => {
		const PKG = `${BASE}/pkg-barrel-alias`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export { original as aliased } from './source';`,
			[`${PKG}/src/utils/source.ts`]: `export const original = 'value';`,
			[CONSUMER]: '',
		});

		runWithFs('barrel-aliases', fs, {
			valid: [],
			invalid: [
				{
					code: `import { aliased } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `import { original as aliased } from './utils/source';`,
				},
			],
		});
	});

	describe('export declarations', () => {
		const PKG = `${BASE}/pkg-export`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: outdent`
				export { default as ComponentA } from './component-a';
				export { default as ComponentB } from './component-b';
			`,
			[`${PKG}/src/utils/component-a.ts`]: outdent`
				const ComponentA = () => null;
				export default ComponentA;
			`,
			[`${PKG}/src/utils/component-b.ts`]: outdent`
				const ComponentB = () => null;
				export default ComponentB;
			`,
			[CONSUMER]: '',
		});

		runWithFs('export-declarations', fs, {
			valid: [],
			invalid: [
				// Re-exporting a default export should work correctly
				{
					code: `export { ComponentA } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `export { default as ComponentA } from './utils/component-a';`,
				},
				{
					code: `export { ComponentA, ComponentB } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: tabindent`
						export { default as ComponentA } from './utils/component-a';
						export { default as ComponentB } from './utils/component-b';
					`,
				},
			],
		});
	});

	describe('namespace imports - warn but no fix', () => {
		const PKG = `${BASE}/pkg-namespace`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export { helperA } from './helper-a';`,
			[`${PKG}/src/utils/helper-a.ts`]: `export const helperA = () => 'A';`,
			[CONSUMER]: '',
		});

		runWithFs('namespace-imports', fs, {
			valid: [],
			invalid: [
				{
					code: `import * as utils from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					// No output - namespace imports cannot be auto-fixed
				},
			],
		});
	});

	describe('cross-package barrel resolution', () => {
		// This test uses packages in different folders (not just ai-mate) to validate
		// that package resolution works across all of platform/packages/
		const fs = createMockFs({
			'/workspace/.git/config': '',
			// Package A in editor folder - the consumer package
			'/workspace/platform/packages/editor/package-a/package.json': JSON.stringify({
				name: '@atlassian/package-a',
				exports: { './utils': './src/utils/index.ts' },
			}),
			'/workspace/platform/packages/editor/package-a/src/consumer.ts': '',
			'/workspace/platform/packages/editor/package-a/src/local-barrel/index.ts': outdent`
				export { myHelper } from '@atlassian/package-b/helpers';
			`,
			// Package B in linking-platform folder - intermediate re-exporter
			'/workspace/platform/packages/linking-platform/package-b/package.json': JSON.stringify({
				name: '@atlassian/package-b',
				exports: { './helpers': './src/helpers/index.ts' },
			}),
			'/workspace/platform/packages/linking-platform/package-b/src/helpers/index.ts': outdent`
				export { myHelper } from '@atlaskit/design-tokens/core';
			`,
			// Package C in design-system folder - the source package
			'/workspace/platform/packages/design-system/design-tokens/package.json': JSON.stringify({
				name: '@atlaskit/design-tokens',
				exports: { './core': './src/core/index.ts' },
			}),
			'/workspace/platform/packages/design-system/design-tokens/src/core/index.ts': outdent`
				export function myHelper() { return 'hello'; }
			`,
		});

		runWithFs('cross-package resolution across platform/packages', fs, {
			valid: [
				{
					code: `import { myHelper } from '@atlaskit/design-tokens/core';`,
					filename: '/workspace/platform/packages/editor/package-a/src/consumer.ts',
				},
			],
			invalid: [
				{
					code: `import { myHelper } from './local-barrel';`,
					filename: '/workspace/platform/packages/editor/package-a/src/consumer.ts',
					errors: [{ messageId: 'barrelImport' }],
					output: `import { myHelper } from '@atlaskit/design-tokens/core';`,
				},
			],
		});
	});

	describe('star exports', () => {
		const PKG = `${BASE}/pkg-star`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export * from './helpers';`,
			[`${PKG}/src/utils/helpers.ts`]: `export const helperA = () => 'A';`,
			[CONSUMER]: '',
		});

		runWithFs('star-exports', fs, {
			valid: [],
			invalid: [
				{
					code: `import { helperA } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `import { helperA } from './utils/helpers';`,
				},
			],
		});
	});

	describe('non-index barrel files (semantic detection)', () => {
		const PKG = `${BASE}/pkg-non-index`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			// A barrel file NOT named index.ts
			[`${PKG}/src/utils/barrel.ts`]: outdent`
				export { helperA } from './helper-a';
				export { helperB } from './helper-b';
			`,
			[`${PKG}/src/utils/helper-a.ts`]: `export const helperA = () => 'A';`,
			[`${PKG}/src/utils/helper-b.ts`]: `export const helperB = () => 'B';`,
			[CONSUMER]: '',
		});

		runWithFs('non-index-barrel', fs, {
			valid: [],
			invalid: [
				{
					code: `import { helperA, helperB } from './utils/barrel';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: tabindent`
						import { helperA } from './utils/helper-a';
						import { helperB } from './utils/helper-b';
					`,
				},
			],
		});
	});

	describe('mixed local and re-exported symbols', () => {
		const PKG = `${BASE}/pkg-mixed`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: outdent`
				export const localHelper = () => 'local';
				export { remoteHelper } from './remote';
			`,
			[`${PKG}/src/utils/remote.ts`]: `export const remoteHelper = () => 'remote';`,
			[CONSUMER]: '',
		});

		runWithFs('mixed-local-reexport', fs, {
			valid: [],
			invalid: [
				{
					code: `import { localHelper, remoteHelper } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: tabindent`
						import { localHelper } from './utils';
						import { remoteHelper } from './utils/remote';
					`,
				},
			],
		});
	});

	describe('deeply nested barrels (3+ levels)', () => {
		const PKG = `${BASE}/pkg-deep`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: `export { deepHelper } from './level1';`,
			[`${PKG}/src/utils/level1/index.ts`]: `export { deepHelper } from './level2';`,
			[`${PKG}/src/utils/level1/level2/index.ts`]: `export { deepHelper } from './source';`,
			[`${PKG}/src/utils/level1/level2/source.ts`]: `export const deepHelper = () => 'deep';`,
			[CONSUMER]: '',
		});

		runWithFs('deeply-nested', fs, {
			valid: [],
			invalid: [
				{
					code: `import { deepHelper } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: `import { deepHelper } from './utils/level1/level2/source';`,
				},
			],
		});
	});

	describe('circular re-exports (should not infinite loop)', () => {
		const PKG = `${BASE}/pkg-circular`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			// Circular: a exports from b, b exports from a
			[`${PKG}/src/a/index.ts`]: outdent`
				export { helperB } from '../b';
				export const helperA = () => 'A';
			`,
			[`${PKG}/src/b/index.ts`]: outdent`
				export { helperA } from '../a';
				export const helperB = () => 'B';
			`,
			[CONSUMER]: '',
		});

		runWithFs('circular-reexports', fs, {
			valid: [],
			invalid: [
				{
					// Should detect as barrel and not infinite loop
					code: `import { helperA, helperB } from './a';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					// helperA is local to ./a, helperB comes from ./b
					output: tabindent`
						import { helperA } from './a';
						import { helperB } from './b';
					`,
				},
			],
		});
	});

	describe('import merging with existing imports', () => {
		const PKG = `${BASE}/pkg-merge`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/utils/index.ts`]: outdent`
				export { helperA, helperB } from './helpers';
				export { validator } from './validators';
			`,
			[`${PKG}/src/utils/helpers.ts`]: outdent`
				export const helperA = () => 'A';
				export const helperB = () => 'B';
			`,
			[`${PKG}/src/utils/validators.ts`]: `export const validator = () => true;`,
			[CONSUMER]: '',
		});

		runWithFs('import-merging', fs, {
			valid: [],
			invalid: [
				{
					// Existing import should be merged with new imports from same file
					code: outdent`
						import { helperA } from './utils/helpers';
						import { helperB, validator } from './utils';
					`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: tabindent`
						import { helperA, helperB } from './utils/helpers';
						import { validator } from './utils/validators';
					`,
				},
			],
		});
	});

	describe('.tsx extension barrel files', () => {
		const PKG = `${BASE}/pkg-tsx`;
		const CONSUMER = `${PKG}/src/consumer.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			[`${PKG}/src/components/index.tsx`]: outdent`
				export { Button } from './Button';
				export { Input } from './Input';
			`,
			[`${PKG}/src/components/Button.tsx`]: `export const Button = () => <button />;`,
			[`${PKG}/src/components/Input.tsx`]: `export const Input = () => <input />;`,
			[CONSUMER]: '',
		});

		runWithFs('tsx-barrel', fs, {
			valid: [],
			invalid: [
				{
					code: `import { Button, Input } from './components';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					output: tabindent`
						import { Button } from './components/Button';
						import { Input } from './components/Input';
					`,
				},
			],
		});
	});

	describe('works in any folder (no applyToImportsFrom constraint)', () => {
		// This rule handles relative imports within a package and does not use applyToImportsFrom.
		// It should work in any folder under platform/packages/

		const fs = createMockFs({
			'/workspace/.git/config': '',
			// Package in any folder - not just ai-mate or search
			'/workspace/platform/packages/other-folder/pkg-other/package.json': JSON.stringify({
				name: '@atlassian/pkg-other',
				exports: { './utils': './src/utils/index.ts' },
			}),
			'/workspace/platform/packages/other-folder/pkg-other/src/consumer.ts': '',
			'/workspace/platform/packages/other-folder/pkg-other/src/barrel/index.ts': outdent`
				export { helper } from './helper';
			`,
			'/workspace/platform/packages/other-folder/pkg-other/src/barrel/helper.ts': outdent`
				export const helper = () => 'helper';
			`,
		});

		// Test: relative barrel imports are detected in any folder
		runWithFs('no-relative-barrel-file-imports - works in any folder', fs, {
			valid: [],
			invalid: [
				{
					code: `import { helper } from './barrel';`,
					filename: '/workspace/platform/packages/other-folder/pkg-other/src/consumer.ts',
					errors: [{ messageId: 'barrelImport' }],
					output: `import { helper } from './barrel/helper';`,
				},
			],
		});
	});

	describe('TREX-1002: re-exports with aliases (export statements)', () => {
		const PKG = `${BASE}/pkg-export-alias`;
		const CONSUMER = `${PKG}/src/index.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			// Source file with original exports
			[`${PKG}/src/services/graphql/search-page/index.tsx`]: outdent`
				export const cache = { data: 'cache' };
				export const generateCacheKey = (id: string) => id;
			`,
			// Barrel that re-exports with aliases (what makes it a barrel file)
			[`${PKG}/src/services/index.ts`]: outdent`
				export { cache as searchPageQueryCache, generateCacheKey as generateSearchPageCacheKey } from './graphql/search-page';
			`,
			// Main index that re-exports from the barrel
			[CONSUMER]: '',
		});

		runWithFs('export-with-aliases', fs, {
			valid: [],
			invalid: [
				// Test that consumer importing from barrel gets fixed to use original names
				{
					code: `export { searchPageQueryCache, generateSearchPageCacheKey } from './services';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					// Should resolve through barrel to source and use original names with consumer's aliases
					output: `export { cache as searchPageQueryCache, generateCacheKey as generateSearchPageCacheKey } from './services/graphql/search-page';`,
				},
			],
		});
	});

	describe('TREX-1002: barrel re-exports with aliases to other barrels', () => {
		const PKG = `${BASE}/pkg-barrel-chain-alias`;
		const CONSUMER = `${PKG}/src/index.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			// Source file
			[`${PKG}/src/services/source.ts`]: outdent`
				export const cache = { data: 'cache' };
				export const generateCacheKey = (id: string) => id;
			`,
			// Intermediate barrel that re-exports from source
			[`${PKG}/src/services/index.ts`]: outdent`
				export { cache, generateCacheKey } from './source';
			`,
			// Main index
			[CONSUMER]: '',
		});

		runWithFs('barrel-chain-with-aliases', fs, {
			valid: [],
			invalid: [
				// Consumer imports from intermediate barrel with aliases
				{
					code: outdent`
						export { 
							cache as searchPageQueryCache, 
							generateCacheKey as generateSearchPageCacheKey 
						} from './services';
					`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					// Should trace through the barrel to the actual source and preserve aliases
					// Note: Since both exports come from same source, they're combined into one statement
					output: `export { cache as searchPageQueryCache, generateCacheKey as generateSearchPageCacheKey } from './services/source';`,
				},
			],
		});
	});

	describe('TREX-1002: mixed direct and aliased re-exports', () => {
		const PKG = `${BASE}/pkg-mixed-alias`;
		const CONSUMER = `${PKG}/src/index.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			// Source file
			[`${PKG}/src/utils/source.ts`]: outdent`
				export const directExport = 'direct';
				export const aliasedExport = 'aliased';
			`,
			// Barrel that re-exports
			[`${PKG}/src/utils/index.ts`]: outdent`
				export { directExport, aliasedExport } from './source';
			`,
			[CONSUMER]: '',
		});

		runWithFs('mixed-direct-and-aliased', fs, {
			valid: [],
			invalid: [
				{
					code: `export { directExport, aliasedExport as renamed } from './utils';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					// Both exports from same source, so they're combined into one statement
					output: `export { directExport, aliasedExport as renamed } from './utils/source';`,
				},
			],
		});
	});

	describe('TREX-1002: barrel with original aliases, consumer adds more aliases', () => {
		const PKG = `${BASE}/pkg-double-alias`;
		const CONSUMER = `${PKG}/src/index.ts`;
		const fs = createMockFs({
			[`${W}/.git/config`]: '',
			// Source file
			[`${PKG}/src/source.ts`]: outdent`
				export const original = 'value';
			`,
			// Barrel that re-exports with alias
			[`${PKG}/src/barrel/index.ts`]: outdent`
				export { original as firstAlias } from '../source';
			`,
			[CONSUMER]: '',
		});

		runWithFs('double-alias-chain', fs, {
			valid: [],
			invalid: [
				{
					code: `export { firstAlias as secondAlias } from './barrel';`,
					filename: CONSUMER,
					errors: [{ messageId: 'barrelImport' }],
					// Should use the original name from source and consumer's final alias
					output: `export { original as secondAlias } from './source';`,
				},
			],
		});
	});
});

describe('named exports should not be converted to default exports', () => {
	const PKG = `${BASE}/pkg-named-exports`;
	const CONSUMER = `${PKG}/src/consumer.ts`;
	const fs = createMockFs({
		[`${W}/.git/config`]: '',
		[`${PKG}/src/services/graphql/search-page/index.tsx`]: outdent`
				export const searchPageQuery = { query: 'search' };
				export const searchDialogQuery = { query: 'dialog' };
			`,
		[`${PKG}/src/services/graphql/search-page/config/index.ts`]: outdent`
				export const getCombinedSearchConfig = () => ({ config: true });
				export const updateCombinedConfigCacheEntry = () => {};
			`,
		[`${PKG}/src/services/index.tsx`]: outdent`
				export { searchPageQuery, searchDialogQuery } from './graphql/search-page';
				export { getCombinedSearchConfig, updateCombinedConfigCacheEntry } from './graphql/search-page/config';
			`,
		[CONSUMER]: '',
	});

	runWithFs('named-exports-not-converted-to-default', fs, {
		valid: [],
		invalid: [
			{
				code: `import { searchPageQuery, searchDialogQuery } from './services';`,
				filename: CONSUMER,
				errors: [{ messageId: 'barrelImport' }],
				output: `import { searchPageQuery, searchDialogQuery } from './services/graphql/search-page';`,
			},
			{
				code: `export { searchPageQuery, searchDialogQuery } from './services';`,
				filename: CONSUMER,
				errors: [{ messageId: 'barrelImport' }],
				output: `export { searchPageQuery, searchDialogQuery } from './services/graphql/search-page';`,
			},
			{
				code: `export { getCombinedSearchConfig, updateCombinedConfigCacheEntry } from './services';`,
				filename: CONSUMER,
				errors: [{ messageId: 'barrelImport' }],
				output: `export { getCombinedSearchConfig, updateCombinedConfigCacheEntry } from './services/graphql/search-page/config';`,
			},
		],
	});
});
