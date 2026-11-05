# ESLint Plugin Editor

This is a plugin for creating custom ESLint rules relevant to the Editor packages.

## Rules

### Warn No Restricted Imports

This rule is simply a clone of ESLint's `no-restricted-imports` rule. This is a workaround because
ESLint does not support using the same rule with multiple severity levels. We currently use
`no-restricted-imports` repo-wide with severity level `error`. This clone allows us to enforce the
rule with severity level `warn`.

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

Enforces that components returned from `withCompiledMigration()` (from
`@atlaskit/editor-common/compiled-migration`) have their compiled `css` prop gated behind the
`platform_editor_renderer_static_css` experiment.

Reports:

- **`missingGate`** — a `css` prop exists but isn't wrapped with
  `isExperimentEnabled('platform_editor_renderer_static_css')`.
- **`missingCssProp`** — a migration-wrapped component is used without a `css` prop at all (likely
  forgot to apply compiled styles).

```
  '@atlaskit/editor/enforce-compiled-migration-gate': 'error',
```

See the
[Emotion → Compiled Feature Gating Strategy](https://hello.atlassian.net/wiki/spaces/~712020e6f24689f2da470b80ba6873df7b44a2/pages/6788274038/Emotion+-+Compiled+Feature+Gating+Strategy)
for details on the migration pattern.

### Apply Engine Vocabulary Conflicts

For `@atlassian/editor-ai-apply-engine` only. The engine's rules share facts about node types (the
container chain of a bare `tableCell`, the item of each list, schema variants, …), declared as
`VocabularyPart`s in `src/rules/vocabulary.ts` and merged when the engine loads. This rule
checks that file as it is written and reports:

- **`conflict`** — two parts give different `containerFor` or `itemFor` values for the same node
  type;
- **`variantConflict`** — a node type is in two different `variants` groups;
- **`notLiteral`** — a part uses a spread, a computed key or a non-literal value, which would hide a
  conflict from the check.

The same fact given twice is allowed.

```
  '@atlaskit/editor/apply-engine-vocabulary-conflicts': 'error',
```
