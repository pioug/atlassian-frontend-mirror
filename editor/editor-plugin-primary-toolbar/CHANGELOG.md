# @atlaskit/editor-plugin-primary-toolbar

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.1.6

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs

## 4.1.5

### Patch Changes

- [`6ca68bbf39757`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6ca68bbf39757) -
  Change all AIFC feature gates over to an experiment platform_editor_ai_aifc
- Updated dependencies

## 4.1.4

### Patch Changes

- Updated dependencies

## 4.1.3

### Patch Changes

- [#195513](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195513)
  [`98c0ba1c91086`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98c0ba1c91086) -
  [EDITOR-1073] Adding a FG to gate Jira as well as Confluence for Undo/ Redo/ Show Diff buttons in
  the primary toolbar

## 4.1.2

### Patch Changes

- [#192343](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192343)
  [`9cb0878241016`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9cb0878241016) -
  ED-28736 more extensible selection extensions API

## 4.1.1

### Patch Changes

- [#193685](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193685)
  [`ee3ba46cb3d0a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee3ba46cb3d0a) -
  [EDITOR-1073] Add undo/ redo & show diff to comment toolbar
- Updated dependencies

## 4.1.0

### Minor Changes

- [#185617](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185617)
  [`c766e636b2d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c766e636b2d44) -
  ED-28220 clean up exp platform_editor_controls_toolbar_pinning_exp

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

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

## 3.2.15

### Patch Changes

- Updated dependencies

## 3.2.14

### Patch Changes

- Updated dependencies

## 3.2.13

### Patch Changes

- Updated dependencies

## 3.2.12

### Patch Changes

- Updated dependencies

## 3.2.11

### Patch Changes

- [#163573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163573)
  [`21e93839ec382`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21e93839ec382) -
  Convert platform_editor_controls_toolbar_pinning fg to
  platform_editor_controls_toolbar_pinning_exp experiment
- Updated dependencies

## 3.2.10

### Patch Changes

- [#162560](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162560)
  [`2f1b203a00ccf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f1b203a00ccf) -
  [ux] Removes docking options from the overflow menu and converts them into pin/unpin button.
- Updated dependencies

## 3.2.9

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- Updated dependencies

## 3.2.7

### Patch Changes

- [#154313](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154313)
  [`36c5067417688`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/36c5067417688) -
  Clean up platform_editor_insert_button_on_primary_toolbar feature gate
- Updated dependencies

## 3.2.6

### Patch Changes

- [#153512](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153512)
  [`795799207e556`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/795799207e556) -
  ED-27817 Hide find button on primary toolbar when contextualFormattingEnabled option is false

## 3.2.5

### Patch Changes

- Updated dependencies

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- [#146886](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146886)
  [`c18099d101897`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c18099d101897) -
  [ux] Do not add find&replace back to docked toolbar when the mitigation FG is enabled
- Updated dependencies

## 3.2.2

### Patch Changes

- [#146429](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146429)
  [`8273b36d97d65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8273b36d97d65) -
  [ux] Add undo/redo/find&replace back to docked toolbar when the mitigation FG is enabled

## 3.2.1

### Patch Changes

- [#140839](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140839)
  [`8c413615979d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c413615979d2) -
  [ux] Include element insert plus button on Editor primary toolbar
- Updated dependencies

## 3.2.0

### Minor Changes

- [#139139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139139)
  [`7f6b665d778dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f6b665d778dd) -
  [https://product-fabric.atlassian.net/browse/ED-27499](ED-27499) - the new
  `@atlassian/confluence-presets` package with Confluence `full-page` preset is created

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- [#137151](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137151)
  [`724daf91c62db`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/724daf91c62db) -
  [ux] Put move of the redo/undo/find behind its own FG. Fix double Find & Replace popup
- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#130044](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130044)
  [`cad348d512cdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cad348d512cdf) -
  [ux] ED-26802 contextual formatting configuration

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#122140](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122140)
  [`3f7b2bc0c6ef0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f7b2bc0c6ef0) -
  Add missing dependencies to the package.json file
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#120931](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120931)
  [`624b97c021fea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/624b97c021fea) -
  [ux] ED-26676 revert to existing primary toolbar components

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

## 2.4.0

### Minor Changes

- [#117435](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117435)
  [`2526289f60537`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2526289f60537) -
  [ux] ED-26675 Docked primary toolbar overflow menu

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#116013](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116013)
  [`18e022766bfd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18e022766bfd3) -
  [ux] ED-26464 Hiding primary toolbar and docking contextual toolbar items to top

## 2.2.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

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

- [#180749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180749)
  [`44a0bb0405ea1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/44a0bb0405ea1) -
  Refactored folder structure to confirm to new editor standards

## 2.0.12

### Patch Changes

- Updated dependencies

## 2.0.11

### Patch Changes

- Updated dependencies

## 2.0.10

### Patch Changes

- Updated dependencies

## 2.0.9

### Patch Changes

- [#150784](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150784)
  [`8a6d80b99e9a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a6d80b99e9a6) -
  Add data-vc to display human readable identifier for TTVC offender list

## 2.0.8

### Patch Changes

- Updated dependencies

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

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

## 1.3.2

### Patch Changes

- [#124654](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124654)
  [`3eace5ec6b539`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3eace5ec6b539) -
  [ux] Updated the primary toolbar plugin to allow have a spellcheck button which is next to the
  undo/redo buttons. Also update the ai plugin to support this and fallback to the original "append
  to end" implementation if the toolbar plugin is not enabled

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#120426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120426)
  [`1cb3869ab1a96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cb3869ab1a96) -
  [ED-23436] Use editor primary toolbar plugin to structure the primary toolbar

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

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies
