# @atlaskit/editor-plugin-mentions

## 7.2.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 7.1.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.0.3

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.2.12

### Patch Changes

- [`8497783928a16`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8497783928a16) -
  ED-29110: clean up sharedPluginStateHookMigratorFactory in media, mentions and paste options
- Updated dependencies

## 5.2.11

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema
- Updated dependencies

## 5.2.10

### Patch Changes

- Updated dependencies

## 5.2.9

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 5.2.8

### Patch Changes

- Updated dependencies

## 5.2.7

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 5.2.6

### Patch Changes

- Updated dependencies

## 5.2.5

### Patch Changes

- Updated dependencies

## 5.2.4

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
- Updated dependencies

## 5.2.3

### Patch Changes

- Updated dependencies

## 5.2.2

### Patch Changes

- Updated dependencies

## 5.2.1

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0
- Updated dependencies

## 5.2.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

## 5.1.4

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 5.1.3

### Patch Changes

- Updated dependencies

## 5.1.2

### Patch Changes

- [#182839](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182839)
  [`81f1c3383bdab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81f1c3383bdab) -
  refactor: use useSharedPluginStateWithSelector instead of useSharedPluginStateSelector

## 5.1.1

### Patch Changes

- Updated dependencies

## 5.1.0

### Minor Changes

- [#181692](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181692)
  [`919d15a436698`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/919d15a436698) -
  Add insertMention API to mentions so that consumers can create mentions from a toolbar.

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

## 4.7.12

### Patch Changes

- Updated dependencies

## 4.7.11

### Patch Changes

- [#176864](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176864)
  [`980fda095ab20`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/980fda095ab20) -
  [ux] Adjust mention styles to use flex centering instead of fixed padding values
- Updated dependencies

## 4.7.10

### Patch Changes

- [#175895](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175895)
  [`6165a5dc5b6b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6165a5dc5b6b1) -
  Remove deprecated path for react version of mentions
- Updated dependencies

## 4.7.9

### Patch Changes

- Updated dependencies

## 4.7.8

### Patch Changes

- Updated dependencies

## 4.7.7

### Patch Changes

- Updated dependencies

## 4.7.6

### Patch Changes

- Updated dependencies

## 4.7.5

### Patch Changes

- Updated dependencies

## 4.7.4

### Patch Changes

- Updated dependencies

## 4.7.3

### Patch Changes

- Updated dependencies

## 4.7.2

### Patch Changes

- Updated dependencies

## 4.7.1

### Patch Changes

- Updated dependencies

## 4.7.0

### Minor Changes

- [#157073](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157073)
  [`90a6126393c2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/90a6126393c2d) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 4.6.1

### Patch Changes

- Updated dependencies

## 4.6.0

### Minor Changes

- [#150809](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150809)
  [`1416994f2bdb2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1416994f2bdb2) -
  Used plugin selector conditionally behind feature flag

## 4.5.2

### Patch Changes

- Updated dependencies

## 4.5.1

### Patch Changes

- [#148798](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148798)
  [`8112e98809756`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8112e98809756) -
  [No Issue] Clean up virtualization feature flag
- Updated dependencies

## 4.5.0

### Minor Changes

- [#145336](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145336)
  [`7c22413232131`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c22413232131) -
  [https://product-fabric.atlassian.net/browse/ED-27657](ED-27657) - move the `mentions` and
  `tasksAndDecisions` plugins configuration to `@atlassian/confluence-presets` package

## 4.4.2

### Patch Changes

- [#143385](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143385)
  [`8c63cbda9b29f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c63cbda9b29f) -
  Fix initial position of mention profile card popup.
- Updated dependencies

## 4.4.1

### Patch Changes

- [#140813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140813)
  [`c4756a5c1a4ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4756a5c1a4ae) -
  Migrating offline editing feature gates to a new experiment "platform_editor_offline_editing_web"
- Updated dependencies

## 4.4.0

### Minor Changes

- [#139139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139139)
  [`7f6b665d778dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f6b665d778dd) -
  [https://product-fabric.atlassian.net/browse/ED-27499](ED-27499) - the new
  `@atlassian/confluence-presets` package with Confluence `full-page` preset is created

### Patch Changes

- Updated dependencies

## 4.3.3

### Patch Changes

- [#138789](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138789)
  [`eeb167efe5e64`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eeb167efe5e64) -
  Setup focus trap for profile card provider in vanilla mention version
- Updated dependencies

## 4.3.2

### Patch Changes

- Updated dependencies

## 4.3.1

### Patch Changes

- [#137012](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137012)
  [`4dc7b6496e62c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4dc7b6496e62c) -
  [ux] Match the popup behaviour in vanilla mention node to the existing behaviour.

## 4.3.0

### Minor Changes

- [#134205](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134205)
  [`7751c880c8ebf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7751c880c8ebf) -
  Refactor mentions node view to vanilla javascript.

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#133497](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133497)
  [`dccd8bcdef0a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dccd8bcdef0a3) -
  [ED-23460] Adding the objectId, containerId and childObjectId to the mention typeahead inserted
  events

### Patch Changes

- Updated dependencies

## 4.1.7

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
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

- [#122140](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122140)
  [`3f7b2bc0c6ef0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f7b2bc0c6ef0) -
  Add missing dependencies to the package.json file
- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- [#119706](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119706)
  [`42fd258ba482e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42fd258ba482e) -
  ED-26704: enables editor node virtualization experiment
- Updated dependencies

## 4.0.2

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 4.0.1

### Patch Changes

- [#119045](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119045)
  [`47b940a098a8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47b940a098a8c) -
  [ux] EDF-2511 - Iconography uplift

## 4.0.0

### Major Changes

- [#117947](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117947)
  [`2c672e958d395`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c672e958d395) -
  [ux] EDF-2346 - [MD] Remove emotion references

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

## 2.15.3

### Patch Changes

- [#116070](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116070)
  [`85b41fded4577`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85b41fded4577) -
  ED-26308: implements fallback dom for mention plugin

## 2.15.2

### Patch Changes

- Updated dependencies

## 2.15.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 2.15.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 2.14.2

### Patch Changes

- Updated dependencies

## 2.14.1

### Patch Changes

- Updated dependencies

## 2.14.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.13.1

### Patch Changes

- [#104847](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104847)
  [`b55fc11242d17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b55fc11242d17) -
  Consolidate duplicate import statements

## 2.13.0

### Minor Changes

- [#103277](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103277)
  [`38e621ec55cd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38e621ec55cd4) -
  Changed signature of optional prop (inviteXProductUser) with 1 more param. This is regarding
  CCEDITIONS-4746 (x-product-user-invite experiment). Project poster link -
  https://hello.atlassian.net/wiki/spaces/CV1/pages/3685626022/Project+poster+-+Cross+Product+User+Search+Invites

### Patch Changes

- Updated dependencies

## 2.12.0

### Minor Changes

- [#101931](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101931)
  [`8a09e2cba1485`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a09e2cba1485) -
  Changed signature of optional prop (inviteXProductUser) with 1 more param. This is regarding
  CCEDITIONS-4746 (x-product-user-invite experiment). Project poster link -

### Patch Changes

- Updated dependencies

## 2.11.3

### Patch Changes

- [#100411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100411)
  [`14499ab145534`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14499ab145534) -
  [ux] Introduces advanced code block as per:
  https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4632293323/Editor+RFC+063+Advanced+code+blocks.
  This can be added to an existing editor preset to enrich the code block experience with syntax
  highlighting and can be extended for other features via CodeMirror extensions (ie. autocompletion,
  code folding etc.).

## 2.11.2

### Patch Changes

- [#102447](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102447)
  [`17f3bf711d55c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17f3bf711d55c) -
  Re-enable mentions while offline.

## 2.11.1

### Patch Changes

- [#97984](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97984)
  [`8ffeab9aaf1ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ffeab9aaf1ab) -
  [ux] [ED-23573] Added new actions (resolveMarks and registerMarks) to basePlugin. Callbacks added
  to mentions, card, emoji and base plugins to handle conversion to inline code. Deprecated code
  removed from editor-common.
- Updated dependencies

## 2.11.0

### Minor Changes

- [#99344](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99344)
  [`fbeb84f180cd2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fbeb84f180cd2) -
  Added optional `isEligibleXProductUserInvite` and `inviteXProductUser` props which will be used in
  CCEDITIONS-4746 (x-product-user-invite experiment). Project poster link -
  https://hello.atlassian.net/wiki/spaces/CV1/pages/3685626022/Project+poster+-+Cross+Product+User+Search+Invites

### Patch Changes

- Updated dependencies

## 2.10.9

### Patch Changes

- Updated dependencies

## 2.10.8

### Patch Changes

- Updated dependencies

## 2.10.7

### Patch Changes

- Updated dependencies

## 2.10.6

### Patch Changes

- Updated dependencies

## 2.10.5

### Patch Changes

- [#171350](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171350)
  [`436dfb28a4833`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/436dfb28a4833) -
  [ux] Support disabled type-ahead items while user is offline for media, emoji, and mentions.
- [#170868](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170868)
  [`ed6ece7d3c533`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed6ece7d3c533) -
  ED-25814: refactors plugins to meet folder standards
- Updated dependencies

## 2.10.4

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 2.10.3

### Patch Changes

- Updated dependencies

## 2.10.2

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 2.10.1

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 2.10.0

### Minor Changes

- [#154569](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154569)
  [`344239dfc7745`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/344239dfc7745) -
  Use smart links for team mentions

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 2.9.2

### Patch Changes

- Updated dependencies

## 2.9.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 2.9.0

### Minor Changes

- [#152012](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152012)
  [`30a69f02904da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30a69f02904da) -
  [ED-23460] Make sure that error analytics in editor-plugin-mentions can fire by using actions from
  editor-plugin-analytics

  - **@atlaskit/editor-common**: Add types for `@atlaskit/editor-plugin-mentions` analytics
  - **@atlaskit/editor-plugin-mentions**: Switch to using `@atlaskit/editor-plugin-analytics`
    actions so that error events can be queued and fired consistently
  - **@atlaskit/mention**: Move some enums to the types file and export them so they can be used to
    type analytics events

## 2.8.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 2.7.1

### Patch Changes

- [#149581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149581)
  [`e98d687b864ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e98d687b864ab) -
  [ED-23460] Track when mention providers are undefined
- Updated dependencies

## 2.7.0

### Minor Changes

- [#148601](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148601)
  [`e11f6a141cfe5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e11f6a141cfe5) -
  [ED-23460] **@atlaskit/editor-plugin-mentions**: Track when mention providers fail to resolve
  **@atlaskit/editor-common**: Add enums for mention provider reporting

### Patch Changes

- Updated dependencies

## 2.6.7

### Patch Changes

- Updated dependencies

## 2.6.6

### Patch Changes

- Updated dependencies

## 2.6.5

### Patch Changes

- [#145765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145765)
  [`eded181672815`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eded181672815) -
  [ED-23481] Clean up `platform.editor.mentions-in-editor-popup-on-click`
- Updated dependencies

## 2.6.4

### Patch Changes

- Updated dependencies

## 2.6.3

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#138305](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138305)
  [`c79d9c18032b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c79d9c18032b6) -
  Passing task local ID from editor mentions plugin

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.5.2

### Patch Changes

- [#136348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136348)
  [`fb4fb56f1da7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb4fb56f1da7c) -
  Use optimised entry-points on editor-common for browser.
- Updated dependencies

## 2.5.1

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.5.0

### Minor Changes

- [#133315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133315)
  [`5c94ca338de14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c94ca338de14) -
  Updating mentions plugin config for handling deleted mentions and refactor

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#131937](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131937)
  [`64414d9668409`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64414d9668409) -
  Adding configuration to mentions plugin from confluence

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#122612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122612)
  [`01a85ce0a88ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01a85ce0a88ec) -
  [ux] ED-23705 Add logic to handle annotations on inline nodes when they are inserted or pasted.
  Covers the following inline nodes: emoji, status, mention, date, inlineCard
- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`d9b562bd66f8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9b562bd66f8e) -
  [ux] [ED-23947] restoring the original order of the typeahead menu so that actions, media,
  mentions and emojis are above the fold (in the top 5 results). this change is a major because it
  removes the `getEditorFeatureFlags prop` for plugins. if any consumers who have adopted these
  changes to the public API, they should remove them on their side too.

### Patch Changes

- Updated dependencies

## 1.8.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#111187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111187)
  [`3fc3b37188f2c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3fc3b37188f2c) -
  [ux] [ED-23788] Make sure that profilecards in the Editor do not autofocus, so that users can
  click on a mention and immediate delete it by pressing `Backspace` or `Delete`
- Updated dependencies

## 1.7.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- Updated dependencies

## 1.6.0

### Minor Changes

- [#108100](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108100)
  [`c854f5415176c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c854f5415176c) -
  Add localId to mentionTypeahead click event attributes

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#103169](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103169)
  [`e9d45fc94064`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9d45fc94064) -
  [ux] [ED-23248] -

  **@atlaskit/editor-core**: Added optional profilecardProvider to Mention plugin in universal
  composable editor **@atlaskit/editor-plugin-mentions**: Made mentions render with profile cards on
  click if the feature flag: `platform.editor.mentions-in-editor-popup-on-click` is turned on

## 1.4.1

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.4.0

### Minor Changes

- [#103099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103099)
  [`ab382e121799`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab382e121799) -
  [ux] [ED-23248] -

  **@atlaskit/editor-core**: REVERT: Added optional profilecardProvider to Mention plugin in
  universal composable editor **@atlaskit/editor-plugin-mentions**: REVERT: Made mentions render
  with profile cards on click if the feature flag:
  `platform.editor.mentions-in-editor-popup-on-click` is turned on

## 1.3.0

### Minor Changes

- [#98647](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98647)
  [`19eb20751225`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19eb20751225) -
  [ux] [ED-23248] -

  **@atlaskit/editor-core**: Added optional profilecardProvider to Mention plugin in universal
  composable editor **@atlaskit/editor-plugin-mentions**: Made mentions render with profile cards on
  click if the feature flag: `platform.editor.mentions-in-editor-popup-on-click` is turned on

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

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- [#98103](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98103)
  [`14c055a65f67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14c055a65f67) -
  removed invite from mention experiment check

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

## 1.0.10

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.9

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.8

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.7

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.0.6

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.5

### Patch Changes

- [#81852](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81852)
  [`0641eef91f65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0641eef91f65) -
  React 18 types for editor-plugin-mentions

## 1.0.4

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.3

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.0.2

### Patch Changes

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

## 0.2.3

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.2

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.2.1

### Patch Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640)
  [`6a3ea210641a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3ea210641a) -
  Create new context identifier plugin which contains the provider.
- Updated dependencies

## 0.2.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.1.20

### Patch Changes

- Updated dependencies

## 0.1.19

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.18

### Patch Changes

- [#67189](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67189)
  [`93cbf53ca0e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93cbf53ca0e0) -
  Removing instances of WithPluginState from mentions and type-ahead plugins.

## 0.1.17

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.1.16

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.1.15

### Patch Changes

- Updated dependencies

## 0.1.14

### Patch Changes

- [#64538](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64538)
  [`264115ce5ec4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/264115ce5ec4) -
  DTR-2096: Add taskListId and taskItemId to mention typeAhead clicked and pressed analytic events,
  when inserted within actions or tasks
- Updated dependencies

## 0.1.13

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.1.12

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.1.11

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.1.10

### Patch Changes

- Updated dependencies

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.1.7

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.1.6

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.1.5

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.1.2

### Patch Changes

- [#42451](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42451)
  [`36764ad64a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36764ad64a9) -
  [ECA11Y-87] Mentioned name is not communicated to the users of screen reader

## 0.1.1

### Patch Changes

- Updated dependencies
