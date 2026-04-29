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

## When not to use it

Disable only in rare migration paths where a file must temporarily expose more than one runtime
symbol.
