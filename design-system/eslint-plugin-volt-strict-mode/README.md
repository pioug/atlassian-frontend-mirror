# Volt Strict Mode ESLint Plugin

Rules and presets for Atlassian UI Volt Strict Mode. Prefer extending the recommended config rather
than hand-picking rules.

## Rules

<!-- START_RULE_TABLE_CODEGEN -->
<!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-volt-strict-mode codegen -->

| Rule                                                                        | Description                                                                                                                                                 | Recommended | Fixable | Suggestions |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------- | ----------- |
| <a href="./src/rules/no-multiple-exports/README.md">no-multiple-exports</a> | Allows at most one runtime export per module so each file maps to a single bundler unit; `export type` / `export interface` are exempt.                     | Yes         |         |             |
| <a href="./src/rules/no-re-exports/README.md">no-re-exports</a>             | Disallows re-exporting symbols from other modules (barrel patterns and import-then-export indirection) so consumers and bundlers do not chase extra layers. | Yes         |         |             |

<!-- END_RULE_TABLE_CODEGEN -->
