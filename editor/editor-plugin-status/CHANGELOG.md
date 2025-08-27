# @atlaskit/editor-plugin-status

## 4.1.10

### Patch Changes

- Updated dependencies

## 4.1.9

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 4.1.8

### Patch Changes

- Updated dependencies

## 4.1.7

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 4.1.6

### Patch Changes

- [`2af42ad93c3e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2af42ad93c3e0) -
  Internal changes to use tokens for border radius.
- Updated dependencies

## 4.1.5

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- Updated dependencies

## 4.1.3

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0
- Updated dependencies

## 4.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

## 4.0.3

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 4.0.2

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

## 3.1.26

### Patch Changes

- [#178271](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178271)
  [`fd1a32b0a4f6b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fd1a32b0a4f6b) -
  [ED-28322] Remove React version of status nodes to clean up experiment platform_editor_vanilla_dom
- Updated dependencies

## 3.1.25

### Patch Changes

- Updated dependencies

## 3.1.24

### Patch Changes

- Updated dependencies

## 3.1.23

### Patch Changes

- Updated dependencies

## 3.1.22

### Patch Changes

- Updated dependencies

## 3.1.21

### Patch Changes

- Updated dependencies

## 3.1.20

### Patch Changes

- Updated dependencies

## 3.1.19

### Patch Changes

- Updated dependencies

## 3.1.18

### Patch Changes

- Updated dependencies

## 3.1.17

### Patch Changes

