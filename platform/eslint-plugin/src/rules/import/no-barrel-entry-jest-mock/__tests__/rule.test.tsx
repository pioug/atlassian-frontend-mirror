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
const TEST_PACKAGE_DIR = `${AI_MATE_DIR}/conversation-assistant-store`;
const TEST_FILE = `${AI_MATE_DIR}/some-consumer/src/test.test.tsx`;

/**
 * Creates a standard mock file system for testing the rule.
 * Sets up a typical package structure with barrel file and specific exports.
 * This mirrors the example from the task description.
 */
function createStandardMockFs(): FileSystem {
	return createMockFileSystem({
		// Workspace markers
		[`${WORKSPACE_ROOT}/package.json`]: '{}',
		[`${WORKSPACE_ROOT}/yarn.lock`]: '',
		[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

		// Package.json with exports
		[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
			name: '@atlassian/conversation-assistant-store',
			exports: {
				'.': './src/index.ts',
				'./controllers/chat/types': './src/controllers/chat/types.ts',
				'./controllers/chat/use-chat-messages': './src/controllers/chat/use-chat-messages/index.ts',
				'./controllers/chat': './src/controllers/chat/index.ts',
				'./controllers/chat-context': './src/controllers/chat-context/index.tsx',
				'./controllers/chat-context/store': './src/controllers/chat-context/store/index.tsx',
				'./controllers/chat-signals': './src/controllers/chat-signals/index.ts',
				'./controllers/current-action-auth': './src/controllers/current-action-auth/index.ts',
				'./controllers/drafts': './src/controllers/drafts/index.ts',
				'./controllers/message-feedback': './src/controllers/message-feedback/index.ts',
				'./controllers/profile': './src/controllers/profile/index.ts',
				'./controllers/profile/types': './src/controllers/profile/types.ts',
				'./controllers/staging-area': './src/controllers/staging-area/index.ts',
				'./controllers/ui-store': './src/controllers/ui-store/index.ts',
				'./controllers/user-preferences': './src/controllers/user-preferences/index.ts',
				'./controllers/user-preferences/types': './src/controllers/user-preferences/types.ts',
				'./services/sync-service/main': './src/services/sync-service/main.ts',
			},
		}),

		// Barrel file (index.ts) - re-exports from various files
		[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
			export { createChatStore, EMPTY_CONVERSATION_ID } from './controllers/chat';

			export {
				useChatContextStoreActions,
				useChatContextEditorContext,
			} from './controllers/chat-context/store';

			export {
				useStagingAreaState,
				useStagingAreaActions,
				useStagingArea,
			} from './controllers/staging-area';

			export { useUIStore } from './controllers/ui-store';
		`,

		// Chat controller (source file for createChatStore, EMPTY_CONVERSATION_ID)
		[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
			export const EMPTY_CONVERSATION_ID = 'empty-conversation-id';
			export const createChatStore = () => ({});
		`,

		// Chat context store (source file for useChatContextStoreActions, etc.)
		[`${TEST_PACKAGE_DIR}/src/controllers/chat-context/store/index.tsx`]: outdent`
			export const useChatContextStoreActions = () => ({});
			export const useChatContextEditorContext = () => ({});
		`,

		// Staging area controller (source file for useStagingArea, etc.)
		[`${TEST_PACKAGE_DIR}/src/controllers/staging-area/index.ts`]: outdent`
			export const useStagingAreaState = () => ({});
			export const useStagingAreaActions = () => ({});
			export const useStagingArea = () => ({});
		`,

		// UI Store controller
		[`${TEST_PACKAGE_DIR}/src/controllers/ui-store/index.ts`]: outdent`
			export const useUIStore = () => ({});
		`,
	});
}

/**
 * Test suite for the no-barrel-entry-jest-mock rule.
 */
describe('no-barrel-entry-jest-mock', () => {
	describe('valid cases - should not report', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - valid', fs, {
			valid: [
				// Already using specific import path
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							EMPTY_CONVERSATION_ID: 'test-id',
						}));
					`,
					filename: TEST_FILE,
				},
				// Relative imports are ignored
				{
					code: outdent`
						jest.mock('./local-module', () => ({
							something: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
				},
				// Package not in ai-mate folder is ignored
				{
					code: outdent`
						jest.mock('@atlaskit/button', () => ({
							Button: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
				},
				// Auto-mock without implementation on specific path
				{
					code: `jest.mock('@atlassian/conversation-assistant-store/controllers/chat');`,
					filename: TEST_FILE,
				},
				// Auto-mock without implementation on barrel file entry point - should be ignored
				{
					code: `jest.mock('@atlassian/conversation-assistant-store');`,
					filename: TEST_FILE,
				},
				// Mock of non-barrel subpath export
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							createChatStore: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('basic barrel mock detection - single symbol', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - single symbol', fs, {
			valid: [],
			invalid: [
				// Single mock that should be redirected to specific export
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('example scenario from task - multiple symbols from different sources', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - example scenario', fs, {
			valid: [],
			invalid: [
				// The exact example from the task description
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							useChatContextStoreActions: jest.fn(),
							useStagingArea: jest.fn(),
							EMPTY_CONVERSATION_ID: 'empty-conversation-id',
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/controllers/staging-area', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area'),
							useStagingArea: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							EMPTY_CONVERSATION_ID: 'empty-conversation-id',
						}));
					`,
				},
			],
		});
	});

	describe('multiple symbols from same source file', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - same source', fs, {
			valid: [],
			invalid: [
				// Multiple symbols that come from the same source file
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							useStagingAreaState: jest.fn(),
							useStagingAreaActions: jest.fn(),
							useStagingArea: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/staging-area', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area'),
							useStagingAreaState: jest.fn(),
							useStagingAreaActions: jest.fn(),
							useStagingArea: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('mock without jest.requireActual spread', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - no requireActual', fs, {
			valid: [],
			invalid: [
				// Mock without jest.requireActual spread should still add it in fix
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							useChatContextStoreActions: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('double quotes', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - double quotes', fs, {
			valid: [],
			invalid: [
				// Should preserve double quotes in the fix
				{
					code: outdent`
						jest.mock("@atlassian/conversation-assistant-store", () => ({
							...jest.requireActual("@atlassian/conversation-assistant-store"),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock("@atlassian/conversation-assistant-store/controllers/chat-context/store", () => ({
							...jest.requireActual("@atlassian/conversation-assistant-store/controllers/chat-context/store"),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('mixed mapped and unmapped symbols', () => {
		// Create a file system with a symbol that doesn't have a matching export
		const fsWithUnmappedSymbol = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports - note: no export for internal-only
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
					// No export for internal-only
				},
			}),

			// Barrel file - re-exports from various files including internal-only
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { EMPTY_CONVERSATION_ID } from './controllers/chat';
				export { internalOnlyFunction } from './internal-only';
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const EMPTY_CONVERSATION_ID = 'empty-conversation-id';
			`,

			// Internal only module (no package.json export)
			[`${TEST_PACKAGE_DIR}/src/internal-only/index.ts`]: outdent`
				export const internalOnlyFunction = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - mixed mapped/unmapped', fsWithUnmappedSymbol, {
			valid: [],
			invalid: [
				// Some symbols can be remapped, some stay in original
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							EMPTY_CONVERSATION_ID: 'test-id',
							internalOnlyFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							EMPTY_CONVERSATION_ID: 'test-id',
						}));
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							internalOnlyFunction: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('non-barrel entry point - source file with original exports', () => {
		// Create a file system where the entry point is NOT a barrel file
		const fsWithNonBarrelEntry = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
				},
			}),

			// Entry file that defines exports directly (NOT a barrel file)
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export const myFunction = () => {};
				export const myConstant = 'value';
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - non-barrel entry', fsWithNonBarrelEntry, {
			valid: [
				// Should NOT report because the entry point is not a barrel file
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							myFunction: jest.fn(),
							myConstant: 'test-value',
						}));
					`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('subpath import that is already specific', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - subpath already specific', fs, {
			valid: [
				// Subpath import that points directly to source - should not report
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/staging-area', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area'),
							useStagingArea: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('nested barrel files - deep re-exports', () => {
		// Create a file system with nested barrel files
		const fsWithNestedBarrels = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
					'./utils/helpers': './src/utils/helpers.ts',
				},
			}),

			// Top-level barrel that re-exports from nested barrel
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { createChatStore, EMPTY_CONVERSATION_ID } from './controllers/chat';
				export { helperFunction } from './utils/helpers';
			`,

			// Nested barrel that re-exports from actual source
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export { createChatStore } from './store';
				export { EMPTY_CONVERSATION_ID } from './constants';
			`,

			// Actual source files
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/store.ts`]: outdent`
				export const createChatStore = () => ({});
			`,

			[`${TEST_PACKAGE_DIR}/src/controllers/chat/constants.ts`]: outdent`
				export const EMPTY_CONVERSATION_ID = 'empty';
			`,

			[`${TEST_PACKAGE_DIR}/src/utils/helpers.ts`]: outdent`
				export const helperFunction = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - nested barrels', fsWithNestedBarrels, {
			valid: [],
			invalid: [
				// Should trace through nested barrels to find exports
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							createChatStore: jest.fn(),
							helperFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/utils/helpers', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/utils/helpers'),
							helperFunction: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('function expression mock factory', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - function expression', fs, {
			valid: [],
			invalid: [
				// Mock using function expression instead of arrow function
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', function() {
							return {
								useChatContextStoreActions: jest.fn(),
							};
						});
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('block body arrow function', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - block body arrow', fs, {
			valid: [],
			invalid: [
				// Mock using arrow function with block body and return
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => {
							return {
								useChatContextStoreActions: jest.fn(),
							};
						});
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('aliased exports - barrel file re-exports with alias', () => {
		// Create a file system with aliased re-exports in barrel file
		const fsWithAliasedExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
					'./controllers/profile': './src/controllers/profile/index.ts',
				},
			}),

			// Barrel file with aliased exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				// Named export with alias
				export { originalChatFunction as renamedChatFunction } from './controllers/chat';
				// Default export re-exported as named export
				export { default as ProfileController } from './controllers/profile';
			`,

			// Chat controller with original named export
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const originalChatFunction = () => ({});
			`,

			// Profile controller with default export
			[`${TEST_PACKAGE_DIR}/src/controllers/profile/index.ts`]: outdent`
				const ProfileController = { init: () => {} };
				export default ProfileController;
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - aliased named export', fsWithAliasedExports, {
			valid: [],
			invalid: [
				// Mock using aliased name should use original name in target mock
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							renamedChatFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							originalChatFunction: jest.fn(),
						}));
					`,
				},
				// Mock using default-to-named alias should use 'default' in target mock with __esModule: true
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							ProfileController: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/profile', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/profile'),
							__esModule: true,
							default: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('default export mocking - includes __esModule: true', () => {
		// Create a file system with a default export re-exported as default
		const fsWithDefaultExport = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/profile': './src/controllers/profile/index.ts',
				},
			}),

			// Barrel file that re-exports default as named
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { default as ProfileController } from './controllers/profile';
			`,

			// Profile controller with default export
			[`${TEST_PACKAGE_DIR}/src/controllers/profile/index.ts`]: outdent`
				const ProfileController = { init: () => {} };
				export default ProfileController;
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - default export', fsWithDefaultExport, {
			valid: [],
			invalid: [
				// Mock of default export should include __esModule: true
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							ProfileController: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/profile', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/profile'),
							__esModule: true,
							default: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('preamble code cleanup - unused constants removed', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - preamble cleanup', fs, {
			valid: [],
			invalid: [
				// Mock with preamble code that is only used by some symbols
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => {
							const mockFn = jest.fn();
							const unusedConstant = 'not-used';
							const anotherUnused = { foo: 'bar' };
							return {
								...jest.requireActual('@atlassian/conversation-assistant-store'),
								useChatContextStoreActions: mockFn,
								useStagingArea: jest.fn(),
							};
						});
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => {
							const mockFn = jest.fn();
							return {
								...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
								useChatContextStoreActions: mockFn,
							};
						});
						jest.mock('@atlassian/conversation-assistant-store/controllers/staging-area', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area'),
							useStagingArea: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('Object.assign unwrapping', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - Object.assign', fs, {
			valid: [],
			invalid: [
				// Mock using Object.assign should be simplified
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () =>
							Object.assign({}, jest.requireActual('@atlassian/conversation-assistant-store'), {
								useChatContextStoreActions: jest.fn(),
								useStagingArea: jest.fn(),
							})
						);
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/controllers/staging-area', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area'),
							useStagingArea: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('star exports - export * from pattern', () => {
		// Create a file system with star exports in barrel file
		const fsWithStarExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
					'./utils/helpers': './src/utils/helpers.ts',
				},
			}),

			// Barrel file with star exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export * from './controllers/chat';
				export * from './utils/helpers';
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
				export const EMPTY_CONVERSATION_ID = 'empty';
			`,

			// Helpers
			[`${TEST_PACKAGE_DIR}/src/utils/helpers.ts`]: outdent`
				export const helperFunction = () => {};
				export const anotherHelper = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - star exports', fsWithStarExports, {
			valid: [],
			invalid: [
				// Star exports should be traced to their source files
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							createChatStore: jest.fn(),
							helperFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/utils/helpers', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/utils/helpers'),
							helperFunction: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('namespace exports - export * as pattern', () => {
		// Create a file system with namespace exports
		const fsWithNamespaceExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
					'./utils/helpers': './src/utils/helpers.ts',
				},
			}),

			// Barrel file with namespace exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export * as chatUtils from './controllers/chat';
				export { helperFunction } from './utils/helpers';
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
				export const EMPTY_CONVERSATION_ID = 'empty';
			`,

			// Helpers
			[`${TEST_PACKAGE_DIR}/src/utils/helpers.ts`]: outdent`
				export const helperFunction = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - namespace exports', fsWithNamespaceExports, {
			valid: [],
			invalid: [
				// Namespace exports should be traced to their source
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							chatUtils: { createChatStore: jest.fn() },
							helperFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							chatUtils: { createChatStore: jest.fn() },
						}));
						jest.mock('@atlassian/conversation-assistant-store/utils/helpers', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/utils/helpers'),
							helperFunction: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('type-only exports - auto-mock should be ignored', () => {
		// Create a file system with only type exports
		const fsWithTypeOnlyExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./types': './src/types.ts',
				},
			}),

			// Barrel file with only type exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export type { ChatMessage, ChatState } from './types';
				export interface ConversationConfig {}
			`,

			// Types file
			[`${TEST_PACKAGE_DIR}/src/types.ts`]: outdent`
				export type ChatMessage = { id: string; content: string };
				export type ChatState = { messages: ChatMessage[] };
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - type-only exports', fsWithTypeOnlyExports, {
			valid: [
				// Auto-mocks are always ignored - they don't have mock implementations to split
				{
					code: `jest.mock('@atlassian/conversation-assistant-store');`,
					filename: TEST_FILE,
				},
			],
			invalid: [],
		});
	});

	describe('enum exports', () => {
		// Create a file system with enum exports
		const fsWithEnumExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./enums': './src/enums.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
				},
			}),

			// Barrel file with enum re-exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { MessageStatus, ConversationState } from './enums';
				export { createChatStore } from './controllers/chat';
			`,

			// Enums file
			[`${TEST_PACKAGE_DIR}/src/enums.ts`]: outdent`
				export enum MessageStatus { PENDING, SENT, DELIVERED }
				export enum ConversationState { IDLE, LOADING, ERROR }
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - enum exports', fsWithEnumExports, {
			valid: [],
			invalid: [
				// Enum exports should be traced to their source
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							MessageStatus: { PENDING: 0, SENT: 1 },
							createChatStore: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/enums', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/enums'),
							MessageStatus: { PENDING: 0, SENT: 1 },
						}));
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('class exports', () => {
		// Create a file system with class exports
		const fsWithClassExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./classes': './src/classes.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
				},
			}),

			// Barrel file with class re-exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { ChatManager, MessageHandler } from './classes';
				export { createChatStore } from './controllers/chat';
			`,

			// Classes file
			[`${TEST_PACKAGE_DIR}/src/classes.ts`]: outdent`
				export class ChatManager {}
				export class MessageHandler {}
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - class exports', fsWithClassExports, {
			valid: [],
			invalid: [
				// Class exports should be traced to their source
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							ChatManager: jest.fn(),
							createChatStore: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/classes', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/classes'),
							ChatManager: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('interface exports - should be filtered out', () => {
		// Create a file system with interface exports mixed with runtime
		const fsWithInterfaceExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
				},
			}),

			// Barrel file with interface + runtime exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export interface ChatConfig {}
				export { createChatStore } from './controllers/chat';
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - interface exports', fsWithInterfaceExports, {
			valid: [],
			invalid: [
				// Interface exports should be ignored, only runtime exports mocked
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							createChatStore: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('mixed type and runtime exports', () => {
		// Create a file system with mixed type and runtime exports
		const fsWithMixedTypeRuntimeExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./types': './src/types.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
				},
			}),

			// Barrel file with mixed type and runtime exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export type { ChatMessage } from './types';
				export { createChatStore, EMPTY_CONVERSATION_ID } from './controllers/chat';
			`,

			// Types file
			[`${TEST_PACKAGE_DIR}/src/types.ts`]: outdent`
				export type ChatMessage = { id: string; content: string };
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
				export const EMPTY_CONVERSATION_ID = 'empty';
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - mixed type runtime', fsWithMixedTypeRuntimeExports, {
			valid: [],
			invalid: [
				// Type exports should be filtered out, only runtime exports should be in the fix
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							createChatStore: jest.fn(),
							EMPTY_CONVERSATION_ID: 'test-id',
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
							EMPTY_CONVERSATION_ID: 'test-id',
						}));
					`,
				},
			],
		});
	});

	describe('mixed local definitions and re-exports', () => {
		// Create a file system with local definitions mixed with re-exports
		const fsWithMixedLocalReexports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
				},
			}),

			// Barrel file with local definitions AND re-exports
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { createChatStore } from './controllers/chat';
				export const LOCAL_CONSTANT = 'local-value';
				export function localHelper() {}
			`,

			// Chat controller
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - mixed local reexports', fsWithMixedLocalReexports, {
			valid: [],
			invalid: [
				// Re-exports should go to specific path, local definitions stay in barrel mock
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							createChatStore: jest.fn(),
							LOCAL_CONSTANT: 'mocked-value',
							localHelper: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							createChatStore: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							LOCAL_CONSTANT: 'mocked-value',
							localHelper: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('preamble dead code removal across split', () => {
		// Create a file system for testing preamble variable isolation
		const fsForPreambleDeadCode = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./analytics': './src/analytics/index.ts',
					'./events': './src/events/index.ts',
				},
			}),

			// Barrel file
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { useAnalytics } from './analytics';
				export { onShowMoreClicked, onShowAllClicked } from './events';
			`,

			// Analytics
			[`${TEST_PACKAGE_DIR}/src/analytics/index.ts`]: outdent`
				export function useAnalytics() {}
			`,

			// Events
			[`${TEST_PACKAGE_DIR}/src/events/index.ts`]: outdent`
				export function onShowMoreClicked() {}
				export function onShowAllClicked() {}
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - preamble dead code', fsForPreambleDeadCode, {
			valid: [],
			invalid: [
				// Preamble variables should only be included in mocks that use them
				{
					code: tabindent`
						jest.mock('@atlassian/conversation-assistant-store', () => {
							const fireAnalyticsEvent = jest.fn();

							return Object.assign({}, jest.requireActual('@atlassian/conversation-assistant-store'), {
								useAnalytics: () => ({
									fireAnalyticsEvent,
								}),
								onShowMoreClicked: jest.fn(),
								onShowAllClicked: jest.fn(),
							});
						});
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					// fireAnalyticsEvent should only be in analytics mock, not events mock
					output: tabindent`
						jest.mock('@atlassian/conversation-assistant-store/analytics', () => {
							const fireAnalyticsEvent = jest.fn();
							return {
								...jest.requireActual('@atlassian/conversation-assistant-store/analytics'),
								useAnalytics: () => ({
									fireAnalyticsEvent,
								}),
							};
						});
						jest.mock('@atlassian/conversation-assistant-store/events', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/events'),
							onShowMoreClicked: jest.fn(),
							onShowAllClicked: jest.fn(),
						}));
					`,
				},
			],
		});
	});

	describe('pre-existing mock merge', () => {
		// Create a file system for testing merge with existing mock
		const fsForMerge = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports
			[`${TEST_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-store',
				exports: {
					'.': './src/index.ts',
					'./controllers/chat': './src/controllers/chat/index.ts',
					'./utils/helpers': './src/utils/helpers.ts',
				},
			}),

			// Barrel file
			[`${TEST_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { createChatStore, updateChat } from './controllers/chat';
				export { helperFunction } from './utils/helpers';
			`,

			// Chat controller - has more exports than what's in barrel
			[`${TEST_PACKAGE_DIR}/src/controllers/chat/index.ts`]: outdent`
				export const createChatStore = () => ({});
				export const updateChat = () => ({});
				export const deleteChat = () => ({});
			`,

			// Helpers
			[`${TEST_PACKAGE_DIR}/src/utils/helpers.ts`]: outdent`
				export const helperFunction = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - pre-existing mock merge', fsForMerge, {
			valid: [],
			invalid: [
				// When there's already a mock for the target path, merge into it
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							deleteChat: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							createChatStore: jest.fn(),
							updateChat: jest.fn(),
							helperFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					// createChatStore and updateChat should merge into existing chat mock
					// requireActual is always included for safety
					output:
						tabindent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat'),
							deleteChat: jest.fn(),
							createChatStore: jest.fn(),
							updateChat: jest.fn(),
						}));
						jest.mock('@atlassian/conversation-assistant-store/utils/helpers', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/utils/helpers'),
							helperFunction: jest.fn(),
						}));
					` + '\n',
				},
			],
		});
	});

	describe('multiple package.json exports mapping to same source file', () => {
		// Create a file system with multiple export paths pointing to the same source file
		// This mimics the conversation-assistant-agent package structure where:
		// ./ui/BrowseAgentsModal, ./ui/BrowseAgentsSidebar, and ./ui/BrowseAgentsSidebarModal
		// all map to the same ./src/ui/browse-agents/index.tsx file
		const fsWithMultipleExportsToSameFile = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Different package for this test
			[`${AI_MATE_DIR}/conversation-assistant-agent/package.json`]: JSON.stringify({
				name: '@atlassian/conversation-assistant-agent',
				exports: {
					'.': './src/index.ts',
					'./ui/BrowseAgentsModal': './src/ui/browse-agents/index.tsx',
					'./ui/BrowseAgentsSidebar': './src/ui/browse-agents/index.tsx',
					'./ui/BrowseAgentsSidebarModal': './src/ui/browse-agents/index.tsx',
				},
			}),

			// Main barrel file
			[`${AI_MATE_DIR}/conversation-assistant-agent/src/index.ts`]: outdent`
				export { BrowseAgentsFullscreen, BrowseAgentsModal, BrowseAgentsSidebar } from './ui/browse-agents';
			`,

			// The actual source file that all three exports point to
			[`${AI_MATE_DIR}/conversation-assistant-agent/src/ui/browse-agents/index.tsx`]: outdent`
				export const BrowseAgentsFullscreen = () => null;
				export const BrowseAgentsModal = () => null;
				export const BrowseAgentsSidebar = () => null;
			`,
		});

		const testFileInAgent = `${AI_MATE_DIR}/some-consumer/src/test.test.tsx`;

		runWithFs(
			'no-barrel-entry-jest-mock - multiple exports to same file - valid subpath',
			fsWithMultipleExportsToSameFile,
			{
				valid: [
					// Already using a valid subpath export that points to the source file
					// Should NOT change to a different subpath even though multiple exist
					{
						code: outdent`
							jest.mock('@atlassian/conversation-assistant-agent/ui/BrowseAgentsSidebar', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-agent/ui/BrowseAgentsSidebar'),
								BrowseAgentsFullscreen: jest.fn(),
							}));
						`,
						filename: testFileInAgent,
					},
					// Same test with BrowseAgentsModal subpath
					{
						code: outdent`
							jest.mock('@atlassian/conversation-assistant-agent/ui/BrowseAgentsModal', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-agent/ui/BrowseAgentsModal'),
								BrowseAgentsFullscreen: jest.fn(),
							}));
						`,
						filename: testFileInAgent,
					},
					// Same test with BrowseAgentsSidebarModal subpath
					{
						code: outdent`
							jest.mock('@atlassian/conversation-assistant-agent/ui/BrowseAgentsSidebarModal', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-agent/ui/BrowseAgentsSidebarModal'),
								BrowseAgentsSidebar: jest.fn(),
							}));
						`,
						filename: testFileInAgent,
					},
				],
				invalid: [],
			},
		);

		runWithFs(
			'no-barrel-entry-jest-mock - multiple exports to same file - barrel entry still reports',
			fsWithMultipleExportsToSameFile,
			{
				valid: [],
				invalid: [
					// Mocking the main barrel entry point should still report and suggest a subpath
					// Note: The exact subpath chosen may depend on iteration order of the exports map
					{
						code: outdent`
							jest.mock('@atlassian/conversation-assistant-agent', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-agent'),
								BrowseAgentsFullscreen: jest.fn(),
							}));
						`,
						filename: testFileInAgent,
						errors: [{ messageId: 'barrelEntryMock' }],
						// We expect it to pick one of the valid subpaths (the first one it finds)
						output: outdent`
							jest.mock('@atlassian/conversation-assistant-agent/ui/BrowseAgentsModal', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-agent/ui/BrowseAgentsModal'),
								BrowseAgentsFullscreen: jest.fn(),
							}));
						`,
					},
				],
			},
		);
	});

	describe('duplicate exports to same barrel file - no valid subpath for symbol', () => {
		// Create a file system where "." and "./src" both point to the same barrel file,
		// and the mocked symbol comes from a source file with no dedicated export
		// This mimics the @atlassian/rovo-content-bridge-api package structure
		const fsWithDuplicateExportsToBarrel = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package where "." and "./src" both point to the same barrel file
			[`${AI_MATE_DIR}/rovo-content-bridge-api/package.json`]: JSON.stringify({
				name: '@atlassian/rovo-content-bridge-api',
				exports: {
					'.': './src/index.ts',
					'./src': './src/index.ts', // Both point to the same file!
					'./hooks': './src/hooks/rovo-bridge-api-hooks.ts',
					'./client': './src/create-rovo-bridge-api-client.ts',
				},
			}),

			// Main barrel file
			[`${AI_MATE_DIR}/rovo-content-bridge-api/src/index.ts`]: outdent`
				export { createRovoBridgeAPIClient } from './create-rovo-bridge-api-client';
				export { getBrowserBridgeAPI, destroyBridgeAPI } from './rovo-bridge-api-singleton';
				export { useRovoBridgeAPI } from './hooks/rovo-bridge-api-hooks';
			`,

			// Source files
			[`${AI_MATE_DIR}/rovo-content-bridge-api/src/create-rovo-bridge-api-client.ts`]: outdent`
				export const createRovoBridgeAPIClient = () => ({});
			`,

			// This file has NO corresponding package.json export!
			[`${AI_MATE_DIR}/rovo-content-bridge-api/src/rovo-bridge-api-singleton.ts`]: outdent`
				export const getBrowserBridgeAPI = () => ({});
				export const destroyBridgeAPI = () => {};
			`,

			[`${AI_MATE_DIR}/rovo-content-bridge-api/src/hooks/rovo-bridge-api-hooks.ts`]: outdent`
				export const useRovoBridgeAPI = () => ({});
			`,
		});

		const testFileInBridgeApi = `${AI_MATE_DIR}/some-consumer/src/test.test.tsx`;

		runWithFs(
			'no-barrel-entry-jest-mock - duplicate exports to barrel - no valid subpath',
			fsWithDuplicateExportsToBarrel,
			{
				valid: [
					// When mocking a symbol that has no valid subpath export, should NOT error
					// getBrowserBridgeAPI comes from ./rovo-bridge-api-singleton.ts which has no package.json export
					// Even though "./src" also points to the barrel, it shouldn't be suggested
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: jest.fn(() => mockBridgeAPI),
							}));
						`,
						filename: testFileInBridgeApi,
					},
					// Same with destroyBridgeAPI - no valid subpath
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								destroyBridgeAPI: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
					},
					// Both symbols from the same file with no export - still valid
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: jest.fn(),
								destroyBridgeAPI: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
					},
				],
				invalid: [
					// But symbols that DO have a valid subpath should still be flagged
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								createRovoBridgeAPIClient: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api/client', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api/client'),
								createRovoBridgeAPIClient: jest.fn(),
							}));
						`,
					},
					// useRovoBridgeAPI has a valid subpath (./hooks)
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								useRovoBridgeAPI: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api/hooks', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api/hooks'),
								useRovoBridgeAPI: jest.fn(),
							}));
						`,
					},
				],
			},
		);

		runWithFs(
			'no-barrel-entry-jest-mock - duplicate exports to barrel - mixed valid and unmapped',
			fsWithDuplicateExportsToBarrel,
			{
				valid: [],
				invalid: [
					// Mix of symbols: some have valid subpaths, some don't
					// Should split the ones with valid subpaths and keep the rest on the barrel
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: jest.fn(),
								createRovoBridgeAPIClient: jest.fn(),
								useRovoBridgeAPI: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: tabindent`
							jest.mock('@atlassian/rovo-content-bridge-api/client', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api/client'),
								createRovoBridgeAPIClient: jest.fn(),
							}));
							jest.mock('@atlassian/rovo-content-bridge-api/hooks', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api/hooks'),
								useRovoBridgeAPI: jest.fn(),
							}));
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: jest.fn(),
							}));
						`,
					},
				],
			},
		);
	});

	describe('cross-package re-exports', () => {
		// Create a file system with cross-package re-exports
		// Package B has symbols in sub-paths that are re-exported through its main entry
		const fsWithCrossPackage = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A setup - re-exports from Package B's sub-path
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
					'./local': './src/local.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { SomeUtil } from '@atlassian/package-b/utils';
				export { localFunction } from './local';
			`,
			[`${AI_MATE_DIR}/package-a/src/local.ts`]: outdent`
				export const localFunction = () => {};
			`,

			// Package B setup - has sub-path export
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./utils': './src/utils/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export { SomeUtil } from './utils';
			`,
			[`${AI_MATE_DIR}/package-b/src/utils/index.ts`]: outdent`
				export const SomeUtil = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - cross-package basic', fsWithCrossPackage, {
			valid: [],
			invalid: [
				// Basic cross-package re-export: Package A re-exports from Package B's sub-path
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							SomeUtil: jest.fn(),
							localFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/package-b/utils', () => ({
							...jest.requireActual('@atlassian/package-b/utils'),
							SomeUtil: jest.fn(),
						}));
						jest.mock('@atlassian/package-a/local', () => ({
							...jest.requireActual('@atlassian/package-a/local'),
							localFunction: jest.fn(),
						}));
					`,
				},
			],
		});

		// Test cross-package with aliased exports
		// Package B has the symbol in a sub-path, Package A imports directly from sub-path
		const fsWithCrossPackageAliased = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A re-exports with alias from Package B's sub-path
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: { '.': './src/index.ts' },
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { originalUtil as renamedUtil } from '@atlassian/package-b/helpers';
			`,

			// Package B setup - has sub-path export
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./helpers': './src/helpers/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export { originalUtil } from './helpers';
			`,
			[`${AI_MATE_DIR}/package-b/src/helpers/index.ts`]: outdent`
				export const originalUtil = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - cross-package aliased', fsWithCrossPackageAliased, {
			valid: [],
			invalid: [
				// Cross-package with aliased export should use original name in target mock
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							renamedUtil: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/package-b/helpers', () => ({
							...jest.requireActual('@atlassian/package-b/helpers'),
							originalUtil: jest.fn(),
						}));
					`,
				},
			],
		});

		// Test cross-package star exports
		// Package A star re-exports from Package B's sub-path
		const fsWithCrossPackageStarExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A star re-exports from Package B's sub-path
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: { '.': './src/index.ts' },
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export * from '@atlassian/package-b/core';
			`,

			// Package B setup - has sub-path export
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./core': './src/core/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export * from './core';
			`,
			[`${AI_MATE_DIR}/package-b/src/core/index.ts`]: outdent`
				export const utilOne = () => {};
				export const utilTwo = () => {};
			`,
		});

		runWithFs(
			'no-barrel-entry-jest-mock - cross-package star exports',
			fsWithCrossPackageStarExports,
			{
				valid: [],
				invalid: [
					// Cross-package star exports should trace to source package's sub-path
					{
						code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							utilOne: jest.fn(),
							utilTwo: jest.fn(),
						}));
					`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: outdent`
						jest.mock('@atlassian/package-b/core', () => ({
							...jest.requireActual('@atlassian/package-b/core'),
							utilOne: jest.fn(),
							utilTwo: jest.fn(),
						}));
					`,
					},
				],
			},
		);

		// Test cross-package with subpath exports
		const fsWithCrossPackageSubpath = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A re-exports from Package B's subpath
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: { '.': './src/index.ts' },
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { subpathUtil } from '@atlassian/package-b/utils';
			`,

			// Package B setup with subpath export
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./utils': './src/utils.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export const mainExport = () => {};
			`,
			[`${AI_MATE_DIR}/package-b/src/utils.ts`]: outdent`
				export const subpathUtil = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - cross-package subpath', fsWithCrossPackageSubpath, {
			valid: [],
			invalid: [
				// Cross-package with subpath export should use the subpath in the mock
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							subpathUtil: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/package-b/utils', () => ({
							...jest.requireActual('@atlassian/package-b/utils'),
							subpathUtil: jest.fn(),
						}));
					`,
				},
			],
		});

		// Test external package not in target folder should remain unmapped
		const fsWithExternalPackage = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A re-exports from external package (not in ai-mate)
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
					'./local': './src/local.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { externalUtil } from '@atlaskit/external-package';
				export { localFunction } from './local';
			`,
			[`${AI_MATE_DIR}/package-a/src/local.ts`]: outdent`
				export const localFunction = () => {};
			`,
			// Note: @atlaskit/external-package is NOT in the ai-mate folder
		});

		runWithFs('no-barrel-entry-jest-mock - external package unmapped', fsWithExternalPackage, {
			valid: [
				// When all symbols come from external packages, no error should be reported
				// because there's nothing to fix
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							externalUtil: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
				},
			],
			invalid: [
				// Mixed external and local - local should be split, external stays in barrel mock
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							externalUtil: jest.fn(),
							localFunction: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
						jest.mock('@atlassian/package-a/local', () => ({
							...jest.requireActual('@atlassian/package-a/local'),
							localFunction: jest.fn(),
						}));
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							externalUtil: jest.fn(),
						}));
					`,
				},
			],
		});

		// Test nested cross-package chains: A → B → C
		// Each package imports directly from the next package's sub-path
		const fsWithNestedCrossPackage = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A re-exports from Package B's sub-path
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: { '.': './src/index.ts' },
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { deepUtil } from '@atlassian/package-b/utils';
			`,

			// Package B re-exports from Package C's sub-path
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./utils': './src/utils/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export { deepUtil } from './utils';
			`,
			[`${AI_MATE_DIR}/package-b/src/utils/index.ts`]: outdent`
				export { deepUtil } from '@atlassian/package-c/deep';
			`,

			// Package C - has sub-path export with actual source
			[`${AI_MATE_DIR}/package-c/package.json`]: JSON.stringify({
				name: '@atlassian/package-c',
				exports: {
					'.': './src/index.ts',
					'./deep': './src/deep/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-c/src/index.ts`]: outdent`
				export { deepUtil } from './deep';
			`,
			[`${AI_MATE_DIR}/package-c/src/deep/index.ts`]: outdent`
				export const deepUtil = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - nested cross-package chain', fsWithNestedCrossPackage, {
			valid: [],
			invalid: [
				// Should trace through chain A → B → C and suggest mocking Package C's sub-path
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							deepUtil: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/package-c/deep', () => ({
							...jest.requireActual('@atlassian/package-c/deep'),
							deepUtil: jest.fn(),
						}));
					`,
				},
			],
		});

		// Test circular cross-package dependencies should not infinite loop
		// Package A imports from Package B's sub-path, Package B imports from Package A (circular)
		const fsWithCircularCrossPackage = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A re-exports from Package B's sub-path AND has local export
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: { '.': './src/index.ts' },
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { utilB } from '@atlassian/package-b/utils';
				export const utilA = () => {};
			`,

			// Package B re-exports from Package A (circular!) AND has local export in sub-path
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./utils': './src/utils/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export { utilA } from '@atlassian/package-a';
				export { utilB } from './utils';
			`,
			[`${AI_MATE_DIR}/package-b/src/utils/index.ts`]: outdent`
				export const utilB = () => {};
			`,
		});

		runWithFs('no-barrel-entry-jest-mock - circular cross-package', fsWithCircularCrossPackage, {
			valid: [],
			invalid: [
				// Should handle circular dependency without infinite loop
				{
					code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							utilB: jest.fn(),
						}));
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/package-b/utils', () => ({
							...jest.requireActual('@atlassian/package-b/utils'),
							utilB: jest.fn(),
						}));
					`,
				},
			],
		});

		// Test cross-package default export
		// Package A imports default from Package B's sub-path
		const fsWithCrossPackageDefault = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package A re-exports default from Package B's sub-path
			[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: { '.': './src/index.ts' },
			}),
			[`${AI_MATE_DIR}/package-a/src/index.ts`]: outdent`
				export { default as DefaultComponent } from '@atlassian/package-b/components';
			`,

			// Package B with default export in sub-path
			[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
				name: '@atlassian/package-b',
				exports: {
					'.': './src/index.ts',
					'./components': './src/components/index.ts',
				},
			}),
			[`${AI_MATE_DIR}/package-b/src/index.ts`]: outdent`
				export { default } from './components';
			`,
			[`${AI_MATE_DIR}/package-b/src/components/index.ts`]: outdent`
				const DefaultComponent = () => null;
				export default DefaultComponent;
			`,
		});

		runWithFs(
			'no-barrel-entry-jest-mock - cross-package default export',
			fsWithCrossPackageDefault,
			{
				valid: [],
				invalid: [
					// Cross-package default export should include __esModule: true
					{
						code: outdent`
						jest.mock('@atlassian/package-a', () => ({
							...jest.requireActual('@atlassian/package-a'),
							DefaultComponent: jest.fn(),
						}));
					`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: outdent`
						jest.mock('@atlassian/package-b/components', () => ({
							...jest.requireActual('@atlassian/package-b/components'),
							__esModule: true,
							default: jest.fn(),
						}));
					`,
					},
				],
			},
		);
	});

	describe('multiple barrel exports re-exporting same symbols - no direct source export', () => {
		/**
		 * This test covers the edge case where:
		 * 1. Multiple exports point to barrel files (e.g., "." and "./src" both -> ./src/index.ts)
		 * 2. Another export (e.g., "./desktop") also re-exports the same symbols from a different barrel
		 * 3. None of the exports directly point to the source files where symbols are defined
		 *
		 * In this case, the rule should NOT report an error because there's no better
		 * (more direct) export path available - all exports are just barrel files.
		 */
		const BRIDGE_API_PACKAGE_DIR = `${AI_MATE_DIR}/rovo-content-bridge-api`;
		const testFileInBridgeApi = `${AI_MATE_DIR}/conversation-assistant/src/test.tsx`;

		const fsWithMultipleBarrelExports = createMockFileSystem({
			// Workspace markers
			[`${WORKSPACE_ROOT}/package.json`]: '{}',
			[`${WORKSPACE_ROOT}/yarn.lock`]: '',
			[`${WORKSPACE_ROOT}/platform/packages/ai-mate`]: '',

			// Package.json with exports - note: both "." and "./src" point to the same barrel file
			// and "./desktop" points to another barrel that re-exports some of the same symbols
			[`${BRIDGE_API_PACKAGE_DIR}/package.json`]: JSON.stringify({
				name: '@atlassian/rovo-content-bridge-api',
				exports: {
					'.': './src/index.ts',
					'./src': './src/index.ts', // Same as "." - should be skipped
					'./hooks': './src/hooks/rovo-bridge-api-hooks.ts',
					'./client': './src/create-rovo-bridge-api-client.ts',
					'./debugger': './src/debug/index.ts',
					'./desktop': './src/desktop.ts', // Another barrel that re-exports same symbols
				},
			}),

			// Main barrel file - re-exports from various source files
			[`${BRIDGE_API_PACKAGE_DIR}/src/index.ts`]: outdent`
				export { getBrowserBridgeAPI } from './rovo-bridge-api-singleton';
				export { createCommand, createBroadcastableCommand } from './command/bridge-api-command-creator';
				export { client } from './client/bridge-api-client-types';
				export { useRovoBridgeAPI } from './hooks/rovo-bridge-api-hooks';
				export { createRovoBridgeAPIClient } from './create-rovo-bridge-api-client';
			`,

			// Desktop barrel file - also re-exports some of the same symbols (NOT the source file)
			[`${BRIDGE_API_PACKAGE_DIR}/src/desktop.ts`]: outdent`
				export { createCommand, createBroadcastableCommand } from './command/bridge-api-command-creator';
				export { client } from './client/bridge-api-client-types';
				export { desktopOnlyFunction } from './desktop-only';
			`,

			// Source files where symbols are actually defined (none have direct exports in package.json)
			[`${BRIDGE_API_PACKAGE_DIR}/src/rovo-bridge-api-singleton.ts`]: outdent`
				export const getBrowserBridgeAPI = () => ({});
			`,

			[`${BRIDGE_API_PACKAGE_DIR}/src/command/bridge-api-command-creator.ts`]: outdent`
				export const createCommand = (name: string) => ({ name });
				export const createBroadcastableCommand = (name: string) => ({ name });
			`,

			[`${BRIDGE_API_PACKAGE_DIR}/src/client/bridge-api-client-types.ts`]: outdent`
				export const client = (id: string) => id;
			`,

			// Files that DO have direct exports
			[`${BRIDGE_API_PACKAGE_DIR}/src/hooks/rovo-bridge-api-hooks.ts`]: outdent`
				export const useRovoBridgeAPI = () => ({});
			`,

			[`${BRIDGE_API_PACKAGE_DIR}/src/create-rovo-bridge-api-client.ts`]: outdent`
				export const createRovoBridgeAPIClient = () => ({});
			`,

			[`${BRIDGE_API_PACKAGE_DIR}/src/desktop-only.ts`]: outdent`
				export const desktopOnlyFunction = () => ({});
			`,

			[`${BRIDGE_API_PACKAGE_DIR}/src/debug/index.ts`]: outdent`
				export const debugBridgeAPI = () => ({});
			`,
		});

		runWithFs(
			'no-barrel-entry-jest-mock - symbols only available through barrels should not error',
			fsWithMultipleBarrelExports,
			{
				valid: [
					// All mocked symbols (getBrowserBridgeAPI, createCommand, createBroadcastableCommand, client)
					// come from source files that have NO direct export in package.json.
					// Even though ./desktop also re-exports some of these, it's just another barrel file,
					// not a direct path to the source. So the rule should NOT report.
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: () => ({ broadcast: jest.fn() }),
								createCommand: (_name: string) => ({ __commandName: _name }),
								createBroadcastableCommand: (_name: string) => ({ __commandName: _name }),
								client: (id: string) => id,
							}));
						`,
						filename: testFileInBridgeApi,
					},
				],
				invalid: [
					// But if we mock a symbol that DOES have a direct export, it should still error
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								useRovoBridgeAPI: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api/hooks', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api/hooks'),
								useRovoBridgeAPI: jest.fn(),
							}));
						`,
					},
					// Mix of symbols: some have direct exports, some don't
					// Only the ones with direct exports should be split out
					{
						code: outdent`
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: () => ({ broadcast: jest.fn() }),
								createRovoBridgeAPIClient: jest.fn(),
							}));
						`,
						filename: testFileInBridgeApi,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: tabindent`
							jest.mock('@atlassian/rovo-content-bridge-api/client', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api/client'),
								createRovoBridgeAPIClient: jest.fn(),
							}));
							jest.mock('@atlassian/rovo-content-bridge-api', () => ({
								...jest.requireActual('@atlassian/rovo-content-bridge-api'),
								getBrowserBridgeAPI: () => ({ broadcast: jest.fn() }),
							}));
						`,
					},
				],
			},
		);
	});

	describe('jest.requireMock rewriting', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - requireMock with destructuring', fs, {
			valid: [],
			invalid: [
				// jest.requireMock with destructuring should be updated to the new subpath
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							useChatContextStoreActions: jest.fn(),
						}));

						function someTest() {
							const { useChatContextStoreActions } = jest.requireMock('@atlassian/conversation-assistant-store');
							expect(useChatContextStoreActions).toHaveBeenCalled();
						}
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));

						function someTest() {
							const { useChatContextStoreActions } = jest.requireMock('@atlassian/conversation-assistant-store/controllers/chat-context/store');
							expect(useChatContextStoreActions).toHaveBeenCalled();
						}
					`,
				},
			],
		});

		runWithFs('no-barrel-entry-jest-mock - requireMock with property access', fs, {
			valid: [],
			invalid: [
				// jest.requireMock with property access should be updated to the new subpath
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							useChatContextStoreActions: jest.fn(),
						}));

						const mockAction = jest.requireMock('@atlassian/conversation-assistant-store').useChatContextStoreActions;
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));

						const mockAction = jest.requireMock('@atlassian/conversation-assistant-store/controllers/chat-context/store').useChatContextStoreActions;
					`,
				},
			],
		});

		runWithFs('no-barrel-entry-jest-mock - requireMock with single mock target (fallback)', fs, {
			valid: [],
			invalid: [
				// When only one mock target exists, jest.requireMock should use that path
				// even without destructured symbols to match against
				{
					code: outdent`
						jest.mock('@atlassian/conversation-assistant-store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store'),
							useChatContextStoreActions: jest.fn(),
						}));

						const mocked = jest.requireMock('@atlassian/conversation-assistant-store');
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: outdent`
						jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
							...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
							useChatContextStoreActions: jest.fn(),
						}));

						const mocked = jest.requireMock('@atlassian/conversation-assistant-store/controllers/chat-context/store');
					`,
				},
			],
		});

		runWithFs(
			'no-barrel-entry-jest-mock - requireMock left unchanged with multiple targets and no symbol match',
			fs,
			{
				valid: [],
				invalid: [
					// When multiple mock targets exist and jest.requireMock has no destructuring
					// or property access, the requireMock path cannot be resolved and is left unchanged
					{
						code: outdent`
							jest.mock('@atlassian/conversation-assistant-store', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-store'),
								useChatContextStoreActions: jest.fn(),
								useStagingArea: jest.fn(),
							}));

							const mocked = jest.requireMock('@atlassian/conversation-assistant-store');
						`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: tabindent`
							jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
								useChatContextStoreActions: jest.fn(),
							}));
							jest.mock('@atlassian/conversation-assistant-store/controllers/staging-area', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area'),
								useStagingArea: jest.fn(),
							}));

							const mocked = jest.requireMock('@atlassian/conversation-assistant-store');
						`,
					},
				],
			},
		);
	});

	describe('applyToImportsFrom option', () => {
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

		// Test: package in target folder is checked (default behavior)
		// Using mock with implementation to trigger the rule
		runWithFs(
			'no-barrel-entry-jest-mock - applyToImportsFrom default behavior',
			createFsForTargetTest(),
			{
				valid: [],
				invalid: [
					// Package in default target folder is checked
					{
						code: outdent`
							jest.mock('@atlassian/package-in-target', () => ({
								...jest.requireActual('@atlassian/package-in-target'),
								helper: jest.fn(),
							}));
						`,
						filename: `${AI_MATE_DIR}/consumer/src/test.ts`,
						errors: [{ messageId: 'barrelEntryMock' }],
						output: outdent`
							jest.mock('@atlassian/package-in-target/specific', () => ({
								...jest.requireActual('@atlassian/package-in-target/specific'),
								helper: jest.fn(),
							}));
						`,
					},
				],
			},
		);

		// Test: empty applyToImportsFrom means no packages are checked
		runWithFs(
			'no-barrel-entry-jest-mock - empty applyToImportsFrom skips all packages',
			createFsForTargetTest(),
			{
				valid: [
					{
						code: outdent`
							jest.mock('@atlassian/package-in-target', () => ({
								...jest.requireActual('@atlassian/package-in-target'),
								helper: jest.fn(),
							}));
						`,
						filename: `${AI_MATE_DIR}/consumer/src/test.ts`,
						options: [{ applyToImportsFrom: [] }],
					},
				],
				invalid: [],
			},
		);

		// Test: package is ignored when applyToImportsFrom doesn't include its folder
		runWithFs(
			'no-barrel-entry-jest-mock - applyToImportsFrom excludes package folder',
			createFsForTargetTest(),
			{
				valid: [
					// Package in ai-mate is ignored when applyToImportsFrom only includes a different folder
					{
						code: outdent`
							jest.mock('@atlassian/package-in-target', () => ({
								...jest.requireActual('@atlassian/package-in-target'),
								helper: jest.fn(),
							}));
						`,
						filename: `${AI_MATE_DIR}/consumer/src/test.ts`,
						options: [{ applyToImportsFrom: ['platform/packages/other-folder'] }],
					},
				],
				invalid: [],
			},
		);
	});

	describe('standalone jest.requireActual violations', () => {
		const fs = createStandardMockFs();

		runWithFs('no-barrel-entry-jest-mock - jest.requireActual property access', fs, {
			valid: [
				// jest.requireActual on a non-barrel subpath is fine
				{
					code: outdent`
						const store = jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat');
					`,
					filename: TEST_FILE,
				},
				// jest.requireActual on an unknown package is fine
				{
					code: outdent`
						const val = jest.requireActual('@atlaskit/button').Button;
					`,
					filename: TEST_FILE,
				},
			],
			invalid: [
				// Property access on barrel entry: jest.requireActual('barrel').Symbol
				{
					code: outdent`
						const actions = jest.requireActual('@atlassian/conversation-assistant-store').useChatContextStoreActions;
					`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryRequireActual' }],
					output: outdent`
						const actions = jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store').useChatContextStoreActions;
					`,
				},
			],
		});

		runWithFs('no-barrel-entry-jest-mock - jest.requireActual with generic type param', fs, {
			valid: [],
			invalid: [
				// Property access with generic type parameter
				{
					code: outdent`
							const actions = jest.requireActual<any>('@atlassian/conversation-assistant-store').useChatContextStoreActions;
						`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryRequireActual' }],
					output: outdent`
							const actions = jest.requireActual<any>('@atlassian/conversation-assistant-store/controllers/chat-context/store').useChatContextStoreActions;
						`,
				},
			],
		});

		runWithFs('no-barrel-entry-jest-mock - jest.requireActual destructuring', fs, {
			valid: [],
			invalid: [
				// Destructuring from barrel entry - symbols from same subpath
				{
					code: outdent`
							const { useStagingAreaState, useStagingAreaActions } = jest.requireActual('@atlassian/conversation-assistant-store');
						`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryRequireActual' }],
					output: outdent`
							const { useStagingAreaState, useStagingAreaActions } = jest.requireActual('@atlassian/conversation-assistant-store/controllers/staging-area');
						`,
				},
			],
		});

		runWithFs(
			'no-barrel-entry-jest-mock - jest.requireActual no fix for unresolvable symbol access',
			fs,
			{
				valid: [],
				invalid: [
					// Spread without determinable symbols - report without fix
					{
						code: outdent`
							const obj = { ...jest.requireActual('@atlassian/conversation-assistant-store') };
						`,
						filename: TEST_FILE,
						errors: [{ messageId: 'barrelEntryRequireActual' }],
					},
				],
			},
		);

		// The real-world scenario: jest.requireActual('barrel').Symbol inside a jest.fn()
		// callback within a jest.mock() factory that targets the same barrel.
		// The jest.mock handler rewrites the whole mock AND fixes nested requireActual calls.
		runWithFs('no-barrel-entry-jest-mock - nested jest.requireActual inside barrel jest.mock', fs, {
			valid: [],
			invalid: [
				{
					code: outdent`
							jest.mock('@atlassian/conversation-assistant-store', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-store'),
								useChatContextStoreActions: jest.fn((...args) => {
									const real = jest.requireActual('@atlassian/conversation-assistant-store').useChatContextStoreActions;
									return real(...args);
								}),
							}));
						`,
					filename: TEST_FILE,
					errors: [{ messageId: 'barrelEntryMock' }],
					output: tabindent`
							jest.mock('@atlassian/conversation-assistant-store/controllers/chat-context/store', () => ({
								...jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store'),
								useChatContextStoreActions: jest.fn((...args) => {
									const real = jest.requireActual('@atlassian/conversation-assistant-store/controllers/chat-context/store').useChatContextStoreActions;
									return real(...args);
								}),
							}));
						`,
				},
			],
		});
	});
});
