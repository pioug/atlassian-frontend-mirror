import outdent from 'outdent';

// @ts-expect-error - ruleTester is untyped but comes from @atlassian/eslint-utils
import { ruleTester as atlaskitRuleTester } from '@atlassian/eslint-utils';

import { type FileSystem } from '../../shared/types';
import { createRule } from '../index';

/**
 * Helper to create a mock file system from a map of file paths to contents.
 * This allows tests to simulate different barrel file structures.
 */
function createMockFileSystem(files: Record<string, string>): FileSystem {
	return {
		existsSync(path: string): boolean {
			return path in files;
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
		statSync(path: string): { isFile(): boolean } {
			return {
				isFile(): boolean {
					return path in files;
				},
			};
		},
		readdirSync(_path: string, _options: { withFileTypes: true }) {
			return [];
		},
		execSync(_command: string, _options?: { cwd?: string }): string | null {
			return null;
		},
		cache: {},
	};
}

// ============================================================================
// TEST RUNNER
// ============================================================================

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

// Valid cases - should not report
runWithFs(
	'no-jest-mock-barrel-files (non-barrel)',
	createMockFileSystem({
		'/project/src/utils/helpers.ts': `
			export function helper1() {}
			export function helper2() {}
		`,
	}),
	{
		valid: [
			{
				code: `jest.mock('./utils/helpers')`,
				filename: '/project/src/test.ts',
			},
		],
		invalid: [],
	},
);

runWithFs(
	'no-jest-mock-barrel-files (local exports only)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export function helper1() {}
			export const helper2 = () => {};
		`,
	}),
	{
		valid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
			},
		],
		invalid: [],
	},
);

runWithFs('no-jest-mock-barrel-files (non-relative)', createMockFileSystem({}), {
	valid: [
		{
			code: `jest.mock('lodash')`,
			filename: '/project/src/test.ts',
		},
		{
			code: `jest.mock('@atlaskit/button')`,
			filename: '/project/src/test.ts',
		},
	],
	invalid: [],
});

runWithFs(
	'no-jest-mock-barrel-files (type-only)',
	createMockFileSystem({
		'/project/src/types/index.ts': `
			export type { MyType } from './myTypes';
			export interface MyInterface {}
		`,
		'/project/src/types/myTypes.ts': `
			export type MyType = string;
		`,
	}),
	{
		valid: [
			{
				code: `jest.mock('./types')`,
				filename: '/project/src/test.ts',
			},
		],
		invalid: [],
	},
);

// Auto-mock cases (no implementation)
const basicBarrelFs = createMockFileSystem({
	'/project/src/utils/index.ts': `
		export { helper1 } from './helpers';
		export { validator1 } from './validators';
	`,
	'/project/src/utils/helpers.ts': `
		export function helper1() {}
	`,
	'/project/src/utils/validators.ts': `
		export function validator1() {}
	`,
});

runWithFs('no-jest-mock-barrel-files (auto-mock basic)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: `jest.mock('./utils')`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: outdent`
				jest.mock('./utils/helpers');
				jest.mock('./utils/validators')
			`,
		},
	],
});

runWithFs(
	'no-jest-mock-barrel-files (auto-mock star)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export * from './helpers';
			export * from './validators';
		`,
		'/project/src/utils/helpers.ts': `
			export function helperA() {}
			export const helperB = 1;
		`,
		'/project/src/utils/validators.ts': `
			export function validateEmail() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: outdent`
				jest.mock('./utils/helpers');
				jest.mock('./utils/validators')
			`,
			},
		],
	},
);

runWithFs('no-jest-mock-barrel-files (double quotes)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: `jest.mock("./utils")`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: outdent`
				jest.mock("./utils/helpers");
				jest.mock("./utils/validators")
			`,
		},
	],
});

// Mock with implementation cases
runWithFs('no-jest-mock-barrel-files (impl multi-source)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () => ({
				  helper1: jest.fn(),
				  validator1: jest.fn()
				}))
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}));
				jest.mock('./utils/validators', () => ({
				  ...jest.requireActual('./utils/validators'),
				  validator1: jest.fn(),
				}))
			`,
		},
	],
});

runWithFs('no-jest-mock-barrel-files (requireActual spread)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () => ({
				  ...jest.requireActual('./utils'),
				  helper1: jest.fn()
				}))
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
		},
	],
});