- [#154961](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154961)
  [`766001ae63324`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/766001ae63324) -
  NOISSUE: fix bad ssr render on vanilla status node
- Updated dependencies

## 3.1.16

### Patch Changes

- Updated dependencies

## 3.1.15

### Patch Changes

- Updated dependencies

## 3.1.14

### Patch Changes

- [#150908](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150908)
  [`0ab8e0f1007ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0ab8e0f1007ea) -
  NOISSUE: fix status selection within tables
- Updated dependencies

## 3.1.13

### Patch Changes

- [#148798](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148798)
  [`8112e98809756`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8112e98809756) -
  [No Issue] Clean up virtualization feature flag
- Updated dependencies

## 3.1.12

### Patch Changes

- [#148210](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148210)
  [`10eb0681e9681`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/10eb0681e9681) -
  fix SSR issues

## 3.1.11

### Patch Changes

- [#146371](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146371)
  [`9540ed4b36027`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9540ed4b36027) -
  [A11Y-9995] Add label to Status editor popup
- Updated dependencies

## 3.1.10

### Patch Changes

- [#139158](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139158)
  [`e535a2a6ac9ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e535a2a6ac9ea) -
  [ux] [A11Y-10038] Announce status popup when it opens and let users know how to access the popup
- Updated dependencies

## 3.1.9

### Patch Changes

- [#137203](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137203)
  [`28c931f62e83e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28c931f62e83e) -
  Converts editor status node to vanilla js
- Updated dependencies

## 3.1.8

### Patch Changes

- Updated dependencies

## 3.1.7

### Patch Changes

- Updated dependencies

## 3.1.6

### Patch Changes

- [#123036](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123036)
  [`08a3386cf1088`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08a3386cf1088) -
  Editor virtualization experiment adjustment, fixes
- Updated dependencies

## 3.1.5

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- [#122140](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122140)
  [`3f7b2bc0c6ef0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f7b2bc0c6ef0) -
  Add missing dependencies to the package.json file
- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- [#119706](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119706)
  [`42fd258ba482e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42fd258ba482e) -
  ED-26704: enables editor node virtualization experiment
- Updated dependencies

## 3.0.2

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

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

## 2.8.2

### Patch Changes

- Updated dependencies

## 2.8.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 2.8.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 2.7.2

### Patch Changes

- Updated dependencies

## 2.7.1

### Patch Changes

- Updated dependencies

## 2.7.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.6.7

### Patch Changes

- [#103440](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103440)
  [`2a34d82d95e38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a34d82d95e38) -
  Cleaned up feature flag that cleans up findDOMNode usages

## 2.6.6

### Patch Changes

- Updated dependencies

## 2.6.5

### Patch Changes

- Updated dependencies

## 2.6.4

### Patch Changes

- Updated dependencies

## 2.6.3

### Patch Changes

- [#178163](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178163)
  [`b838eba8d205f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b838eba8d205f) -
  ED-26030-hide-comment-toolbar-when-user-switch-back-to-edit-mode

## 2.6.2

### Patch Changes

- [#176427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176427)
  [`9c2bd03adeebd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9c2bd03adeebd) -
  [ED-25999] adding analytic events for inline node of emoji,status and inlineCard

## 2.6.1

### Patch Changes

- [#171440](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171440)
  [`835f7bbff3122`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/835f7bbff3122) -
  ED-25816: refactors plugins to meet folder standards

## 2.6.0

### Minor Changes

- [#174097](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174097)
  [`b691b87e73dc2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b691b87e73dc2) -
  [ux] ED-25902-add-floating-toolbar-in-view-mode

### Patch Changes

- Updated dependencies

## 2.5.10

### Patch Changes

- Updated dependencies

## 2.5.9

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 2.5.8

### Patch Changes

- Updated dependencies

## 2.5.7

### Patch Changes

- [#162726](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162726)
  [`10223ce40d9a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10223ce40d9a0) -
  update appearance and colours for visual refresh
- Updated dependencies

## 2.5.6

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 2.5.5

### Patch Changes

- [#155668](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155668)
  [`f948f63ced742`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f948f63ced742) -
  We are testing replacing findDOMNode with an explicit ref behind a feature flag. If this fix is
  successful it will be available in a later release.
- Updated dependencies

## 2.5.4

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 2.5.3

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 2.5.2

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 2.5.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 2.4.12

### Patch Changes

- Updated dependencies

## 2.4.11

### Patch Changes

- Updated dependencies

## 2.4.10

### Patch Changes

- Updated dependencies

## 2.4.9

### Patch Changes

- Updated dependencies

## 2.4.8

### Patch Changes

- Updated dependencies

## 2.4.7

### Patch Changes

- Updated dependencies

## 2.4.6

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.4.5

### Patch Changes

- Updated dependencies

## 2.4.4

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.4.3

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [#122612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122612)
  [`01a85ce0a88ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01a85ce0a88ec) -
  [ux] ED-23705 Add logic to handle annotations on inline nodes when they are inserted or pasted.
  Covers the following inline nodes: emoji, status, mention, date, inlineCard

## 2.1.2

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#117356](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117356)
  [`9d772a51e5663`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9d772a51e5663) -
  [ux] Fix inserting status from insert block dropdown.

  Introduces new command on status plugin "insertStatus" which can be used by toolbars to insert a
  status node.

  Example:

  ```ts
  return pluginInjectionApi?.core?.actions.execute(
  	pluginInjectionApi?.status?.commands?.insertStatus(inputMethod),
  );
  ```

## 2.0.0

### Major Changes

- [`d9b562bd66f8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9b562bd66f8e) -
  [ux] [ED-23947] restoring the original order of the typeahead menu so that actions, media,
  mentions and emojis are above the fold (in the top 5 results). this change is a major because it
  removes the `getEditorFeatureFlags prop` for plugins. if any consumers who have adopted these
  changes to the public API, they should remove them on their side too.

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.4.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.2.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.1.5

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.1.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.1.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.9

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.8

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.7

### Patch Changes

- [#89995](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89995)
  [`997eaf79583d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/997eaf79583d) -
  Disable status popup when Editor not in editable mode

## 1.0.6

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.5

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.0.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.3

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.2

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

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

## 0.3.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.1

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.3.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.2.14

### Patch Changes

- Updated dependencies

## 0.2.13

### Patch Changes

- [#67814](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67814)
  [`b9ae9606c2e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9ae9606c2e0) -
  Migrate status and alignment plugins to use useSharedPluginState rather than WithPluginState

## 0.2.12

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.2.11

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.2.10

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.2.9

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.2.8

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.2.7

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.2.5

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.2.4

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.2.3

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.2.2

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.2.1

### Patch Changes

- [#42564](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42564)
  [`7139d6b0a64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7139d6b0a64) - ED-20512
  Fixed issue with adding status node inside a codeblock

## 0.2.0

### Minor Changes

- [#42325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42325)
  [`58f1fd91d09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58f1fd91d09) - ED-20512
  Set Focus on status input field when tab is pressed

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#41593](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41593)
  [`39329b628c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39329b628c8) - NO-ISSUE
  Added editor-plugin-analytics as a dependency.
