import outdent from 'outdent';

// @ts-expect-error - ruleTester is untyped but comes from @atlassian/eslint-utils
import { ruleTester as atlaskitRuleTester } from '@atlassian/eslint-utils';

import type { FileSystem } from '../../shared/types';
import { createRule } from '../index';

/**
 * Helper to create a mock file system from a map of file paths to contents.
 * This allows tests to simulate different barrel file structures.
 */
function createMockFileSystem(files: Record<string, string>): FileSystem {
	// Build a set of all directories from the file paths
	const directories = new Set<string>();
	for (const filePath of Object.keys(files)) {
		// Add all parent directories
		const parts = filePath.split('/');
		for (let i = 1; i < parts.length; i++) {
			directories.add(parts.slice(0, i).join('/'));
		}
	}

	return {
		existsSync(path: string): boolean {
			return path in files || directories.has(path);
		},
		readFileSync(path: string): string {
			if (!(path in files)) {
				throw new Error(`ENOENT: no such file or directory, open '${path}'`);
			}
			return files[path];
		},
		realpathSync(path: string): string {
			return path;
		},
		statSync(path: string): { isFile(): boolean; mtimeMs?: number } {
			return {
				isFile(): boolean {
					return path in files;
				},
				mtimeMs: 12345,
			};
		},
		readdirSync(path: string, _options: { withFileTypes: true }) {
			if (!directories.has(path) && !(path in files)) {
				throw new Error(`ENOENT: no such file or directory, scandir '${path}'`);
			}

			// Find all immediate children of this directory
			const children = new Map<string, 'file' | 'directory'>();
			const prefix = path + '/';

			for (const filePath of Object.keys(files)) {
				if (filePath.startsWith(prefix)) {
					const relativePath = filePath.slice(prefix.length);
					const firstSegment = relativePath.split('/')[0];
					if (firstSegment) {
						// If there's more after the first segment, it's a directory
						const isDir = relativePath.includes('/');
						const existingType = children.get(firstSegment);
						if (!existingType || isDir) {
							children.set(firstSegment, isDir ? 'directory' : 'file');
						}
					}
				}
			}

			return Array.from(children.entries()).map(([name, type]) => ({
				name,
				isDirectory: () => type === 'directory',
				isFile: () => type === 'file',
			}));
		},
		execSync(command: string, _options?: { cwd?: string }): string | null {
			// Return workspace root for git rev-parse command
			if (command === 'git rev-parse --show-toplevel') {
				return WORKSPACE_ROOT;
			}
			return null;
		},
		// Fresh cache for each test - ensures no state leaks between tests
		cache: {},
	};
}

/**
 * Tagged template literal that strips indentation (like outdent) and converts
 * leading spaces to tabs (2 spaces = 1 tab) to match the rule's output format.
 */
function tabindent(strings: TemplateStringsArray, ...values: unknown[]): string {
	// Use outdent to strip the common indentation first
	const result = outdent(strings, ...values);

	// Convert leading spaces to tabs (2 spaces per tab level)
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
	// Create a rule instance with the mock file system
	const rule = createRule(fs);
	atlaskitRuleTester.run(name, rule, tests);
}

// Base paths used in tests
const WORKSPACE_ROOT = '/workspace';
const PLATFORM_PACKAGES = `${WORKSPACE_ROOT}/platform/packages`;
const AI_MATE_DIR = `${PLATFORM_PACKAGES}/ai-mate`;
const TEST_PACKAGE_DIR = `${AI_MATE_DIR}/conversation-assistant-instrumentation`;
const TEST_FILE = `${AI_MATE_DIR}/agent-evaluation/src/ui/CreateDatasetModal.tsx`;

// instead of using the package name directly, we use a constant so the ratcheting does not fail
const TEST_PACKAGE_NAME = '@atlassian/conversation-assistant-instrumentation';

/**
 * Creates a standard mock file system for testing the rule.
 * Sets up a typical package structure with barrel file and specific exports.
 */