const defaultExportReexportFs = createMockFileSystem({
	'/project/src/components/index.ts': `
		export { default as Button } from './Button';
		export { helper } from './helpers';
	`,
	'/project/src/components/Button.ts': `
		export default function Button() {}
	`,
	'/project/src/components/helpers.ts': `
		export function helper() {}
	`,
});

runWithFs('no-jest-mock-barrel-files (default export reexport)', defaultExportReexportFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
					jest.mock('./components', () => ({
					  Button: jest.fn(),
					  helper: jest.fn()
					}))
				`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
					jest.mock('./components/Button', () => ({
					  __esModule: true,
					  default: jest.fn()
					}));
					jest.mock('./components/helpers', () => ({
					  ...jest.requireActual('./components/helpers'),
					  helper: jest.fn(),
					}))
				`,
		},
	],
});

runWithFs('no-jest-mock-barrel-files (arrow short)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: `jest.mock('./utils', () => ({ helper1: jest.fn() }))`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
		},
	],
});

runWithFs('no-jest-mock-barrel-files (function expression)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: `jest.mock('./utils', function() { return { helper1: jest.fn() }; })`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
		},
	],
});

// Nested barrel files
const nestedBarrelFs = createMockFileSystem({
	'/project/src/utils/index.ts': `
		export { nestedHelper } from './nested';
		export { localUtil } from './local';
	`,
	'/project/src/utils/nested/index.ts': `
		export { nestedHelper } from './nestedHelpers';
	`,
	'/project/src/utils/nested/nestedHelpers.ts': `
		export function nestedHelper() {}
	`,
	'/project/src/utils/local.ts': `
		export function localUtil() {}
	`,
});

runWithFs('no-jest-mock-barrel-files (nested barrel)', nestedBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () => ({
				  nestedHelper: jest.fn(),
				  localUtil: jest.fn()
				}))
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/nested/nestedHelpers', () => ({
				  ...jest.requireActual('./utils/nested/nestedHelpers'),
				  nestedHelper: jest.fn(),
				}));
				jest.mock('./utils/local', () => ({
				  ...jest.requireActual('./utils/local'),
				  localUtil: jest.fn(),
				}))
			`,
		},
	],
});

// Renamed exports
runWithFs(
	'no-jest-mock-barrel-files (renamed exports)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { originalName as renamedExport } from './helpers';
			export { anotherUtil } from './other';
		`,
		'/project/src/utils/helpers.ts': `
			export function originalName() {}
		`,
		'/project/src/utils/other.ts': `
			export function anotherUtil() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./utils', () => ({
				  renamedExport: jest.fn(),
				  anotherUtil: jest.fn()
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  renamedExport: jest.fn(),
				}));
				jest.mock('./utils/other', () => ({
				  ...jest.requireActual('./utils/other'),
				  anotherUtil: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Type exports
runWithFs(
	'no-jest-mock-barrel-files (mixed type runtime)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export type { SomeType } from './types';
			export { runtimeHelper } from './helpers';
		`,
		'/project/src/utils/types.ts': `
			export type SomeType = string;
		`,
		'/project/src/utils/helpers.ts': `
			export function runtimeHelper() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: `jest.mock('./utils/helpers')`,
			},
		],
	},
);

runWithFs(
	'no-jest-mock-barrel-files (interface exports)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export interface MyInterface {}
			export { runtimeHelper } from './helpers';
		`,
		'/project/src/utils/helpers.ts': `
			export function runtimeHelper() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: `jest.mock('./utils/helpers')`,
			},
		],
	},
);

// Namespace exports
runWithFs(
	'no-jest-mock-barrel-files (namespace exports)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export * as helpers from './helpers';
			export { standalone } from './standalone';
		`,
		'/project/src/utils/helpers.ts': `
			export function helper1() {}
			export function helper2() {}
		`,
		'/project/src/utils/standalone.ts': `
			export function standalone() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./utils', () => ({
				  helpers: { helper1: jest.fn() },
				  standalone: jest.fn()
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helpers: { helper1: jest.fn() },
				}));
				jest.mock('./utils/standalone', () => ({
				  ...jest.requireActual('./utils/standalone'),
				  standalone: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Edge cases
runWithFs('no-jest-mock-barrel-files (parent dir)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: `jest.mock('../utils')`,
			filename: '/project/src/tests/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: outdent`
				jest.mock('../utils/helpers');
				jest.mock('../utils/validators')
			`,
		},
	],
});

runWithFs(
	'no-jest-mock-barrel-files (enum exports)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { MyEnum } from './enums';
			export { helper } from './helpers';
		`,
		'/project/src/utils/enums.ts': `
			export enum MyEnum { A, B, C }
		`,
		'/project/src/utils/helpers.ts': `
			export function helper() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: outdent`
				jest.mock('./utils/enums');
				jest.mock('./utils/helpers')
			`,
			},
		],
	},
);

runWithFs(
	'no-jest-mock-barrel-files (class exports)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { MyClass } from './classes';
			export { helper } from './helpers';
		`,
		'/project/src/utils/classes.ts': `
			export class MyClass {}
		`,
		'/project/src/utils/helpers.ts': `
			export function helper() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: outdent`
				jest.mock('./utils/classes');
				jest.mock('./utils/helpers')
			`,
			},
		],
	},
);

runWithFs(
	'no-jest-mock-barrel-files (mixed local reexports)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { helper1 } from './helpers';
			export function localFunction() {}
		`,
		'/project/src/utils/helpers.ts': `export function helper1() {}`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils')`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: outdent`
				jest.mock('./utils/helpers');
				jest.mock('./utils')
			`,
			},
		],
	},
);

// Mock factory with preamble
runWithFs('no-jest-mock-barrel-files (preamble)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () => {
				  const mockFn = jest.fn();
				  return {
				    helper1: mockFn
				  };
				})
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => {
				  const mockFn = jest.fn();
				  return {
				    ...jest.requireActual('./utils/helpers'),
				    helper1: mockFn,
				  };
				})
			`,
		},
	],
});

