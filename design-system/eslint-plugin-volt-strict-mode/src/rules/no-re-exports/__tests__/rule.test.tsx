import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-re-exports',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			{
				name: 'local binding export',
				code: `
          const Foo = () => null;
          export { Foo };
        `,
			},
			{
				name: 'exported const not aliasing import',
				code: `
          import { helper } from './helpers';
          export const Foo = () => helper();
        `,
			},
			{
				name: 'default export of local',
				code: `
          function Page() {
            return null;
          }
          export default Page;
        `,
			},
			{
				name: 'type-only import then type export (same file)',
				code: `
          import type { Props } from './types';
          export type LocalProps = Props;
        `,
			},
			{
				name: 'type-only import then export type specifier list',
				code: `
          import type { X } from './types';
          export type { X };
        `,
			},
			{
				name: 'export star exempted by @deprecated JSDoc shim marker',
				code: `
          /** @deprecated Import from the generated per-export subpath instead. */
          export * from './Foo';
        `,
			},
			{
				name: 'export named from module exempted by @deprecated shim (codemod-emitted JSDoc)',
				code: `
          /**
           * @deprecated Import from the generated per-export subpath instead.
           */
          export { Bar } from './Bar';
        `,
			},
			{
				name: 'import-then-export exempted by @deprecated marker',
				code: `
          import { Foo } from './Foo';
          // @deprecated
          export { Foo };
        `,
			},
			{
				name: 'default re-export exempted by @deprecated marker',
				code: `
          import Foo from './Foo';
          /** @deprecated Import from the generated per-export subpath instead. */
          export default Foo;
        `,
			},
			{
				name: 'bare @deprecated (word-boundary, at end of comment) exempts a re-export',
				code: `
          /** @deprecated */
          export { Bar } from './Bar';
        `,
			},
			{
				name: 'statement-level type-only re-export from module is exempt',
				code: `export type { LayerType } from './types';`,
			},
			{
				name: 'inline type-only specifiers re-exported from module are exempt',
				code: `export { type A, type B } from './types';`,
			},
			{
				name: 'empty re-export (export {} from) is a no-op and exempt',
				code: `export {} from './side-effect';`,
			},
			{
				name: 'sole default export of an imported identifier is exempt (single-export module)',
				code: `
          import AnalyticsReactContext from '@atlaskit/analytics-next-stable-react-context';
          export type { AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';
          export default AnalyticsReactContext;
        `,
			},
			{
				name: 'sole named re-exposure of an imported identifier is exempt',
				code: `
          import { X } from './x';
          export { X };
        `,
			},
			{
				name: 'sole re-exposed import alongside only a primitive const is still exempt',
				code: `
          import X from './x';
          export const LABEL = 'hello';
          export default X;
        `,
			},
			{
				name: 'satisfies-wrapped primitive const is still primitive, so sole re-exposed import stays exempt',
				code: `
          import X from './x';
          export const LABEL = 'hello' satisfies string;
          export default X;
        `,
			},
			{
				name: 'root package barrel (src/index.tsx) may re-export freely without @deprecated',
				filename: '/repo/packages/my-pkg/src/index.tsx',
				code: `
          export * from './Foo';
          export { Bar } from './Bar';
        `,
			},
			{
				name: 'root package barrel (src/index.ts) import-then-export alongside other exports is exempt',
				filename: '/repo/packages/my-pkg/src/index.ts',
				code: `
          import { Foo } from './Foo';
          export { Foo };
          export function bar() {}
        `,
			},
			{
				name: 'root package barrel with .js extension is exempt',
				filename: '/repo/packages/my-pkg/src/index.js',
				code: `export { Bar } from './Bar';`,
			},
			{
				name: 'root package barrel with .jsx extension is exempt',
				filename: '/repo/packages/my-pkg/src/index.jsx',
				code: `export { Bar } from './Bar';`,
			},
		],
		invalid: [
			{
				name: 'export star',
				code: `export * from './Foo';`,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'export named from module',
				code: `export { Bar } from './Bar';`,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'import then export same identifier alongside another runtime export',
				code: `
          import { Foo } from './Foo';
          export { Foo };
          export function bar() {}
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'export const alias of import alongside another runtime export',
				code: `
          import { Foo } from './Foo';
          export const Foo2 = Foo;
          export function bar() {}
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'default export of imported binding alongside a named runtime export',
				code: `
          import Foo from './Foo';
          export function bar() {}
          export default Foo;
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 're-export with satisfies alongside another runtime export',
				code: `
          import { Foo } from './Foo';
          export const Foo2 = Foo satisfies () => void;
          export function bar() {}
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'mixed runtime + inline type re-export from module still reports',
				code: `export { A, type B } from './y';`,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: '@deprecatedFoo (no word boundary) is NOT treated as a shim marker',
				code: `
          /** @deprecatedFoo */
          export { Bar } from './Bar';
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: '@deprecated_marker (trailing underscore) is NOT treated as a shim marker',
				code: `
          /** @deprecated_marker */
          export { Bar } from './Bar';
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: '@deprecated on an unrelated preceding statement does not exempt a later re-export',
				code: `
          // @deprecated
          const x = 1;
          export { Bar } from './Bar';
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'nested barrel (src/components/index.tsx) is NOT a root barrel and still reports',
				filename: '/repo/packages/my-pkg/src/components/index.tsx',
				code: `export { Bar } from './Bar';`,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'non-index file directly under src is NOT a root barrel and still reports',
				filename: '/repo/packages/my-pkg/src/entry.tsx',
				code: `export { Bar } from './Bar';`,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'index file not under a src directory is NOT a root barrel and still reports',
				filename: '/repo/packages/my-pkg/lib/index.tsx',
				code: `export { Bar } from './Bar';`,
				errors: [{ messageId: 'no-re-exports' }],
			},
		],
	},
);
