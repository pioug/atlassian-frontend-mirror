# @atlaskit/editor-plugin-base

## 6.2.1

### Patch Changes

- [`fba5acd7818c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fba5acd7818c3) -
  ED-29392: fix scroll gutter hydration issue
- Updated dependencies

## 6.2.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- [`dae03b426a38d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dae03b426a38d) -
  ED-29162: fix editorcontentcontainer hydration issue
- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.1.8

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema
- Updated dependencies

## 4.1.7

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 4.1.6

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 4.1.5

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- Updated dependencies

## 4.1.3

### Patch Changes

- [`01301aa6646c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/01301aa6646c4) -
  Add advanced codeblocks experiment for jira.
- Updated dependencies

## 4.1.2

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
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

## 4.0.2

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
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

## 3.0.6

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#152928](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152928)
  [`085c1eac95c8f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/085c1eac95c8f) -
  [EDITOR-709] Removed unused analytics enums and types

### Patch Changes

- Updated dependencies

## 2.3.5

### Patch Changes

- Updated dependencies

## 2.3.4

### Patch Changes

- Updated dependencies

## 2.3.3

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

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 2.2.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#97984](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97984)
  [`8ffeab9aaf1ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ffeab9aaf1ab) -
  [ux] [ED-23573] Added new actions (resolveMarks and registerMarks) to basePlugin. Callbacks added
  to mentions, card, emoji and base plugins to handle conversion to inline code. Deprecated code
  removed from editor-common.

### Patch Changes

- Updated dependencies

## 2.0.12

### Patch Changes

- Updated dependencies

## 2.0.11

### Patch Changes

- Updated dependencies

## 2.0.10

### Patch Changes

- [#180763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180763)
  [`db6668f7e2f8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db6668f7e2f8f) -
  ED-25855 clean up feature flag for softline break on second row by using Japanese/Chinese

## 2.0.9

### Patch Changes

