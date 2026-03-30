import { typescriptEslintTester } from '../../__tests__/utils/_tester';
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
				name: 'import then export same identifier',
				code: `
          import { Foo } from './Foo';
          export { Foo };
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'export const alias of import',
				code: `
          import { Foo } from './Foo';
          export const Foo2 = Foo;
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 'default export of imported binding',
				code: `
          import Foo from './Foo';
          export default Foo;
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
			{
				name: 're-export with satisfies',
				code: `
          import { Foo } from './Foo';
          export const Foo2 = Foo satisfies () => void;
        `,
				errors: [{ messageId: 'no-re-exports' }],
			},
		],
	},
);
