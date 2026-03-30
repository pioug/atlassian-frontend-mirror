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
		],
	},
);