// Mock factory with preamble - dead code removal after split
// Tests that preamble variables are only included in mocks where they are used
runWithFs(
	'no-jest-mock-barrel-files (preamble dead code removal)',
	createMockFileSystem({
		'/project/src/analytics/index.ts': `
			export { useAnalytics } from './use-analytics';
			export { onShowMoreClicked, onShowAllClicked } from './events';
		`,
		'/project/src/analytics/use-analytics.ts': `
			export function useAnalytics() {}
		`,
		'/project/src/analytics/events.ts': `
			export function onShowMoreClicked() {}
			export function onShowAllClicked() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: tabindent`
				jest.mock('./analytics', () => {
				  const fireAnalyticsEvent = jest.fn();

				  return Object.assign({}, jest.requireActual('./analytics'), {
				    useAnalytics: () => ({
				      fireAnalyticsEvent,
				    }),
				    onShowMoreClicked: jest.fn(),
				    onShowAllClicked: jest.fn(),
				  });
				})
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				// fireAnalyticsEvent should only be in use-analytics mock, not events mock
				output: tabindent`
				jest.mock('./analytics/use-analytics', () => {
				  const fireAnalyticsEvent = jest.fn();
				  return {
				    ...jest.requireActual('./analytics/use-analytics'),
				    useAnalytics: () => ({
				      fireAnalyticsEvent,
				    }),
				  };
				});
				jest.mock('./analytics/events', () => ({
				  ...jest.requireActual('./analytics/events'),
				  onShowMoreClicked: jest.fn(),
				  onShowAllClicked: jest.fn(),
				}))
			`,
			},
		],
	},
);

// ============================================================================
// ADDITIONAL TEST CASES
// ============================================================================

// Non-index barrel file (barrel file not named index.ts) with local export
// The rule detects barrel files by checking for re-exports, not by filename
// Local exports stay mocked at the barrel file, re-exports are split to source files
runWithFs(
	'no-jest-mock-barrel-files (non-index barrel)',
	createMockFileSystem({
		'/project/src/utils.ts': `
			export { helper1 } from './utils/helpers';
			export { validator1 } from './utils/validators';
			export const localValue = 42;
		`,
		'/project/src/utils/helpers.ts': `
			export function helper1() {}
		`,
		'/project/src/utils/validators.ts': `
			export function validator1() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./utils', () => ({
				  helper1: jest.fn(),
				  validator1: jest.fn(),
				  localValue: 99
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}));
				jest.mock('./utils/validators', () => ({
				  ...jest.requireActual('./utils/validators'),
				  validator1: jest.fn(),
				}));
				jest.mock('./utils', () => ({
				  ...jest.requireActual('./utils'),
				  localValue: 99,
				}))
			`,
			},
		],
	},
);

