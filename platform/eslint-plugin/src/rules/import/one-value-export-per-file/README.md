# one-value-export-per-file

Reports files that contain more than one **local value export**. https://hello.atlassian.net/wiki/spaces/DevInfra/pages/6809881812/One+Export+Per+File

## Options

### `allowPrimitiveExports`

When set to `true`, primitive value exports are ignored when counting local value exports. This
covers direct primitive literals and simple primitive constant expressions:

```typescript
// eslint @atlaskit/platform/one-value-export-per-file: ['warn', { allowPrimitiveExports: true }]
export const maxFiles = 10;
export const imageMaxFileSize = 20 * 1024 * 1024;
export const label = 'foo' + 'bar';
```

Complex runtime values are still counted:

```typescript
export const foo = createFoo();
export const bar = SOME_IMPORTED_CONSTANT;
```

## What counts as a value export

The rule counts local runtime exports such as:

```typescript
export const foo = 'foo';
export let bar = 'bar';
export var baz = 'baz';
export function qux() {}
export class Quux {}
export enum AAA {
	Bbb = 'Ccc',
}
export default function Example() {}
export const { destructuredFoo, nested: { destructuredBar } } = source;

const localFoo = 'foo';
const localBar = 'bar';
export { localFoo, localBar };
```

If a file has more than one of these exports, the rule reports every local value export in the file.
Each warning includes the total number of local value exports and a short sample of their names.
Reporting every value export makes the migration work visible for each symbol and keeps temporary
inline overrides specific to each violation.

## What is ignored

The rule intentionally ignores type-only exports:

```typescript
export type Foo = string;
export interface Bar {
	bar: string;
}
export type { Baz };
export { type Qux };
```

It also ignores re-export-only barrel syntax because those exports are not values declared locally in
the file:

```typescript
export { Foo } from './Foo';
export type { Bar } from './Bar';
export * from './Baz';
export * as Qux from './Qux';
```

## Examples

### Invalid

```typescript
export const foo = 'foo';
export const bar = 'bar';
```

```typescript
export default function Foo() {}
export const bar = 'bar';
```

```typescript
export const { foo, nested: { bar } } = source;
```

### Valid

```typescript
export const foo = 'foo';
export type Foo = typeof foo;
export interface FooOptions {
	name: string;
}
```

```typescript
export { Foo } from './Foo';
export { Bar } from './Bar';
```

## Autofix

This rule does not provide an ESLint autofix. Splitting files and updating imports should be handled
by the migration codemod instead of by ESLint.
