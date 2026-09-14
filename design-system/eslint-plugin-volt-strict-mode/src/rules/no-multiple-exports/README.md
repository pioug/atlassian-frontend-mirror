Volt Strict Mode expects each module to surface at most one runtime export so the module graph stays
shallow and predictable for bundlers and static analysis.

## Examples

### Incorrect

```tsx
export const Foo = () => null;
export const Bar = () => null;
```

### Correct

```tsx
export const Foo = () => null;
```

```tsx
export type Props = { id: string };
export interface Config {
	enabled: boolean;
}
export const Widget = (props: Props) => null;
```

## Options

### `allowPrimitiveExports`

- **Type**: `boolean`
- **Default**: `false`

When set to `true`, multiple exports of primitive values (strings, numbers, and booleans) are
allowed. Only complex exports like functions and components are restricted to one per file.

This is useful for files that collect related constants (e.g. spacing tokens, message strings) while
still enforcing the single-export constraint on runtime behaviour units like components.

```tsx
// eslint @atlaskit/volt-strict-mode/no-multiple-exports: ['error', { allowPrimitiveExports: true }]

// ✅ Correct — multiple primitive exports are allowed
export const SPACING_SMALL = 4;
export const SPACING_MEDIUM = 8;
export const SPACING_LARGE = 16;
```

```tsx
// ❌ Incorrect even with allowPrimitiveExports — two component exports
export const Foo = () => null;
export const Bar = () => null;
```

## Shared mutable-state exemption

A module is exempt when two or more runtime exports directly access the same module-local value and
one of them mutates it, including through a known mutating collection method such as `Map#set`,
`Map#clear`, or `Array#push`. Moving only one of those exports would change the state boundary, so
refactor the state design first before splitting the module.

```tsx
let currentConfig: Config | null = null;

export function configure(config: Config) {
	currentConfig = config;
}

export function getConfig() {
	return currentConfig;
}
```

## Root package barrel exemption

A package's root barrel entry point — `<pkg>/src/index.{ts,tsx,js,jsx}` (an `index` file directly
under a package's `src` directory) — is the package's public API surface, so it is fully exempt from
this rule and may aggregate many runtime exports:

```tsx
// packages/my-pkg/src/index.tsx — allowed
export const Foo = () => null;
export const Bar = () => null;
export function baz() {}
```

The exemption is intentionally narrow: nested barrels such as `src/components/index.tsx`,
non-`index` files under `src`, and `index` files outside a `src` directory are **not** exempt.

## Codemod-unsplittable exemptions (shared Compiled styles / shared mutable state)

This rule is aligned with the `volt-no-multi-exports` codemod and never flags a file the codemod
would refuse to auto-split. Two source-code shapes cannot be split, so files matching them are
exempt even though they have more than one runtime export:

**Shared Compiled styles** — two or more exports reference the same module-level `@compiled` value
(from `@compiled/react` or `@atlaskit/css`). Compiled styles can't cross module boundaries:

```tsx
import { css } from '@compiled/react';

const sharedStyles = css({ color: 'red' }); // one Compiled value…

// ✅ Exempt — both exports depend on the same Compiled style value
export const Foo = () => <div css={sharedStyles} />;
export const Bar = () => <span css={sharedStyles} />;
```

**Shared mutable module state** — two or more exports depend on the same reassignable module-level
`let`/`var` singleton where at least one export reassigns it. Splitting forks the singleton and
reassigning an imported binding is illegal (TS2632):

```tsx
let current; // module-level singleton

// ✅ Exempt — one export writes the singleton, another reads it
export const setCurrent = (next) => {
	current = next;
};
export const getCurrent = () => current;
```

Both exemptions are conservative: a file is only exempt when a **single** binding is genuinely
shared across two or more would-be split exports. Two exports that each own their own `css(...)`
value, or a `let` used by only one export, are still reported.

## When not to use it

Disable only in rare migration paths where a file must temporarily expose more than one runtime
symbol.
