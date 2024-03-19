# @atlaskit/eslint-plugin-ui-styling-standard

## 0.6.1

### Patch Changes

- [#80129](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80129) [`dc0ce9161fc1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc0ce9161fc1) - Add `convert-prop-syntax` to convert invalid `styled-components` props syntax to valid `styled-components` props syntax.
- [#79686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79686) [`7dc7cf06a8b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7dc7cf06a8b9) - Bump @compiled/react to v0.17.0

## 0.6.0

### Minor Changes

- [#81459](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81459) [`08abd3b15614`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/08abd3b15614) - Adds `no-classname-prop` rule which prevents the use of `className` in JSX.

## 0.5.2

### Patch Changes

- [#81702](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81702) [`04e7850f449c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04e7850f449c) - Adding a missing LICENSE for this package, updating from "UNLICENSED" to make it clear this is available for use.

## 0.5.1

### Patch Changes

- [#81166](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81166) [`a249a1bd29a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a249a1bd29a6) - Upgrade ESLint to version 8

## 0.5.0

### Minor Changes

- [#80523](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80523) [`1fbc903e5b7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1fbc903e5b7b) - Adds `no-important-styles` rule which prevents the use of `!important` flags in style declarations.

## 0.4.1

### Patch Changes

- [#76885](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76885) [`06030bc18dd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/06030bc18dd4) - Disable `styled-components` handling for `no-styled-tagged-template-expression` rule, due to edge case where props are converted to output that fails typechecking.

## 0.4.0

### Minor Changes

- [#75600](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75600) [`8875d9de2e5d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8875d9de2e5d) - Migrates the ESLint rule from `@atlaskit/design-system/local-cx-xcss` to `@atlaskit/ui-styling-standard/local-cx-xcss` and overhauls the codegen to enable better documentation and rule distribution.

## 0.3.0

### Minor Changes

- [#74981](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74981) [`842300de03a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/842300de03a1) - Add the following rules:

  - `consistent-css-prop-usage`: Ensures consistency with `css` and `xcss` prop usages
  - `no-empty-styled-expression`: Forbids any styled expression to be used when passing empty arguments to styled.div() (or other JSX elements).
  - `no-exported-css`: Forbid exporting `css` function calls.
  - `no-exported-keyframes`: Forbid exporting `keyframes` function calls.
  - `no-invalid-css-map`: Checks the validity of a CSS map created through cssMap.

- [#72983](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72983) [`878065bfc4c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/878065bfc4c0) - Adds the following rules to the recommended preset:

  - `@atlaskit/design-system/no-css-tagged-template-expression`
  - `@atlaskit/design-system/no-keyframes-tagged-template-expression`
  - `@atlaskit/design-system/no-styled-tagged-template-expression`

### Patch Changes

- [#75152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75152) [`c16a175d372b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c16a175d372b) - Change 'error' to 'warn' to unbreak AFM platform

## 0.2.1

### Patch Changes

- [#71319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71319) [`d716e2b5e102`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d716e2b5e102) - Ensures all dependencies are properly defined

## 0.2.0

### Minor Changes

- [#69723](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69723) [`06cd0f04fefb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/06cd0f04fefb) - Adds the following rules to the recommended config:

  - `local-cx-xcss` - Ensures the `cx()` function is only used within the `xcss` prop
  - `no-supress-xcss` - Disallows supressing type violations when using the `xcss` prop
  - `no-js-xcss` - Disallows using `xcss` prop inside JavaScript files

## 0.1.0

### Minor Changes

- [#63960](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63960) [`8e3774cada83`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e3774cada83) - Created the design system styling standard package