// Single property mock (simplest case with implementation)
runWithFs(
	'no-jest-mock-barrel-files (single property mock)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { helper1 } from './helpers';
			export { validator1 } from './validators';
		`,
		'/project/src/utils/helpers.ts': `
			export function helper1() {}
		`,
		'/project/src/utils/validators.ts': `
			export function validator1() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils', () => ({ helper1: jest.fn() }))`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Default export re-exported as named - should mock default, not the alias
runWithFs(
	'no-jest-mock-barrel-files (default as named)',
	createMockFileSystem({
		'/project/src/components/index.ts': `
			export { default as MyButton } from './Button';
		`,
		'/project/src/components/Button.ts': `
			export default function Button() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./components', () => ({ MyButton: jest.fn() }))`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./components/Button', () => ({
				  __esModule: true,
				  default: jest.fn()
				}))
			`,
			},
		],
	},
);

// Multiple exports from same source file with pre-existing mock - should merge into that mock
runWithFs(
	'no-jest-mock-barrel-files (merge same source)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { helper1, helper2 } from './helpers';
			export { validator1 } from './validators';
		`,
		'/project/src/utils/helpers.ts': `
			export function helper1() {}
			export function helper2() {}
			export function helper3() {}
		`,
		'/project/src/utils/validators.ts': `
			export function validator1() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./utils/helpers', () => ({
				  helper3: jest.fn()
				}));
				jest.mock('./utils', () => ({
				  helper1: jest.fn(),
				  helper2: jest.fn(),
				  validator1: jest.fn()
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				// Note: The merged mock doesn't add requireActual because the existing mock didn't have it
				output:
					tabindent`
				jest.mock('./utils/helpers', () => ({
				  helper3: jest.fn(),
				  helper1: jest.fn(),
				  helper2: jest.fn(),
				}));
				jest.mock('./utils/validators', () => ({
				  ...jest.requireActual('./utils/validators'),
				  validator1: jest.fn(),
				}));
			` + '\n',
			},
		],
	},
);

// Verify requireActual is added when creating new mocks
runWithFs('no-jest-mock-barrel-files (adds requireActual)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			// Mock that only overrides one export - requireActual preserves unmocked exports
			code: outdent`
				jest.mock('./utils', () => ({
				  helper1: 'mocked'
				}))
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: 'mocked',
				}))
			`,
		},
	],
});

// ============================================================================
// OBJECT.ASSIGN PATTERN TEST CASES
// ============================================================================

// Object.assign with jest.requireActual - single export from barrel
runWithFs('no-jest-mock-barrel-files (Object.assign single export)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () =>
				  Object.assign({}, jest.requireActual('./utils'), {
				    helper1: jest.fn(),
				  }),
				)
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
		},
	],
});

// Object.assign with jest.requireActual - multiple exports from same source
runWithFs('no-jest-mock-barrel-files (Object.assign multiple same source)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () =>
				  Object.assign({}, jest.requireActual('./utils'), {
				    helper1: jest.fn(),
				    validator1: jest.fn(),
				  }),
				)
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}));
				jest.mock('./utils/validators', () => ({
				  ...jest.requireActual('./utils/validators'),
				  validator1: jest.fn(),
				}))
			`,
		},
	],
});

// Object.assign with nested barrels
runWithFs('no-jest-mock-barrel-files (Object.assign nested barrel)', nestedBarrelFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./utils', () =>
				  Object.assign({}, jest.requireActual('./utils'), {
				    nestedHelper: jest.fn(),
				  }),
				)
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/nested/nestedHelpers', () => ({
				  ...jest.requireActual('./utils/nested/nestedHelpers'),
				  nestedHelper: jest.fn(),
				}))
			`,
		},
	],
});

// Object.assign with default export re-export
runWithFs('no-jest-mock-barrel-files (Object.assign default export)', defaultExportReexportFs, {
	valid: [],
	invalid: [
		{
			code: outdent`
				jest.mock('./components', () =>
				  Object.assign({}, jest.requireActual('./components'), {
				    Button: jest.fn(),
				  }),
				)
			`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./components/Button', () => ({
				  __esModule: true,
				  default: jest.fn()
				}))
			`,
		},
	],
});

