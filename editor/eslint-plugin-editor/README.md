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
