# @atlaskit/jql-parser

## 2.0.0

### Major Changes

- [`978cfcda881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978cfcda881) - Migrate `jql-parser` package to the `@atlaskit` namespace. Any consumers should update their imports to `@atlaskit/jql-parser`.

## 1.0.7

[![Labs version](https://img.shields.io/badge/labs-1.0.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-parser)

### Patch Changes

- fd1c531: Bump antlr4ts to 0.5.0-alpha.4

## 1.0.6

### Patch Changes

- 7cb0510: Clamp antlr4ts version to 0.5.0-alpha.3

## 1.0.5

[![Labs version](https://img.shields.io/badge/labs-1.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-parser)

### Patch Changes

- 886bd63: Bump labs version.

## 1.0.4

### Patch Changes

[![Labs version](https://img.shields.io/badge/labs-0.0.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-parser)

- 6c31f29: Migrate packages from tslint to eslint

## 1.0.3

### Patch Changes

- 70e0706: Bump dependencies to patch vulnerabilities

## 1.0.2

### Patch Changes

- f46b4ff: Use isolatedModules to fix Babel transpilation of type only exports.

## 1.0.1

### Patch Changes

- bc19fe3: Update storybook and de-dupe babel dependencies.

## 1.0.0

### Major Changes

- 94c794c: Bump all TypeScript packages to 1.0.0 for release to production. From this point on, semver will be used in all packages.

## 0.11.0

### Minor Changes

- 8bcc57f: Disable autocomplete for predicate operands
  - 4c6f34b: Improve grammar definition for history predicate operators

## 0.10.0

### Minor Changes

- 20eb798: Improved definition of valid operands for different terminal clause types
  - e0835ee: Clean up autocomplete logic around the list rule

## 0.9.0

### Minor Changes

- 352d19c: Use babel for build output.

## 0.8.1

### Patch Changes

- 63c7f76: Use es2017 target to align with jira.

## 0.8.0

### Minor Changes

- ef753ba: Move token constants from jql-parser to jql-ast package.

## 0.7.0

### Minor Changes

- ab235ac: Operator-specific parsing for terminal clauses. Consolidation of terminal clause and operator nodes in AST.

### Patch Changes

- 881a846: Add separate cjs and esm build outputs.

## 0.6.0

### Minor Changes

- 82dfd45: Update grammar to distinguish between invalid and unclosed quote strings.

## 0.5.0

### Minor Changes

- 35b5a1c: Rename jql-grammar package to jql-parser

## 0.4.1

### Patch Changes

- 21940c1: Update dependencies with security vulnerabilities reported by SourceClear.

## 0.4.0

### Minor Changes

- b172210: Autocomplete for quoted strings

### Patch Changes

- 9cff3fc: Update jest and typedoc packages.

## 0.3.0

### Minor Changes

- 5afdcbd: Introduce autocomplete unhandled rules and position autocomplete based on first suggestion replace position

## 0.2.1

### Patch Changes

- 2cbeaaf: Add validation indicator to JQL editor and minor package restructure.

## 0.2.0

### Minor Changes

- 586fae2: Add reserved words to grammar

## 0.1.0

### Minor Changes

- Prefix grammar rules

## 0.0.6

### Patch Changes

- 3c5c70a: Used the tslib package and reduced the size of the output

## 0.0.5

### Patch Changes

- 2e8d06e: Update `jql-autosuggest` to accept a selection range which impacts the matchedText and replacePosition for suggestions

## 0.0.4

### Patch Changes

- 6f89567: Improve accuracy of autocomplete suggestions from `jql-autosuggest` package and include information for token replacement.

## 0.0.3

### Patch Changes

- 4985a8e: Remove flow types from build

## 0.0.2

### Patch Changes

- b6e6e6f: Bump patch version

## 0.0.1

### Patch Changes

- 898352a: Use bolt for project management.
- bb0f8e5: Move packages to @atlassiansox namespace