// Object.assign with empty first argument
runWithFs('no-jest-mock-barrel-files (Object.assign empty first arg)', basicBarrelFs, {
	valid: [],
	invalid: [
		{
			code: `jest.mock('./utils', () => Object.assign({}, jest.requireActual('./utils'), { helper1: jest.fn() }))`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
		},
	],
});

// ============================================================================
// ADDITIONAL TEST SCENARIOS FOR COMPREHENSIVE COVERAGE
// ============================================================================

// Non-index barrel file with explicit path (semantic detection)
// A barrel file NOT named index.ts should still be detected
runWithFs(
	'no-jest-mock-barrel-files (non-index barrel explicit path)',
	createMockFileSystem({
		'/project/src/utils/barrel.ts': `
			export { helper1 } from './helpers';
			export { validator1 } from './validators';
		`,
		'/project/src/utils/helpers.ts': `
			export function helper1() {}
		`,
		'/project/src/utils/validators.ts': `
			export function validator1() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils/barrel', () => ({ helper1: jest.fn() }))`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils/helpers', () => ({
				  ...jest.requireActual('./utils/helpers'),
				  helper1: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Mixed local and re-exported symbols (comprehensive)
runWithFs(
	'no-jest-mock-barrel-files (mixed local and re-export comprehensive)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export const localHelper = () => 'local';
			export { remoteHelper } from './remote';
		`,
		'/project/src/utils/remote.ts': `
			export function remoteHelper() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./utils', () => ({
				  localHelper: jest.fn(),
				  remoteHelper: jest.fn(),
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils', () => ({
				  ...jest.requireActual('./utils'),
				  localHelper: jest.fn(),
				}));
				jest.mock('./utils/remote', () => ({
				  ...jest.requireActual('./utils/remote'),
				  remoteHelper: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Deeply nested barrels (3+ levels)
runWithFs(
	'no-jest-mock-barrel-files (deeply nested 3+ levels)',
	createMockFileSystem({
		'/project/src/utils/index.ts': `
			export { deepHelper } from './level1';
		`,
		'/project/src/utils/level1/index.ts': `
			export { deepHelper } from './level2';
		`,
		'/project/src/utils/level1/level2/index.ts': `
			export { deepHelper } from './source';
		`,
		'/project/src/utils/level1/level2/source.ts': `
			export function deepHelper() {}
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: `jest.mock('./utils', () => ({ deepHelper: jest.fn() }))`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./utils/level1/level2/source', () => ({
				  ...jest.requireActual('./utils/level1/level2/source'),
				  deepHelper: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Circular re-exports (should not infinite loop)
runWithFs(
	'no-jest-mock-barrel-files (circular re-exports)',
	createMockFileSystem({
		'/project/src/a/index.ts': `
			export { helperB } from '../b';
			export const helperA = () => 'A';
		`,
		'/project/src/b/index.ts': `
			export { helperA } from '../a';
			export const helperB = () => 'B';
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./a', () => ({
				  helperA: jest.fn(),
				  helperB: jest.fn(),
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./a', () => ({
				  ...jest.requireActual('./a'),
				  helperA: jest.fn(),
				}));
				jest.mock('./b', () => ({
				  ...jest.requireActual('./b'),
				  helperB: jest.fn(),
				}))
			`,
			},
		],
	},
);

// .tsx extension barrel files
runWithFs(
	'no-jest-mock-barrel-files (.tsx barrel files)',
	createMockFileSystem({
		'/project/src/components/index.tsx': `
			export { Button } from './Button';
			export { Input } from './Input';
		`,
		'/project/src/components/Button.tsx': `
			export const Button = () => <button />;
		`,
		'/project/src/components/Input.tsx': `
			export const Input = () => <input />;
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./components', () => ({
				  Button: jest.fn(),
				  Input: jest.fn(),
				}))
			`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: tabindent`
				jest.mock('./components/Button', () => ({
				  ...jest.requireActual('./components/Button'),
				  Button: jest.fn(),
				}));
				jest.mock('./components/Input', () => ({
				  ...jest.requireActual('./components/Input'),
				  Input: jest.fn(),
				}))
			`,
			},
		],
	},
);

/**
 * Helper to create a mock file system that supports directory scanning for cross-package tests.
 * This is more comprehensive than createMockFileSystem and supports readdirSync properly.
 */
function createMockFsWithDirectories(files: Record<string, string>): FileSystem {
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

// Cross-package barrel resolution (multi-hop)
// Tests that barrel files re-exporting from other package's barrels are traced correctly.
// This test uses packages in different folders (not just ai-mate) to validate
// that package resolution works across all of platform/packages/
// Structure:
// - package-a (in editor/) has a local barrel that re-exports from @atlassian/package-b/helpers
// - package-b (in linking-platform/) re-exports from @atlaskit/design-tokens/core
// - design-tokens (in design-system/) defines the actual export
// The rule should trace through all 3 packages and generate the correct mock.
runWithFs(
	'no-jest-mock-barrel-files (cross-package barrel resolution across platform/packages)',
	createMockFsWithDirectories({
		'/workspace/.git/config': '',
		'/workspace/yarn.lock': '',
		// Package A in editor folder - consumer package with local barrel
		'/workspace/platform/packages/editor/package-a/package.json': JSON.stringify({
			name: '@atlassian/package-a',
			exports: { '.': './src/index.ts' },
		}),
		'/workspace/platform/packages/editor/package-a/src/index.ts': '',
		'/workspace/platform/packages/editor/package-a/src/test.ts': '',
		'/workspace/platform/packages/editor/package-a/src/local-barrel/index.ts': outdent`
			export { myHelper } from '@atlassian/package-b/helpers';
		`,
		// Package B in linking-platform folder - intermediate package that re-exports
		'/workspace/platform/packages/linking-platform/package-b/package.json': JSON.stringify({
			name: '@atlassian/package-b',
			exports: { './helpers': './src/helpers/index.ts' },
		}),
		'/workspace/platform/packages/linking-platform/package-b/src/helpers/index.ts': outdent`
			export { myHelper } from '@atlaskit/design-tokens/core';
		`,
		// design-tokens in design-system folder - the source package where myHelper is actually defined
		'/workspace/platform/packages/design-system/design-tokens/package.json': JSON.stringify({
			name: '@atlaskit/design-tokens',
			exports: { './core': './src/core/index.ts' },
		}),
		'/workspace/platform/packages/design-system/design-tokens/src/core/index.ts': outdent`
			export function myHelper() { return 'hello'; }
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				// Mocking a local barrel that re-exports through multiple packages across different folders
				code: `jest.mock('./local-barrel', () => ({ myHelper: jest.fn() }))`,
				filename: '/workspace/platform/packages/editor/package-a/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				// Should trace through package-b (linking-platform) and design-tokens (design-system)
				// The fix should point to the ultimate source in design-tokens
				output: tabindent`
				jest.mock('@atlaskit/design-tokens/core', () => ({
				  ...jest.requireActual('@atlaskit/design-tokens/core'),
				  myHelper: jest.fn(),
				}))
			`,
			},
		],
	},
);

