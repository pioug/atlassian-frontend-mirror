# @atlaskit/editor-plugin-placeholder

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

## 2.0.21

### Patch Changes

- Updated dependencies

## 2.0.20

### Patch Changes

- [#173379](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173379)
  [`99e2b882f5cf0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99e2b882f5cf0) -
  Clean up platform_editor_controls_patch_3
- Updated dependencies

## 2.0.19

### Patch Changes

- Updated dependencies

## 2.0.18

### Patch Changes

- Updated dependencies

## 2.0.17

### Patch Changes

- Updated dependencies

## 2.0.16

### Patch Changes

- Updated dependencies

## 2.0.15

### Patch Changes

- Updated dependencies

## 2.0.14

### Patch Changes

- Updated dependencies

## 2.0.13

### Patch Changes

- Updated dependencies

## 2.0.12

### Patch Changes

- Updated dependencies

## 2.0.11

### Patch Changes

- [#136973](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136973)
  [`d24797988a39c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d24797988a39c) -
  [ux] ED-27349 Remove empty line placeholder and only show empty node placeholder in first table
  cell when it is empty

## 2.0.10

### Patch Changes

- [#135586](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135586)
  [`3aeba66081612`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3aeba66081612) -
  ED-26593 Add missing i18n for editor control
- Updated dependencies

## 2.0.9

### Patch Changes

- [#131399](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131399)
  [`3e2bb97c408f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3e2bb97c408f7) -
  Add className to nested nodes for placeholder text to selectively apply truncation on long text

## 2.0.8

### Patch Changes

- [#129904](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129904)
  [`7a5c1784af47f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7a5c1784af47f) -
  [ux] ED-27141 Adding a check so that only empty paragraphs will show empty node placeholder

## 2.0.7

### Patch Changes

- [#127914](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127914)
  [`1240912e13dd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1240912e13dd0) -
  [ux] ED-27097 Update empty line placeholder to only show when editor is focussed (not in live
  view)
- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- [#124288](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124288)
  [`b847c8d4907ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b847c8d4907ed) -
  [ux] ED-26946 Add prop to only enable empty line placeholders when the plugin option is passed in
- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#122838](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122838)
  [`ebcf63371e09c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebcf63371e09c) -
  ED-26952 Update placeholder text to remove quotes around /

## 2.0.2

### Patch Changes

- [#121254](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121254)
  [`3cff2a93c194b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3cff2a93c194b) -
  [ux] ED-26844 Add placeholder text to empty lines, table cells, expands, panels and layoutColumns

## 2.0.1

### Patch Changes

- Updated dependencies

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

- [#113560](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113560)
  [`0acdf46472e21`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0acdf46472e21) -
  Add new setPlaceholder API so the placeholder text can be changed dynamically via the editor API.

## 1.5.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#180725](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180725)
  [`70657a7f9cb2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/70657a7f9cb2f) -
  Refactored folder structure to confirm to new editor standards

### Patch Changes

- Updated dependencies

## 1.2.13

### Patch Changes

- Updated dependencies

## 1.2.12

### Patch Changes

- Updated dependencies

## 1.2.11

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.2.10

### Patch Changes

- Updated dependencies

## 1.2.9

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
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

## 1.1.9

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

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

- Updated dependencies

## 1.1.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.1

### Patch Changes

- Updated dependencies

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

## 0.1.12

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.1.11

### Patch Changes

- Updated dependencies

## 0.1.10

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- Updated dependencies

## 0.1.7

### Patch Changes

- [#41637](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41637)
  [`76579fdc832`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76579fdc832) - Move
  placeholder tests into placeholder package from editor-core

## 0.1.6

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
