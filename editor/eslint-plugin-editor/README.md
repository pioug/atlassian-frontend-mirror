# ESLint Plugin Editor

This is a plugin for creating custom ESLint rules relevant to the Editor packages.

## Rules

### Warn No Restricted Imports
This rule is simply a clone of ESLint's `no-restricted-imports` rule. This is a workaround because ESLint does not support using the same rule with multiple severity levels. We currently use `no-restricted-imports` repo-wide with severity level `error`. This clone allows us to enforce the rule with severity level `warn`. 

```
  '@atlaskit/editor/warn-no-restricted-imports': [
    'warn',
    {...},
  ],
  'no-restricted-imports': [
    'error',
    {...},
  ]
```

### Enforce Compiled Migration Gate
Enforces that components returned from `withCompiledMigration()` (from `@atlaskit/editor-common/compiled-migration`) have their compiled `css` prop gated behind the `platform_editor_static_css` experiment.

Reports:
- **`missingGate`** — a `css` prop exists but isn't wrapped with `expValEquals('platform_editor_static_css', 'isEnabled', true)`.
- **`missingCssProp`** — a migration-wrapped component is used without a `css` prop at all (likely forgot to apply compiled styles).

```
  '@atlaskit/editor/enforce-compiled-migration-gate': 'error',
```

See the [Emotion → Compiled Feature Gating Strategy](https://hello.atlassian.net/wiki/spaces/~712020e6f24689f2da470b80ba6873df7b44a2/pages/6788274038/Emotion+-+Compiled+Feature+Gating+Strategy) for details on the migration pattern.
