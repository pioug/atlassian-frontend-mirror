# @atlaskit/atlassian-navigation

## 1.1.3

### Patch Changes

- [`4f9dd11a8eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f9dd11a8eb) - Fixes a visual bug which made the logo appear twice under very rare circumstances
- Updated dependencies

## 1.1.2

### Patch Changes

- [`789bc630b95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/789bc630b95) - Moved switcher test utils to private scope.

## 1.1.1

### Patch Changes

- [`1a68f990792`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a68f990792) - ACT-2057 transition @atlaskit/atlassian-switcher-vanilla & @atlaskit/atlassian-switcher to private scope

## 1.1.0

### Minor Changes

- [`e1bac029e02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1bac029e02) - [ux] Added notification badge to the Help button

### Patch Changes

- [`956eeeed790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/956eeeed790) - [ux] Styles for the product icon and logo have been slightly refactored.
- [`88a19402c24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88a19402c24) - Updates to internal tests.
- Updated dependencies

## 1.0.0

### Major Changes

- [`68c25f52345`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68c25f52345) - This `1.0.0` release denotes that the package API is now stable and is no longer in developer preview. There are **NO API CHANGES** in this release.

## 0.12.6

### Patch Changes

- Updated dependencies

## 0.12.5

### Patch Changes

- [`95771438ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95771438ed) - [ux] PrimaryItems will now overflow/resize correctly when the initial load screen size is narrower than the items it contains

## 0.12.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.12.3

### Patch Changes

- [`cadfec2b52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cadfec2b52) - [ux] Introduced a new prop value in search field so that user can control it from outside and can change the value of search field.

## 0.12.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.12.1

### Patch Changes

- [`9798ad1405`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9798ad1405) - Remove deep import paths of dependencies in TS declaration files
- Updated dependencies

## 0.12.0

### Minor Changes

- [`ac92cbbca8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac92cbbca8) - Replaced WidthDetector with WidthObserver. We are doing this change because WidthDetector was causing some performance issue.

### Patch Changes

- Updated dependencies

## 0.11.5

### Patch Changes

- Updated dependencies

## 0.11.4

### Patch Changes

- [`9f54ca0cf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f54ca0cf1) - Adds maxwidth of 260px to logo in @atlaskit/atlassian-navigation and adds new prop logoMaxWidth to make maxWidth for logo user driven.

## 0.11.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.11.2

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 0.11.1

### Patch Changes

- [`2ae915c912`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ae915c912) - Fixed incorrect create-button color issue when hex color shorthand notion is used

## 0.11.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.10.15

### Patch Changes

- [`2221a004ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2221a004ff) - Fixed skeleton button not showing correct border color when selected
- Updated dependencies

## 0.10.14

### Patch Changes

- Updated dependencies

## 0.10.13

### Patch Changes

- [`8783e413a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8783e413a8) - Export IconButton and IconButtonProps from atlassian-navigation

## 0.10.12

### Patch Changes

- [`73f23c649d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73f23c649d) - Fixed incorrect create-button color issue when hex color shorthand notion is used

## 0.10.11

### Patch Changes

- [`cc14956821`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc14956821) - Update all the theme imports to a path thats tree shakable

## 0.10.10

### Patch Changes

- [`739dc7c15c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/739dc7c15c) - Introduces `shouldShowSearch` prop on SkeletonNavigation to control search skeleton

## 0.10.9

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- Updated dependencies

## 0.10.8

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 0.10.7

### Patch Changes

- [`32db77ba72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32db77ba72) - Fix test id to the correct naming convention

## 0.10.6

### Patch Changes

