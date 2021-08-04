# @atlaskit/profilecard

## 15.6.0

### Minor Changes

- [`d07a1ced0bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d07a1ced0bd) - Pass orgId on to service when querying team

## 15.5.12

### Patch Changes

- [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 15.5.11

### Patch Changes

- Updated dependencies

## 15.5.10

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17

## 15.5.9

### Patch Changes

- [`d57d071183e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d57d071183e) - Fix a bug - should re-render ProfileCard when "resourceClient" prop is changed

## 15.5.8

### Patch Changes

- Updated dependencies

## 15.5.7

### Patch Changes

- [`8b87ba0c18c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b87ba0c18c) - Fix the behavior of command click and shift click on links

## 15.5.6

### Patch Changes

- [`f8cf7c90c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8cf7c90c94) - Added error attributes to analytics after failures so we can track issue causes

## 15.5.5

### Patch Changes

- [`f5c41936feb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5c41936feb) - Fix the props to allow better customization of links on avatars in team profilecards.

## 15.5.4

### Patch Changes

- [`9f19d3e89fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f19d3e89fe) - CONFDEV-73945: Added optional customLozenges property to ProfileCardClientData so Typescript will allow custom UserProfileClients to add custom lozenges to the ProfileCard

## 15.5.3

### Patch Changes

- [`e7d0d61bfc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7d0d61bfc0) - Fixed analytics issues in Team Profilecard avatars and added key to User Profilecard lozenges

## 15.5.2

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 15.5.1

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 15.5.0

### Minor Changes

- [`54f4ce55485`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54f4ce55485) - Changed ProfileCard's customLozenges' 'text' prop type to accept a ReactNode to allow internationalized <FormattedMessage> elements in addition to string

## 15.4.0

### Minor Changes

- [`e76cdc56e39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e76cdc56e39) - Made cloudId optional, to increase usability in site-less contexts like new products.

## 15.3.1

### Patch Changes