- [#176803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176803)
  [`7a0ef514e8d39`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a0ef514e8d39) -
  Add data-vc attribute to scroll-gutter

## 2.0.8

### Patch Changes

- [#172929](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172929)
  [`ee80242ee0a31`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee80242ee0a31) -
  Remediate re-exports
- Updated dependencies

## 2.0.7

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- [#170774](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170774)
  [`641b4dbf79095`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/641b4dbf79095) -
  ED-25806: migrates editor plugins to folder standards
- Updated dependencies

## 2.0.5

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 2.0.2

### Patch Changes

- [#156556](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156556)
  [`fa4db989cfa70`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fa4db989cfa70) -
  [HOT-112603] Reduce memory leak footage by using WeakRef to store HTML element

## 2.0.1

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 2.0.0

### Major Changes

- [#154731](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154731)
  [`c07d9c6cecf8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c07d9c6cecf8e) -
  EDF-1411 Removed UFO experience events from Editor.

### Patch Changes

- [#154843](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154843)
  [`33209df89f059`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33209df89f059) -
  [ux] Improve how the scroll gutter at the bottom of the screen works to prevent flickering while
  typing.
- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 1.12.2

### Patch Changes

- [#154162](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154162)
  [`5982815965267`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5982815965267) -
  Updated performanceTracking and inputSampling props to hardcoded values as we're removing this
  feature flag

## 1.12.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 1.12.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 1.11.9

### Patch Changes

- Updated dependencies

## 1.11.8

### Patch Changes

- Updated dependencies

## 1.11.7

### Patch Changes

- Updated dependencies

## 1.11.6

### Patch Changes

- Updated dependencies

## 1.11.5

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.11.4

### Patch Changes

- Updated dependencies

## 1.11.3

### Patch Changes

- [#139034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139034)
  [`517cdc0f7ea1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/517cdc0f7ea1a) -
  Used experiment for lazy node view

## 1.11.2

### Patch Changes

- [#138801](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138801)
  [`eeb1f7ad41211`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eeb1f7ad41211) -
  Adding new entry-points to editor-common to optimise bundle size and move away from "utils"
  entry-point.
- Updated dependencies

## 1.11.1

### Patch Changes

- [#137736](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137736)
  [`2a88fdd213838`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a88fdd213838) -
  Introducing new smaller refined entry-points for editor-common to reduce bundle size.
- Updated dependencies

## 1.11.0

### Minor Changes

- [#136261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136261)
  [`7e900c6a2ae84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7e900c6a2ae84) -
  Lazy node view loading without setProps

### Patch Changes

- Updated dependencies

## 1.10.2

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 1.10.1

### Patch Changes

- Updated dependencies

## 1.10.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 1.7.5

### Patch Changes

- Updated dependencies

## 1.7.4

### Patch Changes

- Updated dependencies

## 1.7.3

### Patch Changes

- [#117973](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117973)
  [`6e37bac62083f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e37bac62083f) -
  moved one const, added new entry point for other and deprecated
- Updated dependencies

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.7.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#110262](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110262)
  [`5a9ede4b76193`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5a9ede4b76193) -
  Added paragraph and heading NodeSpecs flag back

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#105253](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105253)
  [`a5f3cd26fbd6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a5f3cd26fbd6) -
  Clean up platform.editor.enable-localid-for-paragraph-in-stage-0_cby7g FF

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.3.0

### Minor Changes

- [#102243](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102243)
  [`cfc95dac3d82`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cfc95dac3d82) -
  Use new paragraph and heading NodeSpecs

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

## 1.0.7

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.6

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.5

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.4

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

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

## 0.3.7

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.6

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.3.5

### Patch Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640)
  [`6a3ea210641a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3ea210641a) -
  Create new context identifier plugin which contains the provider.
- Updated dependencies

## 0.3.4

### Patch Changes

- [#67690](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67690)
  [`2f7dc1629e1c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f7dc1629e1c) -
  Cleanup feature flag for scrolling optimisation.

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- [#63346](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63346)
  [`7ab6b24559c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ab6b24559c0) -
  Minor performance optimisation for scroll gutter.
- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.3.1

### Patch Changes

- [#64064](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64064)
  [`77394053290a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77394053290a) -
  Comment change to trigger builds

## 0.3.0

### Minor Changes

- [#63522](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63522)
  [`906d43c5bb6d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/906d43c5bb6d) -
  Remove hack for chrome 88 selection bug

## 0.2.13

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.2.12

### Patch Changes

- [#60228](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60228)
  [`63507f58b595`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/63507f58b595) -
  Fix browserFreeze events collecting/reporting

## 0.2.11

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.2.10

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.2.9

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.2.8

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.2.7

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.2.6

### Patch Changes

- [#43646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43646)
  [`d43f8e9402f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43f8e9402f) - Make
  feature flags plugin optional in all plugins including:

  - analytics
  - base
  - card
  - code-block
  - expand
  - extension
  - floating-toolbar
  - hyperlink
  - insert-block
  - layout
  - layout
  - list
  - media
  - paste
  - rule
  - table
  - tasks-and-decisions

  We already treat it as optional in the plugins, so this is just ensuring that the plugin is not
  mandatory to be added to the preset.

## 0.2.5

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.2.4

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.2.3

### Patch Changes

- [#41047](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41047)
  [`8f0b00d165f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0b00d165f) -
  [ED-20003] Extract TypeAhead from editor-core to its own package
  @atlaskit/editor-plugin-type-ahead

## 0.2.2

### Patch Changes

- [#40750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40750)
  [`fc19a7b9edd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc19a7b9edd) -
  [ED-19875] Extraction of Editor Core's Selection Plugin into independent package
  '@atlaskit/editor-plugin-selection'.
- Updated dependencies

## 0.2.1

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 0.2.0

### Minor Changes

- [#40718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40718)
  [`c1d4b48bdd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1d4b48bdd9) - WHAT:
  This change removes plugin exports from editor-core that were used only for the mobile bridge.

  This includes:

  - All plugin keys
  - Plugin commands
  - Plugin types

  The full list is:

  - EditorFeatureFlags (available via '@atlaskit/editor-common/types' as `FeatureFlags`)
  - EmojiResource (available via '@atlaskit/emoji/resource' as `EmojiResource`)
  - mediaPlugin
  - insertMediaSingleNode
  - CustomMediaPicker
  - mediaPluginKey
  - textColorPluginKey
  - TextColorPluginState
  - changeColor
  - CodeBlockPlugin
  - PanelPlugin
  - subscribeToToolbarAndPickerUpdates
  - subscribeTypeAheadUpdates
  - TextFormattingInputMethodToolbar
  - TextFormattingInputMethodBasic
  - createTable
  - insertTaskDecisionCommand
  - TaskDecisionInputMethod
  - EventDispatcher
  - statusPluginKey
  - StatusState
  - StatusType
  - DatePluginState
  - insertDate
  - openDatePicker
  - deleteDate
  - dateToDateType
  - datePluginKey
  - commitStatusPicker
  - setStatusPickerAt
  - updateStatus
  - updateStatusWithAnalytics
  - removeStatus
  - typeAheadPluginKey
  - TypeAheadPluginState
  - setKeyboardHeight
  - setMobilePaddingTop
  - setIsExpanded
  - dedupe (available via '@atlaskit/editor-common/utils' as `dedupe`)
  - GapCursorSelection (available via '@atlaskit/editor-common/selection' as `GapCursorSelection`)
  - GapCursorSide (available via '@atlaskit/editor-common/selection' as `Side`)
  - HistoryPluginState
  - MentionPluginState
  - InsertBlockInputMethodToolbar
  - selectionPluginKey
  - SelectionData
  - SelectionDataState
  - insertExpand
  - createTypeAheadTools
  - AbstractMentionResource (available via '@atlaskit/mention/resource' as
    `AbstractMentionResource`)
  - PresenceResource (available via '@atlaskit/mention/resource' as `PresenceResource`)
  - ReactEditorView
  - BaseReactEditorView
  - getDefaultPresetOptionsFromEditorProps
  - lightModeStatusColorPalette
  - darkModeStatusColorPalette
  - PaletteColor
  - DEFAULT_BORDER_COLOR

  WHY: We have been extracting plugins out of `editor-core` and as we move them out we need to
  remove these exports as the new architecture does not support plugin keys or commands.

  This major bump will remove all remaining commands and keys in one go - some of these features
  will be accessible in a safe manner in the future via the `ComposableEditor` and the appropriate
  plugins.

  HOW: Should be no consumers using these methods currently (only mobile bridge which has been
  updated).

  If there are any issues please reach out to the #help-editor for information on how to update
  appropriately.

## 0.1.0

### Minor Changes

- [#40580](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40580)
  [`f8e7203eec6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8e7203eec6) - ED-19618
  Extract base plugin from editor-core

### Patch Changes

- Updated dependencies