- [`ccdbfccfae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccdbfccfae) - FIX: Double create buttons appear in all screens during lazy load

## 0.10.5

### Patch Changes

- Updated dependencies

## 0.10.4

### Patch Changes

- [patch][b788e3359a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b788e3359a):

  Pass additional hover CSS to search

## 0.10.3

### Patch Changes

- [patch][4515d1bc47](https://bitbucket.org/atlassian/atlassian-frontend/commits/4515d1bc47):

  Fix text color for selected item in custom theme

## 0.10.2

### Patch Changes

- [patch][37edda3e89](https://bitbucket.org/atlassian/atlassian-frontend/commits/37edda3e89):

  - Fixes isHighlighted styles for SkeletonPrimaryButton without a dropdown
  - Updates hover, active and focus styles for all the skeletons
  - Supports children prop for SkeletonPrimaryButton so it has the same API as PrimaryButton
  - Adds documentation for the new skeleton components

## 0.10.1

### Patch Changes

- [patch][42eb460a09](https://bitbucket.org/atlassian/atlassian-frontend/commits/42eb460a09):

  Adds lightweight non-interactive skeleton buttons which can be used in SSR mode.

  Updates isHighlighted styles to be according to the design spec

## 0.10.0

### Minor Changes

- [minor][6e2dda87f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e2dda87f4):

  **Breaking Change:**

  - **Search component:**:
    - Added a required `label` prop
    - Renamed `text` prop to `placeholder` for clarity
  - **AtlassianNavigation:**
    - Added a required `label` prop

  **Accessibility Changes**

  - Search now has a `search` landmark, further described by a `label` prop on the text field
  - AtlassianNavigation now has a `navigation` landmark for use with screen readers;
    this landmark is further described by the `label` prop to differentiate it from side-navigation
  - AtlassianNavigation is wrapped in a `header` component
  - BadgeContainer is now hidden from screen readers, as the notification button's label contains the
    number of unread notifications

### Patch Changes

- Updated dependencies [ed8d8dea65](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8d8dea65):
- Updated dependencies [db2f869556](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2f869556):
- Updated dependencies [81ea791176](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ea791176):
- Updated dependencies [e57c4aa96d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57c4aa96d):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [89d35b919a](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d35b919a):
- Updated dependencies [083cfbaeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/083cfbaeb4):
- Updated dependencies [46d95777ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d95777ef):
- Updated dependencies [9b264df34d](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b264df34d):
  - @atlaskit/menu@0.3.1
  - @atlaskit/docs@8.5.0

## 0.9.6

### Patch Changes

- [patch][b80c88fd26](https://bitbucket.org/atlassian/atlassian-frontend/commits/b80c88fd26):

  Fixes test id not being passed down to icon button.- [patch][9ec1606d00](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ec1606d00):

  Export the value HORIZONTAL_GLOBAL_NAV_HEIGHT- [patch][1b3069e06b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3069e06b):

  Added aria-label to input field in Search component- Updated dependencies [1f9c4f974a](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c4f974a):

- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [3b92b89113](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b92b89113):
  - @atlaskit/menu@0.2.7
  - @atlaskit/icon@20.0.2
  - @atlaskit/drawer@5.3.3

## 0.9.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/badge@13.1.5
  - @atlaskit/button@13.3.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/menu@0.2.6
  - @atlaskit/popup@0.3.2
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/width-detector@2.0.10
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/notification-indicator@7.0.11
  - @atlaskit/notification-log-client@4.0.10
  - @atlaskit/atlassian-notifications@0.1.4
  - @atlaskit/atlassian-switcher-test-utils@0.3.1
  - @atlaskit/atlassian-switcher@5.9.1

## 0.9.4

### Patch Changes

- [patch][602ad2855a](https://bitbucket.org/atlassian/atlassian-frontend/commits/602ad2855a):

  Reduces the size of the icon in the create cta button.- [patch][5c6a0d9512](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c6a0d9512):

  Adds `testId` to all components, read the docs for more information.- [patch][ca86945834](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca86945834):

  Fixes overflow menu having an unstable component reference when nothing had changed.- Updated dependencies [4ed951b8d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ed951b8d8):

- Updated dependencies [e0e91e02a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0e91e02a6):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/menu@0.2.4
  - @atlaskit/icon@20.0.0
  - @atlaskit/logo@12.3.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/drawer@5.3.1
  - @atlaskit/tooltip@15.2.2
  - @atlaskit/atlassian-switcher@5.7.1

## 0.9.3

### Patch Changes

- Updated dependencies [0946fdd319](https://bitbucket.org/atlassian/atlassian-frontend/commits/0946fdd319):
  - @atlaskit/popup@0.3.0

## 0.9.2

### Patch Changes

- [patch][6c8c859801](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c8c859801):

  - Add `openOverflowMenu` and `closeOverflowMenu` to `useOverflowStatus`.
  - Add testIDs to the overflow menu and trigger.

## 0.9.1

### Patch Changes

- [patch][c3ccbe7d7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ccbe7d7b):

  Bump @atlaskit/popup to get closeManager fixes- Updated dependencies [eb1ecc219a](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb1ecc219a):

  - @atlaskit/popup@0.2.7

## 0.9.0

### Minor Changes

- [minor][24edf508bf](https://bitbucket.org/atlassian/atlassian-frontend/commits/24edf508bf):

  **BREAKING CHANGE** Removes `_itemTheme` from package. Replaces popup examples with `@atlaskit/menu`.

## 0.8.5

### Patch Changes

- [patch][5c105059ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c105059ef):

  Increase stability of "more" collapse/expand behaviour- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [f534973bd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/f534973bd4):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/popup@0.2.6
  - @atlaskit/badge@13.1.4
  - @atlaskit/button@13.3.5
  - @atlaskit/spinner@12.1.3
  - @atlaskit/tooltip@15.2.1
  - @atlaskit/dropdown-menu@8.2.2

## 0.8.4

### Patch Changes

- [patch][6c94b91976](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c94b91976):

  Fixes avatar skeleton size.- [patch][64aefb016d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64aefb016d):

  Fixes overflow menu popup placement.

## 0.8.3

### Patch Changes

- [patch][666ecab6c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/666ecab6c9):

  Improve styles for Atlassian Navigation when SSRd

## 0.8.2

### Patch Changes

- [patch][9af7977678](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9af7977678):

  Fixing visual tweaks for top nav and menu spacing

## 0.8.1

### Patch Changes

- [patch][65e4e8a5ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65e4e8a5ec):

  Removing left margin for ProductHome when there's no Switcher before it.

## 0.8.0

### Minor Changes

- [minor][df31cc4fb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df31cc4fb4):

  Changed the ProductHome theme to remove all the button styles. Instead us the PrimaryButton styles.

### Patch Changes

- Updated dependencies [308708081a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/308708081a):
  - @atlaskit/logo@12.3.0

## 0.7.1

### Patch Changes

- [patch][72ceb0c548](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72ceb0c548):

  Fixes Skeleton for atlassian navigation, which had broken earlier due to the ProductHome re-write

## 0.7.0

### Minor Changes

- [minor][63b9f324df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63b9f324df):

  Change the way ProductHome is rendered

## 0.6.7

### Patch Changes

- [patch][38a300c7e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38a300c7e0):

  Misc UI changes- Updated dependencies [d0415ae306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0415ae306):

  - @atlaskit/popup@0.2.4

## 0.6.6

### Patch Changes

- [patch][c86f02bcb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c86f02bcb3):

  Added selected state to more menu

## 0.6.5

### Patch Changes

- [patch][e419c3c01f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e419c3c01f):

  Update color of skeleton in atlassian-navigation

## 0.6.4

### Patch Changes

- [patch][1ef7f6bba9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ef7f6bba9):

  Fixed nav height

## 0.6.3

### Patch Changes

- [patch][8e8366be2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e8366be2c):

      Update IconButton types from string to React.ReactNode.

## 0.6.2

### Patch Changes

- [patch][02d05ff668](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02d05ff668):

  - Fix types for the tooltip prop to allow React components.
  - Introduce `buttonTooltip` and `iconButtonTooltip` to configure tooltip for create button.

## 0.6.1

### Patch Changes

- [patch][042a5d87ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/042a5d87ea):

  Reduced unnecessary deps for navigation, and added temp \_itemTheme export to style dropdown-menu items

## 0.6.0

### Minor Changes

- [minor][355e7ca2ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/355e7ca2ea):

  Breaking changes from previous version:

  - Rename siteName to siteTitle to match what it is called in the products
  - Rename isSelected prop to isHighlighted to avoid confusion with the CSS states of the button, which is also exposed as a prop to Button

  Other visual changes:

  - Primary buttons in the nav with dropdowns stay highlighted when the drop down is open.
  - Fix active state in FF
  - Gradients for Atlassian products works correctly

## 0.5.1

### Patch Changes

- [patch][5eb3d1fc75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5eb3d1fc75):

  Removed spinner from the notifications package (handled by the iframe content instead)

## 0.5.0

### Minor Changes

- [minor][48640192dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48640192dc):

  Adds support for white nav. Repositions how the components are displayed. Changes to the theming API to support white nav. Add support for showing site name

## 0.4.9

- Updated dependencies [6e0bcc75ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e0bcc75ac):
  - @atlaskit/popup@0.2.0

## 0.4.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.4.7

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 0.4.6

### Patch Changes

- [patch][fcfd4db9c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fcfd4db9c0):

  Fixing focus styles for IconButtons

## 0.4.5

### Patch Changes

- [patch][fda9024074](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fda9024074):

  Add a fully instrumented example of atlassian-navigation using @atlaskit/analytics-next

## 0.4.4

### Patch Changes

- [patch][c24724add6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c24724add6):

  Update entry points and exports

## 0.4.3

### Patch Changes

- [patch][6a82fd06ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a82fd06ab):

  Render tooltip only when supplied, and fix button focus background color

## 0.4.2

### Patch Changes

- [patch][c810632671](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c810632671):

  Update theme generation

## 0.4.1

### Patch Changes

- [patch][f7eb0a4886](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7eb0a4886):

  Ensuring new horizontal nav allows for scrollbar width. Using 'vw' units prevents this.

## 0.4.0

### Minor Changes

- [minor][c5939cb73d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5939cb73d):

  Integrate popup component

## 0.3.2

### Patch Changes

- [patch][9a59c6e93b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a59c6e93b):

  Fix badge and primary items container styles

## 0.3.1

### Patch Changes

- [patch][197aa4ed2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/197aa4ed2c):

  Use context hooks in favour of emotion-theming

## 0.3.0

### Minor Changes

- [minor][382273ee49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/382273ee49):

  Add more behaviour

## 0.2.2

### Patch Changes

- [patch][13f8980fb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13f8980fb2):

  Use emotion object style

## 0.2.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/drawer@5.0.10
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 0.2.0

### Minor Changes

- [minor][187b3147bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/187b3147bd):

  Add theming support

## 0.1.3

- Updated dependencies [6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):
  - @atlaskit/badge@13.0.0
  - @atlaskit/notification-indicator@7.0.8

## 0.1.2

### Patch Changes

- [patch][8e692b02f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e692b02f5):

  Add `AppNavigationSkeleton` as a named export.

## 0.1.1

### Patch Changes

- [patch][f0980913df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0980913df):

  Add missing dependencies to package.json
