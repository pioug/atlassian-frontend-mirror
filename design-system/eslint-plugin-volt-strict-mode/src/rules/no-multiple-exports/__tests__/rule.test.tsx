import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-multiple-exports',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			{
				name: 'single named component export',
				code: `
          export const Foo = (props: { foo: string }) => <div>FooComponent</div>;
        `,
			},
			{
				name: 'default export only',
				code: `
          export default function Page() {
            return null;
          }
        `,
			},
			{
				name: 'single export with multiple type exports',
				code: `
          export type A = string;
          export interface B {
            x: number;
          }
          export const Foo = () => null;
        `,
			},
			{
				name: 'type re-export specifiers alongside single value export',
				code: `
          export type { A, B };
          export const Foo = () => null;
        `,
			},
			{
				name: 'inline type export specifiers with value export',
				code: `
          export { type A, type B };
          export const Foo = () => null;
        `,
			},
			{
				name: 'only type exports',
				code: `
          export type T = number;
          export interface U {
            a: T;
          }
        `,
			},
			{
				name: 'single export enum',
				code: `
          export enum E {
            A = 1,
            B = 2,
          }
        `,
			},
			{
				name: 'single export with two type aliases',
				code: `
          export type RowId = string;
          export type ColumnId = string;
          export const Grid = () => null;
        `,
			},
		],
		invalid: [
			{
				name: 'two named component exports',
				code: `
          export const Foo = (props: { foo: string }) => <div>FooComponent</div>;
          export const Bar = (props: { boo: string }) => <div>BarComponent</div>;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'default and named runtime export',
				code: `
          export const Foo = () => null;
          export default Foo;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'two exports in one export declaration',
				code: `
          export const a = 1, b = 2;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'two export specifiers',
				code: `
          const a = 1;
          const b = 2;
          export { a, b };
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'three exports report second and third',
				code: `
          export const one = 1;
          export const two = 2;
          export const three = 3;
        `,
				errors: [{ messageId: 'no-multiple-exports' }, { messageId: 'no-multiple-exports' }],
			},
			// allowPrimitiveExports: still errors on complex exports
			{
				name: 'allowPrimitiveExports: two component exports still error',
				code: `
          export const Foo = () => null;
          export const Bar = () => null;
        `,
				options: [{ allowPrimitiveExports: true }],
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'allowPrimitiveExports: primitive and component export errors on component',
				code: `
          export const LABEL = 'hello';
          export const Foo = () => null;
          export const Bar = () => null;
        `,
				options: [{ allowPrimitiveExports: true }],
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'allowPrimitiveExports: default export alongside component still errors',
				code: `
          export const Foo = () => null;
          export default function Bar() { return null; }
        `,
				options: [{ allowPrimitiveExports: true }],
				errors: [{ messageId: 'no-multiple-exports' }],
			},
		],
	},
);

typescriptEslintTester.run(
	'no-multiple-exports with allowPrimitiveExports',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			{
				name: 'allowPrimitiveExports: multiple number constant exports',
				code: `
          export const SPACING_SMALL = 4;
          export const SPACING_MEDIUM = 8;
          export const SPACING_LARGE = 16;
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: multiple string constant exports',
				code: `
          export const FOO = 'foo';
          export const BAR = 'bar';
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: multiple boolean constant exports',
				code: `
          export const IS_ENABLED = true;
          export const IS_VISIBLE = false;
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: mixed primitive types',
				code: `
          export const NAME = 'button';
          export const SIZE = 32;
          export const ACTIVE = true;
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: primitive alongside type exports',
				code: `
          export type Id = string;
          export const FOO = 'foo';
          export const BAR = 'bar';
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: template literal constants',
				code: `
          export const A = \`hello\`;
          export const B = \`world\`;
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: single component export still valid',
				code: `
          export const Foo = () => null;
        `,
				options: [{ allowPrimitiveExports: true }],
			},
		],
		invalid: [],
	},
);
