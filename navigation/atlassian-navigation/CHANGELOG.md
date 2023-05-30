# @atlaskit/atlassian-navigation

## 2.6.1

### Patch Changes

- [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration work. The change is internal only and should not introduce any changes for the component consumers.

## 2.6.0

### Minor Changes

- [`e40a555bd64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40a555bd64) - [ux] Adds a platform-feature-flagged update to the way the top nav renders primary nav items, moving it from unperformant JS-based calculations to a responsive CSS solution. PFF: "platform.design-system-team.navigation-v2-no-jank_5yhbd"

## 2.5.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.5.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.5.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- [`f7f852b0a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f852b0a4f) - Migrated use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 2.4.0

### Minor Changes

- [`e3fa4437cf5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3fa4437cf5) - [ux] Updates focus appearance of components using buttons and custom buttons. These states now use an offset outline which is consistent with other applications of focus in Atlassian components.

### Patch Changes

- Updated dependencies

## 2.3.5

### Patch Changes

- [`718d5ad3044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/718d5ad3044) - Updates to support the new `@atlaskit/tokens` theming API.
- Updated dependencies

## 2.3.4

### Patch Changes

- [`cdc1dd169be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdc1dd169be) - [ux] When updating tokens for Search component of `atlassian-navigation` package we found that some styles don't apply. This is due to the fact that some dynamic styles for `hover` and `focus` states used to be passed via `style` attribute. `style` attribute doesn't allow usage of pseudo-classes hens styles were never applied. We fixed this and made tokens follow the spec. However, to prevent consumer's VR tests from breaking we decided to fallback on default styles so the UI on legacy theming unchanged.

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

- [`27fc68c8e36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fc68c8e36) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- [`fc570a62923`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc570a62923) - [ux] Fixed a regression which could prevent items from collapsing.

## 2.2.9

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 2.2.8

### Patch Changes

- [`eb77cae1ea4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb77cae1ea4) - [ux] Selected buttons that have menus in the atlassian-navigation component now show the correct background color when "selected"

## 2.2.7

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 2.2.6

### Patch Changes

- [`95c1a5e91d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95c1a5e91d1) - Internal code change turning on new linting rules.
- Updated dependencies

## 2.2.5

### Patch Changes

- [`deeaf03eb21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/deeaf03eb21) - Fix an issue where ProductHome rendered incorrectly in Safari

## 2.2.4

### Patch Changes

- [`416570be6bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/416570be6bf) - Small update to styles to account for change in `@atlaskit/logo`.
- Updated dependencies

## 2.2.3

### Patch Changes

- [`5b7962fbceb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b7962fbceb) - Fix visual bug with selected state of navigation iconButtons
- [`dd991482e67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd991482e67) - [ux] Fixed a regression causing the `logoMaxWidth` prop to have no effect. VR tests may need regenerating, but in most cases will not.
- Updated dependencies

## 2.2.2

### Patch Changes

- [`d28c3b5078e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d28c3b5078e) - Updated type documentation

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`81addc0c144`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81addc0c144) - [ux] Pass boxShadow for the focus styling of search section in the theme generator.

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- [`3622df604ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3622df604ee) - Fixes bug where navigation items cannot be added after intial render if the initial item array was empty

## 2.1.5

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [`5772d2d059c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5772d2d059c) - update root babel config to correctly compile atlassian switcher

## 2.1.2

### Patch Changes

- [`ac9343c3ed4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac9343c3ed4) - Replaces usage of deprecated design tokens. No visual or functional changes
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates all usage of brand tokens to either selected or information tokens. This change is purely for semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 2.1.1

### Patch Changes

- [`faee2b4ee52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faee2b4ee52) - Rewrite dynamic styles to be static to aid compiled migration.
- Updated dependencies

## 2.1.0

### Minor Changes

- [`c4e94b64308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4e94b64308) - Added a new href prop to the Create button which causes it to be rendered as a link. This is suitable for when the Create action is handled as a full page rather than in a modal-dialog.

## 2.0.4

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [`9dd6250db15`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd6250db15) - Updates token value for selected button text. Button text should now be "blue" when selected

## 2.0.1

### Patch Changes

- [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 2.0.0

### Major Changes

- [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) - ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including breaking API changes, types and tests in atlassian-frontend packages

  What changed: Upgraded our react-intl support from ^2.6.0 to ^5.18.1. This means editor packages now rely on consumers installing ^5.18.1, otherwise editor usage of react-intl will mismatch with actual installed react-intl APIs.
  Why change was made: As part of a coordinated upgrade effort across AF packages, as react-intl v2 is quite dated.
  How consumer should update their code: Ensure react-intl ^5.18.1 is installed in consuming applications.

  Upgrade guide: To consume atlassian-frontend packages that use react-intl5 setup a second provider for the new version, using an npm alias

  ```js
  "react-intl": "^2.6.0",
  "react-intl-next": "npm:react-intl@^5.18.1",
  ```

  ```js
  import { IntlProvider } from 'react-intl';
  import { IntlProvider as IntlNextProvider } from 'react-intl-next';

  return (
    <IntlProvider
      key={locale}
      data-test-language={locale}
      locale={locale}
      defaultLocale={DEFAULT_LOCALE}
      messages={messages}
    >
      <IntlNextProvider
        key={locale}
        data-test-language={locale}
        locale={locale}
        defaultLocale={DEFAULT_LOCALE}
        messages={messages}
      >
        {children}
      </IntlNextProvider>
    </IntlProvider>
  );
  ```

## 1.3.0

### Minor Changes

- [`9d4ca6e23da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d4ca6e23da) - [ux] New create-dropdown-menu package for Create dropdown button

## 1.2.2

### Patch Changes

- [`a2f953f3814`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2f953f3814) - Previously the `ensure-design-token-usage` eslint rule contained all checks relating to token use. This has now been split up into two separate rules:

  `ensure-design-token-usage` now covers:

  - `legacyElevation` — warns about old usages of the elevation mixins or styles, which instead should use the `card` or `overlay` tokens.
  - `hardCodedColor` — warns about use of hard-coded colors such as `color: colors.B100`, which instead should be wrapped in a `token()` call. This covers the majority of cases in existing codebases when first adopting tokens.

  `no-unsafe-design-token-usage` (new) covers the remaining rules:

  - `directTokenUsage` — warns against using the CSS Custom Property name that is output in the browser by the `token()` call.
    Eg. directly using `var(--ds-accent-subtleBlue)` is bad.
  - `staticToken` — warns when tokens aren't used inline. Inlining the token usages helps with static analysis, which unlocks future improvements.
    Eg. pulling the token out into a const like `css={ color: token(primaryButtonText) }` is bad.
  - `invalidToken` — warns when using a token that doesn't exist (not one that's been renamed, see the next point).
  - `tokenRenamed` — warns when using a token that's been renamed in a subsequent release.
  - `tokenFallbackEnforced` — warns if a fallback for the token call is not provided.
    Eg. call with the fallback like this `token('color.background.disabled', N10)` instead of `token('color.background.disabled')`.
  - `tokenFallbackRestricted` — the opposite of `tokenFallbackEnforced`.
    Eg. do not pass in a fallback like this `token('color.background.disabled', N10)` and instead only include the token `token('color.background.disabled')`.

  Upgrading — some instances of `\\eslint-disable` may need to be changed to the new rule. If you have failing lint rules after only bumping this package then switch those ignores to use `no-unsafe-design-token-usage` instead.

- [`22fb31312eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22fb31312eb) - Fixes unmounted component state update warnings for AtlassianNavigation
- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 1.2.1

### Patch Changes

- [`bb54a699e54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb54a699e54) - [ux] Fixes a bug where a previously removed gradient positioned ::after primary actions was still rendered. Also fixes a bug where this gradient rendered incorrectly on Safari.

## 1.2.0

### Minor Changes

- [`c9986657899`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9986657899) - Instrumented atlassian-navigation with the new theming package, @atlaskit/tokens.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha). These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`f791fab1bfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f791fab1bfa) - Added missing `components` and `onBlur` props to the props type used by secondary actions. These were already available but were not documented.
- Updated dependencies

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
