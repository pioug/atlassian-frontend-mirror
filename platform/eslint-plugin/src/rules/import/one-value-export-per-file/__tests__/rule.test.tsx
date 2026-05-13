import outdent from 'outdent';

// @ts-expect-error - ruleTester is untyped but comes from @atlassian/eslint-utils
import { ruleTester as atlaskitRuleTester } from '@atlassian/eslint-utils';

import rule from '../index';

function multipleValueExportsError({
	count = '2',
	names = 'foo, bar',
	line,
	column,
}: {
	count?: string;
	names?: string;
	line?: number;
	column?: number;
} = {}) {
	return {
		messageId: 'multipleValueExports',
		...(line ? { line } : {}),
		...(column ? { column } : {}),
		data: {
			count,
			names,
		},
	};
}

function multipleValueExportsErrors({
	count,
	names,
	locations,
}: {
	count: string;
	names: string;
	locations: Array<{ line: number; column?: number }>;
}) {
	return locations.map((location) => multipleValueExportsError({ count, names, ...location }));
}

describe('one-value-export-per-file', () => {
	atlaskitRuleTester.run('valid exports', rule, {
		valid: [
			{
				name: 'allows exactly one value export with multiple type and interface exports',
				code: outdent`
					export const foo = 'foo';
					export type Foo = typeof foo;
					export interface Bar {
						bar: string;
					}
					export type { Baz };
					export { type Qux };
				`,
			},
			{
				name: 'allows multiple type and interface exports with no value exports',
				code: outdent`
					export type Foo = string;
					export interface Bar {
						bar: string;
					}
					export type { Baz, Qux };
					export { type Quux };
				`,
			},
			{
				name: 'ignores re-export-only barrel syntax',
				code: outdent`
					export { Foo } from './Foo';
					export type { Bar } from './Bar';
					export * from './Baz';
					export * as Qux from './Qux';
				`,
			},
			{
				name: 'does not count re-exports alongside one local value export',
				code: outdent`
					export const foo = 'foo';
					export { Bar } from './Bar';
					export * from './Baz';
				`,
			},
			{
				name: 'allowPrimitiveExports: allows multiple primitive value exports',
				code: outdent`
					export const stringValue = 'foo';
					export const numberValue = 1;
					export const booleanValue = true;
					export const nullValue = null;
					export const undefinedValue = undefined;
					export const templateValue = \`foo\`;
				`,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: allows primitive constant expressions',
				code: outdent`
					export const maxFiles = 10;
					export const imageMaxFileSize = 20 * 1024 * 1024;
					export const timeoutMs = 60 * 1000;
					export const negativeOne = -1;
					export const label = 'foo' + 'bar';
					export const castValue = (1 + 2) as number;
				`,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: ignores primitive exports alongside one complex value export',
				code: outdent`
					export const stringValue = 'foo';
					export const imageMaxFileSize = 20 * 1024 * 1024;
					export const foo = () => null;
					export type Foo = typeof foo;
				`,
				options: [{ allowPrimitiveExports: true }],
			},
		],
		invalid: [
			{
				name: 'reports every local value export declaration in a violating file',
				code: outdent`
					export const foo = 'foo';
					export const bar = 'bar';
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, bar',
					locations: [{ line: 1 }, { line: 2 }],
				}),
			},
			{
				name: 'reports multiple declarators in a single exported variable declaration',
				code: outdent`
					export const foo = 1, bar = 2;
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, bar',
					locations: [{ line: 1 }, { line: 1 }],
				}),
			},
			{
				name: 'reports every exported const, let, var, function, class, and enum declaration',
				code: outdent`
					export const foo = 'foo';
					export let bar = 'bar';
					export var baz = 'baz';
					export function qux() {}
					export class Quux {}
					export enum Corge {
						Grault = 'grault',
					}
				`,
				errors: multipleValueExportsErrors({
					count: '6',
					names: 'foo, bar, baz, qux, Quux, and 1 more',
					locations: [{ line: 1 }, { line: 2 }, { line: 3 }, { line: 4 }, { line: 5 }, { line: 6 }],
				}),
			},
			{
				name: 'reports every destructured object and array binding export',
				code: outdent`
					export const { foo, nested: { bar }, baz = 'baz', ...rest } = source;
					export const [qux] = items;
				`,
				errors: multipleValueExportsErrors({
					count: '5',
					names: 'foo, bar, baz, rest, qux',
					locations: [{ line: 1 }, { line: 1 }, { line: 1 }, { line: 1 }, { line: 2 }],
				}),
			},
			{
				name: 'counts a default export as one local value export',
				code: outdent`
					export default function foo() {}
					export const bar = 'bar';
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, bar',
					locations: [{ line: 1, column: 25 }, { line: 2 }],
				}),
			},
			{
				name: 'uses the named default export identifier location when default export is second',
				code: outdent`
					export const bar = 'bar';
					export default function foo() {}
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'bar, foo',
					locations: [{ line: 1 }, { line: 2, column: 25 }],
				}),
			},
			{
				name: 'counts an anonymous default export with the name default',
				code: outdent`
					export default () => {};
					export const foo = 'foo';
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'default, foo',
					locations: [{ line: 1 }, { line: 2 }],
				}),
			},
			{
				name: 'reports every local named value export specifier',
				code: outdent`
					const foo = 'foo';
					const bar = 'bar';
					export { foo, bar };
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, bar',
					locations: [{ line: 3 }, { line: 3 }],
				}),
			},
			{
				name: 'reports aliased local named value exports on the exported name',
				code: outdent`
					const foo = 'foo';
					const baz = 'baz';
					export { foo as bar, baz };
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'bar, baz',
					locations: [
						{ line: 3, column: 17 },
						{ line: 3, column: 22 },
					],
				}),
			},
			{
				name: 'reports only value exports from mixed named specifiers',
				code: outdent`
					const foo = 'foo';
					type Bar = string;
					export { foo, type Bar };
					export const baz = 'baz';
				`,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, baz',
					locations: [{ line: 3 }, { line: 4 }],
				}),
			},
			{
				name: 'allowPrimitiveExports: still reports complex runtime expressions',
				code: outdent`
					export const foo = createFoo();
					export const bar = SOME_IMPORTED_CONSTANT;
				`,
				options: [{ allowPrimitiveExports: true }],
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, bar',
					locations: [{ line: 1 }, { line: 2 }],
				}),
			},
			{
				name: 'does not provide an autofix',
				code: outdent`
					export const foo = 'foo';
					export const bar = 'bar';
				`,
				output: null,
				errors: multipleValueExportsErrors({
					count: '2',
					names: 'foo, bar',
					locations: [{ line: 1 }, { line: 2 }],
				}),
			},
		],
	});
});
