# @atlaskit/mention

## 19.7.0

### Minor Changes

- [`71bb1bb3cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bb1bb3cd0) - [ED-12933] Export min height mentions to improve rendering performance on editor typeahead

### Patch Changes

- Updated dependencies

## 19.6.4

### Patch Changes

- Updated dependencies

## 19.6.3

### Patch Changes

- [`52e7807e543`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52e7807e543) - Fixed English translations for team counts

## 19.6.2

### Patch Changes

- [`56ffe4d3c5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56ffe4d3c5a) - Add optional MentionNameResolver to SmartMentionResource config

## 19.6.1

### Patch Changes

- [`f5eba1a5c71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5eba1a5c71) - ED-11989 fixed mention displaying old cached name
- Updated dependencies

## 19.6.0

### Minor Changes

- [`f042eac9bf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f042eac9bf1) - Add SmartMentionResource to mentions with editor-core example

### Patch Changes

- Updated dependencies

## 19.5.1

### Patch Changes

- [`3274237a5be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3274237a5be) - [ux] reverted changes in ED-11939

## 19.5.0

### Minor Changes

- [`c49d543a921`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c49d543a921) - Only restrict mentions view if UserAccessLevel is set to NONE

## 19.4.1

### Patch Changes

- [`d5b0036f8c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5b0036f8c5) - Updated LozengeProps type to accept React.ReactNode instead of string. This makes it easier to pass in translations to this component from the consumer.

## 19.4.0

### Minor Changes

- [`3dae9ea0c02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3dae9ea0c02) - MentionItem now accepts and renders Lozenges when provided with a LozengeProps type object - ex. { text: 'GUEST', appearance: 'new' }. Previously, it only accepted a string.

### Patch Changes

- [`967aa365eff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/967aa365eff) - [ux] ED-11939: fix mentions showing the wrong name after unselect
- [`b0ac0fc993d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0ac0fc993d) - Transferring mentions package ownership to Search & Smarts
- Updated dependencies

## 19.3.1

### Patch Changes

- [`178e91b75ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/178e91b75ad) - PL-AFDD-JOB1-158 Add translations for new messages
- Updated dependencies

## 19.3.0

### Minor Changes

- [`cafde5bbe21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cafde5bbe21) - [ux] Added Team prefix to teams in the mention list to increase clarity.
- [`43b2f925f0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43b2f925f0b) - Add optional attributes to mentionProvider analytics callback

### Patch Changes

- Updated dependencies

## 19.2.0

### Minor Changes

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations

## 19.1.2

### Patch Changes

- [`05757c917b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05757c917b) - taking config.productName into mentionResource
- [`dd91541afe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd91541afe) - [ux] Further improvements on the invite from mention experiment

## 19.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 19.1.0

### Minor Changes

- [`22791ceed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22791ceed0) - [ux] - added new properites in MentionResource interface to support invite from mention experiment

  - updated util-data-test/mention to enable invite from mention experiment
  - added invite from mention experiment logic into editor-core

## 19.0.9

### Patch Changes

- [`dcd6b0ecfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcd6b0ecfb) - Fix React warning: should not setState on unmounted component
- Updated dependencies

## 19.0.8

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 19.0.7

### Patch Changes

- Updated dependencies

## 19.0.6

### Patch Changes

- [`c0533f4b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0533f4b35) - Upgrade analytics-next to prevent event loss (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)
- Updated dependencies

## 19.0.5

### Patch Changes

- [`bee2157c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bee2157c1b) - Remove usage of @atlaskit/util-common-test package

## 19.0.4

### Patch Changes

- Updated dependencies

## 19.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 19.0.2

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 19.0.1

### Patch Changes

- Updated dependencies

## 19.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 18.18.3

### Patch Changes

