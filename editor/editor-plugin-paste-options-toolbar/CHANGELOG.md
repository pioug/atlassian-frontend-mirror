# @atlaskit/editor-plugin-paste-options-toolbar

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- [`8497783928a16`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8497783928a16) -
  ED-29110: clean up sharedPluginStateHookMigratorFactory in media, mentions and paste options
- Updated dependencies

## 3.1.3

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#183158](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183158)
  [`d6096ec5c8ad9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6096ec5c8ad9) -
  Migrate to useSharedPluginStateWithSelector
- Updated dependencies

## 3.0.0

### Major Changes

- [#181024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181024)
  [`8e80c487ca307`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e80c487ca307) - ##
  Make `@atlaskit/editor-common` a peer dependency

  **WHAT:** `@atlaskit/editor-common` has been moved from `dependencies` to `peerDependencies` in
  all editor plugin packages.

  **WHY:** This change ensures that only a single version of `@atlaskit/editor-common` is used in
  consuming applications, preventing issues caused by multiple versions of singleton libraries (such
  as context mismatches or duplicated state). This is especially important for packages that rely on
  shared context or singletons.

  **HOW TO ADJUST:**

  - Consumers must now explicitly install `@atlaskit/editor-common` in their own project if they use
    any of these editor plugins.
  - Ensure the version you install matches the version required by the plugins.
  - You can use the
    [`check-peer-dependencies`](https://www.npmjs.com/package/check-peer-dependencies) package to
    verify that all required peer dependencies are installed and compatible.
  - Example install command:
    ```
    npm install @atlaskit/editor-common
    ```
    or
    ```
    yarn add @atlaskit/editor-common
    ```

  **Note:** This is a breaking change. If `@atlaskit/editor-common` is not installed at the
  application level, you may see errors or unexpected behavior.

### Patch Changes

- Updated dependencies

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#150836](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150836)
  [`04b73eab35ce8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/04b73eab35ce8) -
  Used plugin selector conditionally behind feature flag

## 2.0.7

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 2.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.4.7

### Patch Changes

- Updated dependencies

## 1.4.6

### Patch Changes

- Updated dependencies

## 1.4.5

### Patch Changes

- [#99019](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99019)
  [`40d07b40b2031`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40d07b40b2031) -
  ED-25888: Add lint rule to enforce editor plugin structure

## 1.4.4

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#163564](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163564)
  [`6e4c6d8dcc5e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e4c6d8dcc5e9) -
  Converted paste-icon from CommonJS to ES6 module syntax to address 'require is not defined' errors
  during transpilation

### Patch Changes

- Updated dependencies

## 1.3.12

### Patch Changes

- Updated dependencies

## 1.3.11

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 1.3.10

### Patch Changes

- Updated dependencies

## 1.3.9

### Patch Changes

- Updated dependencies

## 1.3.8

### Patch Changes

- Updated dependencies

## 1.3.7

### Patch Changes

- Updated dependencies

## 1.3.6

### Patch Changes

- Updated dependencies

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.3.0

### Minor Changes

- [#137614](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137614)
  [`f7efc61f35951`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7efc61f35951) -
  Add export for plugin type from paste options toolbar. Slightly re-arrange plugins to meet linting
  rule.

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.1.11

### Patch Changes

- Updated dependencies

## 1.1.10

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- [#113525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113525)
  [`f60b24002afb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f60b24002afb7) -
  Null check code block node so we don't crash if the code block plugin hasn't been added.
- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#96138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96138)
  [`6c157cfaf29f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c157cfaf29f) -
  [ED-19863] Clean-up the paste options toolbar

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#89247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89247)
  [`a65b4a0870d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a65b4a0870d8) -
  The internal composition of this package has changed. There is no expected change in behavior.

## 1.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.9

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.8

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.3.7

### Patch Changes

- [#69790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69790)
  [`0de5e8a05235`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0de5e8a05235) -
  ED-21955-update: Correcting outdated comments

## 0.3.6

### Patch Changes

- Updated dependencies

## 0.3.5

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- [#43282](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43282)
  [`ea6aae16859`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea6aae16859) - Fixed
  extra paragraph added on pasting codeblock and modified relevant testcases

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#42718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42718)
  [`954af7ba44b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954af7ba44b) - Changing
  hasLinkMark function to use pasted slice instead of state.doc while searching for link in pasted
  text.

## 0.2.3

### Patch Changes

- [#42152](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42152)
  [`0097171c562`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0097171c562) -
  ED-19766-collab: Adding collab support for paste options toolbar for confluence

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [#42128](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42128)
  [`8d06cbeae33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d06cbeae33) -
  ED-20584: Adding logic to show correct positioning for toolbar in confluence
