Disallows importing from known package barrels when a mapped entry-point exists in
`@atlaskit/volt-components-entry-point-config`.

The rule only reports what it can rewrite: a symbol is flagged when the config gives it an
`entry-point` and marks it `voltCompliant: true` with `consumersMigrated: false` (Stage 1). Symbols
with `consumersMigrated: true` are owned by `no-migrated-barrel-imports` (error). Symbols with
`voltCompliant: false` (package not Stage 1 yet, or a permanent override) or with no mapped
entry-point are left alone. Imports carrying a namespace binding (`import * as X`) are skipped for
the same reason — they cannot be rewritten to entry-points.

Fixes are offered as a selectable suggestion (IDE quick-fix), not as an autofix. They will not run
on save or with `eslint --fix`.

## Examples

### Incorrect

```tsx
import Flag, { FlagGroup, useFlags } from '@atlaskit/flag';
```

### Correct

```tsx
import Flag from '@atlaskit/flag/flag';
import { FlagGroup } from '@atlaskit/flag/flag-group';
import { useFlags } from '@atlaskit/flag/use-flags';
```

When one import mixes rewriteable and non-rewriteable symbols, the suggestion moves only the
rewriteable ones and leaves the rest on the barrel.
