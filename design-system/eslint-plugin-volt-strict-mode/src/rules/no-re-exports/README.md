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

## Options

This rule does not accept options.

## When not to use it

Disable only at package public API boundaries if your publishing workflow still relies on a single
entry barrel (prefer narrowing and follow-up cleanup).