- [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update translation files via Traduki build

## 18.18.2

### Patch Changes

- [`64e7f3f077`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64e7f3f077) - Bump dependency query-string to ^5.1.0

## 18.18.1

### Patch Changes

- Updated dependencies

## 18.18.0

### Minor Changes

- [minor][53ebcdb974](https://bitbucket.org/atlassian/atlassian-frontend/commits/53ebcdb974):

  Adding analytics metrics for PTC SLIs

### Patch Changes

- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/docs@8.5.0

## 18.17.0

### Minor Changes

- [minor][0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):

  Adding analytics for mention providers

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/lozenge@9.1.6
  - @atlaskit/tooltip@15.2.5

## 18.16.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1

## 18.16.1

### Patch Changes

- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 18.16.0

### Minor Changes

- [minor][49fbe3d3bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49fbe3d3bf):

  MentionProvider can be consumed directly from `@atlaskit/mention/types` entry point

### Patch Changes

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0

## 18.15.8

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided.

  ### Breaking

  ** getTokens props changes **
  When defining the value function passed into a ThemeProvider, the getTokens parameter cannot be called without props; if no props are provided an empty object `{}` must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes **
  Color palettes have been moved into their own file.
  Users will need to update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 18.15.7

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/util-service-support@5.0.0

## 18.15.6

### Patch Changes

- [patch][d04ac087fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d04ac087fc):

  Handle query parameters for operations in mentions

## 18.15.5

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0
  - @atlaskit/util-service-support@4.1.0
  - @atlaskit/editor-test-helpers@10.1.2

## 18.15.4

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 18.15.3

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 18.15.2

- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-test-helpers@10.0.0

## 18.15.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 18.15.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 18.14.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 18.14.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 18.14.2

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

## 18.14.1

### Patch Changes

- [patch][84b795279d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84b795279d):

  TEAMS-626 : Adding translations for team mention spotlight

## 18.14.0

### Minor Changes

- [minor][a22fc8004f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a22fc8004f):

  TEAMS-618 : Exporting Team mention spotlight with correct name

## 18.13.0

### Minor Changes

- [minor][9b83fdea35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b83fdea35):

  TEAMS-618 : Rename Team mention spotlight to Team Mention Highlight

## 18.12.0

### Minor Changes

- [minor][fe1a882fbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe1a882fbb):

  TEAMS-602 : Can pass the team creation link from confluence as an optional parameter to the Team Mention Spotlight

## 18.11.4

### Patch Changes

- [patch][2f62d55150](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f62d55150):

  The mention spotlight can take a context path, and fixing a bug with on-click for the create team link

## 18.11.3

### Patch Changes

- [patch][c72cca2853](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c72cca2853):

  Added analytics when user clicks the create team link

## 18.11.2

### Patch Changes

- [patch][b4d2284e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4d2284e01):

  Added analytics on spotlight viewed.

## 18.11.1

### Patch Changes

- [patch][23f9c8ff08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23f9c8ff08):

  Added analytics on closing team mention spotlight

## 18.11.0

### Minor Changes

- [minor][cda47d4480](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cda47d4480):

  TEAMS-623 : Before this fix, when Spotlight was being rendered for the 5th time, it briefly appeared and then disappeared. This change fixes that.

## 18.10.0

### Minor Changes

- [minor][e81d32fe9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e81d32fe9a):

  TEAMS-588 : Refactors the Team Spotlight ( which is used in mention typeahead for Fabric Editor and TinyMCE editor). Now can close the spotlight from Fabric Editor by clicking on the x button.

## 18.9.0

### Minor Changes

- [minor][06cfea0870](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06cfea0870):

  TEAMS-549 : Adding capability to show a spotlight in Fabric Editor

## 18.8.0

### Minor Changes

- [minor][2d8dd7bc30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d8dd7bc30):

  Now able to take a prop that will show a feature highlight

## 18.7.3

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 18.7.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 18.7.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 18.7.0

### Minor Changes

- [minor][64b87b4ecb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64b87b4ecb):

  TEAMS-544 : Releasing the initial version of the Mention Spotlight

## 18.6.3

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 18.6.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/icon@19.0.0

## 18.6.1

### Patch Changes

- [patch][227431f9cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/227431f9cb):

  FS-4028 - Update translations for mention component

## 18.6.0

### Minor Changes

- [minor][58dd589a04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58dd589a04):

  Update TeamMentionResource to accept teamLinkResolver option which is used to construct a team link.
  Fix missing userId of user mentions in analytics in editor-core

## 18.5.0

### Minor Changes

- [minor][2d1c3db523](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d1c3db523):

  FS-3986 - Support analytics for mention hydration.

## 18.4.2

### Patch Changes

- [patch][b23479c7ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b23479c7ba):

  fix i18n-tools validation error on try/catch

## 18.4.1

### Patch Changes

- [patch][434b2688af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/434b2688af):

  Update translation

## 18.4.0

### Minor Changes

- [minor][11cb8d8626](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11cb8d8626):

  - Remove @atlaskit/analytics dependency.

## 18.3.3

### Patch Changes

- [patch][ac95568398](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac95568398):

  - Some messages are never pushed to Transifex so we need to run `yarn i18n:push && yarn i18n:pull` again

## 18.3.2

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 18.3.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/icon@18.0.0

## 18.3.0

### Minor Changes

- [minor][0b55c3b421](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b55c3b421):

  FS-3244 - Add support for resolving mention names client-side

## 18.2.1

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 18.2.0

- [minor][a0d5982270](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0d5982270):

  - Don't display nickname in mention list if it is the same as name.

## 18.1.0

- [minor][5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):

  - Fix typeahead re-rendering when moving mouse

  Breaking change -> TypeAheadItem:

  ```ts
  export type TypeAheadItemRenderProps = {
    onClick: () => void;

    // BREAKING CHANGE
    // onMouseMove -> onHover
    onHover: () => void;

    isSelected: boolean;
  };

  export type TypeAheadItem = {
    /*...*/
    render?: (
      props: TypeAheadItemRenderProps,
    ) => React.ReactElement<TypeAheadItemRenderProps> | null;
    /*...*/
  };
  ```

  Items returned from `QuickInsertProvider#getItems` method that have custom `render` function will now get `onHover` instead of `onMouseMove`.

## 18.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 17.6.9

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 17.6.8

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 17.6.7

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 17.6.6

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 17.6.5

- [patch][ddb3238b1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ddb3238b1c):

  - TEAMS-396 : Changing byline logic for mention

## 17.6.4

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 17.6.3

- [patch][14b89652d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14b89652d7):

  - TEAMS-364 : Renaming the missed test files in the previous PR

## 17.6.2

- [patch][c8b669eaec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8b669eaec):

  - TEAMS-364 : Renaming Team mention description highlight classes to Byline

## 17.6.1

- [patch][d26570e3b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d26570e3b5):

  - Update i18n for team mention
  - Fix a bug in team mention: missing https protocol in team link

## 17.6.0

- [minor][b31086fcf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b31086fcf6):

  - Add additional entry points for selective imports of mention components

## 17.5.0

- [minor][b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):

  - reset jest modules before hydration

## 17.4.0

- [minor][1affe17dc4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1affe17dc4):

  - add analytics events for team mention

## 17.3.0

- [minor][073320a681](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/073320a681):

  - Improve TeamMentionResource, both team and user requests are not blocked together

## 17.2.0

- [patch][5ca3696b14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ca3696b14):

  - TEAMS-319 : Render member counts and whether team includes you in byline

- [minor][b8b55dc6ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8b55dc6ae):

  - TEAMS-319 : Render member counts and whether team includes you in byline

## 17.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 17.1.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 17.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 16.4.0

- [minor][fb679d390f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb679d390f):

  - Add a new TeamMenioResource for @atlaskit/mention package. That allows to fetch teams data for mention from a team service (Legion service)

## 16.3.0

- [minor][7261577953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7261577953):

  - use @atlaskit/ssr to ssr/hydrate mention examples

## 16.2.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/analytics@5.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 16.2.1

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-test-helpers@7.0.0

## 16.2.0

- [minor][ef368572dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef368572dc):

  - Update types for @atlaskit/mention

## 16.1.0

- [minor][0f3f9f0992](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f3f9f0992):

  - Fix context identifiers not being passed to mention provider's calls. MentionProvider interface was updated to include the optional contextIdentifier parameter in filter and recordMentionSelection methods.

## 16.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 16.0.0

- [major][0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):

  - Removed client-side indexed cache of mention results. Also removed method 'getUsersInContext' from MentionResourceConfig, 'remoteSearch' from MentionStats and 'weight' from MentionDescription. If you used to use them, simply remove any references to them.

## 15.3.0

- [minor][c238c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c238c00):

  - added i18n support to mentions

- [minor][3b1de17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b1de17):

  - added i18n translated files

## 15.2.2

- [patch][0f19693](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f19693):

  - added tests for xregexp transformer, updated README and simplified code

- [patch][b789b3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b789b3a):

  - removed xregexp library dependency from emoji and mention components, added xregexp-transformer package to compile xregexp expressions to unicode charsets

## 15.2.1

- [patch][cae5adb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cae5adb):

  - UR-197: Add queryLength to mentionTypeahead rendered event

## 15.2.0

- [minor][f62557c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f62557c):

  - ED-5888 Add dark mode for mention

## 15.1.9

- [patch][b81da9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81da9b):

  - Fix typescript types to support strictFunctionTypes

## 15.1.8

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics@4.0.7
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/icon@15.0.2
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/docs@6.0.0

## 15.1.7

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/lozenge@6.2.3

## 15.1.6

- [patch][90c4702](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90c4702):

  - FS-1734 Removed the try it out section from Emoji and Mentions documentation pages to match other pages. The section only contained a link to the same page, so was essentially redundant and potentially confusing.

## 15.1.5

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 15.1.4

- [patch][01edbde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01edbde):

  - Force patch release

## 15.1.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 15.1.2

- [patch][36c362f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c362f):

  - FS-3174 - Fix usage of gridSize() and borderRadius()

## 15.1.1

- [patch][527b954](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/527b954):

  - FS-3174 - Remove usage of util-shared-styles from elements components

## 15.1.0

- [minor] Use relative units for font size and paddings in Mention component [b711063](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b711063)

## 15.0.11

- [patch] Analytics event's 'source' field from GasPayload type is now optional. In most cases, the 'source' field is expected to be set by the integrator through AnalyticsContext. Thus it's recommended that components do not set it to avoid overriding the one provided by the integrating product. Analytics listeners are handling the case where the 'source' field couldn't be found by setting the default value "unknown" before sending the event through the client. [1c0ea95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c0ea95)

## 15.0.10

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 15.0.9

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)

## 15.0.8

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 15.0.7

- [patch] propagate sessionId to the mentionTypeahead rendered event and service endpoints [0c37666](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c37666)

## 15.0.6

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7

## 15.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/analytics-next-types@3.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/analytics@4.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 15.0.4

- [patch] FS-2049 add userIds attribute to rendered event [a5d05bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5d05bc)
- [none] Updated dependencies [a5d05bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5d05bc)

## 15.0.3

- [patch] fixed TS errors [8eced90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eced90)
- [patch] fixed broken tests and added test for util/analytics [57b9d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57b9d1e)
- [patch] code improvements and tests added [0bc5732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bc5732)
- [patch] added mentionTypeAhead rendered analytics [c536e60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c536e60)
- [none] Updated dependencies [8eced90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eced90)
- [none] Updated dependencies [57b9d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57b9d1e)
- [none] Updated dependencies [0bc5732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bc5732)
- [none] Updated dependencies [c536e60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c536e60)

## 15.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1
  - @atlaskit/analytics-gas-types@3.1.2
  - @atlaskit/analytics@4.0.3
  - @atlaskit/avatar@14.0.5

## 15.0.1

- [patch] FS-2020 add session id to typeahead plugin inside editor [5ae463f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae463f)
- [none] Updated dependencies [5ae463f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae463f)
  - @atlaskit/analytics-gas-types@3.1.1

## 15.0.0

- [major] ED-4769: wrap mentions like inline text [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
- [none] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/util-data-test@10.0.1

## 14.0.2

- [patch] Fallback to use containerId from MentionResourceConfig if ContextIdentifier promise fails [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
- [patch] add support for childObjectId in ContextIdentifiers and pass it to the mention service endpoints [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
- [none] Updated dependencies [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
- [none] Updated dependencies [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)

## 14.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/avatar@14.0.1

## 14.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 13.1.10

- [patch] fixed typescript build errors [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
- [patch] code improvements and MentionContextIdentifier attributes made mandatory to sync with editor-common ContextIdentifier [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
- [patch] include containerId and objectId passed from editor-core into mention service requests [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/util-data-test@9.1.19
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/util-data-test@9.1.19
- [patch] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/util-data-test@9.1.19

## 13.1.9

- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-service-support@2.0.12
  - @atlaskit/util-data-test@9.1.18
  - @atlaskit/analytics-gas-types@2.1.4

## 13.1.8

- [patch] FS-2093 add mention insert analytics event [30bbe5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bbe5a)
- [none] Updated dependencies [30bbe5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bbe5a)

## 13.1.7

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0

## 13.1.6

- [patch] FS-2092 add mention typeahead cancel analytics event [40bd3fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bd3fb)
- [none] Updated dependencies [40bd3fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bd3fb)

## 13.1.5

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0

## 13.1.4

- [patch] added mention userId in the Mention lozenge analytics [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/util-data-test@9.1.16

## 13.1.3

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/util-data-test@9.1.15

## 13.1.2

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14

## 13.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/icon@12.1.2

## 13.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/util-data-test@9.1.11

## 13.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8
  - @atlaskit/analytics-gas-types@2.1.1
  - @atlaskit/analytics@3.0.2
  - @atlaskit/avatar@11.0.0

## 12.0.3

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/util-data-test@9.1.9

## 12.0.2

- [patch] Moved event tag to FabricElementsListener [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/util-data-test@9.1.7

## 12.0.1

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 12.0.0

- [patch] code improvements [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
- [major] fixed/added tests for analytics-next and code improvements [db1bafa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db1bafa)
- [patch] upgrade to analytics-next and GAS V3 [f150242](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f150242)
- [patch] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/util-data-test@9.1.6
- [major] Updated dependencies [db1bafa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db1bafa)
  - @atlaskit/util-data-test@9.1.6
- [patch] Updated dependencies [f150242](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f150242)
  - @atlaskit/util-data-test@9.1.6

## 11.1.5

- [patch] revert ED-2551 wrong cursor on special mentions [1cf64a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cf64a6)
- [none] Updated dependencies [1cf64a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cf64a6)

## 11.1.4

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
  - @atlaskit/util-data-test@9.1.3
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7
  - @atlaskit/lozenge@4.0.1
  - @atlaskit/analytics@3.0.1
- [patch] Updated dependencies [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
  - @atlaskit/util-data-test@9.1.3

## 11.1.3

- [patch] ED-2551 use default cursor on mention if no onClick is provided [e9cc83c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9cc83c)
- [patch] Updated dependencies [e9cc83c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9cc83c)

## 11.1.2

- [patch] Align font sizes for inline code, mentions and dates [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)
- [none] Updated dependencies [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)

## 11.1.0

- [minor] If a Mention item is a team then render a TEAM lozenge automatically [d4976d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4976d4)

## 11.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 10.0.0

- [major] FS-1697 move elements packages to use util-data-test for test data [deb820a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb820a)

## 9.2.3

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 9.2.2

- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 9.2.1

- [patch] Fix for styled-components types to support v1.4.x [75a2375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75a2375)

## 9.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 9.1.5

- [patch] fix mention and emoji bug related to MutationObserver API [dd0a69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd0a69c)

## 9.1.4

- [patch] Disable browser's spell check in mention lozenge [c04bf36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c04bf36)

## 9.1.3

- [patch] FS-1091 remove direct dependency on url-search-params [e680d67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e680d67)

## 9.1.2

- [patch] FS-1699 Fix mention sorting [ff33bef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff33bef)

## 9.1.1

- [patch] fixed mention picker style typos [8bb40f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bb40f0)

## 9.1.0

- [minor] FS-1633 Change the way we use getUsersInContext [86b615c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86b615c)

## 9.0.0

- [patch] Added eslint-disable to example file [49491a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49491a9)
- [major] Migrated mentions to new atlaskit-mk2 [dad3ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dad3ccc)

## 8.5.1 (2018-01-09)

- bug fix; removed chai and sinon from tests (issues closed: fs-1606) ([f3a65cd](https://bitbucket.org/atlassian/atlaskit/commits/f3a65cd))

## 8.5.0 (2018-01-08)

- feature; allow MentionResource to optionally exclude the credentials from the request (issues closed: fs-1602) ([cbf913c](https://bitbucket.org/atlassian/atlaskit/commits/cbf913c))

## 8.4.1 (2017-12-20)

- bug fix; added minimum avatar dependency that has dist/esm folder for mention ([c90fbfa](https://bitbucket.org/atlassian/atlaskit/commits/c90fbfa))

## 8.4.0 (2017-12-19)

- feature; fS-1063 Code review remark ([93ff21e](https://bitbucket.org/atlassian/atlaskit/commits/93ff21e))
- bug fix; make sure root does not change whatever import we use ([085d483](https://bitbucket.org/atlassian/atlaskit/commits/085d483))
- feature; fS-1063 Fix code review remarks ([a247fa6](https://bitbucket.org/atlassian/atlaskit/commits/a247fa6))
- feature; fS-1063 When searching for mentionable users in a public room, I want users current ([b5310c7](https://bitbucket.org/atlassian/atlaskit/commits/b5310c7))

## 8.3.4 (2017-12-19)

- bug fix; bump packages to fixed version of analytics ([615e41c](https://bitbucket.org/atlassian/atlaskit/commits/615e41c))
- bug fix; explicit analytics bump in mentions ([688ed80](https://bitbucket.org/atlassian/atlaskit/commits/688ed80))

## 8.3.3 (2017-12-19)

- bug fix; reduce mention bundle size by referencing avatar directly from dist/esm folder ([2a88ef0](https://bitbucket.org/atlassian/atlaskit/commits/2a88ef0))

## 8.3.2 (2017-12-18)

- bug fix; fS-1587 fix TS errors in mention (issues closed: fs-1587) ([8dd4b86](https://bitbucket.org/atlassian/atlaskit/commits/8dd4b86))

## 8.3.1 (2017-12-15)

- bug fix; analytics now correctly a dep of the mention component ([da6cd5d](https://bitbucket.org/atlassian/atlaskit/commits/da6cd5d))
- bug fix; mention component no longer uses relative imports in one of the stories ([1109ecc](https://bitbucket.org/atlassian/atlaskit/commits/1109ecc))

## 8.3.0 (2017-12-13)

- bug fix; minor code improvements and fixed build error ([56bc6bb](https://bitbucket.org/atlassian/atlaskit/commits/56bc6bb))
- feature; added some mention front-end analytics ([74b7ee6](https://bitbucket.org/atlassian/atlaskit/commits/74b7ee6))

## 8.2.1 (2017-12-08)

- bug fix; update mock data under dist folder ([615dfd3](https://bitbucket.org/atlassian/atlaskit/commits/615dfd3))

## 8.2.0 (2017-11-26)

- feature; add more mock data to support integration tests ([9520323](https://bitbucket.org/atlassian/atlaskit/commits/9520323))

## 8.1.1 (2017-11-20)

- bug fix; presence client now actually requests stateMetadata to get focus mode (issues closed: fs-1487) ([7984774](https://bitbucket.org/atlassian/atlaskit/commits/7984774))

## 8.1.0 (2017-11-19)

- feature; add support for showing focus state on mention picker's avatars (issues closed: fs-1487) ([fe5b287](https://bitbucket.org/atlassian/atlaskit/commits/fe5b287))
- feature; updated icon and tooltip dependencies ([a10f196](https://bitbucket.org/atlassian/atlaskit/commits/a10f196))

## 8.0.1 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 8.0.0 (2017-10-20)

- bug fix; fixed unit test failure. ([7878911](https://bitbucket.org/atlassian/atlaskit/commits/7878911))
- bug fix; added missing \_notifyAllResultsListeners ([28cbfb2](https://bitbucket.org/atlassian/atlaskit/commits/28cbfb2))
- feature; expose MentionsResult interface from mention ([a817c63](https://bitbucket.org/atlassian/atlaskit/commits/a817c63))
- bug fix; added missing method \_notifyAllResultsListeners to mention mock service and fixed re ([f057300](https://bitbucket.org/atlassian/atlaskit/commits/f057300))
- feature; added a dummy data wit the same last name. ([2ed7d4d](https://bitbucket.org/atlassian/atlaskit/commits/2ed7d4d))
- feature; fS-1372 Show an APP flag for App users like Bot ([0ff41fc](https://bitbucket.org/atlassian/atlaskit/commits/0ff41fc))
- bug fix; Revert code splitting of mentions/task-decisions as it introduces a performance problem (issues closed: fs-1396 / hnw-3183) ([bbecb14](https://bitbucket.org/atlassian/atlaskit/commits/bbecb14))
- bug fix; code splitted avatar in mention and task-decision packages (issues closed: ed-2776) ([19f8276](https://bitbucket.org/atlassian/atlaskit/commits/19f8276))
- bug fix; update background of "no access" mention lozenge to be transparent (issues closed: fs-1160) ([abd124d](https://bitbucket.org/atlassian/atlaskit/commits/abd124d))
- bug fix; update background colour of default mention lozenge (issues closed: fs-1319) ([391d263](https://bitbucket.org/atlassian/atlaskit/commits/391d263))
- bug fix; make mention lozenge 20px high to match rendering line height (issues closed: fs-1160) ([9d02973](https://bitbucket.org/atlassian/atlaskit/commits/9d02973))
- feature; update util-\* dependencies ([eba115f](https://bitbucket.org/atlassian/atlaskit/commits/eba115f))
- feature; update mention dependencies: avatar, icon, lozenge, tooltip (issues closed: fs-1309) ([8686314](https://bitbucket.org/atlassian/atlaskit/commits/8686314))
- bug fix; based on PR comment, update the variable name ([4517be5](https://bitbucket.org/atlassian/atlaskit/commits/4517be5))
- bug fix; the name of the variable was not correct - cf AK-1433 (issues closed: ak-1433) ([85fe651](https://bitbucket.org/atlassian/atlaskit/commits/85fe651))
- bug fix; publish only javascript files in dist/ ([367736a](https://bitbucket.org/atlassian/atlaskit/commits/367736a))
- bug fix; fix .npm-ingore for fabric ts packages. ([f6f2edd](https://bitbucket.org/atlassian/atlaskit/commits/f6f2edd))
- bug fix; quick fix to avoid issues accessing support data via npm dependency ([4f9eee7](https://bitbucket.org/atlassian/atlaskit/commits/4f9eee7))
- bug fix; fix unused expression error throwing test ([22b75b2](https://bitbucket.org/atlassian/atlaskit/commits/22b75b2))
- feature; export test/story data for direct import. Not in bundle. (issues closed: fs-1205) ([eaa98fb](https://bitbucket.org/atlassian/atlaskit/commits/eaa98fb))
- bug fix; Merged in fix/FS-1051-copying-renderer-mention (pull request #3532) (issues closed: fs-1051) ([352f8eb](https://bitbucket.org/atlassian/atlaskit/commits/352f8eb))
- bug fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
- bug fix; no user selection in mention list should result in the top item always being selecte (issues closed: fs-1178) ([07fc665](https://bitbucket.org/atlassian/atlaskit/commits/07fc665))
- feature; fS-1125 Adding test ([af91b18](https://bitbucket.org/atlassian/atlaskit/commits/af91b18))
- feature; fS-1125 Add callback parameter when subscribing to receive all results no just the ([cf7636a](https://bitbucket.org/atlassian/atlaskit/commits/cf7636a))
- bug fix; fS-1121 Don't return special mention when typing letter 'm' ([6c2ddd3](https://bitbucket.org/atlassian/atlaskit/commits/6c2ddd3))
- feature; restyle the Mentions error pop-up with a funkier exclamation sign and better wording (issues closed: fs-1115) ([8820193](https://bitbucket.org/atlassian/atlaskit/commits/8820193))
- bug fix; fS-1090 Fix test ([4262bee](https://bitbucket.org/atlassian/atlaskit/commits/4262bee))
- feature; fS-1090 Expose searchIndex so we can reuse it in test data + fix formatting ([aab39e6](https://bitbucket.org/atlassian/atlaskit/commits/aab39e6))
- breaking; New method isFiltering(query: string) on MentionProvider interface ([6881c4b](https://bitbucket.org/atlassian/atlaskit/commits/6881c4b))
- breaking; fS-1090 Expose isFiltering on MentionProvider interface && add query parameter in t ([6881c4b](https://bitbucket.org/atlassian/atlaskit/commits/6881c4b))
- bug fix; update avatar dependency ([64f6640](https://bitbucket.org/atlassian/atlaskit/commits/64f6640))
- breaking; The onOpen handlers will now be called when searches error. Previously they would only be called ([1380702](https://bitbucket.org/atlassian/atlaskit/commits/1380702))
- breaking; fix the Promise handling when a search is performed locally and remotely. (issues closed: fa-910) ([1380702](https://bitbucket.org/atlassian/atlaskit/commits/1380702))
- bug fix; fix for long standing react warning. :yakshave: ([cf88128](https://bitbucket.org/atlassian/atlaskit/commits/cf88128))
- bug fix; uncaught rejected provider promises, ui not updating. (issues closed: ed-1886) ([237cd54](https://bitbucket.org/atlassian/atlaskit/commits/237cd54))
- bug fix; fS-1073 Code review remarks + fix tests ([7611a77](https://bitbucket.org/atlassian/atlaskit/commits/7611a77))
- bug fix; fS-1073 Code review remarks ([003dc28](https://bitbucket.org/atlassian/atlaskit/commits/003dc28))
- bug fix; fS-1073 Reset search index on bootstrap ([5582b3c](https://bitbucket.org/atlassian/atlaskit/commits/5582b3c))
- bug fix; fS-1073 Filter mention locally from previous search results ([0c4788a](https://bitbucket.org/atlassian/atlaskit/commits/0c4788a))
- feature; enable the display of more specific error messages in the MentionList (issues closed: fs-910) ([db5efae](https://bitbucket.org/atlassian/atlaskit/commits/db5efae))
- bug fix; fix correct usage of react lifecycle and controlled input component. ([3ccd3ec](https://bitbucket.org/atlassian/atlaskit/commits/3ccd3ec))
- bug fix; add AbstractMentionResource export to editor-core (issues closed: fs-1029) ([308ad31](https://bitbucket.org/atlassian/atlaskit/commits/308ad31))
- bug fix; style fix to render tooltip properly in Firefox ([32d223d](https://bitbucket.org/atlassian/atlaskit/commits/32d223d))
- bug fix; render tooltip on same line as Mention component ([4b18886](https://bitbucket.org/atlassian/atlaskit/commits/4b18886))
- bug fix; fixed positioning for tooltip rendered for non-permitted mention ([83851e6](https://bitbucket.org/atlassian/atlaskit/commits/83851e6))
- feature; mentionItem without nickname rendered only using name ([b2fa672](https://bitbucket.org/atlassian/atlaskit/commits/b2fa672))
- bug fix; fS-691 Change whoops style to white and use akicon ([6f023d0](https://bitbucket.org/atlassian/atlaskit/commits/6f023d0))
- feature; fS-1026 When displaying the mention typeahead, I want to see users who don't have a ([a31d317](https://bitbucket.org/atlassian/atlaskit/commits/a31d317))
- bug fix; remove 'graphql' url component from presence's config (issues closed: fs-1030) ([b975e98](https://bitbucket.org/atlassian/atlaskit/commits/b975e98))
- bug fix; restore classname for confluence selenium tests ([e59c2f7](https://bitbucket.org/atlassian/atlaskit/commits/e59c2f7))
- bug fix; add polyfills for all storybooks, use es6-promise, URLSearchParams, Fetch API and Elemen ([db2f5cf](https://bitbucket.org/atlassian/atlaskit/commits/db2f5cf))
- bug fix; move all polyfills into devDeps ([d275563](https://bitbucket.org/atlassian/atlaskit/commits/d275563))
- bug fix; fix remaining mention tests ([d34d43b](https://bitbucket.org/atlassian/atlaskit/commits/d34d43b))
- breaking; ED-1701, ED-1702, ED-1704 ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
- breaking; remove polyfills from mention and emoji packages, use styled-components instead of t (issues closed: ed-1701, ed-1702, ed-1704) ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
- bug fix; fixed storybooks and bumped lozenge and avatar dependencies in mentions (issues closed: fs-902) ([71ddb2a](https://bitbucket.org/atlassian/atlaskit/commits/71ddb2a))
- bug fix; update legal copy to be more clear. Not all modules include ADG license. (issues closed: ak-2035) ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))
- bug fix; update legal copy and fix broken links for component README on npm. New contribution and (issues closed: ak-2035) ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- feature; add a class to mention node ([5996b7a](https://bitbucket.org/atlassian/atlaskit/commits/5996b7a))
- bug fix; properly handle the case where mention provider is null or undefined ([cf5dc91](https://bitbucket.org/atlassian/atlaskit/commits/cf5dc91))
- feature; displays nickname rather than username in MentionItem if exists for user (issues closed: fs-824) ([d3f4a81](https://bitbucket.org/atlassian/atlaskit/commits/d3f4a81))
- bug fix; updated avatar version from ^1.0.0 to ^2.0.0 in mention (issues closed: fab-2658) ([4ef6a16](https://bitbucket.org/atlassian/atlaskit/commits/4ef6a16))
- bug fix; resourcedMention component doesn't update provider correctly (issues closed: ed-1173) ([fa0c8fc](https://bitbucket.org/atlassian/atlaskit/commits/fa0c8fc))
- bug fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))
- bug fix; upgrade TypeScript to 2.2.1 (issues closed: ed-1104) ([2aa28fc](https://bitbucket.org/atlassian/atlaskit/commits/2aa28fc))
- bug fix; merge branch 'master' into ED-738-ak-editor-shared-styles ([b514e44](https://bitbucket.org/atlassian/atlaskit/commits/b514e44))
- breaking; ([c99a94e](https://bitbucket.org/atlassian/atlaskit/commits/c99a94e))
- breaking; rendering performance optimisations. (issues closed: fs-285) ([c99a94e](https://bitbucket.org/atlassian/atlaskit/commits/c99a94e))
- bug fix; fix some failing unit tests. ([4a4e32c](https://bitbucket.org/atlassian/atlaskit/commits/4a4e32c))
- breaking; ([8e48507](https://bitbucket.org/atlassian/atlaskit/commits/8e48507))
- breaking; fS-214: Allow mentions to work with the session service; both using a header and a (issues closed: fs-214) ([8e48507](https://bitbucket.org/atlassian/atlaskit/commits/8e48507))
- feature; adding a resourced mention-component that takes a mentionProvider-promise ([aff9907](https://bitbucket.org/atlassian/atlaskit/commits/aff9907))
- breaking; ([08a1291](https://bitbucket.org/atlassian/atlaskit/commits/08a1291))
- breaking; adding method highlightning mentions ([08a1291](https://bitbucket.org/atlassian/atlaskit/commits/08a1291))
- bug fix; merged master into ED-738 ([8afd112](https://bitbucket.org/atlassian/atlaskit/commits/8afd112))
- bug fix; select colour changed from dark to light ([1dc44ec](https://bitbucket.org/atlassian/atlaskit/commits/1dc44ec))
- bug fix; Query should be optional ([4e05ce1](https://bitbucket.org/atlassian/atlaskit/commits/4e05ce1))
- bug fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
- bug fix; Updates package to have correct dev-dependency for util-common-test ([403d232](https://bitbucket.org/atlassian/atlaskit/commits/403d232))
- bug fix; Updates docs to mention using yarn to install ([5af03bf](https://bitbucket.org/atlassian/atlaskit/commits/5af03bf))
- bug fix; Rearrange tsconfig.json organisation to allow per-package configuration. ([6c6992d](https://bitbucket.org/atlassian/atlaskit/commits/6c6992d))
- bug fix; Updates package to use scoped ak packages ([db5c2f6](https://bitbucket.org/atlassian/atlaskit/commits/db5c2f6))

## 7.6.0 (2017-10-16)

- bug fix; fixed unit test failure. ([7878911](https://bitbucket.org/atlassian/atlaskit/commits/7878911))
- bug fix; added missing \_notifyAllResultsListeners ([28cbfb2](https://bitbucket.org/atlassian/atlaskit/commits/28cbfb2))
- feature; expose MentionsResult interface from mention ([a817c63](https://bitbucket.org/atlassian/atlaskit/commits/a817c63))
- bug fix; added missing method \_notifyAllResultsListeners to mention mock service and fixed re ([f057300](https://bitbucket.org/atlassian/atlaskit/commits/f057300))
- feature; added a dummy data wit the same last name. ([2ed7d4d](https://bitbucket.org/atlassian/atlaskit/commits/2ed7d4d))

## 7.5.0 (2017-09-26)

- feature; fS-1372 Show an APP flag for App users like Bot ([0ff41fc](https://bitbucket.org/atlassian/atlaskit/commits/0ff41fc))

## 7.4.3 (2017-09-21)

- bug fix; Revert code splitting of mentions/task-decisions as it introduces a performance problem (issues closed: fs-1396 / hnw-3183) ([bbecb14](https://bitbucket.org/atlassian/atlaskit/commits/bbecb14))

## 7.4.2 (2017-09-19)

- bug fix; code splitted avatar in mention and task-decision packages (issues closed: ed-2776) ([19f8276](https://bitbucket.org/atlassian/atlaskit/commits/19f8276))

## 7.4.1 (2017-09-13)

- bug fix; update background of "no access" mention lozenge to be transparent (issues closed: fs-1160) ([abd124d](https://bitbucket.org/atlassian/atlaskit/commits/abd124d))
- bug fix; update background colour of default mention lozenge (issues closed: fs-1319) ([391d263](https://bitbucket.org/atlassian/atlaskit/commits/391d263))
- bug fix; make mention lozenge 20px high to match rendering line height (issues closed: fs-1160) ([9d02973](https://bitbucket.org/atlassian/atlaskit/commits/9d02973))

## 7.4.0 (2017-08-28)

- feature; update util-\* dependencies ([eba115f](https://bitbucket.org/atlassian/atlaskit/commits/eba115f))
- feature; update mention dependencies: avatar, icon, lozenge, tooltip (issues closed: fs-1309) ([8686314](https://bitbucket.org/atlassian/atlaskit/commits/8686314))

## 7.3.5 (2017-08-21)

- bug fix; based on PR comment, update the variable name ([4517be5](https://bitbucket.org/atlassian/atlaskit/commits/4517be5))
- bug fix; the name of the variable was not correct - cf AK-1433 (issues closed: ak-1433) ([85fe651](https://bitbucket.org/atlassian/atlaskit/commits/85fe651))

## 7.3.4 (2017-08-14)

- bug fix; publish only javascript files in dist/ ([367736a](https://bitbucket.org/atlassian/atlaskit/commits/367736a))

## 7.3.3 (2017-08-10)

- bug fix; fix .npm-ingore for fabric ts packages. ([f6f2edd](https://bitbucket.org/atlassian/atlaskit/commits/f6f2edd))

## 7.3.2 (2017-08-10)

- bug fix; quick fix to avoid issues accessing support data via npm dependency ([4f9eee7](https://bitbucket.org/atlassian/atlaskit/commits/4f9eee7))

## 7.3.1 (2017-07-27)

- fix; fix unused expression error throwing test ([22b75b2](https://bitbucket.org/atlassian/atlaskit/commits/22b75b2))

## 7.3.0 (2017-07-25)

- feature; export test/story data for direct import. Not in bundle. ([eaa98fb](https://bitbucket.org/atlassian/atlaskit/commits/eaa98fb))

## 7.2.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 7.2.1 (2017-07-20)

- fix; no user selection in mention list should result in the top item always being selecte ([07fc665](https://bitbucket.org/atlassian/atlaskit/commits/07fc665))

## 7.2.0 (2017-07-07)

- feature; fS-1125 Add callback parameter when subscribing to receive all results no just the ([cf7636a](https://bitbucket.org/atlassian/atlaskit/commits/cf7636a))
- feature; fS-1125 Adding test ([af91b18](https://bitbucket.org/atlassian/atlaskit/commits/af91b18))

## 7.1.1 (2017-07-06)

- fix; fS-1121 Don't return special mention when typing letter 'm' ([6c2ddd3](https://bitbucket.org/atlassian/atlaskit/commits/6c2ddd3))

## 7.1.0 (2017-07-04)

- feature; restyle the Mentions error pop-up with a funkier exclamation sign and better wording ([8820193](https://bitbucket.org/atlassian/atlaskit/commits/8820193))

## 7.0.0 (2017-06-28)

- fix; fS-1090 Fix test ([4262bee](https://bitbucket.org/atlassian/atlaskit/commits/4262bee))
- feature; fS-1090 Expose searchIndex so we can reuse it in test data + fix formatting ([aab39e6](https://bitbucket.org/atlassian/atlaskit/commits/aab39e6))

## 6.0.1 (2017-06-28)

- fix; update avatar dependency ([64f6640](https://bitbucket.org/atlassian/atlaskit/commits/64f6640))
- feature; fS-1090 Expose isFiltering on MentionProvider interface && add query parameter in t ([6881c4b](https://bitbucket.org/atlassian/atlaskit/commits/6881c4b))
- breaking; New method isFiltering(query: string) on MentionProvider interface

## 6.0.0 (2017-06-27)

- fix; fix the Promise handling when a search is performed locally and remotely. ([1380702](https://bitbucket.org/atlassian/atlaskit/commits/1380702))
- breaking; The onOpen handlers will now be called when searches error. Previously they would only be called when there were search results.
- ISSUES CLOSED: FA-910

## 5.3.2 (2017-06-22)

- fix; fix for long standing react warning. :yakshave: ([cf88128](https://bitbucket.org/atlassian/atlaskit/commits/cf88128))
- fix; uncaught rejected provider promises, ui not updating. ([237cd54](https://bitbucket.org/atlassian/atlaskit/commits/237cd54))

## 5.3.0 (2017-06-20)

- fix; fS-1073 Code review remarks ([003dc28](https://bitbucket.org/atlassian/atlaskit/commits/003dc28))
- fix; fS-1073 Code review remarks + fix tests ([7611a77](https://bitbucket.org/atlassian/atlaskit/commits/7611a77))
- fix; fS-1073 Filter mention locally from previous search results ([0c4788a](https://bitbucket.org/atlassian/atlaskit/commits/0c4788a))
- fix; fS-1073 Reset search index on bootstrap ([5582b3c](https://bitbucket.org/atlassian/atlaskit/commits/5582b3c))

## 5.2.0 (2017-06-19)

- feature; enable the display of more specific error messages in the MentionList ([db5efae](https://bitbucket.org/atlassian/atlaskit/commits/db5efae))

## 5.1.2 (2017-06-15)

- fix; fix correct usage of react lifecycle and controlled input component. ([3ccd3ec](https://bitbucket.org/atlassian/atlaskit/commits/3ccd3ec))

## 5.1.1 (2017-06-14)

- fix; add AbstractMentionResource export to editor-core ([308ad31](https://bitbucket.org/atlassian/atlaskit/commits/308ad31))
- fix; fixed positioning for tooltip rendered for non-permitted mention ([83851e6](https://bitbucket.org/atlassian/atlaskit/commits/83851e6))
- fix; render tooltip on same line as Mention component ([4b18886](https://bitbucket.org/atlassian/atlaskit/commits/4b18886))
- fix; style fix to render tooltip properly in Firefox ([32d223d](https://bitbucket.org/atlassian/atlaskit/commits/32d223d))
- feature; mentionItem without nickname rendered only using name ([b2fa672](https://bitbucket.org/atlassian/atlaskit/commits/b2fa672))

## 5.1.0 (2017-06-05)

- fix; fS-691 Change whoops style to white and use akicon ([6f023d0](https://bitbucket.org/atlassian/atlaskit/commits/6f023d0))
- feature; fS-1026 When displaying the mention typeahead, I want to see users who don't have a ([a31d317](https://bitbucket.org/atlassian/atlaskit/commits/a31d317))

## 5.0.1 (2017-06-01)

- fix; remove 'graphql' url component from presence's config ([b975e98](https://bitbucket.org/atlassian/atlaskit/commits/b975e98))

## 5.0.0 (2017-06-01)

- fix; add polyfills for all storybooks, use es6-promise, URLSearchParams, Fetch API and Elemen ([db2f5cf](https://bitbucket.org/atlassian/atlaskit/commits/db2f5cf))
- fix; fix remaining mention tests ([d34d43b](https://bitbucket.org/atlassian/atlaskit/commits/d34d43b))
- fix; move all polyfills into devDeps ([d275563](https://bitbucket.org/atlassian/atlaskit/commits/d275563))
- fix; remove polyfills from mention and emoji packages, use styled-components instead of t ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
- fix; restore classname for confluence selenium tests ([e59c2f7](https://bitbucket.org/atlassian/atlaskit/commits/e59c2f7))
- breaking; ED-1701, ED-1702, ED-1704
- ISSUES CLOSED: ED-1701, ED-1702, ED-1704

## 4.2.3 (2017-05-09)

- fix; fixed storybooks and bumped lozenge and avatar dependencies in mentions ([71ddb2a](https://bitbucket.org/atlassian/atlaskit/commits/71ddb2a))

## 4.2.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 4.2.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 4.2.0 (2017-04-10)

- feature; add a class to mention node ([5996b7a](https://bitbucket.org/atlassian/atlaskit/commits/5996b7a))

## 4.1.1 (2017-04-07)

- fix; properly handle the case where mention provider is null or undefined ([cf5dc91](https://bitbucket.org/atlassian/atlaskit/commits/cf5dc91))

## 4.1.0 (2017-04-04)

- feature; displays nickname rather than username in MentionItem if exists for user ([d3f4a81](https://bitbucket.org/atlassian/atlaskit/commits/d3f4a81))

## 4.0.5 (2017-03-27)

- fix; updated avatar version from ^1.0.0 to ^2.0.0 in mention ([4ef6a16](https://bitbucket.org/atlassian/atlaskit/commits/4ef6a16))

## 4.0.4 (2017-03-23)

- fix; resourcedMention component doesn't update provider correctly ([fa0c8fc](https://bitbucket.org/atlassian/atlaskit/commits/fa0c8fc))

## 4.0.2 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 4.0.1 (2017-03-17)

- fix; upgrade TypeScript to 2.2.1 ([2aa28fc](https://bitbucket.org/atlassian/atlaskit/commits/2aa28fc))

## 4.0.0 (2017-03-13)

- feature; rendering performance optimisations. ([c99a94e](https://bitbucket.org/atlassian/atlaskit/commits/c99a94e))
- breaking; MentionItem no longer spreads Mention props as component props, moving to a single mention prop instead.
- Mention no longer duplicates time and status. Now only in presence property object.
- Event callbacks have changes, but in general should be code compatible.
- ISSUES CLOSED: FS-285

## 3.0.0 (2017-03-08)

- fix; fix some failing unit tests. ([4a4e32c](https://bitbucket.org/atlassian/atlaskit/commits/4a4e32c))
- feature; fS-214: Allow mentions to work with the session service; both using a header and a ([8e48507](https://bitbucket.org/atlassian/atlaskit/commits/8e48507))
- breaking; A different URL should be provided to the Mentions component
- ISSUES CLOSED: FS-214

## 2.1.0 (2017-03-02)

- feature; adding a resourced mention-component that takes a mentionProvider-promise ([aff9907](https://bitbucket.org/atlassian/atlaskit/commits/aff9907))

## 2.0.0 (2017-03-01)

- feature; adding method highlightning mentions ([08a1291](https://bitbucket.org/atlassian/atlaskit/commits/08a1291))
- breaking; MentionProvider now expects a "shouldHighlightMention"-method

## 1.4.0 (2017-02-23)

- Component for rendering mentions ([7a83043](https://bitbucket.org/atlassian/atlaskit/commits/7a83043))

## 1.3.6 (2017-02-23)

- Fixing internal types in MentionResource to reflect actual types. ([6829ace](https://bitbucket.org/atlassian/atlaskit/commits/6829ace))

## 1.3.5 (2017-02-21)

- Typescript configuration changes to match latest core configuration. ([aa13d3f](https://bitbucket.org/atlassian/atlaskit/commits/aa13d3f))

## 1.3.4 (2017-02-17)

- fix; select colour changed from dark to light ([1dc44ec](https://bitbucket.org/atlassian/atlaskit/commits/1dc44ec))
- undo padding change ([3c1f0c6](https://bitbucket.org/atlassian/atlaskit/commits/3c1f0c6))

## 1.3.2 (2017-02-16)

- fix; Query should be optional ([4e05ce1](https://bitbucket.org/atlassian/atlaskit/commits/4e05ce1))
- fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
- Fixing types in mention resource ([60a3538](https://bitbucket.org/atlassian/atlaskit/commits/60a3538))

## 1.3.1 (2017-02-10)

- fix; Updates package to have correct dev-dependency for util-common-test ([403d232](https://bitbucket.org/atlassian/atlaskit/commits/403d232))

## 1.3.0 (2017-02-09)

- Adding method for getting number of mentions and made positioning props optional again ([51d0591](https://bitbucket.org/atlassian/atlaskit/commits/51d0591))
- uncomment tests that turned out not that flakey ([f100134](https://bitbucket.org/atlassian/atlaskit/commits/f100134))

## 1.2.0 (2017-02-07)

- Disable failing test, remove unused file. ([5075309](https://bitbucket.org/atlassian/atlaskit/commits/5075309))

## 1.1.1 (2017-02-07)

- fix; Updates docs to mention using yarn to install ([5af03bf](https://bitbucket.org/atlassian/atlaskit/commits/5af03bf))
- fix; Rearrange tsconfig.json organisation to allow per-package configuration. ([6c6992d](https://bitbucket.org/atlassian/atlaskit/commits/6c6992d))
- Bump to a real version of lozenge ([b77862d](https://bitbucket.org/atlassian/atlaskit/commits/b77862d))
- Fix dependency on util-shared-styles ([9b4e3c6](https://bitbucket.org/atlassian/atlaskit/commits/9b4e3c6))
- Remove legacy .js file, add MentionItem export. ([5c021e2](https://bitbucket.org/atlassian/atlaskit/commits/5c021e2))

## 1.1.0 (2017-02-06)

- fix; Updates package to use scoped ak packages ([db5c2f6](https://bitbucket.org/atlassian/atlaskit/commits/db5c2f6))
- Export MentionItem for not list/picker use cases. ([7cdd17f](https://bitbucket.org/atlassian/atlaskit/commits/7cdd17f))
- Expose selectIndex and selectId apis on the relevant components. ([25d7ebf](https://bitbucket.org/atlassian/atlaskit/commits/25d7ebf))
- Migrating to typescrypt ([1bff7bc](https://bitbucket.org/atlassian/atlaskit/commits/1bff7bc))
