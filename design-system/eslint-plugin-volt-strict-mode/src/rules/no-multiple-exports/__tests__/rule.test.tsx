import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
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
				name: 'multiple export enums are allowed',
				code: `
          export enum Direction {
            Up = 'UP',
            Down = 'DOWN',
          }
          export enum Status {
            Active = 'ACTIVE',
            Inactive = 'INACTIVE',
          }
        `,
			},
			{
				name: 'enum exports alongside type exports are allowed',
				code: `
          export type Id = string;
          export enum Color {
            Red = 'red',
            Blue = 'blue',
          }
          export enum Size {
            Small = 'small',
            Large = 'large',
          }
        `,
			},
			{
				name: 'enum alongside single runtime export is allowed',
				code: `
          export enum Status {
            Active = 'ACTIVE',
            Inactive = 'INACTIVE',
          }
          export const getStatus = () => Status.Active;
        `,
			},
			{
				name: 'enum alongside single runtime export is allowed but runtime export should be first',
				code: `
					export const getStatus = () => Status.Active;
          export enum Status {
            Active = 'ACTIVE',
            Inactive = 'INACTIVE',
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
			{
				name: 'TypeScript function overloads with two overload signatures and implementation',
				code: `
          export function getAllComments(context: string): string[];
          export function getAllComments(context: number): number[];
          export function getAllComments(context: string | number): string[] | number[] {
            return [];
          }
        `,
			},
			{
				name: 'TypeScript function overloads alongside type exports',
				code: `
          export type Comment = { value: string };
          export function getAllComments(context: string): Comment[];
          export function getAllComments(context: number): Comment[];
          export function getAllComments(context: string | number): Comment[] {
            return [];
          }
        `,
			},
			{
				name: 'TypeScript function overloads with generic type parameters',
				code: `
          export function getAllComments(context: string): string[];
          export function getAllComments<TMessageIds extends string = string>(context: unknown): string[];
          export function getAllComments(context: unknown): string[] {
            return [];
          }
        `,
			},
			{
				name: 'multiple data-object consts are allowed (codemod leaves them in place)',
				code: `
          export const config = { a: 1, b: 2 };
          export const defaults = { c: 3 };
        `,
			},
			{
				name: 'multiple data-array consts are allowed',
				code: `
          export const items = [1, 2, 3];
          export const names = ['a', 'b'];
        `,
			},
			{
				name: 'data const alongside a single function export is allowed',
				code: `
          export const config = { a: 1 };
          export const build = () => null;
        `,
			},
			{
				name: 'call-expression and new-expression consts are treated as data (allowed)',
				code: `
          export const client = createClient();
          export const store = new Store();
        `,
			},
			{
				name: 'default export and named export of the same identifier count once (default first)',
				code: `
          const useThing = () => null;
          export default useThing;
          export { useThing };
        `,
			},
			{
				name: 'default export and named export of the same identifier count once (named first)',
				code: `
          const useThing = () => null;
          export { useThing };
          export default useThing;
        `,
			},
			{
				name: 'import-then-export barrel shim of multiple imported bindings is not counted (owned by no-re-exports)',
				code: `
          import useThing, { type ThingOptions, THING_KEY } from './thing';
          import { OTHER_KEY } from './other';
          /**
           * @deprecated Import from the generated per-export subpath instead.
           */
          export { useThing, type ThingOptions, THING_KEY, OTHER_KEY };
        `,
			},
			{
				name: 'default export of an imported binding is a re-export, not counted',
				code: `
          import useThing from './thing';
          import { HELPER } from './helper';
          export default useThing;
          export { HELPER };
        `,
			},
			{
				name: 'aliased re-export of an already-exported local const counts once (export { Drawer as default })',
				code: `
          export const Drawer = () => null;
          export { Drawer as default };
        `,
			},
			{
				name: 'function const plus default export of the same local binding counts once',
				code: `
          export const Foo = () => null;
          export default Foo;
        `,
			},
			{
				name: 'aliased re-export of an already-exported local function counts once',
				code: `
          export function buildThing() { return null; }
          export { buildThing as buildThingAlias };
        `,
			},
			{
				name: 'aliased re-export of an already-exported local class counts once',
				code: `
          export class Thing {}
          export { Thing as ThingAlias, Thing as default };
        `,
			},
			{
				name: 'single function const plus multiple aliased re-exports of it count once',
				code: `
          export const layoutColumn = { name: 'layout-column' };
          export const tableCell = () => null;
          export { tableCell as tableCellStage0 };
        `,
			},
			{
				name: 'exports that share a module-local reassigned binding are allowed',
				code: `
          let config: { enabled: boolean } | null = null;
          export function configure(nextConfig: { enabled: boolean }) {
            config = nextConfig;
          }
          export function isEnabled() {
            return config?.enabled ?? false;
          }
        `,
			},
			{
				name: 'exports that mutate and read shared reassignable module-local object state are allowed',
				code: `
          let state = { enabled: false };
          export function enable() {
            state.enabled = true;
          }
          export function isEnabled() {
            return state.enabled;
          }
        `,
			},
			{
				name: 'SSR profiler exports that share module-local Map state are allowed',
				code: `
          let startTimes = new Map<string, number[]>();
          let spanStates = new Map<string, { latestEndTime?: number }>();

          export const clearState = (): void => {
            startTimes.clear();
            spanStates.clear();
          };

          export const flushSsrRenderProfilerTraces = (): void => {
            spanStates.forEach(() => {});
            spanStates.clear();
          };

          export const SsrRenderProfilerInner = (): null => {
            startTimes.set('render', []);
            spanStates.set('render', {});
            return null;
          };
        `,
			},
			{
				name: 'root package barrel (src/index.tsx) may aggregate many exports',
				filename: '/repo/packages/my-pkg/src/index.tsx',
				code: `
          export const Foo = () => null;
          export const Bar = () => null;
          export function baz() {}
        `,
			},
			{
				name: 'root package barrel with .js extension may aggregate many exports',
				filename: '/repo/packages/my-pkg/src/index.js',
				code: `
          export const one = () => null;
          export const two = () => null;
        `,
			},
		],
		invalid: [
			{
				name: 'nested barrel (src/components/index.tsx) is NOT a root barrel and still errors',
				filename: '/repo/packages/my-pkg/src/components/index.tsx',
				code: `
          export const Foo = () => null;
          export const Bar = () => null;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'non-index file directly under src is NOT a root barrel and still errors',
				filename: '/repo/packages/my-pkg/src/entry.tsx',
				code: `
          export const Foo = () => null;
          export const Bar = () => null;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'default export and named export of DIFFERENT identifiers still error',
				code: `
          const foo = () => null;
          const bar = () => null;
          export default foo;
          export { bar };
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'a mutable value used by only one export does not exempt unrelated exports',
				code: `
          let count = 0;
          export function increment() {
            count += 1;
          }
          export function reset() {}
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'two named component exports',
				code: `
          export const Foo = (props: { foo: string }) => <div>FooComponent</div>;
          export const Bar = (props: { boo: string }) => <div>BarComponent</div>;
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
			{
				name: 'two function-valued consts still error even alongside data consts',
				code: `
          export const config = { a: 1 };
          export const build = () => null;
          export const parse = () => null;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'function-valued const alongside a real function declaration errors',
				code: `
          export const config = { a: 1 };
          export const build = () => null;
          export function parse() { return null; }
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'satisfies-wrapped function-valued const counts (cannot escape via satisfies)',
				code: `
          type Fn = () => null;
          export const build = (() => null) satisfies Fn;
          export const parse = (() => null) satisfies Fn;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'as-wrapped function-valued const counts (cannot escape via as)',
				code: `
          type Fn = () => null;
          export const build = (() => null) as Fn;
          export const parse = (() => null) as Fn;
        `,
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
				name: 'allowPrimitiveExports: string constants with as const',
				code: `
          export const FOO = 'foo' as const;
          export const BAR = 'bar' as const;
        `,
				options: [{ allowPrimitiveExports: true }],
			},
			{
				name: 'allowPrimitiveExports: mixed as const and plain primitives',
				code: `
          export const SELECTOR = '[data-my-attr]' as const;
          export const SIZE = 32;
          export const NAME = 'button' as const;
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

// B2 (shared mutable module state / TS2632) and B3 (shared Compiled styles) are
// file shapes that the `volt-no-multi-exports` codemod refuses to split. The
// lint rule stays aligned with the codemod — it must never flag a file the
// codemod would refuse to auto-split — so these files are exempt wholesale.
typescriptEslintTester.run(
	'no-multiple-exports B2/B3 codemod-unsplittable exemptions',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			// ---- B3: shared Compiled styles ----
			{
				name: 'B3: two components share one @compiled/react css value',
				code: `
          import { css } from '@compiled/react';
          const sharedStyles = css({ color: 'red' });
          export const Foo = () => <div css={sharedStyles} />;
          export const Bar = () => <span css={sharedStyles} />;
        `,
			},
			{
				name: 'B3: two components share one @atlaskit/css css value',
				code: `
          import { css } from '@atlaskit/css';
          const sharedStyles = css({ color: 'red' });
          export const Foo = () => <div css={sharedStyles} />;
          export const Bar = () => <span css={sharedStyles} />;
        `,
			},
			{
				name: 'B3: shared style value via aliased css import',
				code: `
          import { css as cssFn } from '@compiled/react';
          const sharedStyles = cssFn({ color: 'red' });
          export const Foo = () => <div css={sharedStyles} />;
          export const Bar = () => <span css={sharedStyles} />;
        `,
			},
			{
				name: 'B3: shared cssMap value across exports',
				code: `
          import { cssMap } from '@compiled/react';
          const styleMap = cssMap({ primary: { color: 'red' } });
          export const Foo = () => <div css={styleMap.primary} />;
          export const Bar = () => <span css={styleMap.primary} />;
        `,
			},
			{
				name: 'B3: page example shape (profilecard Error.tsx) — three exports use different properties of one shared @atlaskit/css cssMap via xcss/cx',
				code: `
          import { cssMap, cx } from '@atlaskit/css';
          const styles = cssMap({
            errorWrapper: { textAlign: 'center' },
            errorTitle: { marginTop: '8px' },
            teamErrorText: { color: 'grey' },
          });
          export const ErrorWrapper = (props) => <div xcss={cx(styles.errorWrapper)} {...props} />;
          export const ErrorTitle = (props) => <div xcss={styles.errorTitle}>{props.children}</div>;
          export const TeamErrorText = (props) => <div xcss={cx(styles.teamErrorText)}>{props.children}</div>;
        `,
			},
			{
				name: 'B3: page example shape (linking-common Skeleton) — shared span skeleton styles',
				code: `
          import { css, keyframes } from '@compiled/react';
          const placeholderShimmer = keyframes({});
          const spanSkeletonStyles = css({ userSelect: 'none', animationName: placeholderShimmer });
          export const SpanSkeleton = (props) => <span css={spanSkeletonStyles} {...props} />;
          export const BlockSkeleton = (props) => <div css={spanSkeletonStyles} {...props} />;
        `,
			},
			// ---- B2: shared mutable module state (TS2632) ----
			{
				name: 'B2: module-level let written by one export and read by another',
				code: `
          let count = 0;
          export const increment = () => { count += 1; };
          export const read = () => count;
        `,
			},
			{
				name: 'B2: page example shape (media-viewer ufoExperiences) — shared mutable singleton',
				code: `
          let ufoExperience: any;
          export const getExperience = () => {
            if (!ufoExperience) { ufoExperience = {}; }
            return ufoExperience;
          };
          export const resetExperience = () => { ufoExperience = undefined; };
        `,
			},
			{
				name: 'B2: shared mutable var reassigned in one export, read in another',
				code: `
          var current = null;
          export function setCurrent(next) { current = next; }
          export function getCurrent() { return current; }
        `,
			},
			{
				name: 'B2: shared mutable state with globalReturn parser scope wrapper',
				code: `
          let debugEnabled = false;
          let stacktracesEnabled = false;
          export function enableLogger(enable: boolean): void { debugEnabled = enable; }
          export function enableStacktraces(enable: boolean): void { stacktracesEnabled = enable; }
          export function logStacktrace(): void { if (stacktracesEnabled) { console.log(new Error().stack); } }
          export default function debug(msg: unknown): void { if (debugEnabled) { console.log(msg); } }
        `,
				parserOptions: {
					ecmaFeatures: {
						globalReturn: true,
						jsx: true,
					},
				},
			},
			{
				name: 'B2: page example shape (adf-schema tableNodes) — reader export reaches the shared mutable let through a non-exported helper',
				code: `
          let testGlobalTheme: string;
          export const setGlobalTheme = (theme: string): void => { testGlobalTheme = theme; };
          const getGlobalTheme = () => { if (testGlobalTheme) { return testGlobalTheme; } return ''; };
          export const getCellDomAttrs = (node) => getGlobalTheme();
        `,
			},
		],
		invalid: [
			// Guard: over-exemption must not happen. These are still splittable.
			{
				name: 'guard: two components each with their OWN css value still error (not shared)',
				code: `
          import { css } from '@compiled/react';
          const fooStyles = css({ color: 'red' });
          const barStyles = css({ color: 'blue' });
          export const Foo = () => <div css={fooStyles} />;
          export const Bar = () => <span css={barStyles} />;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'guard: css value used by only ONE export does not exempt the file',
				code: `
          import { css } from '@compiled/react';
          const fooStyles = css({ color: 'red' });
          export const Foo = () => <div css={fooStyles} />;
          export const Bar = () => <span />;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'guard: each export owns its OWN cssMap (no shared map) still errors',
				code: `
          import { cssMap } from '@atlaskit/css';
          const fooStyles = cssMap({ root: { color: 'red' } });
          const barStyles = cssMap({ root: { color: 'blue' } });
          export const Foo = (props) => <div xcss={fooStyles.root} />;
          export const Bar = (props) => <span xcss={barStyles.root} />;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'guard: css-like local NOT imported from Compiled does not exempt',
				code: `
          const css = (x) => x;
          const sharedStyles = css({ color: 'red' });
          export const Foo = () => <div css={sharedStyles} />;
          export const Bar = () => <span css={sharedStyles} />;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'guard: shared CONST object (not reassigned) is not B2 mutable state',
				code: `
          const config = { value: 0 };
          export const bump = () => { config.value += 1; };
          export const read = () => config.value;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'guard: mutable let used by only ONE export does not exempt the file',
				code: `
          let count = 0;
          export const increment = () => { count += 1; };
          export const Bar = () => null;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
			{
				name: 'guard: indirect read via helper but only ONE export touches the mutable let does not exempt',
				code: `
          let theme: string;
          const getTheme = () => theme;
          export const setTheme = (next: string) => { theme = next; };
          export const Unrelated = () => null;
        `,
				errors: [{ messageId: 'no-multiple-exports' }],
			},
		],
	},
);
