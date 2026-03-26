# visit-example-type-import-required

Ensures that `visitExample` uses a `typeof import(...)` generic and that the import path
matches the example file resolved from the call arguments.

## Rule Details

This rule enforces that when using `page.visitExample(groupId, packageId, exampleId)`,
a `typeof import('...')` generic type parameter is provided that points to the correct
example file at `packages/{groupId}/{packageId}/examples/{exampleId}.tsx`.

### Valid

```typescript
await page.visitExample<typeof import('../../examples/basic.tsx')>(
  'commerce', 'quote-line-items', 'basic'
);
```

```typescript
await this.page.visitExample<typeof import('../../examples/load-time-area.tsx')>(
  'apm', 'appmon-charts', 'load-time-area'
);
```

### Invalid

```typescript
// ❌ Missing typeof import generic
await page.visitExample('commerce', 'quote-line-items', 'basic');

// ❌ Import path doesn't match arguments
await page.visitExample<typeof import('../../examples/wrong.tsx')>(
  'commerce', 'quote-line-items', 'basic'
);

// ❌ File-level type alias (must be inlined)
type Examples = typeof import('../../examples/basic.tsx');
await page.visitExample<Examples>('commerce', 'quote-line-items', 'basic');

// ❌ Package imports not allowed
await page.visitExample<typeof import('@atlaskit/pkg/examples/basic.tsx')>(
  'commerce', 'quote-line-items', 'basic'
);
```

## What This Rule Does

1. **Enforces typeof import(...) generic** on all visitExample calls in .spec.tsx files
2. **Validates import path alignment** with the (groupId, packageId, exampleId) arguments
3. **Provides auto-fix** to add the typeof import generic
4. **Rejects file-level type aliases** (must be inlined)
5. **Rejects package imports** (must use relative paths)
6. **Resolves constant variables** used as arguments

## Limitations

- Only applies to `.spec.tsx` files
- Cannot auto-fix when arguments are dynamic (non-string, non-constant)
- Type aliases must be defined in the same file
- Numeric-prefixed example file resolution may not work without filesystem access in tests

## When This Rule Applies

This rule is automatically applied to all `.spec.tsx` files in the platform product. It helps prevent regressions and ensures type safety for Playwright integration tests that use `visitExample`.
