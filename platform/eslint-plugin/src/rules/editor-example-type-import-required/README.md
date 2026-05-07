# editor-example-type-import-required

Ensures every Playwright spec file under `**/__tests__/playwright/` ties at least one example
file into its TypeScript import graph via a `typeof import('...')` reference.

## Rule Details

CI uses `@atlassian/facts-map` to compute affected tests from changed files. For that to
work, every spec file needs a static, statically-resolvable reference to the example file(s)
it exercises. This rule enforces that contract.

The canonical pattern uses the `exampleName` test fixture with a `keyof typeof import(...)`
type assertion:

```typescript
test.use({
  exampleName: 'basic' as keyof typeof import('../../examples/01-basic.tsx'),
});
```

The rule also accepts any other shape of `typeof import('...')` anywhere in the spec, so
other established patterns are valid out of the box (see _Valid_ below).

### Valid

Canonical `test.use({ exampleName })` cast:

```typescript
import { editorTestCase as test } from '@af/editor-libra';

test.use({
  exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx'),
  editorProps: {},
});
```

Inline `visitExample<typeof import(...)>` generic:

```typescript
import { test } from '@playwright/test';

test('renders', async ({ page }) => {
  await page.visitExample<typeof import('../../examples/01-basic.tsx')>(
    'react-ufo',
    'atlaskit',
    'basic',
  );
});
```

Free-standing `typeof import(...)` (e.g. a typed helper alias):

```typescript
import { test } from '@playwright/test';

type ExampleModule = typeof import('../../examples/01-basic.tsx');
const helper = (m?: ExampleModule) => m;
```

`exampleName` declared in a nested `test.describe` rather than at the top level:

```typescript
test.describe('suite', () => {
  test.use({
    exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx'),
    editorProps: {},
  });
});
```

### Invalid

```typescript
// ❌ No typeof import(...) anywhere in the file
import { editorTestCase as test } from '@af/editor-libra';

test.use({
  editorProps: {},
});
```

```typescript
// ❌ exampleName present but missing the typeof import assertion
import { editorTestCase as test } from '@af/editor-libra';

test.use({
  exampleName: 'testing',
  editorProps: {},
});
```

```typescript
// ❌ test.use called with no object literal at all
import { editorTestCase as test } from '@af/editor-libra';

test.use({});
```

## What This Rule Does

1. **Targets every Playwright spec file** at `**/__tests__/playwright/*.spec.{ts,tsx}`.
2. **Single AST walk** per file — collects all `test.use({...})` calls *and* records whether
   any `TSImportType` (`typeof import('...')`) is present anywhere.
3. **Property-level fallback** — if no file-level `typeof import` was found, the rule looks
   for `test.use({ exampleName: '...' as keyof typeof import('...') })` in any `test.use()`
   call (top-level or nested in `test.describe`). One satisfying call is enough to pass the
   whole file.
4. **Autofix** — when the rule fires, it inserts the canonical
   `exampleName: '<defaultName>' as keyof typeof import('<resolvedPath>')` property into the
   first `test.use({...})` call (or replaces an existing untyped `exampleName` value). The
   default name is the existing `exampleName` value, falling back to `'testing'`. The import
   path is resolved by globbing
   `packages/{groupId}/{packageId}/examples/(?:\d+-)?<defaultName>(?:\.examples?)?\.tsx`
   relative to the spec's location.
6. **Excluded files** — a hard-coded `EXCLUDED_SPEC_FILES` list (suffix-matched against the
   file path) carves out specs that legitimately can't carry a spec-level `typeof import`,
   for example. This should be used sparingly in the case that the file is incompatible with 
	 this rule.
   Each cluster has an inline comment in `index.ts` explaining the reason. The list is
   suffix-matched, so a single string covers nested rerunner copies of the same spec under
   different `__tests__/playwright/` roots.

## Maintaining `EXCLUDED_SPEC_FILES`

When adding a new spec, prefer satisfying the rule with one of the _Valid_ patterns above.
Add to the exclusion list **only** when the spec genuinely can't reference an example file
at compile time (e.g. it uses `page.setContent()` with no example, or it drives navigation
via a runtime fixture).

## Limitations

- The rule walks the **spec file only**. A `typeof import('...')` that lives in a colocated
  page-object (e.g. `_helpers/page-object.ts`) doesn't satisfy the file-level check, so
  page-object-routed specs still need an entry in `EXCLUDED_SPEC_FILES`.
- The autofix uses the file system (`fs.readdirSync`) to resolve the example path. In test
  environments where the `examples/` directory doesn't exist on disk, the fix falls back to
  `<exampleName>.tsx` (no numeric prefix or `.examples?.tsx` suffix).
- The rule only matches `.spec.ts` / `.spec.tsx`. Other test extensions (`.test.ts`,
  `.integration.ts`, …) are ignored.

## When This Rule Applies

Configured in `platform/eslint.config.cjs` for every spec under
`**/__tests__/playwright/*.spec.{ts,tsx}` in the platform product.