- [`620ddc14690`](https://bitbucket.org/atlassian/atlassian-frontend/commits/620ddc14690) - [ux] Correct styling on Profile Card triggers

## 15.3.0

### Minor Changes

- [`5e7fbaa154f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e7fbaa154f) - [ux] Added an optional prop to the Profilecard component for displaying custom lozenges

## 15.2.0

### Minor Changes

- [`61544638935`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61544638935) - Added analytics to the Team profile card

## 15.1.3

### Patch Changes

- [`11f5b0da43e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11f5b0da43e) - [ux] Fix zIndex for profile card and team profile card

## 15.1.2

### Patch Changes

- [`e104d184c58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e104d184c58) - [ux] Enabled translations for team profile card messages

## 15.1.1

### Patch Changes

- [`771af9a49ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/771af9a49ed) - [ux] Enable propagating onClick handlers to the Avatar Group

## 15.1.0

### Minor Changes

- [`d30beab4f1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d30beab4f1e) - Introduce lazy loading for the team profile card

## 15.0.2

### Patch Changes

- [`1d2da620745`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d2da620745) - [ux] Default to showing shadow around user profile cards

## 15.0.1

### Patch Changes

- [`1e5d7f613f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e5d7f613f5) - [ux] Position the header image on team profile cards correctly

## 15.0.0

### Major Changes

- [`6d6aa2b4928`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d6aa2b4928) - Introduced entrypoints to the profilecard package.

## 14.3.1

### Patch Changes

- [`537b933d68f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/537b933d68f) - [ux] Simplified the CSS being used and added improved testing

## 14.3.0

### Minor Changes

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations

## 14.2.0

### Minor Changes

- [`78a52b31f84`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78a52b31f84) - [ux] Added triggerLinkType prop to allow customisation of the link that wraps the trigger.

## 14.1.0

### Minor Changes

- [`8263a7a153`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8263a7a153) - [ux] Update the user profile card trigger to use @atlaskit/popup for the popup behaviour, and remove/simplify unneeded code.

## 14.0.2

### Patch Changes

- [`9e021e9873`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e021e9873) - Added customisation to the new Team Profilecard examples.

## 14.0.1

### Patch Changes

- [`d2582c8e90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2582c8e90) - Export the TeamProfileCardTrigger

## 14.0.0

### Major Changes

- [`bc57b32d3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc57b32d3a) - [ux] WARNING: This major release exists for testing purposes only. Avoid using this version as it contains some duplicated dependencies that will be improved in future when the next release is ready for use.

  Introduced a new profile card type: the Team profile card. To support this new type, some changes have been made to the profile client structure to allow code reuse for managing both team and user profile card data collection.

## 13.0.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 13.0.6

### Patch Changes

- Updated dependencies

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 13.0.3

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 13.0.2

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.4.4

### Patch Changes

- Updated dependencies

## 12.4.3

### Patch Changes

- [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update translation files via Traduki build

## 12.4.2

### Patch Changes

- [`39faba6e98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39faba6e98) - Update all the theme imports to something tree-shakable

## 12.4.1

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 12.4.0

### Minor Changes

- [minor][e981669ba5](https://bitbucket.org/atlassian/atlassian-frontend/commits/e981669ba5):

  Adds a new prop to actions: link. The link provided will be used to provide basic web link functionality to the button (eg. URL preview, open link in new tab, etc.).

### Patch Changes

- [patch][9957801602](https://bitbucket.org/atlassian/atlassian-frontend/commits/9957801602):

  clear all timeout callbacks- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/dynamic-table@13.7.2
  - @atlaskit/lozenge@9.1.6
  - @atlaskit/spinner@12.1.6

## 12.3.8

### Patch Changes

- [patch][c913bb88f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/c913bb88f4):

  quickfix to kill stale timeouts

## 12.3.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/dynamic-table@13.6.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/layer@8.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/popper@3.1.11
  - @atlaskit/portal@3.1.6
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/util-data-test@13.1.1

## 12.3.6

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/layer@8.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 12.3.5

### Patch Changes

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any dynamic code it may break you. Refer to the [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):

- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0
  - @atlaskit/portal@3.1.3

## 12.3.4

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

## 12.3.3

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0

## 12.3.2

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 12.3.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.3.0

### Minor Changes

- [minor][84bedb23c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84bedb23c4):

  Export profile-cards withOuterListeners wrapper

## 12.2.0

### Minor Changes

- [minor][8a3c534ec6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a3c534ec6):

  Export show and hide delay times of profile card trigger

## 12.1.0

### Minor Changes

- [minor][16bf116576](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16bf116576):

  Increased show/hide delay times for ProfileCardTrigger

## 12.0.9

### Patch Changes

- [patch][8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):

  @atlaskit/avatar has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 12.0.8

### Patch Changes

- [patch][02f8d986b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02f8d986b5):

  ProfileCardResourced should trigger analytics event when having error

## 12.0.7

### Patch Changes

- [patch][875282da30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/875282da30):

  Fix a bug which causes ProfileCard triggers viewed analytics event twice

## 12.0.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.0.5

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 12.0.4

- Updated dependencies [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/popper@3.0.0

## 12.0.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 12.0.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 12.0.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/portal@3.0.7
  - @atlaskit/icon@19.0.0

## 12.0.0

### Major Changes

- [major][2b333a4c6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b333a4c6d):

  update api types; dispay user active state in ProfilecardResourced; change trigger component display to inherit

## 11.0.1

### Patch Changes

- [patch][0b87683d6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b87683d6c):

  fix unbound method in ProfilecardTrigger component

## 11.0.0

### Major Changes

- [major][a40f54404e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a40f54404e):

  Profilecard is no longer internally wrapped by a react-intl IntlProvider. Consumers must now ensure to Profilecard is wrapped inside a IntlProvider and provide messages from @atlaskit/profilecard/i18n. See https://hello.atlassian.net/wiki/spaces/AtlasKit/pages/287632890/i18n+API

## 10.2.6

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/portal@3.0.3
  - @atlaskit/icon@18.0.0

## 10.2.5

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 10.2.4

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/button@13.0.4
  - @atlaskit/dynamic-table@13.0.1
  - @atlaskit/spinner@12.0.0
  - @atlaskit/portal@3.0.0

## 10.2.3

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 10.2.2

- [patch][afd34e36b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/afd34e36b0):

  - Hide public name when it matches the full name

## 10.2.1

- Updated dependencies [3d95467c4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d95467c4b):
  - @atlaskit/icon@17.0.1
  - @atlaskit/dynamic-table@13.0.0

## 10.2.0

- [minor][e7d7fe8252](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7d7fe8252):

  - Make full name and public name in the same line. Remove `@` symbol in front of public name. Remove mention icon

## 10.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 10.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 9.0.5

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 9.0.4

- Updated dependencies [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
- Updated dependencies [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/portal@1.0.0
  - @atlaskit/popper@1.0.0

## 9.0.3

- [patch][50e8c82ec4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50e8c82ec4):

  - index.ts is now ignored when published to npm to avoid ambiguity between ts and js files

## 9.0.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/dynamic-table@11.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/popper@0.4.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 9.0.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/avatar@15.0.3
  - @atlaskit/dynamic-table@11.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/popper@0.4.2
  - @atlaskit/portal@0.3.1
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 9.0.0

- [major][bfca144ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfca144ea5):

  - Refactored internal components. Moved to Typescript. Updated named exports. Updated type definitions.

## 8.0.2

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/dynamic-table@11.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/i18n-tools@0.5.0
  - @atlaskit/button@11.0.0
  - @atlaskit/util-data-test@11.0.0

## 8.0.1

- [patch][9a0c34d490](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a0c34d490):

  - Fixes package.json to not exclude built files

## 8.0.0

- [major][dbff4fdcf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbff4fdcf9):

  - Remove presence from profilecard now that users cannot use Stride to control it

## 7.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 6.2.0

- [minor][e0e5dd69a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0e5dd69a7):

  - Support 2 new props "hasStatusLozengeForDisabledAccount" and "customMessageForDisabledAccount"

## 6.1.5

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/icon@16.0.0

## 6.1.4

- [patch][ba95c0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba95c0e):

  - Remove typescript type InjectedIntlProps from flow js code

## 6.1.3

- [patch][3ef5292](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ef5292):

  - Include type definitions in npm package

## 6.1.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/dynamic-table@10.0.22
  - @atlaskit/icon@15.0.2
  - @atlaskit/layer@5.0.10
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/docs@6.0.0

## 6.1.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/dynamic-table@10.0.20
  - @atlaskit/icon@15.0.1
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/lozenge@6.2.3

## 6.1.0

- [minor][a2da489](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2da489):

  - - wrap profile card in IntlProvider and support i18n

## 6.0.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/icon@15.0.0

## 6.0.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/dynamic-table@10.0.18
  - @atlaskit/icon@14.6.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 6.0.1

- [patch][9d63842](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d63842):

  - Fixed a bug where content is not rendered for cards of users whose accounts are closed

## 6.0.0

- [major][9c0844d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0844d):

  - Replace "isActive" prop with new "status" prop and adding react-intl messages

## 5.0.0

- [major][a6dd6e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6dd6e3):

  - Removed isCensored prop as this state no longer exists

## 4.0.10

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/icon@14.0.0

## 4.0.9

- [patch] Remove promise polyfill to fix Jira SSR [e793f6e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e793f6e)

## 4.0.8

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7

## 4.0.7

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/dynamic-table@10.0.9
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 4.0.6

- [patch] Updated dependencies [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)
  - @atlaskit/layer@5.0.5

## 4.0.5

- [patch] use size prop small when using icon component [27e074e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27e074e)
- [none] Updated dependencies [27e074e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27e074e)

## 4.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/dynamic-table@10.0.7
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/layer@5.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 4.0.3

- [patch] Bumping dependency on util-data-test [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)

* [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/util-data-test@10.0.3
* [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
* [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/dynamic-table@10.0.6
  - @atlaskit/util-data-test@10.0.3
* [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/util-data-test@10.0.3
* [none] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/util-data-test@10.0.3

## 4.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/icon@13.2.2
  - @atlaskit/dynamic-table@10.0.5
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/avatar@14.0.5

## 4.0.1

- [patch] Remove \$FlowFixMe, move styled-components to peerDependencies and move tests under src and a unit folder [36b595c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36b595c)
- [none] Updated dependencies [36b595c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36b595c)

## 4.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/dynamic-table@10.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/dynamic-table@10.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 3.13.4

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/dynamic-table@9.2.6
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/dynamic-table@9.2.6

## 3.13.3

- [patch] Fix flow config and add back flow fix me [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)
- [none] Updated dependencies [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)

## 3.13.2

- [patch] Update package.json to point to correct build directories [2362f0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2362f0b)
- [none] Updated dependencies [2362f0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2362f0b)

## 3.13.1

- [patch] Migrate Profilecard to AKM2 DIR-553 [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)
- [none] Updated dependencies [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)
  - @atlaskit/docs@4.2.2
- [none] Updated dependencies [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)
  - @atlaskit/docs@4.2.2

## 3.12.3 (2017-12-13)

- bug fix; cap profilecard cache age at 30 days ([6e112c0](https://bitbucket.org/atlassian/atlaskit/commits/6e112c0))

## 3.12.2 (2017-12-06)

- bug fix; add max-width to profilecard trigger to allow CSS truncation of children (issues closed: ak-3989) ([ad721a1](https://bitbucket.org/atlassian/atlaskit/commits/ad721a1))

## 3.12.1 (2017-11-27)

- bug fix; fix profilecard error when user has null presenceMessage ([b250e2b](https://bitbucket.org/atlassian/atlaskit/commits/b250e2b))

## 3.12.0 (2017-11-20)

- feature; add presence message to profilecard (issues closed: dir-459) ([a927c12](https://bitbucket.org/atlassian/atlaskit/commits/a927c12))

## 3.11.0 (2017-11-17)

- feature; add support for focus state to profilecard (issues closed: dir-453) ([51185f4](https://bitbucket.org/atlassian/atlaskit/commits/51185f4))

## 3.10.0 (2017-11-01)

- bug fix; fix profilecard graphql api client (issues closed: dir-444) ([8adce3a](https://bitbucket.org/atlassian/atlaskit/commits/8adce3a))
- feature; add card states for deactivated and app users (issues closed: dir-436) ([0343cb6](https://bitbucket.org/atlassian/atlaskit/commits/0343cb6))

## 3.9.0 (2017-10-27)

- feature; add new profile data keys to graphql query ([44d81d4](https://bitbucket.org/atlassian/atlaskit/commits/44d81d4))

- feature; add predicate method to profile card actions (issues closed: dir-423) ([2737016](https://bitbucket.org/atlassian/atlaskit/commits/2737016))

## 3.8.1 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 3.8.0 (2017-10-16)

- feature; add new detail label for a users email to the profilecard (issues closed: dir-324) ([84f12aa](https://bitbucket.org/atlassian/atlaskit/commits/84f12aa))

## 3.7.4 (2017-10-12)

- bug fix; fix dark mode colors for profilecard (issues closed: dir-413) ([27a6981](https://bitbucket.org/atlassian/atlaskit/commits/27a6981))

- bug fix; fix unit tests for profilecard (issues closed: dir-407) ([9a488fe](https://bitbucket.org/atlassian/atlaskit/commits/9a488fe))
- bug fix; refactor profilecard to styled components (issues closed: dir-407) ([2a0a834](https://bitbucket.org/atlassian/atlaskit/commits/2a0a834))

## 3.7.3 (2017-10-10)

- bug fix; align default status messages of profilecard with Stride (issues closed: dir-414) ([4d65674](https://bitbucket.org/atlassian/atlaskit/commits/4d65674))
- bug fix; bump dependeny versions for profilecard to latest (issues closed: dir-408) ([839922d](https://bitbucket.org/atlassian/atlaskit/commits/839922d))

## 3.7.2 (2017-09-20)

- bug fix; fix non array value of \`oneOf\` proptype in profilecard.jsx ([39131f7](https://bitbucket.org/atlassian/atlaskit/commits/39131f7))

## 3.7.1 (2017-09-08)

- bug fix; limit profilecards error types to the two available from the api (issues closed: dir-376) ([b9b8532](https://bitbucket.org/atlassian/atlaskit/commits/b9b8532))

## 3.7.0 (2017-08-14)

- feature; add not-found error state to profilecard (issues closed: dir-340) ([8021368](https://bitbucket.org/atlassian/atlaskit/commits/8021368))

## 3.6.4 (2017-08-09)

- bug fix; make profilecard type def also available through lerna link (issues closed: ed-2435) ([fb15d63](https://bitbucket.org/atlassian/atlaskit/commits/fb15d63))

* bug fix; Merged in fix/ED-2266-profile-card (pull request #3650) (issues closed: ed-2266) ([2a5b88e](https://bitbucket.org/atlassian/atlaskit/commits/2a5b88e))

## 3.6.3 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.6.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.6.1 (2017-07-20)

- fix; use \`title\` instead of \`position\` from directory data for job title ([3d0864b](https://bitbucket.org/atlassian/atlaskit/commits/3d0864b))

## 3.6.0 (2017-07-18)

## 3.2.0 (2017-07-17)

## 3.2.0 (2017-07-17)

- feature; fix analytics event names for profilecard ([2225d04](https://bitbucket.org/atlassian/atlaskit/commits/2225d04))

## 3.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-07-17)

- feature; add trigger property to AkProfilecardTrigger (possible values: click, hover (defaul ([6f7b508](https://bitbucket.org/atlassian/atlaskit/commits/6f7b508))

## 3.0.2 (2017-07-12)

- fix; export modifyResponse for util-data-test ([67d5784](https://bitbucket.org/atlassian/atlaskit/commits/67d5784))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 3.0.1 (2017-05-12)

- fix; fix profilecard caching issue ([53223a1](https://bitbucket.org/atlassian/atlaskit/commits/53223a1))
- fix; add required cloudId props to stories ([5aa1e8a](https://bitbucket.org/atlassian/atlaskit/commits/5aa1e8a))

## 3.0.0 (2017-05-10)

## 2.4.0 (2017-05-09)

- fix; fix profilecards retry button to only show up when retry method is passed ([4c67a6d](https://bitbucket.org/atlassian/atlaskit/commits/4c67a6d))

* feature; stop render empty layer while profilecard is not visible anyway ([8d56ab3](https://bitbucket.org/atlassian/atlaskit/commits/8d56ab3))
* feature; use new GraphQL query in profilecard-client ([66b846d](https://bitbucket.org/atlassian/atlaskit/commits/66b846d))

- breaking; cloudId is now required for resourced component

ISSUES CLOSED: DIR-248, DIR-249, DIR-250

## 2.3.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.3.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.3.0 (2017-04-20)

- feature; add analytics to profilecard component ([77fa03e](https://bitbucket.org/atlassian/atlaskit/commits/77fa03e))

## 2.2.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 2.1.1 (2017-04-18)

- fix; minor profilecard fixes for integration with Home ([7140657](https://bitbucket.org/atlassian/atlaskit/commits/7140657))

## 2.1.0 (2017-04-12)

- feature; add trigger wrapper component for profile cards ([cff0f87](https://bitbucket.org/atlassian/atlaskit/commits/cff0f87))

## 2.0.0 (2017-03-31)

## 1.3.0 (2017-03-31)

- feature; add LRU cache to AkProfileClient ([cb34168](https://bitbucket.org/atlassian/atlaskit/commits/cb34168))
- feature; add wrapper for height transition animation around profilecard ([23cea8c](https://bitbucket.org/atlassian/atlaskit/commits/23cea8c))

* breaking; made resourceClient a required prop, resourceClients method names changed

ISSUES CLOSED: FAB-2671

## 1.2.3 (2017-03-21)

## 1.2.3 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.2.2 (2017-03-20)

- fix; make sure profilecard has a minimum height even without any labels ([88b07a5](https://bitbucket.org/atlassian/atlaskit/commits/88b07a5))

## 1.2.1 (2017-03-07)

## 1.2.0 (2017-03-02)

- feature; fixing error component in profilecard ([66f533c](https://bitbucket.org/atlassian/atlaskit/commits/66f533c))

## 1.1.2 (2017-02-28)

- fix; adds warning to usage.md about editing readme ([4496574](https://bitbucket.org/atlassian/atlaskit/commits/4496574))
- fix; removes jsdoc annoations and moves content to usage.md ([dc12a0d](https://bitbucket.org/atlassian/atlaskit/commits/dc12a0d))
- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.1.1 (2017-02-27)

- fix; change action button appearance ([e13175f](https://bitbucket.org/atlassian/atlaskit/commits/e13175f))
- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.1.0 (2017-02-17)

- feature; Adding isLoading and hasError props to the stateless AkProfilecard component ([b988ff8](https://bitbucket.org/atlassian/atlaskit/commits/b988ff8))
- fixing lint error ([da369d3](https://bitbucket.org/atlassian/atlaskit/commits/da369d3))

## 1.0.2 (2017-02-07)

- fix; Updates docs to mention using yarn ([8259add](https://bitbucket.org/atlassian/atlaskit/commits/8259add))

## 1.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packges ([26b9140](https://bitbucket.org/atlassian/atlaskit/commits/26b9140))
