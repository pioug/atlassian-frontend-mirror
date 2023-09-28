# @atlaskit/jql-ast

## 3.0.0

### Major Changes

- [#39978](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39978) [`978cfcda881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978cfcda881) - Migrate `jql-ast` package to the `@atlaskit` namespace. Any consumers should update their imports to `@atlaskit/jql-ast`.

### Patch Changes

- Updated dependencies

## 2.4.2

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 2.4.1

[![Labs version](https://img.shields.io/badge/labs-2.1.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-ast)

### Patch Changes

- [#36690](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36690) [`7926dc060ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7926dc060ff) - Clamp antlr4ts version to 0.5.0-alpha.4

## 2.4.0

### Minor Changes

- [#36029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36029) [`337298e67b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/337298e67b8) - Added argumentByText to creators that let you add an argument that has been pre-treated to produce a valid JQL string

## 2.3.2

[![Labs version](https://img.shields.io/badge/labs-2.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-ast)

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 2.2.0

### Minor Changes

- [#31491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31491) [`0d5ab9875fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d5ab9875fc) - Add new `isOperandNode` type guard which can be called to identify AST nodes of type operand

## 2.1.0

### Minor Changes

- [#31288](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31288) [`35d641e8956`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35d641e8956) - Introduce valueOperandByText creator which allows creation of value operand AST nodes by text instead of value

## 2.0.1

### Patch Changes

- [#24912](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24912) [`4ca006051df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ca006051df) - Migrate @atlassiansox/jql-ast package to the Atlassian Frontend monorepo

## 2.0.0

### Major Changes

- #### AstNode

  Added `enterNode`, `exitNode` and `getChildren` methods to the `AstNode` interface to simplify listener/visitor tree traversal.

  #### JastListener

  Added `enterEveryNode` and `exitEveryNode` method to allow consumers to perform logic for all nodes in the tree.

  Removed `Clause` and `Operand` node types from listener interface and added `Property` node type.

  `Clause` and `Operand` node types where removed from the listener interface as they were union types rather than concrete nodes. Consumers relying on enter/exit events for these node types should implement the enter/exit methods of the appropriate subtype, e.g. `CompoundClause` and `TerminalClause`

- Make AST node position nullable.

  These values will still be set for newly constructed AST's but are required to support null data to accommodate new
  transformation API's. Consumers who are using positional data of AST nodes should update their code to support null
  values.

- Move NOT clauses from compound clause into their own node type within the AST. This is to provide more semantic accuracy with the AST structure as NOT clauses can only contain a single sub-clause.

  We've also added `enterNotClause/exitNotClause` and `visitNotClause` to the listener and visitor API respectively to allow consumers to perform specific processing of these node types.

- #### JastVisitor

  Added `visit` method. Default implementation should delegate to `AstNode#accept` and return a user-defined result of the operation.

  Removed `visitNode` which was previously invoked when an appropriate visit method was not defined for a node type, e.g. `visitField`. Consumers that require this functionality should migrate to `visitChildren`.

  Added `visitChildren` which serves as a replacement for `visitNode` but has more accurate semantics of it's intended behaviour within the API. Implementors of this method can control default behaviour for tree traversal, but in most cases you'll want to rely on the default implementation from `AbstractJastVisitor`.

  #### AbstractJastVisitor

  Introduced new abstract class to simplify traversal of AST's.

  Previously consumers would need to implement visit methods for all node types from the AST root to the node type that required processing.

  Visitors extending this class will automatically traverse the entire tree when visiting the AST root, as such they now only have to implement visit methods for node types they intend to process.

  If a node type visit method is implemented then the consumer can choose to continue visiting child nodes or short circuit the traversal.

### Minor Changes

- Introduce print API to print a provided AST object into a formatted JQL string.
- Introduce removeClause and remove functions to Clause nodes as part of the AST transformation API.
- Introduce replaceClause and replace functions to Clause nodes as part of the AST transformation API.
- Introduce prependOrderField function to Query and OrderBy nodes as part of the AST transformation API.
- Introduce appendClause function to Query and CompoundClause nodes as part of the AST transformation API.
- Introduce setOrderDirection function to Query, OrderBy and OrderByField nodes as part of the AST transformation API.

### Patch Changes

- Minor refactor of internal node creator functions.

## 1.0.5

[![Labs version](https://img.shields.io/badge/labs-1.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-ast)

### Patch Changes

- Bump labs version.
- Updated dependencies
  - @atlassiansox/jql-parser@1.0.5

## 1.0.4

[![Labs version](https://img.shields.io/badge/labs-0.0.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-ast)

### Patch Changes

- Migrate packages from tslint to eslint
- Updated dependencies
  - @atlassiansox/jql-parser@1.0.4

## 1.0.3

### Patch Changes

- Bump dependencies to patch vulnerabilities
- Add analytics tracking for the collapsed team custom field
- Updated dependencies
  - @atlassiansox/jql-analytics@1.0.3
  - @atlassiansox/jql-parser@1.0.3

## 1.0.2

### Patch Changes

- Use isolatedModules to fix Babel transpilation of type only exports.
- Updated dependencies
  - @atlassiansox/jql-analytics@1.0.2
  - @atlassiansox/jql-parser@1.0.2

## 1.0.1

### Patch Changes

- Update storybook and de-dupe babel dependencies.
- Send a debug message when external JQL errors are rendered or when updating attributes throws an error.
- Updated dependencies
  - @atlassiansox/jql-analytics@1.0.1
  - @atlassiansox/jql-parser@1.0.1

## 1.0.0

### Major Changes

- Bump all TypeScript packages to 1.0.0 for release to production. From this point on, semver will be used in all packages.

### Minor Changes

- Update attributes for JQL insight and external JQL error analytics.

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-analytics@1.0.0
  - @atlassiansox/jql-parser@1.0.0

## 0.11.1

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-analytics@0.1.0

## 0.11.0

### Minor Changes

- Lift represents property to the root AST object and match source query value
- Update attributes computed by the jql-insights-listener.
- Export JQL anonymizer visitor and JQL insights listener from jql-ast package.

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @atlassiansox/jql-analytics@0.0.3

## 0.10.1

### Patch Changes

- Disable autocomplete for predicate operands
- Improve grammar definition for history predicate operators
- Updated dependencies
- Updated dependencies
  - @atlassiansox/jql-parser@0.11.0

## 0.10.0

### Minor Changes

- Improved definition of valid operands for different terminal clause types

### Patch Changes

- Fix type checking in operand visitor.
- Clean up autocomplete logic around the list rule
- Updated dependencies
- Updated dependencies
  - @atlassiansox/jql-parser@0.10.0

## 0.9.0

### Minor Changes

- Use babel for build output.

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-parser@0.9.0

## 0.8.1

### Patch Changes

- Use es2017 target to align with jira.
- Updated dependencies
  - @atlassiansox/jql-parser@0.8.1

## 0.8.0

### Minor Changes

- Move token constants from jql-parser to jql-ast package.

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-parser@0.8.0

## 0.7.0

### Minor Changes

- Operator-specific parsing for terminal clauses. Consolidation of terminal clause and operator nodes in AST.

### Patch Changes

- Add separate cjs and esm build outputs.
- Updated dependencies
- Updated dependencies
  - @atlassiansox/jql-parser@0.7.0

## 0.6.2

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-parser@0.6.0

## 0.6.1

### Patch Changes

- Unescape all escaped characters in AST strings

## 0.6.0

### Minor Changes

- Entity properties support. Return raw and clean text for string nodes. Unify AST naming.

### Patch Changes

- Reset error handler when building AST.

## 0.5.1

### Patch Changes

- Rename jql-grammar package to jql-parser
- Updated dependencies
  - @atlassiansox/jql-parser@0.5.0

## 0.5.0

### Minor Changes

- Correctly handle NOT clauses when producing the AST and update attributes for editor searched event.

## 0.4.0

### Minor Changes

- Auto insert opening parenthesis following a list operator

## 0.3.0

### Minor Changes

- Update operator node to include value property for the raw text value and type property as a constant reference.

### Patch Changes

- Update dependencies with security vulnerabilities reported by SourceClear.
- Updated dependencies
  - @atlassiansox/jql-grammar@0.4.1

## 0.2.1

### Patch Changes

- Update jest and typedoc packages.
- Update jql-ast to return JQLParseError instead of standard JS Error.
- Updated dependencies
- Updated dependencies
  - @atlassiansox/jql-grammar@0.4.0

## 0.2.0

### Minor Changes

- Introduce autocomplete unhandled rules and position autocomplete based on first suggestion replace position

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-grammar@0.3.0

## 0.1.8

### Patch Changes

- Add validation indicator to JQL editor and minor package restructure.
- Updated dependencies
  - @atlassiansox/jql-grammar@0.2.1

## 0.1.7

### Patch Changes

- Updated dependencies
  - @atlassiansox/jql-grammar@0.2.0

## 0.1.6

### Patch Changes

- Refactor of component rendering for JQL editor plugins

## 0.1.5

### Patch Changes

- Prefix grammar rules
- Updated dependencies
  - @atlassiansox/jql-grammar@0.1.0

## 0.1.4

### Patch Changes

- Used the tslib package and reduced the size of the output
- Updated dependencies
  - @atlassiansox/jql-grammar@0.0.6

## 0.1.3

### Patch Changes

- Update `jql-autosuggest` to accept a selection range which impacts the matchedText and replacePosition for suggestions
- Updated dependencies
  - @atlassiansox/jql-grammar@0.0.5

## 0.1.2

### Patch Changes

- Improve accuracy of autocomplete suggestions from `jql-autosuggest` package and include information for token replacement.
- Updated dependencies
  - @atlassiansox/jql-grammar@0.0.4

## 0.1.1

### Patch Changes

- Added !~ operator

## 0.1.0

### Minor Changes

- Return unexpected parse errors and JAST building errors in JAST builder

## 0.0.3

### Patch Changes

- Remove flow types from build
- Updated dependencies
  - @atlassiansox/jql-grammar@0.0.3

## 0.0.2

### Patch Changes

- Bump patch version
- Updated dependencies
  - @atlassiansox/jql-grammar@0.0.2

## 0.0.1

### Patch Changes

- Use bolt for project management.
- Move packages to @atlassiansox namespace
- Provide ANTLErrorStrategy as an argument when building an AST
- Updated dependencies
- Updated dependencies
  - @atlassiansox/jql-grammar@0.0.1
