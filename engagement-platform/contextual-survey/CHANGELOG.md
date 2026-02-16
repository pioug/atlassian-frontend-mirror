# @atlaskit/contextual-survey

## 6.0.3

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Major Changes

- [`6bf206e599731`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bf206e599731) -
  [ux] A new Contextual Survey Component with Redesigned UI

## 5.1.2

### Patch Changes

- [`db16d1751c5ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db16d1751c5ad) -
  Internal changes to typography.

## 5.1.1

### Patch Changes

- Updated dependencies

## 5.1.0

### Minor Changes

- [`87b12e64ff750`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87b12e64ff750) -
  Removed usages of LEGACY icon props

### Patch Changes

- Updated dependencies

## 5.0.20

### Patch Changes

- [`9123fad528082`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9123fad528082) -
  Icon entry point migration update

## 5.0.19

### Patch Changes

- [`6a82d7964a37b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6a82d7964a37b) -
  Icon entrypoint migration
- Updated dependencies

## 5.0.18

### Patch Changes

- Updated dependencies

## 5.0.17

### Patch Changes

- Updated dependencies

## 5.0.16

### Patch Changes

- Updated dependencies

## 5.0.15

### Patch Changes

- Updated dependencies

## 5.0.14

### Patch Changes

- Updated dependencies

## 5.0.13

### Patch Changes

- Updated dependencies

## 5.0.12

### Patch Changes

- Updated dependencies

## 5.0.11

### Patch Changes

- Updated dependencies

## 5.0.10

### Patch Changes

- Updated dependencies

## 5.0.9

### Patch Changes

- [`beaa6ee463aa8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/beaa6ee463aa8) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 5.0.8

### Patch Changes

- Updated dependencies

## 5.0.7

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 5.0.6

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#170573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170573)
  [`1efba5d4d5b72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1efba5d4d5b72) -
  [ux] This change overrides the Heading xsmall default DOM element from an `h5` to an `h2` to
  address an accessibility issue. Visually there is no change.

## 5.0.0

### Major Changes