// Cross-package with mixed local and cross-package exports
// Tests that when a barrel has both local exports and cross-package re-exports,
// the mocks are split correctly.
// This test uses packages in different folders to validate cross-folder resolution.
runWithFs(
	'no-jest-mock-barrel-files (cross-package mixed local and remote across folders)',
	createMockFsWithDirectories({
		'/workspace/.git/config': '',
		'/workspace/yarn.lock': '',
		// Package A in editor folder - has local barrel with mixed exports
		'/workspace/platform/packages/editor/package-a/package.json': JSON.stringify({
			name: '@atlassian/package-a',
			exports: { '.': './src/index.ts' },
		}),
		'/workspace/platform/packages/editor/package-a/src/index.ts': '',
		'/workspace/platform/packages/editor/package-a/src/test.ts': '',
		'/workspace/platform/packages/editor/package-a/src/utils/index.ts': outdent`
			export const localUtil = () => 'local';
			export { remoteUtil } from '@atlaskit/primitives/utils';
		`,
		// primitives in design-system folder - provides remoteUtil
		'/workspace/platform/packages/design-system/primitives/package.json': JSON.stringify({
			name: '@atlaskit/primitives',
			exports: { './utils': './src/utils/index.ts' },
		}),
		'/workspace/platform/packages/design-system/primitives/src/utils/index.ts': outdent`
			export function remoteUtil() { return 'remote'; }
		`,
	}),
	{
		valid: [],
		invalid: [
			{
				code: outdent`
				jest.mock('./utils', () => ({
				  localUtil: jest.fn(),
				  remoteUtil: jest.fn(),
				}))
			`,
				filename: '/workspace/platform/packages/editor/package-a/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				// Should split into local mock and cross-package mock (from design-system folder)
				output: tabindent`
				jest.mock('./utils', () => ({
				  ...jest.requireActual('./utils'),
				  localUtil: jest.fn(),
				}));
				jest.mock('@atlaskit/primitives/utils', () => ({
				  ...jest.requireActual('@atlaskit/primitives/utils'),
				  remoteUtil: jest.fn(),
				}))
			`,
			},
		],
	},
);

