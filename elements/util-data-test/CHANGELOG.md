# @atlaskit/util-data-test

## 16.0.1

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 16.0.0

### Major Changes

- [`57808770e17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57808770e17) - CETI-31 Add the predefined Panel Icons to the emoji Picker

## 15.0.1

### Patch Changes

- [`83a7f464573`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83a7f464573) - Introduce new simple mock profilecard client to improve usability.

## 15.0.0

### Major Changes

- [`d361f290d63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d361f290d63) - NO-ISSUE avoid bundling test data for development

## 14.2.2

### Patch Changes

- [`dd91541afe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd91541afe) - [ux] Further improvements on the invite from mention experiment

## 14.2.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 14.2.0

### Minor Changes

- [`22791ceed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22791ceed0) - [ux] - added new properites in MentionResource interface to support invite from mention experiment

  - updated util-data-test/mention to enable invite from mention experiment
  - added invite from mention experiment logic into editor-core

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [`c9327fc11e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9327fc11e) - [ux] Add ability to user picker to display the external users along with the sources they come from.

## 14.0.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 14.0.3

### Patch Changes

- Updated dependencies

## 14.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 14.0.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 14.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 13.2.1

### Patch Changes

- [patch][f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  Remove unused dependencies

## 13.2.0

### Minor Changes

- [minor][35910b842f](https://bitbucket.org/atlassian/atlassian-frontend/commits/35910b842f):

  New Share to Slack UI wired up to experiment api calls and mock data for share to slack

## 13.1.2

### Patch Changes

- [patch][0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):

  Adding analytics for mention providers- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
  - @atlaskit/docs@8.4.0
  - @atlaskit/mention@18.17.0
  - @atlaskit/task-decision@16.0.8

## 13.1.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/emoji@62.6.3
  - @atlaskit/mention@18.16.2
  - @atlaskit/task-decision@16.0.6
  - @atlaskit/util-service-support@5.0.1

## 13.1.0

### Minor Changes

- [minor][81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):

  fixed avatar urls for mentions examples

## 13.0.2

### Patch Changes

- [patch][ce21161796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce21161796):

  Fix some types that were being transpiled to 'any'

## 13.0.1

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/emoji@62.5.5
  - @atlaskit/mention@18.15.7
  - @atlaskit/task-decision@16.0.1
  - @atlaskit/util-service-support@5.0.0

## 13.0.0

### Major Changes

- [major][bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):

  ED-7631: removed deprecated code for actions/decisions component- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

## 12.11.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.11.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.11.0

### Minor Changes

- [minor][8b73f10071](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b73f10071):

  fixed emoji CDN urls to ddev and re-enabled VR tests

## 12.10.0

### Minor Changes

- [minor][c9fbef651f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9fbef651f):

  Add Group as a new Option

## 12.9.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.9.5

### Patch Changes

- [patch][1fdbf04bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fdbf04bcd):

  Fix copy script for json-data to resolve path issues in codesandbox.

## 12.9.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.9.3

### Patch Changes

- [patch][6b237d8a3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b237d8a3e):

  Move json-data into src to fix the issue when the package is built.

## 12.9.2

### Patch Changes

- [patch][d5f37039ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5f37039ad):

  Add a custom build to copy `json-data` in the dist.

## 12.9.1

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 12.9.0

### Minor Changes

- [minor][9b83fdea35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b83fdea35):

  TEAMS-618 : Rename Team mention spotlight to Team Mention Highlight

## 12.8.0

### Minor Changes

- [minor][fe1a882fbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe1a882fbb):

  TEAMS-602 : Can pass the team creation link from confluence as an optional parameter to the Team Mention Spotlight

## 12.7.0

### Minor Changes

- [minor][06cfea0870](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06cfea0870):

  TEAMS-549 : Adding capability to show a spotlight in Fabric Editor

## 12.6.3

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.6.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 12.6.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 12.6.0

### Minor Changes

- [minor][2d1c3db523](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d1c3db523):

  FS-3986 - Support analytics for mention hydration.

## 12.5.0

### Minor Changes

- [minor][fec7d4576f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fec7d4576f):

  Bump new version of @atlaskit/mention to other AK packages to get correct i18n strings

## 12.4.0

### Minor Changes

- [minor][1c30b83665](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c30b83665):

  removed dup JSON files and fixed file paths to the new location

## 12.3.1

### Patch Changes

- [patch][2c387b14cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c387b14cf):

  Update private npm property to be public.Reasoning, it is breaking other components that depend on iton codesandbox.

## 12.3.0

### Minor Changes

- [minor][0b55c3b421](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b55c3b421):

  FS-3244 - Add support for resolving mention names client-side

## 12.2.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 12.1.0

- [minor][7089d49f61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7089d49f61):

  - consume the new mention entrypoints

## 12.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 11.1.9

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/emoji@61.0.0
  - @atlaskit/task-decision@14.0.9

## 11.1.8

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/emoji@60.0.0
  - @atlaskit/task-decision@14.0.8

## 11.1.7

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 11.1.6

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 11.1.5

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/emoji@59.0.0
  - @atlaskit/task-decision@14.0.1

## 11.1.4

- Updated dependencies [eb4323c388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb4323c388):
  - @atlaskit/task-decision@14.0.0

## 11.1.3

- [patch][1affe17dc4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1affe17dc4):

  - add analytics events for team mention

## 11.1.2

- [patch][5ca3696b14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ca3696b14):

  - TEAMS-319 : Render member counts and whether team includes you in byline

- [patch][b8b55dc6ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8b55dc6ae):

  - TEAMS-319 : Render member counts and whether team includes you in byline

## 11.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 11.1.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 11.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 10.2.6

- [patch][fb679d390f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb679d390f):

  - Add a new TeamMenioResource for @atlaskit/mention package. That allows to fetch teams data for mention from a team service (Legion service)

## 10.2.5

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/emoji@57.0.0
  - @atlaskit/task-decision@12.0.1

## 10.2.4

- Updated dependencies [72c6f68226](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72c6f68226):
  - @atlaskit/task-decision@12.0.0

## 10.2.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/emoji@56.2.1
  - @atlaskit/mention@16.2.2
  - @atlaskit/task-decision@11.3.1
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/docs@7.0.0

## 10.2.2

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/emoji@56.0.0
  - @atlaskit/task-decision@11.2.3

## 10.2.1

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/emoji@55.0.0
  - @atlaskit/task-decision@11.2.1

## 10.2.0

- [minor][1d19234fbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d19234fbd):

  - Enable noImplicitAny and resolve issues for elements util packages

## 10.1.0

- [minor][be86cbebc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be86cbebc3):

  - enable noImplicitAny for task-decision, and related changes

## 10.0.36

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/emoji@54.0.0
  - @atlaskit/task-decision@11.1.8

## 10.0.35

- [patch][1ce0c13301](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ce0c13301):

  - TEAMS-169 Adding team related example data

## 10.0.34

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/emoji@53.0.0
  - @atlaskit/task-decision@11.1.6

## 10.0.33

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/emoji@52.0.0
  - @atlaskit/task-decision@11.1.5

## 10.0.32

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/mention@16.0.0

## 10.0.31

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/emoji@51.0.0
  - @atlaskit/task-decision@11.1.4

## 10.0.30

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/emoji@50.0.0
  - @atlaskit/task-decision@11.1.3

## 10.0.29

- [patch][551696e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/551696e):

  - FS-3398 Fix incorrect event type for mention's "rendered" analytics event, ui -> operational

## 10.0.28

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/emoji@49.0.0
  - @atlaskit/task-decision@11.1.1

## 10.0.27

- [patch][015fcd0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/015fcd0):

  - Adjusted unit tests to test for the bug noticed in FS-3259. Added multiple atlassian-ftfy emoji to test this, so updated a unit test to confirm that there are 14 Atlassian emoji, and also added an additional unit test to confirm that FS-3259 was corrected.

## 10.0.26

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/emoji@48.0.0
  - @atlaskit/task-decision@11.0.9

## 10.0.25

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/emoji@47.0.7
  - @atlaskit/mention@15.1.8
  - @atlaskit/task-decision@11.0.8
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/docs@6.0.0

## 10.0.24

- [patch][e0c91b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0c91b6):

  - FS-3310 Fix handling of duplicate users in mention typeahead causing HOT-85672

## 10.0.23

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 10.0.22

- [patch][10a728e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10a728e):

  - FS-3208 only display 'name' if same value as 'publicName'

## 10.0.21

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/emoji@47.0.0
  - @atlaskit/task-decision@11.0.4

## 10.0.20

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/emoji@46.0.0
  - @atlaskit/task-decision@11.0.2

## 10.0.19

- [patch] FS-3012 add async functionality to user-picker [832fdc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/832fdc1)

## 10.0.18

- [patch] Tweak emoji tests to work better with newest EmojiOne v4 metadata [c034007](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c034007)

## 10.0.17

- [patch] FS-3098 multi user picker [095b3b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/095b3b6)

## 10.0.16

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/emoji@45.0.0
  - @atlaskit/task-decision@11.0.1

## 10.0.15

- [patch] Updated dependencies [8a1ccf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a1ccf2)
  - @atlaskit/task-decision@11.0.0

## 10.0.14

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/emoji@44.0.0
  - @atlaskit/task-decision@10.0.2

## 10.0.13

- [patch] FS-3009 added user picker examples and data [74b88a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74b88a3)

## 10.0.12

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/emoji@43.0.0
  - @atlaskit/task-decision@10.0.1

## 10.0.11

- [patch] Updated dependencies [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)
  - @atlaskit/task-decision@10.0.0

## 10.0.10

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/emoji@42.0.0
  - @atlaskit/task-decision@9.0.0

## 10.0.9

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/emoji@41.0.0
  - @atlaskit/task-decision@8.1.9

## 10.0.8

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/emoji@40.0.0
  - @atlaskit/task-decision@8.1.7

## 10.0.7

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/task-decision@8.1.6
  - @atlaskit/mention@15.0.6
  - @atlaskit/emoji@39.1.1

## 10.0.6

- [patch] Update emoji examples to use valid emoji in test data [62ebfd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62ebfd7)
- [none] Updated dependencies [62ebfd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62ebfd7)
  - @atlaskit/emoji@39.0.2

## 10.0.5

- [patch] Fix es5 exports of some of the newer modules [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
- [none] Updated dependencies [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
  - @atlaskit/util-service-support@3.0.2

## 10.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/task-decision@8.1.4
  - @atlaskit/mention@15.0.5
  - @atlaskit/emoji@39.0.1

## 10.0.3

- [patch] Bumping dep on emoji [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)

* [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/emoji@39.0.0
  - @atlaskit/task-decision@8.1.3

## 10.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/task-decision@8.1.2
  - @atlaskit/mention@15.0.2
  - @atlaskit/emoji@38.0.5
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1

## 10.0.1

- [patch] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/mention@15.0.0

## 10.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/task-decision@8.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/task-decision@8.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0

## 9.1.19

- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/mention@13.1.10
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/mention@13.1.10
- [patch] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/mention@13.1.10

## 9.1.18

- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-service-support@2.0.12
  - @atlaskit/task-decision@7.1.13
  - @atlaskit/mention@13.1.9
  - @atlaskit/emoji@37.0.1

## 9.1.17

- [patch] FS-2011 change EmojiRepository to use CategoryId [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)

- [patch] Updated dependencies [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
  - @atlaskit/emoji@37.0.0
- [none] Updated dependencies [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
  - @atlaskit/emoji@37.0.0

## 9.1.16

- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/mention@13.1.4

## 9.1.15

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/emoji@36.0.1
  - @atlaskit/task-decision@7.1.8
  - @atlaskit/mention@13.1.3

## 9.1.14

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/emoji@36.0.0
  - @atlaskit/task-decision@7.1.7
  - @atlaskit/mention@13.1.2

## 9.1.13

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/emoji@35.1.1
  - @atlaskit/task-decision@7.1.1
  - @atlaskit/mention@13.1.1

## 9.1.12

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/util-service-support@2.0.11
  - @atlaskit/docs@4.1.1

## 9.1.11

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/task-decision@7.1.0
  - @atlaskit/mention@13.1.0
  - @atlaskit/emoji@35.1.0

## 9.1.10

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/emoji@35.0.7
  - @atlaskit/task-decision@7.0.0
  - @atlaskit/mention@13.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8

## 9.1.9

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/emoji@35.0.6
  - @atlaskit/task-decision@6.0.9
  - @atlaskit/mention@12.0.3

## 9.1.8

- [patch] FS-2007 change productivity emoji order [609ec2f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/609ec2f)
- [none] Updated dependencies [609ec2f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/609ec2f)

## 9.1.7

- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/mention@12.0.2

## 9.1.6

- [none] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/mention@12.0.0

## 9.1.5

- [patch] FS-1904 add support for emoji with ascii starting with ( [c83d567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83d567)
- [none] Updated dependencies [c83d567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83d567)
  - @atlaskit/emoji@35.0.2

## 9.1.4

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/task-decision@6.0.6
  - @atlaskit/emoji@35.0.0

## 9.1.3

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/task-decision@6.0.5
  - @atlaskit/mention@11.1.4
  - @atlaskit/emoji@34.2.0

## 9.1.1

- [patch] FS-1693 added integration tests for task-decision [85867ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85867ea)

## 9.1.0

- [minor] If a Mention item is a team then render a TEAM lozenge automatically [d4976d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4976d4)

## 9.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 9.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 8.0.3

- [patch] Patch release util-data-test to bump emoji [49ff12f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49ff12f)

## 8.0.1

- [patch] FS-1697 move elements packages to use util-data-test for test data [deb820a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb820a)

## 8.0.0 (2018-03-27)

- breaking; Change structure of exports in elements packages ([7c0b226](https://bitbucket.org/atlassian/atlaskit/commits/7c0b226))
- breaking; fS-1697 moved testing and example utils to util-data-test ([7c0b226](https://bitbucket.org/atlassian/atlaskit/commits/7c0b226))

## 7.3.0 (2018-02-13)

- feature; migrated json data back to util-data-test ([d03b160](https://bitbucket.org/atlassian/atlaskit/commits/d03b160))

## 7.2.1 (2018-01-17)

- bug fix; missing json files are breaking mk-2 ([0e5e8db](https://bitbucket.org/atlassian/atlaskit/commits/0e5e8db))

## 7.2.0 (2018-01-17)

- feature; move test json files from fabric packages ([a0dd818](https://bitbucket.org/atlassian/atlaskit/commits/a0dd818))

## 7.1.1 (2017-09-08)

- bug fix; fix regex in mock-profile-client to match lower and uppercase error strings (issues closed: dir-376) ([e52930f](https://bitbucket.org/atlassian/atlaskit/commits/e52930f))

## 7.1.0 (2017-08-04)

- feature; update mock-profile-client to be able to return custom error responses ([1a99156](https://bitbucket.org/atlassian/atlaskit/commits/1a99156))

## 5.0.0 (2017-07-25)

- fix; fix build to not fail copying something that no longer exists. ;) ([ebb411b](https://bitbucket.org/atlassian/atlaskit/commits/ebb411b))

## 5.0.0 (2017-07-25)

- feature; remove emoji and mention test data from util-data-test. ([c3604f1](https://bitbucket.org/atlassian/atlaskit/commits/c3604f1))
- breaking; Emoji and mention data can now be imported directly from the component.
- ISSUES CLOSED: FS-1205

## 4.10.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
- fix; don't use dev/peer deps as it breaks components on upgrade that don't supply all pee ([52e5249](https://bitbucket.org/atlassian/atlaskit/commits/52e5249))

## 4.10.1 (2017-07-20)

- fix; emojiDescription 'duck types' in the test data need to specify the searchable property ([c301d9c](https://bitbucket.org/atlassian/atlaskit/commits/c301d9c))

## 4.10.0 (2017-07-14)

- feature; move profilecard stories helpers into util-data-test ([b93209b](https://bitbucket.org/atlassian/atlaskit/commits/b93209b))

## 4.9.1 (2017-07-11)

- fix; bump emoji to the latest version ([2342c9a](https://bitbucket.org/atlassian/atlaskit/commits/2342c9a))

## 4.9.0 (2017-07-07)

- fix; fS-1125 Test package has test too :facepalm: ([78540f2](https://bitbucket.org/atlassian/atlaskit/commits/78540f2))
- feature; fS-1125 Update mention test data ([f6c8978](https://bitbucket.org/atlassian/atlaskit/commits/f6c8978))

## 4.8.0 (2017-07-05)

- feature; updated atlassian emoji test data in util-data-test ([f7bf773](https://bitbucket.org/atlassian/atlaskit/commits/f7bf773))

## 4.7.0 (2017-06-28)

- feature; fS-1090 Update util-data-test to handle isFiltering and new query parameter in filt ([feb1fc4](https://bitbucket.org/atlassian/atlaskit/commits/feb1fc4))
- feature; fS-1090 Bump mention version ([1274606](https://bitbucket.org/atlassian/atlaskit/commits/1274606))

## 4.4.0 (2017-06-20)

- fix; changed build scripts to export mention data ([aab2242](https://bitbucket.org/atlassian/atlaskit/commits/aab2242))

## 4.3.0 (2017-06-19)

- fix; integrated native emoji convert breaking changes to MockEmojiResource ([f039649](https://bitbucket.org/atlassian/atlaskit/commits/f039649))
- feature; add ascii emoji input rule to automatically match and convert ascii representations ([b404019](https://bitbucket.org/atlassian/atlaskit/commits/b404019))
- feature; extracted shared mention testing data to package ([b189402](https://bitbucket.org/atlassian/atlaskit/commits/b189402))

## 4.2.1 (2017-05-18)

- fix; fix dependency on emoji to get latest EmojiRepository ([eb0e0e6](https://bitbucket.org/atlassian/atlaskit/commits/eb0e0e6))

## 4.2.0 (2017-05-08)

- feature; update of shared emoji testing data ([18c9ef5](https://bitbucket.org/atlassian/atlaskit/commits/18c9ef5))

## 4.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 4.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 4.1.0 (2017-04-13)

- feature; feature commit to trigger release ([a849b8b](https://bitbucket.org/atlassian/atlaskit/commits/a849b8b))

## 2.1.3 (2017-04-03)

- fix; add description, force a release. ([10898af](https://bitbucket.org/atlassian/atlaskit/commits/10898af))
- fix; bump package version to prevent linking by reactions due to breaking change. ([1aacc41](https://bitbucket.org/atlassian/atlaskit/commits/1aacc41))
- feature; upgrade to Emoji 13.0.0 compatible data set ([bce544a](https://bitbucket.org/atlassian/atlaskit/commits/bce544a))
- breaking; Dataset is not compatible with earlier versions of the Emoji component
- ISSUES CLOSED: FS-850

## 2.1.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.0 (2017-03-14)

- fix; defer loading of test data unless used ([3630f3b](https://bitbucket.org/atlassian/atlaskit/commits/3630f3b))
- feature; add shared data component for sharing test/story data and mocks for between compone ([058e642](https://bitbucket.org/atlassian/atlaskit/commits/058e642))
- feature; adjust exports. Move test from emoji. ([0b04066](https://bitbucket.org/atlassian/atlaskit/commits/0b04066))
