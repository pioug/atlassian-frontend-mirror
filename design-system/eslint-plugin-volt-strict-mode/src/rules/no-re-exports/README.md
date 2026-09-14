Re-exports add a hop between the consumer and the defining module. Volt Strict Mode discourages
barrel files and import-then-export aliases so tooling and humans read dependencies directly from
their source.

## Examples

### Incorrect

```tsx
export * from './Foo';
export { Bar } from './Bar';
import { Foo } from './Foo';
export { Foo };
import { Baz } from './Baz';
export const BazAlias = Baz;
```

### Correct

```tsx
import { Foo } from './Foo';

const Foo = () => {
	return null;
};
export { Foo };
```

Type-only re-exports of imported types use `export type` / `export { type Name }` and are ignored by
this rule for value indirection.

### Root package barrel exemption

A package's root barrel entry point — `<pkg>/src/index.{ts,tsx,js,jsx}` (an `index` file directly
under a package's `src` directory) — is the package's public API surface, so it is fully exempt from
this rule. It may re-export freely **without** an `@deprecated` migration-shim marker:

```tsx
// packages/my-pkg/src/index.tsx — allowed
export * from './Foo';
export { Bar } from './Bar';
```

The exemption is intentionally narrow: nested barrels such as `src/components/index.tsx`,
non-`index` files under `src`, and `index` files outside a `src` directory are **not** exempt.

## Options

This rule does not accept options.

## When not to use it

Disable only at package public API boundaries if your publishing workflow still relies on a single
entry barrel (prefer narrowing and follow-up cleanup).
