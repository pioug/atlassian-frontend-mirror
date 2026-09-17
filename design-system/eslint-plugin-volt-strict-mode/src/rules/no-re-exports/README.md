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

### Third-party dependency adapters

Re-exporting a verified third-party dependency is allowed. For example:

```tsx
export { Transform, StepMap } from 'prosemirror-transform';
```

The rule verifies an installed package manifest under `node_modules`. Workspace symlinks,
workspace/file/link/portal dependency declarations, relative imports, and unresolved requests are
not covered by this exemption. Missing or malformed package metadata fails closed. This check
requires a real filename and installed dependencies; a bare package-looking name alone is not proof
of a third-party dependency.

Named, star, namespace, and import-then-export forms follow the same boundary. A local re-export in
the same adapter is still checked:

```tsx
export { Transform } from 'prosemirror-transform'; // Allowed third-party boundary.
export { Step } from './transform-override'; // Local forwarding is still checked.
```

Stage 2 also requires external resolved-graph evidence and installed package metadata. It does not
exempt a local forwarding chain merely because it eventually reaches a third-party dependency; those
unresolvable upstream binding kinds remain unknown. Deprecated consumer migration edges remain
reported. Namespace escapes and literal module requests can be proven safe when the provider has a
complete, explicit, non-empty export surface and every binding is valid. Star exports, mixed/unknown
bindings, empty or unparsed providers, and unresolved member accesses do not establish that proof.
Side-effect-only static imports remain conservative. Raw dependency and test-impact counts are
unchanged.

## Options

This rule does not accept options.

## When not to use it

Disable only at package public API boundaries if your publishing workflow still relies on a single
entry barrel (prefer narrowing and follow-up cleanup).
