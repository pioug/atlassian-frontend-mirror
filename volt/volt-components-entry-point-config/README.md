# VoltComponentsEntryPointConfig

Config for entry-points to drive codemods, linting, and ratcheting.

## Usage

```ts
import { config } from '@atlaskit/volt-components-entry-point-config';
```

## Package readiness (`scripts/packages.codegen.tsx`)

`PACKAGE_NAMES` is generated from
`platform/volt-preset-packages.json`:

- every preset entry becomes a key (using the on-disk `package.json` `name` when present)
- `voltCompliant: true` → per-symbol `voltCompliant: true` allowed (lint report + suggestion)
- `consumersMigrated: true` → per-symbol `consumersMigrated: true` (Stage 2; reserved for future warn→error)
- otherwise → map entry-points when possible, but keep `voltCompliant: false` (silent)

Do not edit `scripts/packages.codegen.tsx` by hand. Update the preset JSON, then regenerate.

## Regenerating

After package `exports` change (e.g. after a debarrel run), or when you want readiness /
entry-point mappings to catch up with `volt-preset-packages.json`:

```bash
afm workspace @atlaskit/volt-components-entry-point-config codegen
```

The Volt preset is **not** a signed-source dependency of the generated files, so flipping
`voltCompliant` / `consumersMigrated` elsewhere does not require regenerating this package in the
same PR. Regenerate on a cadence when you want lint/`voltCompliant: true` coverage to include newly
ready packages.

Ambiguous mappings belong in `src/overrides.tsx` (merged on top of codegen output). Overrides are
partial — supply only the fields you want to change on a generated symbol.

## Keeping a symbol on the barrel (`voltCompliant: false`)

`voltCompliant` is set from the Volt preset for whole packages. To keep an individual symbol on the
barrel after its package is `voltCompliant`, override it with `voltCompliant: false`:

```ts
'@atlaskit/tokens': {
	'': {
		token: { voltCompliant: false },
	},
},
```

Codegen also writes `src/codegen-report.codegen.json` (version-controlled) with:
- `meta.mapped` / `meta.unmapped` — totals (`voltCompliant: true` with an entry-point vs everything else)
- `meta.packages[pkg]` — per-package `mapped` / `unmapped` / `ambiguous` counts
- `ambiguous` — remaining tied symbols (detail)
- `resolvedByOverrides` — previously ambiguous symbols fixed via overrides