function createStandardMockFs(): FileSystem {
	return createMockFileSystem({
		// Workspace markers
		[`${WORKSPACE_ROOT}/package.json`]: '{}',
		[`${WORKSPACE_ROOT}/yarn.lock`]: '',
		[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

		// Package.json with exports
		[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
			name: '@atlassian/conversation-assistant-instrumentation',
			exports: {
				'.': './src/index.ts',
				'./constants/analytics': './src/controllers/analytics/constants.ts',
				'./controllers/analytics': './src/controllers/analytics/index.tsx',
				'./controllers/experience-tracker': './src/controllers/experience-tracker/index.tsx',
				'./types/analytics': './src/controllers/analytics/types.ts',
			},
		}),

		// Barrel file (index.ts)
		[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
			export { useAnalytics } from './controllers/analytics';
			export type { IUseAnalytics } from './controllers/analytics/types';
			export { ANALYTICS_CHANNEL } from './controllers/analytics/constants';
			export { useExperienceTracker } from './controllers/experience-tracker';
		`,

		// Analytics controller (source file for useAnalytics)
		[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
			export const useAnalytics = () => {
				return { sendEvent: () => {} };
			};
		`,

		// Analytics types
		[`${TEST_PACKAGE_DIR}/src/controllers/analytics/types.ts`]: outdent`
			export interface IUseAnalytics {
				sendEvent: () => void;
			}
		`,

		// Analytics constants
		[`${TEST_PACKAGE_DIR}/src/controllers/analytics/constants.ts`]: outdent`
			export const ANALYTICS_CHANNEL = 'ai-mate';
		`,

		// Experience tracker controller
		[`${TEST_PACKAGE_DIR}/src/controllers/experience-tracker/index.tsx`]: outdent`
			export const useExperienceTracker = () => {
				return { track: () => {} };
			};
		`,
	});
}

/**
 * Test suite for the no-barrel-entry-imports rule.
 */
describe('no-barrel-entry-imports', () => {
	describe('valid cases', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - valid', fs, {
			valid: [
				// Already using specific import
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
					filename: TEST_FILE,
				},
				// Relative imports are ignored
				{
					code: `import { something } from './local';`,
					filename: TEST_FILE,
				},
				// Package not in ai-mate folder is ignored
				{
					code: `import { Button } from '@atlaskit/button';`,
					filename: TEST_FILE,
				},
				// Already using specific import for types
				{
					code: `import type { IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation/types/analytics';`,
					filename: TEST_FILE,
				},
				// Non-barrel import with subpath
				{
					code: `import { ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation/constants/analytics';`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('basic barrel import detection', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - basic detection', fs, {
			valid: [],
			invalid: [
				// Single named import from barrel
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
			],
		});
	});

	describe('CommonJS require() of barrel entry', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - require member access', fs, {
			valid: [],
			invalid: [
				{
					code: `const useAnalytics = require('@atlassian/conversation-assistant-instrumentation').useAnalytics;`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `const useAnalytics = require('@atlassian/conversation-assistant-instrumentation/controllers/analytics').useAnalytics;`,
				},
			],
		});

		runWithFs('no-barrel-entry-imports - require destructuring single target', fs, {
			valid: [],
			invalid: [
				{
					code: `const { useAnalytics } = require('@atlassian/conversation-assistant-instrumentation');`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `const { useAnalytics } = require('@atlassian/conversation-assistant-instrumentation/controllers/analytics');`,
				},
			],
		});

		runWithFs('no-barrel-entry-imports - require destructuring multiple targets', fs, {
			valid: [],
			invalid: [
				{
					code: tabindent`
						const { useAnalytics, useExperienceTracker } = require('@atlassian/conversation-assistant-instrumentation');
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						const useAnalytics = require('@atlassian/conversation-assistant-instrumentation/controllers/analytics').useAnalytics;
						const useExperienceTracker = require('@atlassian/conversation-assistant-instrumentation/controllers/experience-tracker').useExperienceTracker;
					`,
				},
			],
		});
	});

	describe('multiple imports from different sources', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - multiple sources', fs, {
			valid: [],
			invalid: [
				// Multiple imports that should split to different paths
				{
					code: `import { useAnalytics, ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation/constants/analytics';
					`,
				},
			],
		});
	});

	describe('type imports', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - type imports', fs, {
			valid: [],
			invalid: [
				// Type-only import
				{
					code: `import type { IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import type { IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation/types/analytics';`,
				},
			],
		});
	});

	describe('mixed value and type imports', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - mixed imports', fs, {
			valid: [],
			invalid: [
				// Mixed value and inline type imports
				{
					code: `import { useAnalytics, type IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { type IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation/types/analytics';
					`,
				},
			],
		});
	});

	describe('imports with no specific export available', () => {
		// Create a file system where some exports don't have specific paths
		const fsWithPartialExports = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
					// Note: no specific export for 'someHelper'
				},
			}),

			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { useAnalytics } from './controllers/analytics';
				export const someHelper = () => {};
			`,

			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,
		});

		runWithFs('no-barrel-entry-imports - partial exports', fsWithPartialExports, {
			valid: [],
			invalid: [
				// When some imports can be remapped and others can't
				{
					code: `import { useAnalytics, someHelper } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { someHelper } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
			],
		});
	});

	describe('no violation when all imports lack specific exports', () => {
		const fsWithNoSpecificExports = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					// No specific exports
				},
			}),

			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export const useAnalytics = () => {};
				export const someHelper = () => {};
			`,
		});

		runWithFs('no-barrel-entry-imports - no specific exports', fsWithNoSpecificExports, {
			valid: [
				// No violation when there are no specific exports to use
				{
					code: `import { useAnalytics, someHelper } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('aliased imports', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - aliased imports', fs, {
			valid: [],
			invalid: [
				// Import with alias
				{
					code: `import { useAnalytics as useAI } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { useAnalytics as useAI } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
			],
		});
	});

	describe('barrel-side aliased re-exports', () => {
		// Test complex scenario with multiple symbols from different sources with different aliases
		const fsWithBarrelAlias = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
					'./controllers/tracker': './src/controllers/tracker/index.tsx',
				},
			}),

			// Barrel file with multiple re-exports, some aliased, one defined locally
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { sendAnalyticsEvent as useAnalytics, AnalyticsContext } from './controllers/analytics';
				export { createTracker as useTracker, TrackerContext } from './controllers/tracker';
				export const LOCAL_CONSTANT = 'local-value';
			`,

			// Analytics controller - source for useAnalytics and AnalyticsContext
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export const sendAnalyticsEvent = () => {
					return { sendEvent: () => {} };
				};
				export const AnalyticsContext = {};
			`,

			// Tracker controller - source for useTracker and TrackerContext
			[`${TEST_PACKAGE_DIR}/src/controllers/tracker/index.tsx`]: outdent`
				export const createTracker = () => {
					return { track: () => {} };
				};
				export const TrackerContext = {};
			`,
		});

		runWithFs('no-barrel-entry-imports - barrel-side alias', fsWithBarrelAlias, {
			valid: [],
			invalid: [
				// Single aliased import
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { sendAnalyticsEvent as useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
				// Single aliased import with consumer alias - should use original name but keep local alias
				{
					code: `import { useAnalytics as myAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { sendAnalyticsEvent as myAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
				// Multiple symbols from different sources, with different aliases, plus one local symbol
				// useAnalytics -> aliased from sendAnalyticsEvent in analytics
				// useTracker -> aliased from createTracker in tracker
				// TrackerContext -> not aliased, from tracker
				// LOCAL_CONSTANT -> defined locally in index, no specific export
				{
					code: `import { useAnalytics, useTracker, TrackerContext, LOCAL_CONSTANT } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { sendAnalyticsEvent as useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { createTracker as useTracker, TrackerContext } from '@atlassian/conversation-assistant-instrumentation/controllers/tracker';
						import { LOCAL_CONSTANT } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Same as above but with consumer aliases on top of barrel aliases
				{
					code: `import { useAnalytics as analytics, useTracker as tracker, TrackerContext as ctx, LOCAL_CONSTANT as CONST } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { sendAnalyticsEvent as analytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { createTracker as tracker, TrackerContext as ctx } from '@atlassian/conversation-assistant-instrumentation/controllers/tracker';
						import { LOCAL_CONSTANT as CONST } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Existing import from analytics - should merge with the split-out import
				{
					code: outdent`
						import { AnalyticsContext } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { useAnalytics, useTracker, LOCAL_CONSTANT } from '@atlassian/conversation-assistant-instrumentation';
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { AnalyticsContext, sendAnalyticsEvent as useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { createTracker as useTracker } from '@atlassian/conversation-assistant-instrumentation/controllers/tracker';
						import { LOCAL_CONSTANT } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Existing imports from both source files - should merge with both
				{
					code: outdent`
						import { AnalyticsContext } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { TrackerContext } from '@atlassian/conversation-assistant-instrumentation/controllers/tracker';
						import { useAnalytics, useTracker, LOCAL_CONSTANT } from '@atlassian/conversation-assistant-instrumentation';
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { AnalyticsContext, sendAnalyticsEvent as useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { TrackerContext, createTracker as useTracker } from '@atlassian/conversation-assistant-instrumentation/controllers/tracker';
						import { LOCAL_CONSTANT } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Existing imports with aliases - should preserve existing aliases when merging
				{
					code: outdent`
						import { AnalyticsContext as AC } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { AnalyticsContext as AC, sendAnalyticsEvent as useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
			],
		});
	});

	describe('barrel-side aliased default exports', () => {
		// Test complex scenario with multiple symbols including aliased default exports
		const fsWithDefaultAlias = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./components/AnalyticsProvider': './src/components/AnalyticsProvider.tsx',
					'./components/TrackerProvider': './src/components/TrackerProvider.tsx',
				},
			}),

			// Barrel file re-exports defaults as named, plus a local symbol
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { default as AnalyticsProvider } from './components/AnalyticsProvider';
				export { default as TrackerProvider } from './components/TrackerProvider';
				export const PROVIDER_VERSION = '1.0.0';
			`,

			// AnalyticsProvider - default export plus named exports
			[`${TEST_PACKAGE_DIR}/src/components/AnalyticsProvider.tsx`]: outdent`
				const AnalyticsProvider = () => {
					return null;
				};
				export default AnalyticsProvider;
				export const useAnalyticsContext = () => {};
			`,

			// TrackerProvider - default export plus named exports
			[`${TEST_PACKAGE_DIR}/src/components/TrackerProvider.tsx`]: outdent`
				const TrackerProvider = () => {
					return null;
				};
				export default TrackerProvider;
				export const useTrackerContext = () => {};
			`,
		});

		runWithFs('no-barrel-entry-imports - default alias', fsWithDefaultAlias, {
			valid: [],
			invalid: [
				// require() of default re-exported as named → subpath + .default
				{
					code: `const AnalyticsProvider = require('@atlassian/conversation-assistant-instrumentation').AnalyticsProvider;`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `const AnalyticsProvider = require('@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider').default;`,
				},
				// Single default-as-named import
				{
					code: `import { AnalyticsProvider } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import AnalyticsProvider from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';`,
				},
				// Single default-as-named with consumer alias
				{
					code: `import { AnalyticsProvider as AP } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import AP from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';`,
				},
				// Multiple default exports from different sources, plus one local symbol
				// Note: Each default export goes to a separate import statement since they're from different files
				{
					code: `import { AnalyticsProvider, TrackerProvider, PROVIDER_VERSION } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import AnalyticsProvider from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import TrackerProvider from '@atlassian/conversation-assistant-instrumentation/components/TrackerProvider';
						import { PROVIDER_VERSION } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Same as above but with consumer aliases
				{
					code: `import { AnalyticsProvider as AP, TrackerProvider as TP, PROVIDER_VERSION as VERSION } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import AP from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import TP from '@atlassian/conversation-assistant-instrumentation/components/TrackerProvider';
						import { PROVIDER_VERSION as VERSION } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Existing named import from source file - should merge default with existing named import
				{
					code: outdent`
						import { useAnalyticsContext } from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import { AnalyticsProvider, PROVIDER_VERSION } from '@atlassian/conversation-assistant-instrumentation';
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import AnalyticsProvider, { useAnalyticsContext } from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import { PROVIDER_VERSION } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Existing named imports from both source files - should merge defaults with existing
				{
					code: outdent`
						import { useAnalyticsContext } from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import { useTrackerContext } from '@atlassian/conversation-assistant-instrumentation/components/TrackerProvider';
						import { AnalyticsProvider, TrackerProvider, PROVIDER_VERSION } from '@atlassian/conversation-assistant-instrumentation';
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import AnalyticsProvider, { useAnalyticsContext } from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import TrackerProvider, { useTrackerContext } from '@atlassian/conversation-assistant-instrumentation/components/TrackerProvider';
						import { PROVIDER_VERSION } from '@atlassian/conversation-assistant-instrumentation';
					`,
				},
				// Existing import with alias - should preserve existing alias when merging
				{
					code: outdent`
						import { useAnalyticsContext as useAC } from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';
						import { AnalyticsProvider as AP } from '@atlassian/conversation-assistant-instrumentation';
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import AP, { useAnalyticsContext as useAC } from '@atlassian/conversation-assistant-instrumentation/components/AnalyticsProvider';`,
				},
			],
		});
	});

	describe('different quote styles', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - double quotes', fs, {
			valid: [],
			invalid: [
				// Double quotes should be preserved
				{
					code: `import { useAnalytics } from "@atlassian/conversation-assistant-instrumentation";`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { useAnalytics } from "@atlassian/conversation-assistant-instrumentation/controllers/analytics";`,
				},
			],
		});
	});

	describe('nested re-exports', () => {
		// Create a file system with nested barrel files where the most specific export
		// points to the actual source file (not an intermediate barrel)
		const fsWithNestedBarrels = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
					// Most specific export points to the actual source file
					'./hooks/useAnalytics': './src/controllers/analytics/useAnalytics.ts',
				},
			}),

			// Main barrel re-exports from another barrel
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { useAnalytics } from './controllers/analytics';
			`,

			// Controller barrel re-exports from the actual source
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export { useAnalytics } from './useAnalytics';
			`,

			// Actual source file
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/useAnalytics.ts`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,
		});

		runWithFs('no-barrel-entry-imports - nested barrels', fsWithNestedBarrels, {
			valid: [],
			invalid: [
				// Should trace through nested barrels to find the most specific export
				// (the one pointing to the actual source file, not the intermediate barrel)
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/hooks/useAnalytics';`,
				},
			],
		});
	});

	describe('non-index entry file with direct exports', () => {
		// Entry file defines exports directly (no re-exporting) - not a barrel for these symbols
		const fsWithNonIndexEntry = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/main.ts',
				},
			}),

			// main.ts defines useAnalytics directly - not re-exporting
			[`${TEST_PACKAGE_DIR}/src/main.ts`]: outdent`
				export const useAnalytics = () => {};
			`,
		});

		runWithFs('no-barrel-entry-imports - direct exports', fsWithNonIndexEntry, {
			valid: [
				// No violation when symbol is defined directly in entry file
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('non-index entry file that re-exports', () => {
		// Entry file re-exports from another file - IS a barrel for these symbols
		const fsWithNonIndexBarrel = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/main.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
				},
			}),

			// main.ts re-exports useAnalytics - acts as a barrel for this symbol
			[`${TEST_PACKAGE_DIR}/src/main.ts`]: outdent`
				export { useAnalytics } from './controllers/analytics';
			`,

			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,
		});

		runWithFs('no-barrel-entry-imports - non-index re-exports', fsWithNonIndexBarrel, {
			valid: [],
			invalid: [
				// Violation when non-index entry file re-exports and there's a more specific export
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
			],
		});
	});

	describe('subpath barrel imports', () => {
		// A subpath import can also resolve to a barrel file that re-exports from more specific paths
		const fsWithSubpathBarrel = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./controllers': './src/controllers/index.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
					'./controllers/experience-tracker': './src/controllers/experience-tracker/index.tsx',
				},
			}),

			// Main entry barrel
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export * from './controllers';
			`,

			// Controllers barrel - re-exports from specific controller paths
			[`${TEST_PACKAGE_DIR}/src/controllers/index.ts`]: outdent`
				export { useAnalytics } from './analytics';
				export { useExperienceTracker } from './experience-tracker';
			`,

			// Analytics controller
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,

			// Experience tracker controller
			[`${TEST_PACKAGE_DIR}/src/controllers/experience-tracker/index.tsx`]: outdent`
				export const useExperienceTracker = () => {
					return { track: () => {} };
				};
			`,
		});

		runWithFs('no-barrel-entry-imports - subpath barrel', fsWithSubpathBarrel, {
			valid: [
				// Already using the most specific import
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
					filename: TEST_FILE,
				},
			],
			invalid: [
				// Importing from subpath barrel should suggest more specific import
				{
					code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
				},
				// Multiple imports from subpath barrel should be split to their respective sources
				{
					code: `import { useAnalytics, useExperienceTracker } from '@atlassian/conversation-assistant-instrumentation/controllers';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { useExperienceTracker } from '@atlassian/conversation-assistant-instrumentation/controllers/experience-tracker';`,
				},
			],
		});
	});

	describe('jest automock handling', () => {
		// When a file has both an import and a jest.mock() of the same path,
		// we should update both the import AND the automock when fixing
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-imports - jest automock basic', fs, {
			valid: [
				// Automock without corresponding import - should be ignored
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-instrumentation');

						const something = 'test';
					`,
					filename: TEST_FILE,
				},
				// Already using specific import path with matching automock
				{
					code: outdent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');
					`,
					filename: TEST_FILE,
				},
				// Relative import with automock - should be ignored (rule skips relative imports)
				{
					code: outdent`
						import { something } from './local';

						jest.mock('./local');
					`,
					filename: TEST_FILE,
				},
				// Relative automock without matching import - should be ignored
				{
					code: outdent`
						jest.mock('./some-module');

						const something = 'test';
					`,
					filename: TEST_FILE,
				},
				// Relative automock with non-automock factory - should be ignored
				{
					code: outdent`
						import { helper } from '../utils/helper';

						jest.mock('../utils/helper', () => ({
							helper: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
				},
			],
			invalid: [
				// Non-automock jest.mock (has factory function) - import should still be fixed,
				// but the jest.mock should NOT be updated (it has custom mock implementation)
				{
					code: outdent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
						}));
					`,
				},
				// Non-automock with multiple imports splitting - jest.mock with factory should NOT be modified
				{
					code: outdent`
						import { useAnalytics, ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
							ANALYTICS_CHANNEL: 'mocked-channel',
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation/constants/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
							ANALYTICS_CHANNEL: 'mocked-channel',
						}));
					`,
				},
				// Non-automock with second options argument - should NOT be modified
				{
					code: outdent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
						}), { virtual: true });
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
						}), { virtual: true });
					`,
				},
				// Mixed: automock AND non-automock for same path - only automock should be updated
				{
					code: outdent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation');
						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');
						jest.mock('@atlassian/conversation-assistant-instrumentation', () => ({
							useAnalytics: jest.fn(),
						}));
					`,
				},
				// Single import with matching automock - both should be updated
				{
					code: outdent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation');

						describe('test', () => {});
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');

						describe('test', () => {});
					`,
				},
				// Multiple imports splitting to different paths - automock should be split
				{
					code: outdent`
						import { useAnalytics, ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation');

						describe('test', () => {});
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { ANALYTICS_CHANNEL } from '@atlassian/conversation-assistant-instrumentation/constants/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');
						jest.mock('@atlassian/conversation-assistant-instrumentation/constants/analytics');

						describe('test', () => {});
					`,
				},
				// Import with automock - automock appears after other code
				{
					code: outdent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						const someConst = 'value';

						jest.mock('@atlassian/conversation-assistant-instrumentation');
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';

						const someConst = 'value';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');
					`,
				},
			],
		});

		// Test with partial exports where some imports stay on barrel
		const fsWithPartialExports = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
					// Note: no specific export for 'someHelper'
				},
			}),

			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { useAnalytics } from './controllers/analytics';
				export const someHelper = () => {};
			`,

			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,
		});

		runWithFs('no-barrel-entry-imports - jest automock partial', fsWithPartialExports, {
			valid: [],
			invalid: [
				// When some imports can be remapped and others can't, automock should be split
				// keeping the barrel automock for unmapped imports
				{
					code: outdent`
						import { useAnalytics, someHelper } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation');
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { someHelper } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');
						jest.mock('@atlassian/conversation-assistant-instrumentation');
					`,
				},
			],
		});

		// Test with double quotes
		runWithFs('no-barrel-entry-imports - jest automock double quotes', fs, {
			valid: [],
			invalid: [
				// Double quotes should be preserved in both import and automock
				{
					code: outdent`
						import { useAnalytics } from "@atlassian/conversation-assistant-instrumentation";

						jest.mock("@atlassian/conversation-assistant-instrumentation");
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from "@atlassian/conversation-assistant-instrumentation/controllers/analytics";

						jest.mock("@atlassian/conversation-assistant-instrumentation/controllers/analytics");
					`,
				},
			],
		});

		// Test with type imports - automocks should only be created for value imports
		runWithFs('no-barrel-entry-imports - jest automock with types', fs, {
			valid: [],
			invalid: [
				// Mixed value and type imports - automock should only include value import paths
				{
					code: outdent`
						import { useAnalytics, type IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation');
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						import { type IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation/types/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation/controllers/analytics');
					`,
				},
				// Pure type import should NOT update automock (type imports don't need runtime mocking)
				{
					code: outdent`
						import type { IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation';

						jest.mock('@atlassian/conversation-assistant-instrumentation');
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import type { IUseAnalytics } from '@atlassian/conversation-assistant-instrumentation/types/analytics';

						jest.mock('@atlassian/conversation-assistant-instrumentation');
					`,
				},
			],
		});
	});

	describe('multiple exports pointing to same file', () => {
		// When multiple export paths point to the same file, we should NOT change
		// imports that already use one of those valid paths
		const fsWithMultipleExportsSameFile = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					// Multiple exports pointing to the SAME file
					'./ui/BrowseAgentsModal': './src/ui/browse-agents/index.tsx',
					'./ui/BrowseAgentsSidebar': './src/ui/browse-agents/index.tsx',
					'./ui/BrowseAgentsSidebarModal': './src/ui/browse-agents/index.tsx',
					// A different export pointing to a different file
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
				},
			}),

			// Main barrel file that re-exports from multiple places
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { BrowseAgentsFullscreen, BrowseAgentsPanel } from './ui/browse-agents';
				export { useAnalytics } from './controllers/analytics';
			`,

			// Browse agents module - exports multiple components
			[`${TEST_PACKAGE_DIR}/src/ui/browse-agents/index.tsx`]: outdent`
				export const BrowseAgentsFullscreen = () => null;
				export const BrowseAgentsPanel = () => null;
			`,

			// Analytics controller
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - multiple exports same file',
			fsWithMultipleExportsSameFile,
			{
				valid: [
					// Already using BrowseAgentsSidebar - should NOT change to BrowseAgentsModal or BrowseAgentsSidebarModal
					{
						code: `import { BrowseAgentsFullscreen } from '@atlassian/conversation-assistant-instrumentation/ui/BrowseAgentsSidebar';`,
						filename: TEST_FILE,
					},
					// Already using BrowseAgentsModal - should NOT change to other equivalent exports
					{
						code: `import { BrowseAgentsFullscreen } from '@atlassian/conversation-assistant-instrumentation/ui/BrowseAgentsModal';`,
						filename: TEST_FILE,
					},
					// Already using BrowseAgentsSidebarModal - should NOT change to other equivalent exports
					{
						code: `import { BrowseAgentsPanel } from '@atlassian/conversation-assistant-instrumentation/ui/BrowseAgentsSidebarModal';`,
						filename: TEST_FILE,
					},
					// Multiple imports from one of the equivalent paths - still valid
					{
						code: `import { BrowseAgentsFullscreen, BrowseAgentsPanel } from '@atlassian/conversation-assistant-instrumentation/ui/BrowseAgentsSidebar';`,
						filename: TEST_FILE,
					},
				],
				invalid: [
					// Import from root barrel should still be flagged when there are specific exports available
					{
						code: `import { BrowseAgentsFullscreen } from '@atlassian/conversation-assistant-instrumentation';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						// Should suggest one of the valid export paths (whichever is found first)
						output: `import { BrowseAgentsFullscreen } from '@atlassian/conversation-assistant-instrumentation/ui/BrowseAgentsModal';`,
					},
					// Analytics import from root barrel should still be fixed
					{
						code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
					},
					// Mixed: components with equivalent exports AND analytics should both be fixed appropriately
					{
						code: `import { BrowseAgentsFullscreen, useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { BrowseAgentsFullscreen } from '@atlassian/conversation-assistant-instrumentation/ui/BrowseAgentsModal';
							import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';
						`,
					},
				],
			},
		);
	});

	describe('cross-package re-exports', () => {
		// Setup: package-a re-exports from package-b
		const PACKAGE_A_DIR = `${AI_MATE_DIR}/package-a`;
		const PACKAGE_B_DIR = `${AI_MATE_DIR}/package-b`;

		const fsWithCrossPackageReexport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - re-exports from Package B
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
					'./local-component': './src/local-component.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export { SomeComponent } from '@atlassian/package-b';
				export { localThing } from './local-component';
			`,
			[`${PACKAGE_A_DIR}/src/local-component.ts`]: outdent`
				export const localThing = 'local';
			`,

			// Package B - the source package with subpath exports
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./ui/components': './src/ui/components/index.ts',
					'./utils': './src/utils/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export { SomeComponent } from './ui/components';
				export { helperUtil } from './utils';
			`,
			[`${PACKAGE_B_DIR}/src/ui/components/index.ts`]: outdent`
				export const SomeComponent = () => null;
			`,
			[`${PACKAGE_B_DIR}/src/utils/index.ts`]: outdent`
				export const helperUtil = () => {};
			`,
		});

		runWithFs('no-barrel-entry-imports - cross-package re-exports', fsWithCrossPackageReexport, {
			valid: [
				// Importing local export from package-a (not a cross-package re-export)
				{
					code: `import { localThing } from '@atlassian/package-a/local-component';`,
					filename: TEST_FILE,
				},
				// Importing from package-b's specific export path
				{
					code: `import { SomeComponent } from '@atlassian/package-b/ui/components';`,
					filename: TEST_FILE,
				},
			],
			invalid: [
				// Simple cross-package re-export: should suggest importing from source package's subpath
				{
					code: `import { SomeComponent } from '@atlassian/package-a';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { SomeComponent } from '@atlassian/package-b/ui/components';`,
				},
				// Mixed: cross-package re-export AND local export
				{
					code: `import { SomeComponent, localThing } from '@atlassian/package-a';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
						import { SomeComponent } from '@atlassian/package-b/ui/components';
						import { localThing } from '@atlassian/package-a/local-component';
					`,
				},
				// Import from package-b's barrel can also be made more specific
				{
					code: `import { SomeComponent } from '@atlassian/package-b';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { SomeComponent } from '@atlassian/package-b/ui/components';`,
				},
			],
		});

		// Test with aliased cross-package re-exports
		const fsWithAliasedCrossPackageReexport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - re-exports from Package B with aliasing
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export { OriginalName as AliasedName } from '@atlassian/package-b';
			`,

			// Package B - the source package with subpath export
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./helpers': './src/helpers/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export { OriginalName } from './helpers';
			`,
			[`${PACKAGE_B_DIR}/src/helpers/index.ts`]: outdent`
				export const OriginalName = 'original';
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - cross-package with aliasing',
			fsWithAliasedCrossPackageReexport,
			{
				valid: [],
				invalid: [
					// Cross-package re-export with aliasing: should use original name from source package's subpath
					{
						code: `import { AliasedName } from '@atlassian/package-a';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { OriginalName as AliasedName } from '@atlassian/package-b/helpers';`,
					},
				],
			},
		);

		// Test with star re-exports (export * from)
		const fsWithStarReexport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - star re-exports from Package B
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export * from '@atlassian/package-b';
			`,

			// Package B - the source package with subpath export
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./ui/widgets': './src/ui/widgets/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export { ComponentOne, ComponentTwo } from './ui/widgets';
			`,
			[`${PACKAGE_B_DIR}/src/ui/widgets/index.ts`]: outdent`
				export const ComponentOne = () => null;
				export const ComponentTwo = () => null;
			`,
		});

		runWithFs('no-barrel-entry-imports - star re-exports', fsWithStarReexport, {
			valid: [],
			invalid: [
				// Star re-export: should suggest importing from source package's subpath
				{
					code: `import { ComponentOne } from '@atlassian/package-a';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { ComponentOne } from '@atlassian/package-b/ui/widgets';`,
				},
				// Multiple imports via star re-export
				{
					code: `import { ComponentOne, ComponentTwo } from '@atlassian/package-a';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { ComponentOne, ComponentTwo } from '@atlassian/package-b/ui/widgets';`,
				},
			],
		});

		// Test type-only cross-package re-exports
		const fsWithTypeCrossPackageReexport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - re-exports types from Package B
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export type { SomeType } from '@atlassian/package-b';
				export { SomeComponent } from '@atlassian/package-b';
			`,

			// Package B - the source package with subpath exports
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./types': './src/types/index.ts',
					'./ui/components': './src/ui/components/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export type { SomeType } from './types';
				export { SomeComponent } from './ui/components';
			`,
			[`${PACKAGE_B_DIR}/src/types/index.ts`]: outdent`
				export interface SomeType { value: string; }
			`,
			[`${PACKAGE_B_DIR}/src/ui/components/index.ts`]: outdent`
				export const SomeComponent = () => null;
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - type-only cross-package re-exports',
			fsWithTypeCrossPackageReexport,
			{
				valid: [],
				invalid: [
					// Type-only cross-package re-export
					{
						code: `import type { SomeType } from '@atlassian/package-a';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import type { SomeType } from '@atlassian/package-b/types';`,
					},
					// Mixed value and type cross-package re-exports - should split to different subpaths
					{
						code: `import { SomeComponent, type SomeType } from '@atlassian/package-a';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { SomeComponent } from '@atlassian/package-b/ui/components';
							import { type SomeType } from '@atlassian/package-b/types';
						`,
					},
				],
			},
		);

		// Test Jest automocks with cross-package re-exports
		const fsWithCrossPackageAutomock = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - re-exports from Package B
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
					'./local-component': './src/local-component.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export { SomeComponent } from '@atlassian/package-b';
				export { localThing } from './local-component';
			`,
			[`${PACKAGE_A_DIR}/src/local-component.ts`]: outdent`
				export const localThing = 'local';
			`,

			// Package B - the source package with subpath export
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./ui/components': './src/ui/components/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export { SomeComponent } from './ui/components';
			`,
			[`${PACKAGE_B_DIR}/src/ui/components/index.ts`]: outdent`
				export const SomeComponent = () => null;
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - cross-package re-exports with jest automocks',
			fsWithCrossPackageAutomock,
			{
				valid: [],
				invalid: [
					// Cross-package re-export with automock - both should be updated to source package's subpath
					{
						code: outdent`
							import { SomeComponent } from '@atlassian/package-a';

							jest.mock('@atlassian/package-a');
						`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: outdent`
							import { SomeComponent } from '@atlassian/package-b/ui/components';

							jest.mock('@atlassian/package-b/ui/components');
						`,
					},
					// Mixed cross-package and local exports with automock - automock should be split
					{
						code: outdent`
							import { SomeComponent, localThing } from '@atlassian/package-a';

							jest.mock('@atlassian/package-a');
						`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { SomeComponent } from '@atlassian/package-b/ui/components';
							import { localThing } from '@atlassian/package-a/local-component';

							jest.mock('@atlassian/package-b/ui/components');
							jest.mock('@atlassian/package-a/local-component');
						`,
					},
					// Cross-package re-export with non-automock (factory function) - only import should be updated
					{
						code: outdent`
							import { SomeComponent } from '@atlassian/package-a';

							jest.mock('@atlassian/package-a', () => ({
								SomeComponent: jest.fn(),
							}));
						`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: outdent`
							import { SomeComponent } from '@atlassian/package-b/ui/components';

							jest.mock('@atlassian/package-a', () => ({
								SomeComponent: jest.fn(),
							}));
						`,
					},
					// Type-only cross-package import with automock - automock should NOT be updated
					{
						code: outdent`
							import type { SomeComponent } from '@atlassian/package-a';

							jest.mock('@atlassian/package-a');
						`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: outdent`
							import type { SomeComponent } from '@atlassian/package-b/ui/components';

							jest.mock('@atlassian/package-a');
						`,
					},
				],
			},
		);

		// Test nested cross-package re-exports (A -> B -> C)
		const PACKAGE_C_DIR = `${AI_MATE_DIR}/package-c`;

		const fsWithNestedCrossPackageReexport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - re-exports from Package B
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export { DeepComponent } from '@atlassian/package-b';
				export { MiddleComponent } from '@atlassian/package-b';
			`,

			// Package B - re-exports DeepComponent from Package C, defines MiddleComponent locally
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./ui/middle': './src/ui/middle/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export { DeepComponent } from '@atlassian/package-c';
				export { MiddleComponent } from './ui/middle';
			`,
			[`${PACKAGE_B_DIR}/src/ui/middle/index.ts`]: outdent`
				export const MiddleComponent = () => null;
			`,

			// Package C - the deepest source package
			[`${PACKAGE_C_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-c',
				exports: {
					'.': './src/index.ts',
					'./ui/deep': './src/ui/deep/index.ts',
				},
			}),
			[`${PACKAGE_C_DIR}/src/index.ts`]: outdent`
				export { DeepComponent } from './ui/deep';
			`,
			[`${PACKAGE_C_DIR}/src/ui/deep/index.ts`]: outdent`
				export const DeepComponent = () => null;
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - nested cross-package re-exports (A -> B -> C)',
			fsWithNestedCrossPackageReexport,
			{
				valid: [
					// Already importing from the deepest source
					{
						code: `import { DeepComponent } from '@atlassian/package-c/ui/deep';`,
						filename: TEST_FILE,
					},
					// Already importing from the middle package's subpath
					{
						code: `import { MiddleComponent } from '@atlassian/package-b/ui/middle';`,
						filename: TEST_FILE,
					},
				],
				invalid: [
					// Nested re-export (A -> B -> C): should trace all the way to package-c's subpath
					{
						code: `import { DeepComponent } from '@atlassian/package-a';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { DeepComponent } from '@atlassian/package-c/ui/deep';`,
					},
					// Re-export that stops at B (A -> B): should use package-b's subpath
					{
						code: `import { MiddleComponent } from '@atlassian/package-a';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { MiddleComponent } from '@atlassian/package-b/ui/middle';`,
					},
					// Mixed: one goes to C, one stops at B
					{
						code: `import { DeepComponent, MiddleComponent } from '@atlassian/package-a';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { DeepComponent } from '@atlassian/package-c/ui/deep';
							import { MiddleComponent } from '@atlassian/package-b/ui/middle';
						`,
					},
					// Import from B that can be traced to C
					{
						code: `import { DeepComponent } from '@atlassian/package-b';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { DeepComponent } from '@atlassian/package-c/ui/deep';`,
					},
					// Import from B that stays in B
					{
						code: `import { MiddleComponent } from '@atlassian/package-b';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { MiddleComponent } from '@atlassian/package-b/ui/middle';`,
					},
					// Import from C's barrel that can use more specific subpath
					{
						code: `import { DeepComponent } from '@atlassian/package-c';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { DeepComponent } from '@atlassian/package-c/ui/deep';`,
					},
				],
			},
		);

		// Test cross-package re-export from a subpath of package-a
		const fsWithSubpathCrossPackageReexport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A - has a subpath that re-exports from Package B
			[`${PACKAGE_A_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
					'./ui': './src/ui/index.ts',
					'./local-utils': './src/local-utils/index.ts',
				},
			}),
			[`${PACKAGE_A_DIR}/src/index.ts`]: outdent`
				export { localHelper } from './local-utils';
			`,
			[`${PACKAGE_A_DIR}/src/ui/index.ts`]: outdent`
				export { SharedButton } from '@atlassian/package-b';
				export { SharedModal } from '@atlassian/package-b';
				export { LocalPanel } from './LocalPanel';
			`,
			[`${PACKAGE_A_DIR}/src/ui/LocalPanel.ts`]: outdent`
				export const LocalPanel = () => null;
			`,
			[`${PACKAGE_A_DIR}/src/local-utils/index.ts`]: outdent`
				export const localHelper = () => {};
			`,

			// Package B - the source package for shared UI components
			[`${PACKAGE_B_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./ui/button': './src/ui/button/index.ts',
					'./ui/modal': './src/ui/modal/index.ts',
				},
			}),
			[`${PACKAGE_B_DIR}/src/index.ts`]: outdent`
				export { SharedButton } from './ui/button';
				export { SharedModal } from './ui/modal';
			`,
			[`${PACKAGE_B_DIR}/src/ui/button/index.ts`]: outdent`
				export const SharedButton = () => null;
			`,
			[`${PACKAGE_B_DIR}/src/ui/modal/index.ts`]: outdent`
				export const SharedModal = () => null;
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - subpath cross-package re-exports',
			fsWithSubpathCrossPackageReexport,
			{
				valid: [
					// Already importing from the source package's subpath
					{
						code: `import { SharedButton } from '@atlassian/package-b/ui/button';`,
						filename: TEST_FILE,
					},
					// Local export from package-a subpath - no cross-package involved
					{
						code: `import { LocalPanel } from '@atlassian/package-a/ui';`,
						filename: TEST_FILE,
					},
				],
				invalid: [
					// Import from package-a subpath that re-exports from package-b
					// Should redirect to package-b's specific subpath
					{
						code: `import { SharedButton } from '@atlassian/package-a/ui';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { SharedButton } from '@atlassian/package-b/ui/button';`,
					},
					// Multiple imports from package-a subpath going to different package-b subpaths
					{
						code: `import { SharedButton, SharedModal } from '@atlassian/package-a/ui';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { SharedButton } from '@atlassian/package-b/ui/button';
							import { SharedModal } from '@atlassian/package-b/ui/modal';
						`,
					},
					// Mixed: cross-package re-export AND local export from the same subpath
					{
						code: `import { SharedButton, LocalPanel } from '@atlassian/package-a/ui';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { SharedButton } from '@atlassian/package-b/ui/button';
							import { LocalPanel } from '@atlassian/package-a/ui';
						`,
					},
					// All three: two cross-package to different subpaths, one local
					{
						code: `import { SharedButton, SharedModal, LocalPanel } from '@atlassian/package-a/ui';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: tabindent`
							import { SharedButton } from '@atlassian/package-b/ui/button';
							import { SharedModal } from '@atlassian/package-b/ui/modal';
							import { LocalPanel } from '@atlassian/package-a/ui';
						`,
					},
				],
			},
		);
	});

	describe('deeply nested barrels with specific exports', () => {
		// Test that the rule traces through multiple levels of nested barrels
		// to find the most specific export path available
		const fsWithDeeplyNestedBarrels = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-instrumentation',
				exports: {
					'.': './src/index.ts',
					'./controllers': './src/controllers/index.ts',
					'./controllers/analytics': './src/controllers/analytics/index.tsx',
					// The most specific export points directly to the source file
					'./hooks/useAnalytics': './src/controllers/analytics/useAnalytics.ts',
				},
			}),

			// Main barrel re-exports from controllers barrel
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { useAnalytics } from './controllers';
			`,

			// Controllers barrel re-exports from analytics barrel
			[`${TEST_PACKAGE_DIR}/src/controllers/index.ts`]: outdent`
				export { useAnalytics } from './analytics';
			`,

			// Analytics barrel re-exports from the actual source file
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/index.tsx`]: outdent`
				export { useAnalytics } from './useAnalytics';
			`,

			// Actual source file - this is what ./hooks/useAnalytics points to
			[`${TEST_PACKAGE_DIR}/src/controllers/analytics/useAnalytics.ts`]: outdent`
				export const useAnalytics = () => {
					return { sendEvent: () => {} };
				};
			`,
		});

		runWithFs(
			'no-barrel-entry-imports - deeply nested barrels with specific exports',
			fsWithDeeplyNestedBarrels,
			{
				valid: [
					// Already using the most specific export
					{
						code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/hooks/useAnalytics';`,
						filename: TEST_FILE,
					},
				],
				invalid: [
					// Should trace through all nested barrels to find the most specific export
					// index.ts -> controllers/index.ts -> analytics/index.tsx -> useAnalytics.ts
					// The most specific export is ./hooks/useAnalytics which points to useAnalytics.ts
					{
						code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/hooks/useAnalytics';`,
					},
					// Same for importing from the controllers barrel
					{
						code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/hooks/useAnalytics';`,
					},
					// Same for importing from the analytics barrel
					{
						code: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/controllers/analytics';`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { useAnalytics } from '@atlassian/conversation-assistant-instrumentation/hooks/useAnalytics';`,
					},
				],
			},
		);
	});

	describe('entry-point wrapper files', () => {
		// When exports map to thin wrapper files in an entry-points/ folder that
		// re-export from the actual source, the rule should still detect barrel
		// imports and produce the correct fix.
		const fsWithEntryPointWrappers = createMockFileSystem({
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: TEST_PACKAGE_NAME,
				exports: {
					'.': './src/index.ts',
					'./dropdown-menu': './src/entry-points/dropdown-menu.ts',
					'./dropdown-menu-item': './src/entry-points/dropdown-menu-item.ts',
					'./dropdown-menu-item-group': './src/entry-points/dropdown-menu-item-group.ts',
					'./types': './src/entry-points/types.ts',
				},
			}),

			// Barrel file re-exports directly from source files
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { default } from './dropdown-menu';
				export { default as DropdownItemGroup } from './dropdown-menu-item-group';
				export { default as DropdownItem } from './dropdown-menu-item';
				export type { DropdownMenuProps } from './types';
			`,

			// Actual source files
			[`${TEST_PACKAGE_DIR}/src/dropdown-menu.ts`]: outdent`
				const DropdownMenu = () => null;
				export default DropdownMenu;
			`,
			[`${TEST_PACKAGE_DIR}/src/dropdown-menu-item.ts`]: outdent`
				const DropdownItem = () => null;
				export default DropdownItem;
			`,
			[`${TEST_PACKAGE_DIR}/src/dropdown-menu-item-group.ts`]: outdent`
				const DropdownItemGroup = () => null;
				export default DropdownItemGroup;
			`,
			[`${TEST_PACKAGE_DIR}/src/types.ts`]: outdent`
				export interface DropdownMenuProps { placement?: string; }
			`,

			// Entry-point wrapper files that re-export from the source
			[`${TEST_PACKAGE_DIR}/src/entry-points/dropdown-menu.ts`]: outdent`
				export { default } from '../dropdown-menu';
			`,
			[`${TEST_PACKAGE_DIR}/src/entry-points/dropdown-menu-item.ts`]: outdent`
				export { default as DropdownItem } from '../dropdown-menu-item';
			`,
			[`${TEST_PACKAGE_DIR}/src/entry-points/dropdown-menu-item-group.ts`]: outdent`
				export { default as DropdownItemGroup } from '../dropdown-menu-item-group';
			`,
			[`${TEST_PACKAGE_DIR}/src/entry-points/types.ts`]: outdent`
				export type { DropdownMenuProps } from '../types';
			`,
		});

		runWithFs('no-barrel-entry-imports - entry-point wrapper files', fsWithEntryPointWrappers, {
			valid: [
				// Already using a specific entry-point import
				{
					code: `import DropdownItem from '${TEST_PACKAGE_NAME}/dropdown-menu-item';`,
					filename: TEST_FILE,
				},
			],
			invalid: [
				// Named import of a default-as-named re-export through entry-point wrapper
				// Entry-point: `export { default as DropdownItem }` → consumer uses named import
				{
					code: `import { DropdownItem } from '${TEST_PACKAGE_NAME}';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import { DropdownItem } from '${TEST_PACKAGE_NAME}/dropdown-menu-item';`,
				},
				// Multiple named imports, each going through different entry-point wrappers
				{
					code: `import { DropdownItem, DropdownItemGroup } from '${TEST_PACKAGE_NAME}';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
							import { DropdownItem } from '${TEST_PACKAGE_NAME}/dropdown-menu-item';
							import { DropdownItemGroup } from '${TEST_PACKAGE_NAME}/dropdown-menu-item-group';
						`,
				},
				// Default import through entry-point wrapper
				// Entry-point: `export { default }` → consumer uses default import
				{
					code: `import DropdownMenu from '${TEST_PACKAGE_NAME}';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import DropdownMenu from '${TEST_PACKAGE_NAME}/dropdown-menu';`,
				},
				// Type import through entry-point wrapper
				{
					code: `import type { DropdownMenuProps } from '${TEST_PACKAGE_NAME}';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: `import type { DropdownMenuProps } from '${TEST_PACKAGE_NAME}/types';`,
				},
				// Mixed default and named imports through entry-point wrappers
				{
					code: `import DropdownMenu, { DropdownItem, DropdownItemGroup } from '${TEST_PACKAGE_NAME}';`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryImport' }],
					output: tabindent`
							import DropdownMenu from '${TEST_PACKAGE_NAME}/dropdown-menu';
							import { DropdownItem } from '${TEST_PACKAGE_NAME}/dropdown-menu-item';
							import { DropdownItemGroup } from '${TEST_PACKAGE_NAME}/dropdown-menu-item-group';
						`,
				},
			],
		});
	});

	describe('applyToImportsFrom option', () => {
		// Test: package in target folder is checked (default behavior)
		// Each test uses a fresh file system to avoid cache issues
		const createFsForTargetTest = () =>
			createMockFileSystem({
				// Git config for workspace detection
				[`${WORKSPACE_ROOT}/.git/config`]: '',
				// Package in ai-mate folder (default target)
				[`${AI_MATE_DIR}/package-in-target/package.json`]: JSON.stringify({
					name: '@atlassian/package-in-target',
					exports: {
						'.': './src/index.ts',
						'./specific': './src/specific.ts',
					},
				}),
				[`${AI_MATE_DIR}/package-in-target/src/index.ts`]: outdent`
					export { helper } from './specific';
				`,
				[`${AI_MATE_DIR}/package-in-target/src/specific.ts`]: outdent`
					export const helper = () => 'helper';
				`,
				// Consumer file
				[`${AI_MATE_DIR}/consumer/src/test.ts`]: '',
			});

		runWithFs(
			'no-barrel-entry-imports - applyToImportsFrom default behavior',
			createFsForTargetTest(),
			{
				valid: [],
				invalid: [
					// Package in default target folder is checked
					{
						code: `import { helper } from '@atlassian/package-in-target';`,
						filename: `${AI_MATE_DIR}/consumer/src/test.ts`,
						errors: [{ messageId: 'barrelEntryImport' }],
						output: `import { helper } from '@atlassian/package-in-target/specific';`,
					},
				],
			},
		);

		// Test: empty applyToImportsFrom means no packages are checked
		runWithFs(
			'no-barrel-entry-imports - empty applyToImportsFrom skips all packages',
			createFsForTargetTest(),
			{
				valid: [
					{
						code: `import { helper } from '@atlassian/package-in-target';`,
						filename: `${AI_MATE_DIR}/consumer/src/test.ts`,
						options: [{ applyToImportsFrom: [] }],
					},
				],
				invalid: [],
			},
		);

		// Test: package is ignored when applyToImportsFrom doesn't include its folder
		runWithFs(
			'no-barrel-entry-imports - applyToImportsFrom excludes package folder',
			createFsForTargetTest(),
			{
				valid: [
					// Package in ai-mate is ignored when applyToImportsFrom only includes a different folder
					{
						code: `import { helper } from '@atlassian/package-in-target';`,
						filename: `${AI_MATE_DIR}/consumer/src/test.ts`,
						options: [{ applyToImportsFrom: ['platform/packages/other-folder'] }],
					},
				],
				invalid: [],
			},
		);
	});
});