- [#168857](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168857)
  [`4375440aeaf60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4375440aeaf60) -
  [ux] This change removes constants exports since compiled constants are not meant to be imported.
  Instead this change has the position values in-file instead.

  This is a breaking change because we are removing an entry point.

  Package consumers will need to remove "@atlaskit/contextual-survey/constants" as a dependency.

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#138159](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138159)
  [`065a6f8569949`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/065a6f8569949) -
  [ux] Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align
  with the rest of the Atlaskit techstack, and support React 18 Sttreaming SSR. Please note, in
  order to use this version of @atlaskit/contextual-survey, you will need to ensure that your
  bundler is configured to handle '.css' imports correctly.

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 3.1.0

### Minor Changes

- Migrate from @emotion/react to @compiled/react, enabled by feature gate:
  platform_contextual_survey_enable_compiled_fg

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

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

## 2.5.4

### Patch Changes

- Updated dependencies

## 2.5.3

### Patch Changes

- Updated dependencies

## 2.5.2

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- Updated dependencies

## 2.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

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

- Updated dependencies

## 2.4.5

### Patch Changes

- Updated dependencies

## 2.4.4

### Patch Changes

- Updated dependencies

## 2.4.3

### Patch Changes

- Updated dependencies

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- [#149900](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149900)
  [`1b67ed4471db0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b67ed4471db0) -
  bumped to react18

## 2.4.0

### Minor Changes

- [#147230](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147230)
  [`0450aceb2400a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0450aceb2400a) -
  Enable new icons behind a feature flag.

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

- [#129844](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129844)
  [`654f46d9b38cc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/654f46d9b38cc) -
  Typography migration (https://product-fabric.atlassian.net/browse/PYX-881) for engagement-platform
  package

## 2.2.20

### Patch Changes

- Updated dependencies

## 2.2.19

### Patch Changes

- Updated dependencies

## 2.2.18

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 2.2.17

### Patch Changes

- Updated dependencies

## 2.2.16

### Patch Changes

- Updated dependencies

## 2.2.15

### Patch Changes

- [#84829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84829)
  [`a6299ec57bc3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6299ec57bc3) -
  Internal change to replace hardcoded font fallback values with an exported constant. There is no
  expected visual difference.

## 2.2.14

### Patch Changes

- [#83176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83176)
  [`5c64e4657ef3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c64e4657ef3) -
  [ux] Minor changes to replace deprecated font tokens with new tokens. There may be some very
  slight differences in font size if the previous value was incorrectly applied, and slight
  differences in line height to match the new typography system.
- Updated dependencies

## 2.2.13

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.2.12

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 2.2.11

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 2.2.9

### Patch Changes

- [#57124](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57124)
  [`7ee324f9de67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ee324f9de67) -
  Upgrade Emotion v10 (@emotion/core) to Emotion v11 (@emotion/react). No behaviour change expected.

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- Updated dependencies

## 2.2.6

### Patch Changes

- Updated dependencies

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 2.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.1.12

### Patch Changes

- [#33208](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33208)
  [`f655e8ed2d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f655e8ed2d2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 2.1.11

### Patch Changes

- [#32162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32162)
  [`edf6745b956`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edf6745b956) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 2.1.10

### Patch Changes

- Updated dependencies

## 2.1.9

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 2.1.8

### Patch Changes

- Updated dependencies

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- Updated dependencies

## 2.1.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 2.1.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#19924](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19924)
  [`d943a822f6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d943a822f6a) - [ux]
  Instrumented `@atlaskit/contextual-survey` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

## 2.0.11

### Patch Changes

- Updated dependencies

## 2.0.10

### Patch Changes

- Updated dependencies

## 2.0.9

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`cad4332df17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cad4332df17) - [ux]
  Fixed flickering in context survey by removing theme overrides
- Updated dependencies

## 2.0.8

### Patch Changes

- Updated dependencies

## 2.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

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

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 2.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 1.0.10

### Patch Changes

- [#2884](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2884)
  [`3ba793cffa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ba793cffa) - Update all
  the theme imports in contextual-survey

## 1.0.9

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 1.0.8

### Patch Changes

- [patch][dd7e8b4bc7](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd7e8b4bc7):

  Change imports to comply with Atlassian conventions

## 1.0.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/textarea@2.2.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 1.0.6

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/form@7.1.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/tooltip@15.2.2

## 1.0.5

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Pull in update to form to fix a bug which could cause the internal fieldId to be incorrectly set-
  [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow
  types are no longer provided. No API changes.- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/form@7.0.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/textarea@2.2.3

## 1.0.4

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 1.0.3

- Updated dependencies
  [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/form@6.2.3
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 1.0.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 1.0.1

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 1.0.0

### Major Changes

- [major][271b7db35b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271b7db35b):

  _💥 Most of the changes listed are breaking changes from the 0.x release_

  ### New component for placement: `<SurveyMarshal />`

  We no longer require consumers to know anything about `react-transition-group` to use this
  package. The `<SurveyMarshal />` takes care of the placement and mounting / unmounting animation
  of the component. It accepts a _function as a child_ which needs to return the
  `<ContextualSurvey />`. This pattern also allows the `<ContextualSurvey />` to not be evaluated
  when it is not mounted

  ```js
  import { SurveyMarshal, ContextualSurvey } from '@atlaskit/contextual-survey';

  <SurveyMarshal shouldShow={showSurvey}>{() => <ContextualSurvey />}</SurveyMarshal>;
  ```

  ### Other
  - `getUserHasAnsweredMailingList: () => boolean | () => Promise<boolean>` has been streamlined to
    just be `() => Promise<boolean>`.
  - ~~`onSignUp() => Promise<void>`~~ has become `onMailingListAnswer(answer) => Promise<void>`.
    Previously `onSignUp` was only called if the user selected they wanted to sign up.
    `onMailingListAnswer` will be called when the user selects they want to sign up, as well as if
    they select that they do not want to sign up.
  - 💄 `<ContextualSurvey />` now animates in as well as out
  - 💄 No more scrollbars during closing animation
  - 💄 Fixing spacing for `FeedbackAcknowledgement` screen
  - 💄 Audit dismiss button alignment
  - 🛠Preventing double calls to `onDismiss()`
  - 🛠`onDismiss()` now provided with a `enum:DismissTrigger` to give more information about the
    reason for the dismiss
  - 🛠If `<ContextualSurvey />` is dismissed while `onSubmit` is resolving, then
    `getUserHasAnsweredMailingList()` is not called. We do this as we won't be showing the email
    sign up
  - 🛠If the user marks that they do not want to be contacted, then
    `getUserHasAnsweredMailingList()` is not called. Previously `getUserHasAnsweredMailingList()`
    was always called _regardless_ of whether the user wanted to be contacted. The email sign up is
    only showed if the user states that they want to be contacted and if
    `getUserHasAnsweredMailingList` returns `false`. We now don't call
    `getUserHasAnsweredMailingList` if the user has stated they don't want to be contacted as it is
    a precondition.
  - 🚀 The user is able to dismiss the form at any time using the `escape` key
  - 🕵️‍ After clicking a score the response `textarea` is given browser focus.
  - ✅ New behaviour for the _can contact_ checkbox. It is now not selected by default. When a user
    types into the response text area for the first time we swap it to checked. From that point the
    user is welcome to change it's value and we do not automatically swap it to checked again. This
    allows people to select a score but not be contacted for it. It also recognises that the
    engagement platform would like to be able to respond to people who provide feedback.
  - ♿️ Added `aria-pressed` to currently selected score
  - 📖 Documentation explaining application flow
  - 👩‍🔬 Added automated test for happy path
  - ❌ No longer exporting `surveyWidth` and `surveyMargin`. All placement is handled by
    `<SurveyMarshal />`

## 0.1.3

- Updated dependencies
  [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/checkbox@9.0.0

## 0.1.2

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/form@6.1.1
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 0.1.1

### Patch Changes

- [patch][0fc1ac28e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0fc1ac28e8):

  Fixed missing background colour.

## 0.1.0

### Minor Changes

- [minor][25f45f87f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25f45f87f4):

  Create contextual survey component
