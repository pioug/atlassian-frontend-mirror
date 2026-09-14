// `pretty-proptypes` ships no type definitions and has no `@types/*` package.
//
// Its sibling ambient declaration (`pretty-proptypes.d.ts`) is only in scope for
// this package's own compilation (its tsconfig `include`s `./src/**/*.ts`). It is
// NOT loaded by downstream consumers that type-check against `@atlaskit/docs`'s
// published `types` entry (`src/index.tsx`), because TypeScript only follows the
// import graph and never auto-loads a dependency's adjacent ambient `.d.ts`.
//
// This module puts the typing INSIDE the import graph, so any consumer that
// reaches `@atlaskit/docs` (e.g. via a package's `docs/*.tsx` example) resolves
// `pretty-proptypes` through this shim and gets the (permissive) types below,
// instead of failing with TS7016 "Could not find a declaration file for module
// 'pretty-proptypes'".
//
// The single `@ts-expect-error` is the one, contained spot where the untyped
// module is imported; everything else in the repo should import from this shim.
// @ts-expect-error - pretty-proptypes ships no type definitions
import PrettyProps, { Prop, PropsTable, components, LayoutRenderer } from 'pretty-proptypes';

export { Prop, PropsTable, components, LayoutRenderer };
export default PrettyProps as any;
