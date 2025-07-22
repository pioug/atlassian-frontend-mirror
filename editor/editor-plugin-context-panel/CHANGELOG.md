# @atlaskit/editor-plugin-context-panel

## 5.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

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

## 4.1.8

### Patch Changes

- Updated dependencies

## 4.1.7

### Patch Changes

- Updated dependencies

## 4.1.6

### Patch Changes

- Updated dependencies

## 4.1.5

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- Updated dependencies

## 4.1.3

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#148777](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148777)
  [`4ec86d3df0375`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ec86d3df0375) -
  Update type for canClosePanel to return promise for object sidebar

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [#126488](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126488)
  [`6030175b41a48`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6030175b41a48) -
  Update types to stay in sync with confluence
- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#122281](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122281)
  [`8c84e6db9b94f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c84e6db9b94f) -
  EDF-2539 Integrated object sidebar api through context-panel plugin in extensions to show panel.

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

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

## 2.1.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#111186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111186)
  [`40e1ee0230fce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40e1ee0230fce) -
  Updating API to match Object Sidebar changes in Confluence

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

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

- [#98971](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98971)
  [`1af472c6db66f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1af472c6db66f) -
  Remove platform_editor_context_panel_support_multiple fg

## 1.3.17

### Patch Changes

- Updated dependencies

## 1.3.16

### Patch Changes

- Updated dependencies

## 1.3.15

### Patch Changes

- [#168970](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168970)
  [`97db2d026001d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/97db2d026001d) -
  ED-25808: refactors plugins to meet folder standards
- Updated dependencies

## 1.3.14

### Patch Changes

- Updated dependencies

## 1.3.13

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.3.12

### Patch Changes

- Updated dependencies

## 1.3.11

### Patch Changes

- Updated dependencies

## 1.3.10

### Patch Changes

- [#147017](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147017)
  [`d08342ae8ee66`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d08342ae8ee66) -
  ED-25008 Bugfix for context panel to support multiple editor plugins to use context panels without
  error

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

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.3.3

### Patch Changes

- [#137041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137041)
  [`060aff106c5ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/060aff106c5ac) -
  Add insert-right-rail experiment and reimplement right rail logic
- [#137041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137041)
  [`060aff106c5ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/060aff106c5ac) -
  Add new experiment for insert menu in right rail, allow right menu to be opened from main toolbar
  '+' button

## 1.3.2

### Patch Changes

- [#136413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136413)
  [`934839fbec788`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/934839fbec788) -
  Revert ED-24737-enable-right-rail due to HOT-111462

## 1.3.1

### Patch Changes

- [#136295](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136295)
  [`0150dad7ca580`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0150dad7ca580) -
  Add new experiment for insert menu in right rail, allow right menu to be opened from main toolbar
  '+' button
- Updated dependencies

## 1.3.0

### Minor Changes

- [#132259](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132259)
  [`f5e633e11af26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5e633e11af26) -
  [ux] Expose the context panel state from the context panel plugin. Simplify and consolidate the
  context panel logic such that it always opens in the same manner. Previously there was a small
  number of cases in which the context panel overlaps.

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

## 0.2.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325)
  [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating
  all plugins with minor version to correct issue with semver.

## 0.1.4

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177)
  [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added
  atlaskit docs to all existing plugins.

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 0.1.1

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782)
  [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) -
  [ED-17082] Mark package as a singleton one
- Updated dependencies
