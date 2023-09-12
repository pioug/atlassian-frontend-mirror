# @atlaskit/jql-autocomplete

## 2.0.0

### Major Changes

- [`978cfcda881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978cfcda881) - Migrate `jql-autocomplete` package to the `@atlaskit` namespace. Any consumers should update their imports to `@atlaskit/jql-autocomplete`.

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 1.2.5

### Patch Changes

- [`046f9e95899`](https://bitbucket.org/atlassian/atlassian-frontend/commits/046f9e95899) - Use deep import for antlr4-c3 dependency to mitigate lack of tree-shaking.

## 1.2.4

[![Labs version](https://img.shields.io/badge/labs-1.1.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-autocomplete)

### Patch Changes

- [`7926dc060ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7926dc060ff) - Clamp antlr4ts version to 0.5.0-alpha.4

## 1.2.3

[![Labs version](https://img.shields.io/badge/labs-1.1.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-autocomplete)

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 1.2.2

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 1.2.1

### Patch Changes

- [`5fbee461cc7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fbee461cc7) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 1.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 1.1.9

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.1.8

[![Labs version](https://img.shields.io/badge/labs-1.0.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-autocomplete)

### Patch Changes

- [`5a4217aeed6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a4217aeed6) - Add polyfill for node assert and util modules.

## 1.1.7

[![Labs version](https://img.shields.io/badge/labs-1.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-autocomplete)

### Patch Changes

- 886bd63: Bump labs version.
- Updated dependencies [886bd63]
  - @atlassiansox/jql-parser@1.0.5

## 1.1.6

[![Labs version](https://img.shields.io/badge/labs-0.0.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-autocomplete)

### Patch Changes

- 6c31f29: Migrate packages from tslint to eslint
- Updated dependencies [6c31f29]
  - @atlassiansox/jql-parser@1.0.4

## 1.1.5

### Patch Changes

- 70e0706: Bump dependencies to patch vulnerabilities
- Updated dependencies [70e0706]
  - @atlassiansox/jql-parser@1.0.3

## 1.1.4

### Patch Changes

- 52ad1a8: VULN-570232 - Bump lodash to 4.17.21
- cb93263: We are fixing a scenario for handling string within JQL query which are in unclosed single or double quote.

## 1.1.3

### Patch Changes

- f46b4ff: Use isolatedModules to fix Babel transpilation of type only exports.
- Updated dependencies [f46b4ff]
  - @atlassiansox/jql-parser@1.0.2

## 1.1.2

### Patch Changes

- bc19fe3: Update storybook and de-dupe babel dependencies.
- Updated dependencies [bc19fe3]
  - @atlassiansox/jql-parser@1.0.1

## 1.1.1

### Patch Changes

- 1d78273: Fix an issue where autocomplete rule context would not return isList=true right after a comma

## 1.1.0

### Minor Changes

- 3c957a1: Improve autocomplete rule context accuracy when both operator and operand rules are suggested

### Patch Changes

- 1b1139c: Remove RPAREN from default delimiter tokens, effectively disabling suggestions right after an RPAREN token
- c3cef8a: Update autocomplete replacement position to be inclusive of the entire token underneath the caret for single token selections.

## 1.0.0

### Major Changes

- 94c794c: Bump all TypeScript packages to 1.0.0 for release to production. From this point on, semver will be used in all packages.

### Patch Changes

- Updated dependencies [94c794c]
  - @atlassiansox/jql-parser@1.0.0

## 0.7.2

### Patch Changes

- 8bcc57f: Disable autocomplete for predicate operands
- 4c6f34b: Improve grammar definition for history predicate operators
- Updated dependencies [8bcc57f]
- Updated dependencies [4c6f34b]
  - @atlassiansox/jql-parser@0.11.0

## 0.7.1

### Patch Changes

- 20eb798: Improved definition of valid operands for different terminal clause types
- e0835ee: Clean up autocomplete logic around the list rule
- Updated dependencies [20eb798]
- Updated dependencies [e0835ee]
  - @atlassiansox/jql-parser@0.10.0

## 0.7.0

### Minor Changes

- 352d19c: Use babel for build output.

### Patch Changes

- Updated dependencies [352d19c]
  - @atlassiansox/jql-parser@0.9.0

## 0.6.3

### Patch Changes

- 2cfd326: Import directly from antlr4ts submodule.

## 0.6.2

### Patch Changes

- 63c7f76: Use es2017 target to align with jira.
- Updated dependencies [63c7f76]
  - @atlassiansox/jql-parser@0.8.1

## 0.6.1

### Patch Changes

- ef753ba: Move token constants from jql-parser to jql-ast package.
- Updated dependencies [ef753ba]
  - @atlassiansox/jql-parser@0.8.0

## 0.6.0

### Minor Changes

- ab235ac: Operator-specific parsing for terminal clauses. Consolidation of terminal clause and operator nodes in AST.

### Patch Changes

- 881a846: Add separate cjs and esm build outputs.
- Updated dependencies [881a846]
- Updated dependencies [ab235ac]
  - @atlassiansox/jql-parser@0.7.0

## 0.5.0

### Minor Changes

- 0df4e5e: Add validation message for invalid custom field ids.

### Patch Changes

- Updated dependencies [82dfd45]
  - @atlassiansox/jql-parser@0.6.0

## 0.4.0

### Minor Changes

- fcdedf6: General improvements and JQL function support for editor validation.
- 0272b09: Add validation message for malformed field property ids.
- 380062a: Update jql-autocomplete to extend a grammar agnostic base class and make autocomplete options configurable.
- fdde5d1: Add clause type to field rule context. Pass clause type to onFields callback.

## 0.3.0

### Minor Changes

- ae89e98: Rename jql-autosuggest package to jql-autocomplete

## 0.2.1

### Patch Changes

- 35b5a1c: Rename jql-grammar package to jql-parser
- Updated dependencies [35b5a1c]
  - @atlassiansox/jql-parser@0.5.0

## 0.2.0

### Minor Changes

- 1333fcf: Auto insert opening parenthesis following a list operator

## 0.1.2

### Patch Changes

- 21940c1: Update dependencies with security vulnerabilities reported by SourceClear.
- Updated dependencies [21940c1]
  - @atlassiansox/jql-grammar@0.4.1

## 0.1.1

### Patch Changes

- 9cff3fc: Update jest and typedoc packages.
- Updated dependencies [b172210]
- Updated dependencies [9cff3fc]
  - @atlassiansox/jql-grammar@0.4.0

## 0.1.0

### Minor Changes

- 5afdcbd: Introduce autocomplete unhandled rules and position autocomplete based on first suggestion replace position

### Patch Changes

- Updated dependencies [5afdcbd]
  - @atlassiansox/jql-grammar@0.3.0

## 0.0.10

### Patch Changes

- 2cbeaaf: Add validation indicator to JQL editor and minor package restructure.
- Updated dependencies [2cbeaaf]
  - @atlassiansox/jql-grammar@0.2.1

## 0.0.9

### Patch Changes

- Updated dependencies [586fae2]
  - @atlassiansox/jql-grammar@0.2.0

## 0.0.8

### Patch Changes

- 0440295: Refactor of component rendering for JQL editor plugins

## 0.0.7

### Patch Changes

- Prefix grammar rules
- Updated dependencies [undefined]
  - @atlassiansox/jql-grammar@0.1.0

## 0.0.6

### Patch Changes

- 3c5c70a: Used the tslib package and reduced the size of the output
- Updated dependencies [3c5c70a]
  - @atlassiansox/jql-grammar@0.0.6

## 0.0.5

### Patch Changes

- 2e8d06e: Update `jql-autosuggest` to accept a selection range which impacts the matchedText and replacePosition for suggestions
- Updated dependencies [2e8d06e]
  - @atlassiansox/jql-grammar@0.0.5

## 0.0.4

### Patch Changes

- 6f89567: Improve accuracy of autocomplete suggestions from `jql-autosuggest` package and include information for token replacement.
- Updated dependencies [6f89567]
  - @atlassiansox/jql-grammar@0.0.4

## 0.0.3

### Patch Changes

- 4985a8e: Remove flow types from build
- Updated dependencies [4985a8e]
  - @atlassiansox/jql-grammar@0.0.3

## 0.0.2

### Patch Changes

- b6e6e6f: Bump patch version
- Updated dependencies [b6e6e6f]
  - @atlassiansox/jql-grammar@0.0.2

## 0.0.1

### Patch Changes

- 898352a: Use bolt for project management.
- bb0f8e5: Move packages to @atlassiansox namespace
- Updated dependencies [898352a]
- Updated dependencies [bb0f8e5]
- @atlassiansox/jql-grammar@0.0.1
