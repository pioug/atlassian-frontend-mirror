# @atlaskit/codemod-utils

## 5.1.0

### Minor Changes

- [`bd2c5b0112185`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd2c5b0112185) -
  Remove stale API report artifacts from published Platform packages.

## 5.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

## 4.3.0

### Minor Changes

- [`f768b61932518`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f768b61932518) -
  Autofix: add explicit package exports (barrel removal)

## 4.2.5

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.

## 4.2.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 4.2.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 4.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 4.1.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.1.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.1.1

### Patch Changes

- [#23836](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23836)
  [`edc6fef0c8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc6fef0c8f) - Fix
  printf format specifier matching within `matchesStringWithFormatSpecifier` for fuzzy matching
  interpolated placeholder values

## 4.1.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`e4624adcb2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4624adcb2f) -
  ED-14608: Update codemod-utils to support type import entry point changes in
  changeImportEntryPoint, remove adf-utils from repo stricter lint exclusion lists

## 4.0.2

### Patch Changes

- [#21152](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21152)
  [`9358d42eeaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9358d42eeaa) -
  NO-ISSUE: fixed codemod utils tryCreateImport() and addToImport() causing multiple insert in
  certain scenarios

## 4.0.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 4.0.0

### Major Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b29ce16dad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b29ce16dad8) -
  [ED-14606] Move bitbucket schema, confluence schema, jira schema, and default schema from
  @atlaskit/adf-schema to their own entry points. These new entry points are as follows

  @atlaskit/adf-schema/schema-bitbucket for:
  - bitbucketSchema

  @atlaskit/adf-schema/schema-confluence for:
  - confluenceSchema
  - confluenceSchemaWithMediaSingle

  @atlaskit/adf-schema/schema-jira for:
  - default as createJIRASchema
  - isSchemaWithLists
  - isSchemaWithMentions
  - isSchemaWithEmojis
  - isSchemaWithLinks
  - isSchemaWithAdvancedTextFormattingMarks
  - isSchemaWithCodeBlock
  - isSchemaWithBlockQuotes
  - isSchemaWithMedia
  - isSchemaWithSubSupMark
  - isSchemaWithTextColor
  - isSchemaWithTables

  @atlaskit/adf-schema/schema-default for:
  - defaultSchema
  - getSchemaBasedOnStage
  - defaultSchemaConfig

  This change also includes codemods in @atlaskit/adf-schema to update these entry points. It also
  introduces a new util function "changeImportEntryPoint" to @atlaskit/codemod-utils to handle this
  scenario.

## 3.4.0

### Minor Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Adds new
  util `hasImportDeclarationFromAnyPackageEntrypoint`. It works just like `hasImportDeclaration`,
  but instead of searching for an import declaration that has strict equality with a supplied import
  path (e.g. `@atlaskit/theme`), it looks for an import declaration that _starts with_ the supplied
  import path. With that same example, it will match both `@atlaskit/theme` and
  `@atlaskit/theme/typography` — making it easy to choose to run a codemod on a usage regardless of
  the way in which it was imported.

## 3.3.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`9729143f07b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9729143f07b) - Add
  support functions `getDynamicImportName`, `isCallExpressionCalleeImportType`,
  `isCallExpressionArgumentStringLiteralType`, `isCallExpressionArgumentValueMatches` and
  `addDynamicImport`.

## 3.2.2

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`dc04275805a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc04275805a) - Update
  types of API addCommentBefore

## 3.2.1

### Patch Changes

- [#11911](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11911)
  [`d0ef46dee01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0ef46dee01) - Removes
  ts-node / cjs bundle switcher from main entrypoint of codemod-utils and updated codemod-cli
  scripts to support

## 3.2.0

### Minor Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`43412f2b0b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43412f2b0b1) - Added
  few helper functions

### Patch Changes

- [`200ebeada19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/200ebeada19) - Updated
  codemods to handle edge cases

## 3.1.0

### Minor Changes

- [#10787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10787)
  [`2ec9e608acc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ec9e608acc) - Update
  `addCommentBefore` helper method to:
  - Make the message prefix optional.
    - _The default remains as `TODO: (from codemod)` for backwards compatibility_
  - Support both block & line comment output.
    - _The default remains as `block` for backwards compatibility_

## 3.0.0

### Major Changes

- [#10179](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10179)
  [`284a374eed8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/284a374eed8) - Removed
  `createSkipTest` & `createSkipTestTransformer` transformer from the API. This is a **breaking
  change**!

  If you rely on this transformer, you can now depend on it via a new package
  `@af/skip-inconsistent-tests`.

## 2.2.1

### Patch Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`1300c88e2cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1300c88e2cc) - Add
  shouldApplyTransform to createTransformer so there is a check before transforms are run.
- [`1b6bf93be84`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b6bf93be84) - Migrate
  helper functions into codemod-utils

## 2.2.0

### Minor Changes

- [#9940](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9940)
  [`2474e09dc7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2474e09dc7f) - Add new
  method to create a custom Transformer for skip test

## 2.1.2

### Patch Changes

- [#9832](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9832)
  [`d72b572dfc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72b572dfc2) - bumped
  jscodeshift@^0.11.0
- [`d72b572dfc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72b572dfc2) - bumped
  @types/jscodeshift@^0.11.0

## 2.1.1

### Patch Changes

- [#8981](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8981)
  [`5be80507d82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5be80507d82) - Fixed a
  defect in move component to entry point codemod

## 2.1.0

### Minor Changes

- [#8169](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8169)
  [`7e295f4d9da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e295f4d9da) - Added
  more lower level helpers for writing codemod:
  - getDefaultSpecifier
  - getNamedSpecifier
  - hasJSXAttributesByName
  - hasImportDeclaration
  - addCommentBefore
  - addCommentToStartOfFile
  - callExpressionArgMatchesString
  - testMethodVariantEach

  They are used quite frequently as basic build blocks, so export them to consumers.

## 2.0.1

### Patch Changes

- [#7012](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7012)
  [`ecc5b95e65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecc5b95e65) - ED-11440:
  Add skipTest to codemod-utils

## 2.0.0

### Major Changes

- [#6722](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6722)
  [`f1e5c2be81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1e5c2be81) - ED-11335:
  Initialise codemod-utils package