// ============================================================================
// WORKS IN ANY FOLDER (NO TARGET FOLDERS CONSTRAINT)
// ============================================================================

// This rule handles relative imports and does not use applyToImportsFrom.
// It should work in any folder under platform/packages/

// ============================================================================
// JEST.REQUIREMOCK REWRITING
// ============================================================================

runWithFs('no-jest-mock-barrel-files (jest.requireMock with destructuring)', basicBarrelFs, {
	valid: [],
	invalid: [
		// jest.requireMock with the old barrel path should be updated to the new subpath
		{
			code: outdent`
					jest.mock('./utils', () => ({
					  helper1: jest.fn(),
					}));

					function someTest() {
					  const { helper1 } = jest.requireMock('./utils');
					  expect(helper1).toHaveBeenCalled();
					}
				`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: [
				"jest.mock('./utils/helpers', () => ({",
				"\t...jest.requireActual('./utils/helpers'),",
				'\thelper1: jest.fn(),',
				'}));',
				'',
				'function someTest() {',
				"  const { helper1 } = jest.requireMock('./utils/helpers');",
				'  expect(helper1).toHaveBeenCalled();',
				'}',
			].join('\n'),
		},
	],
});

runWithFs('no-jest-mock-barrel-files (jest.requireMock with property access)', basicBarrelFs, {
	valid: [],
	invalid: [
		// jest.requireMock with property access pattern should also be updated
		{
			code: outdent`
					jest.mock('./utils', () => ({
					  validator1: jest.fn(),
					}));

					const mockValidator = jest.requireMock('./utils').validator1;
				`,
			filename: '/project/src/test.ts',
			errors: [{ messageId: 'barrelMock' }],
			output: [
				"jest.mock('./utils/validators', () => ({",
				"\t...jest.requireActual('./utils/validators'),",
				'\tvalidator1: jest.fn(),',
				'}));',
				'',
				"const mockValidator = jest.requireMock('./utils/validators').validator1;",
			].join('\n'),
		},
	],
});

runWithFs(
	'no-jest-mock-barrel-files (jest.requireMock with single mock target fallback)',
	basicBarrelFs,
	{
		valid: [],
		invalid: [
			// When only one mock target exists, jest.requireMock should use that path
			// even without destructured symbols to match against
			{
				code: outdent`
					jest.mock('./utils', () => ({
					  helper1: jest.fn(),
					}));

					const mocked = jest.requireMock('./utils');
				`,
				filename: '/project/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: [
					"jest.mock('./utils/helpers', () => ({",
					"\t...jest.requireActual('./utils/helpers'),",
					'\thelper1: jest.fn(),',
					'}));',
					'',
					"const mocked = jest.requireMock('./utils/helpers');",
				].join('\n'),
			},
		],
	},
);

runWithFs(
	'no-jest-mock-barrel-files (works in any folder)',
	createMockFsWithDirectories({
		'/workspace/.git/config': '',
		'/workspace/yarn.lock': '',
		// Package in any folder - not just ai-mate or search
		'/workspace/platform/packages/other-folder/pkg-other/package.json': JSON.stringify({
			name: '@atlassian/pkg-other',
		}),
		'/workspace/platform/packages/other-folder/pkg-other/src/test.ts': '',
		'/workspace/platform/packages/other-folder/pkg-other/src/utils/index.ts': outdent`
			export { helper } from './helper';
		`,
		'/workspace/platform/packages/other-folder/pkg-other/src/utils/helper.ts': outdent`
			export const helper = () => 'helper';
		`,
	}),
	{
		valid: [],
		invalid: [
			// Barrel mocks are detected in any folder
			{
				code: `jest.mock('./utils')`,
				filename: '/workspace/platform/packages/other-folder/pkg-other/src/test.ts',
				errors: [{ messageId: 'barrelMock' }],
				output: `jest.mock('./utils/helper')`,
			},
		],
	},
);
