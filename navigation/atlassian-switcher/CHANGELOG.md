# @atlaskit/atlassian-switcher

## 8.10.1

### Patch Changes

- [`9b5012a9a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b5012a9a93) - Added support for Product Recommendations API. Product Recommendations can now replace the experimental Joinable Sites API. Primarly for use within the Cross-join section of Atlassian Switcher

## 8.10.0

### Minor Changes

- [`b21ff184a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b21ff184a2) - Bump required @atlaskit/logo version to 13.0.6 and remove mystique feature flag

## 8.9.0

### Minor Changes

- [`2ce4fad81c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ce4fad81c) - Improving switcher analytics

## 8.8.0

### Minor Changes

- [`fedc82da88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fedc82da88) - issue/TC-965 add Team Central (Beta) to the Switch to section of the switcher

## 8.7.0

### Minor Changes

- [`eb40b58d0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb40b58d0b) - Add customizeLinks props to switcher to add functionality to update switcher product url and extend analytics attributes

## 8.6.4

### Patch Changes

- [`d9dd180f91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9dd180f91) - Reverting mystique removal changes. Fixing broken release.

## 8.6.3

### Patch Changes

- [`115d690474`](https://bitbucket.org/atlassian/atlassian-frontend/commits/115d690474) - Remove mystique feature flags

## 8.6.2

### Patch Changes

- [`53720ca531`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53720ca531) - EXPO-411: Update GitHub spelling

## 8.6.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.6.0

### Minor Changes

- [`5ed4144fa6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ed4144fa6) - Add Slack integration link for the discover more section and update copy of the discover more link when integrations link is visible

## 8.5.8

### Patch Changes

- [`3e8e65525a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e8e65525a) - Do not check mystique feature flag for cross-flow logic changes in the Switcher (clean-up).

## 8.5.7

### Patch Changes

- [`66aadb66b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66aadb66b0) - Forcing mystique FF to be true. This means Jira Service Desk will read Jira Service Management for all customers regardless of the FFs value

## 8.5.6

### Patch Changes

- [`9e9ad7f1ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e9ad7f1ab) - Add link item to atlassianSwitcherDiscoverMore rendered event

## 8.5.5

### Patch Changes

- [`bc52618a88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc52618a88) - [ux] EXPO-274: Add Git Tools link to Discover more section of AppSwitcher

## 8.5.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 8.5.3

### Patch Changes

- [`f49a0446d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f49a0446d6) - Export types needed for creating a custom provider.

## 8.5.2

### Patch Changes

- Updated dependencies

## 8.5.1

### Patch Changes

- [`22c2f52bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22c2f52bba) - Added joinableSiteProducts to switcher analytics

## 8.5.0

### Minor Changes

- [`6e8c5eeb31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e8c5eeb31) - Add dragonfruit product icon

## 8.4.1

### Patch Changes

- Updated dependencies

## 8.4.0

### Minor Changes

- [`bfc8eb6f4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfc8eb6f4d) - [ux] Added integration that will allow Start to show in switcher.

## 8.3.0

### Minor Changes

- [`17e8021667`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17e8021667) - [ux] Update Discover section logic based on product combinations

## 8.2.1

### Patch Changes

- [`106c70fc43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/106c70fc43) - remove unnecessary example

## 8.2.0

### Minor Changes

- [`c8853feb40`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8853feb40) - Updated switcher to show new JSD "Mystique" product variation when "mystique" feature flag is turned on.

## 8.1.5

### Patch Changes

- Updated dependencies

## 8.1.4

### Patch Changes

- [`3c50349ede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c50349ede) - Upgrade analytics-next to prevent event loss (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)

## 8.1.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 8.1.2

### Patch Changes

- [`0c72458dbe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c72458dbe) - yFix 401 error handling (show correct message and login prompt)

## 8.1.1

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 8.1.0

### Minor Changes

- [`0cb13c9bb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cb13c9bb9) - Remove JSWOG recommendation from Atlassian Switcher

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 8.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.1.0

### Minor Changes

- [`155dc48305`](https://bitbucket.org/atlassian/atlassian-frontend/commits/155dc48305) - Add unverified users support to switcher

## 7.0.0

### Major Changes

- [`38f39c2de9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38f39c2de9) - REMOVED apsMigrationAvailableProductsProvider. API MIGRATED available-products

## 6.1.0

### Minor Changes

- [`57fe37f7ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57fe37f7ef) - Add support for custom admin links

## 6.0.2

### Patch Changes

- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 6.0.1

### Patch Changes

- [`4e03b57b8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e03b57b8a) - Fix custom links and recent containers SLOs

## 6.0.0

### Major Changes

- [`ccb0157282`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccb0157282) - updated disableHeadings prop to disableSwitchToHeading and added experimental app navigation example

## 5.20.16

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 5.20.15

### Patch Changes

- [`b389779939`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b389779939) - Update recommended products to choose a new product ordering based on a UPaaS feature flag

## 5.20.14

### Patch Changes

- [`1a28a1c8c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a28a1c8c8) - Fix FormattedMessage import

## 5.20.13

### Patch Changes

- [`d1b02455ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1b02455ac) - Return empty array instead of null when CrossFlowSection has no suggestedLinks to prevent the <Section> title from appearing

## 5.20.12

### Patch Changes

- [`168b7a3483`](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b7a3483) - Remove messages prop drilling by importing messages directly from import

## 5.20.11

### Patch Changes

- [`4cb7fc56e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cb7fc56e1) - Moving switcher into switcher-components/; extract out 'switch-to', 'custom-links', 'recent' from switcher; move util in switcher into common/utils/analytics to reduce cyclic dependency; remove message props passing down

## 5.20.10

### Patch Changes

- [`c78fc7c2e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c78fc7c2e3) - Update custom links render tracker to treat empty renderes as a valid case

## 5.20.9

### Patch Changes

- [`8ae9bdad80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ae9bdad80) - Add provider name to provider analytics event attributes

## 5.20.8

### Patch Changes

- [`5d03b8b58e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d03b8b58e) - Remove lodash import

## 5.20.7

### Patch Changes

- [`4cffddce92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cffddce92) - Fix function passed to CrossFlowSubsection prop

## 5.20.6

### Patch Changes

- [`3d8ec5e6c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d8ec5e6c7) - yMake sure that disocver section links are collected on render

## 5.20.5

### Patch Changes

- [`4785b13cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4785b13cbd) - Refactor - moved Admin, Cross-flow, and Cross-join links out of links.tsx

## 5.20.4

### Patch Changes

- [`1026701ba5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1026701ba5) - Only pass required props to cross-flow, cross-join & admin sections

## 5.20.3

### Patch Changes

- [`b5cd8fee88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5cd8fee88) - Extract cross-flow, cross-join & admin sections from main switcher component

## 5.20.2

### Patch Changes

- [`ccf56c1f78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccf56c1f78) - Refactor - moved Admin, Cross-flow, and Cross-join link collectors out of map-results-to-switcher-props.ts

## 5.20.1

### Patch Changes

- [`86ad7daeb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86ad7daeb4) - `components/` `theme/` into `ui/` folder; `providers/` `utils/` into `common/` folder; create test-helpers/**tests** and moving tests in root `src/` folder

## 5.20.0

### Minor Changes

- [`dcdcfeeca5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcdcfeeca5) - Track custom links rendered SLI

## 5.19.0

### Minor Changes

- [`59a64a9cc7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59a64a9cc7) - Track recent containers rendered SLO

## 5.18.0

### Minor Changes

- [`dc094938ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc094938ba) - Track discover more rendered SLI

## 5.17.0

### Minor Changes

- [`d869b9683b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d869b9683b) - Track recommended products rendered SLI

## 5.16.1

### Patch Changes

- [`95ca5c978b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95ca5c978b) - Adds missing check for undefined values

## 5.16.0

### Minor Changes

- [`55d0cd04e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55d0cd04e6) - Add tracking for joinable sited rendered SLI

## 5.15.0

### Minor Changes

- [minor][9d4f1a828c](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d4f1a828c):

  Added availableProductsDataProvider prop to confluence-switcher

## 5.14.0

### Minor Changes

- [minor][dcc32245bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcc32245bc):

  remove collectSuggestedLinks dependency on userSiteData, use provisionedProduts instead

## 5.13.5

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/analytics-namespaced-context@4.2.0

## 5.13.4

### Patch Changes

- [patch][07c3248211](https://bitbucket.org/atlassian/atlassian-frontend/commits/07c3248211):

  Add analytics event to track available products rendered SLI

## 5.13.3

### Patch Changes

- [patch][c204b6e5a5](https://bitbucket.org/atlassian/atlassian-frontend/commits/c204b6e5a5):

  Send error boundary reason via analytics event attributes

## 5.13.2

### Patch Changes

- [patch][e75a202ba4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e75a202ba4):

  Modify shadow traffic comparison logic and add diff data

## 5.13.1

### Patch Changes

- [patch][1c95306567](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c95306567):

  joinable sites fetch function will return empty sites on error

## 5.13.0

### Minor Changes

- [minor][b91191a550](https://bitbucket.org/atlassian/atlassian-frontend/commits/b91191a550):

  Add a prioritise-confluence feature flag in switcher for Trello-Confluence crossflow

## 5.12.2

### Patch Changes

- [patch][6fec40c280](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fec40c280):

  TTJTDT-26: Add new feature flag for Trello-JSW crossflow

## 5.12.1

### Patch Changes

- [patch][557f47eceb](https://bitbucket.org/atlassian/atlassian-frontend/commits/557f47eceb):

  Update Bitbucket default href to "/dashboard/overview"

## 5.12.0

### Minor Changes

- [minor][c1919268fd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1919268fd):

  New export for atl-switcher experiment createApsMigrationAvailableProductsProvider

## 5.11.1

### Patch Changes

- [patch][0b3c3b20db](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b3c3b20db):

  Fix backwards compatibility for joinable sites

## 5.11.0

### Minor Changes

- [minor][b97e7c0f05](https://bitbucket.org/atlassian/atlassian-frontend/commits/b97e7c0f05):

  Added availableProductsDataProvider prop to jira-switcher

## 5.10.0

### Minor Changes

- [minor][f932a6ba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/f932a6ba75):

  Introduce isProductStoreInTrelloJSWFirstEnabled product recommendation feature flag to prioritize JSW in Discover

## 5.9.2

### Patch Changes

- [patch][d8f9ca9085](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8f9ca9085):

  Fix AA users not seeing the fox login prompt in atlassian-switcher

## 5.9.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar-group@5.0.4
  - @atlaskit/button@13.3.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/item@11.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/navigation@36.0.1
  - @atlaskit/page@11.0.12
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/type-helpers@4.2.3
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/atlassian-switcher-test-utils@0.3.1

## 5.9.0

### Minor Changes

- [minor][24d648d80e](https://bitbucket.org/atlassian/atlassian-frontend/commits/24d648d80e):

  Changing switcher Collaboration Graph request to contain a specific contextType

## 5.8.1

### Patch Changes

- [patch][e1c78e4afa](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1c78e4afa):

  Discover more products shouldn't show products that are joinable

## 5.8.0

### Minor Changes

- [minor][d9b3b4022c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9b3b4022c):

  Add a feature flag property to enable fetching recent containers via a collaboration graph endpoint

### Patch Changes

- Updated dependencies [d9b3b4022c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9b3b4022c):
  - @atlaskit/atlassian-switcher-test-utils@0.3.0

## 5.7.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/navigation@36.0.0
  - @atlaskit/form@7.1.1
  - @atlaskit/avatar-group@5.0.3
  - @atlaskit/logo@12.3.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/drawer@5.3.1
  - @atlaskit/inline-dialog@12.1.8
  - @atlaskit/textfield@3.1.5
  - @atlaskit/tooltip@15.2.2
  - @atlaskit/page@11.0.11

## 5.7.0

### Minor Changes

- [minor][7773f8ba8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7773f8ba8c):

  add-trello-products no longer injects trello item in available sites if trello was returned from the endpoint

## 5.6.2

### Patch Changes

- [patch][ed3b1a0ac1](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed3b1a0ac1):

  fix text overflow on trello signup banner

## 5.6.1

### Patch Changes

- [patch][b48f1b162e](https://bitbucket.org/atlassian/atlassian-frontend/commits/b48f1b162e):

  Fix: cloudId not included as attribute in Trello signup analytic events

## 5.6.0

### Minor Changes

- [minor][644b3691de](https://bitbucket.org/atlassian/atlassian-frontend/commits/644b3691de):

  Add support for pulling smartling translations

### Patch Changes

- Updated dependencies [644b3691de](https://bitbucket.org/atlassian/atlassian-frontend/commits/644b3691de):
  - @atlaskit/i18n-tools@0.6.4

## 5.5.1

### Patch Changes

- [patch][5daac1e2f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/5daac1e2f5):

  Add analytics context to Trello signup banner

## 5.5.0

### Minor Changes

- [minor][4f7f265efa](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f7f265efa):

  Atlassian Switcher - remove activity count based top site selection

### Patch Changes

- Updated dependencies [ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [4f7f265efa](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f7f265efa):
- Updated dependencies [99849f50b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/99849f50b2):
  - @atlaskit/form@7.1.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/atlassian-switcher-test-utils@0.2.1
  - @atlaskit/drawer@5.3.0

## 5.4.4

### Patch Changes

- [patch][5e760c70c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e760c70c1):

  Performance improvements for trello switcher

## 5.4.3

### Patch Changes

- [patch][aa66cbe608](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa66cbe608):

  Add multiLine support for descriptions in the Discover section of the switcher

## 5.4.2

### Patch Changes

- [patch][53d284e380](https://bitbucket.org/atlassian/atlassian-frontend/commits/53d284e380):

  Update Trello join site banner svg to fit multiple switcher sizes and clean up paddings

## 5.4.1

### Patch Changes

- [patch][5da47b0c7d](https://bitbucket.org/atlassian/atlassian-frontend/commits/5da47b0c7d):

  Prevent click propagation on toggleChildItemsVisibility - a patch for fixing the issue where switcher popover is being closed in horizontal nav when a user clicks on the sites dropdown

## 5.4.0

### Minor Changes

- [minor][e1318502c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1318502c5):

  Make sure non-AA mastered Trello users are logged in with the correct account when joining a site

## 5.3.2

### Patch Changes

- [patch][cc39ddca1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc39ddca1a):

  Fixing faulty directory reference

## 5.3.1

### Patch Changes

- [patch][a11b1ed371](https://bitbucket.org/atlassian/atlassian-frontend/commits/a11b1ed371):

  Handling 401s for the available products provider

## 5.3.0

### Minor Changes

- [minor][07cfb2d56b](https://bitbucket.org/atlassian/atlassian-frontend/commits/07cfb2d56b):

  Show 'Trello has new friends' banner to users who have joinable sites and don;t have any available products in Trello switcher

## 5.2.1

### Patch Changes

- [patch][6ac2142338](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ac2142338):

  Wiring up availableProductsDataProvider with Trello Switcher

## 5.2.0

### Minor Changes

- [minor][db4f7f25f2](https://bitbucket.org/atlassian/atlassian-frontend/commits/db4f7f25f2):

  Show sign up to join banner in Trello version of switcher

## 5.1.0

### Minor Changes

- [minor][f3e30019f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3e30019f0):

  CROSSFLOW-154 introduce new isDefaultEditionFreeExperimentEnabled prop to control copy changes in the discover section of the switcher

### Patch Changes

- Updated dependencies [f3e30019f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3e30019f0):
  - @atlaskit/atlassian-switcher-test-utils@0.2.0

## 5.0.0

### Major Changes

- [major][15239ee523](https://bitbucket.org/atlassian/atlassian-frontend/commits/15239ee523):

  Removed support for providing a transformer on default joinable sites fetch

## 4.11.0

### Minor Changes

- [minor][026ed7dadf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026ed7dadf):

  Export a new fetch function so clients can create a custom data provider for joinable sites section on the atlassian switcher

### Patch Changes

- Updated dependencies [026ed7dadf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026ed7dadf):
  - @atlaskit/atlassian-switcher-test-utils@0.1.1

## 4.10.1

### Patch Changes

- [patch][be97cdfc46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be97cdfc46):

  updated the expected joinable site response type definition and replaced product landing url logic

## 4.10.0

### Minor Changes

- [minor][4245cdfcc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4245cdfcc1):

  Update Switcher to include Trello specific design variation; Fix Switcher error screen to show up when critical requests are failed

## 4.9.1

### Patch Changes

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0
  - @atlaskit/field-text@9.0.14
  - @atlaskit/textfield@3.1.4
  - @atlaskit/avatar-group@5.0.2
  - @atlaskit/drawer@5.2.0
  - @atlaskit/item@10.2.0
  - @atlaskit/navigation@35.3.0
  - @atlaskit/inline-dialog@12.1.6

## 4.9.0

### Minor Changes

- [minor][54588e51df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54588e51df):

  Add recommendationsFeatureFlags to generic-switcher

### Patch Changes

- Updated dependencies [54588e51df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54588e51df):
  - @atlaskit/atlassian-switcher-test-utils@0.1.0

## 4.8.3

### Patch Changes

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any dynamic code it may break you. Refer to the [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies [d438b16fbc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d438b16fbc):

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/drawer@5.1.0
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0

## 4.8.2

### Patch Changes

- [patch][a5dd2b0188](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5dd2b0188):

  Fixed href for jira products and replaced `products` key with `users` for JoinableSite

## 4.8.1

### Patch Changes

- [patch][3478b25562](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3478b25562):

  moved Join section above Discover section

## 4.8.0

### Minor Changes

- [minor][28b8211352](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28b8211352):

  Allow joinable products to accept a callback. This is required to support migration flow from Trello.

## 4.7.1

### Patch Changes

- [patch][b284a6babd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b284a6babd):

  Pull fresh translations

## 4.7.0

### Minor Changes

- [minor][004b30d3d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/004b30d3d8):

  Added Join section, and its data provider, and added createProviderWithCustomFetchData method

## 4.6.9

### Patch Changes

- [patch][ea75c17b3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea75c17b3a):

  internal typescript fixes

## 4.6.8

### Patch Changes

- [patch][60d6636f32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60d6636f32):

  Fixing types for the switcher HOCs

## 4.6.7

### Patch Changes

- [patch][95d6aac929](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95d6aac929):

  Fix a bug where basic users are seeing Browse Marketplace link.

## 4.6.6

- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/i18n-tools@0.6.0
  - @atlaskit/analytics-namespaced-context@4.1.10

## 4.6.5

### Patch Changes

- [patch][fb43fc2e99](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb43fc2e99):

  PTC-2695: Add "reason" to the analytics event fired on provider failed events

## 4.6.4

### Patch Changes

- [patch][6bc87c7501](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bc87c7501):

  Split mockEndpoints into a separate package

## 4.6.3

### Patch Changes

- [patch][f07586ba0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f07586ba0e):

  Hide manage list link when custom links are disabled

## 4.6.2

### Patch Changes

- [patch][14e55631c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14e55631c6):

  Add groupIndex to switcher item analytics

## 4.6.1

### Patch Changes

- [patch][e6f7f7747f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6f7f7747f):

  Add Opsgenie to default list of product recommendations

## 4.6.0

### Minor Changes

- [minor][cd96adc5e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd96adc5e7):

  Add Try lozenge to first item in Discover section

## 4.5.4

### Patch Changes

- [patch][d904d4df82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d904d4df82):

  Use kebab case for switcher chunk names

## 4.5.3

### Patch Changes

- [patch][03e00bd3d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03e00bd3d7):

  Fix discover/x-sell work for Bitbucket cloud

## 4.5.2

### Patch Changes

- [patch][be38f90454](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be38f90454):

  Added support for additional languages: Thai, Turkish, Ukrainia and Vietnamese

## 4.5.1

### Patch Changes

- [patch][165f1cd0ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/165f1cd0ad):

  Refactor codes related to experimental Discover section in Atlassian Switcher.

## 4.5.0

### Minor Changes

- [minor][331053f02c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/331053f02c):

  Add experimental discover section to Atlassian Switcher.

## 4.4.0

### Minor Changes

- [minor][a2ae055500](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2ae055500):

  Update custom links to include link type (applink vs custom link) in analytics

## 4.3.0

### Minor Changes

- [minor][3920c7a2b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3920c7a2b9):

  Update translation for atlassian-switcher package

## 4.2.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 4.2.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 4.2.1

### Patch Changes

- [patch][8ec4a18b58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ec4a18b58):

  Updating examples

## 4.2.0

### Minor Changes

- [minor][173ada19f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/173ada19f7):

  yRemove People link from switcher

## 4.1.0

### Minor Changes

- [minor][42afbf2163](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42afbf2163):

  Only show try links if the product is not provisioned for any of the available sites

## 4.0.0

### Major Changes

- [major][deff626951](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deff626951):

  Remove enableUserCentricProducts feature flag, enable account centric switcher by default

## 3.31.3

### Patch Changes

- [patch][b72b5b773c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b72b5b773c):

  Removed ts-ignore from the code

## 3.31.2

### Patch Changes

- [patch][fa1f938f76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa1f938f76):

  [Bug fix] Emcee link was not able to capture source param, this release will fix that

## 3.31.1

### Patch Changes

- [patch][3ea2b986e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ea2b986e1):

  1. Change Discover more label to More Atlassian Products 2. Change Browse apps label to Browse Marketplace apps

## 3.31.0

### Minor Changes

- [minor][33fc071f60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33fc071f60):

  Remove the top item variation, set it to current site

## 3.30.1

### Patch Changes

- [patch][712fe8c503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/712fe8c503):

  Only show people link in Jira and Confluence because it's not supported elsewhere

## 3.30.0

### Minor Changes

- [minor][45cba7159a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45cba7159a):

  Allow consumers to specify a custom provider for available products"

## 3.29.0

### Minor Changes

- [minor][84c5898593](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84c5898593):

  Add FE support for Trello and Statuspage

## 3.28.2

### Patch Changes

- [patch][7c4b42ed6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c4b42ed6b):

  yUpdate siwtcher documentation

## 3.28.1

### Patch Changes

- [patch][a9bf2f8d31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9bf2f8d31):

  Adding vanilla wrapper for Atlassian switcher

## 3.28.0

### Minor Changes

- [minor][9397a40abf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9397a40abf):

  Added isEmceeLinkEnabled prop to enable Embedded Marketplace link with in the product

## 3.27.1

### Patch Changes

- [patch][5129434a9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5129434a9b):

  Fix examples when Grid was used without Page

## 3.27.0

### Minor Changes

- [minor][f1b05c87ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1b05c87ab):

  Lazy load underlying switcher component to avoid loading unnecessary code

## 3.26.0

### Minor Changes

- [minor][d1997bfbc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1997bfbc2):

  Fixed an edge case where viewed events will be emitted prematurely because we're using the incorrect provider to check for hasLoaded flag

## 3.25.1

### Patch Changes

- [patch][4d8468b055](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d8468b055):

  Fix UI alignment between toggle and top level item

## 3.25.0

### Minor Changes

- [minor][03a905d43e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03a905d43e):

  FIND-133: Add support for theming

## 3.24.0

### Minor Changes

- [minor][5f681ceea7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f681ceea7):

  Add a tooltip dependency and hide tooltip on mouse down event

## 3.23.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.23.1

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 3.23.0

### Minor Changes

- [minor][c0f0ae12ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0f0ae12ce):

  yShow site avatars on switcher child items

## 3.22.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.22.0

### Minor Changes

- [minor][66d7234386](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66d7234386):

  Bumped up item version to pick up themable item width support

## 3.21.0

### Minor Changes

- [minor][0e43bd0082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e43bd0082):

  Use with width theming property now provided by Item

## 3.20.1

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

## 3.20.0

### Minor Changes

- [minor][a055fbda01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a055fbda01):

  yRemove description from items that don't have multiple sites

## 3.19.0

### Minor Changes

- [minor][d700e692be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d700e692be):

  Fix ellipsis on item with dropdown

## 3.18.0

### Minor Changes

- [minor][bdbe90c48b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdbe90c48b):

  FIND-133: Allow switcher to be rendered standalone (outside a drawer)

## 3.17.1

### Patch Changes

- [patch][04388187f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04388187f4):

  Added docs and details about i18n

## 3.17.0

### Minor Changes

- [minor][520e77bd9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/520e77bd9c):

  Fixed analytics bug for A/B testing product sorting algorithm for account-centric products

## 3.16.0

### Minor Changes

- [minor][74501ba0ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74501ba0ea):

  Accept a feature flag to AB test which site to show at the top of the product (efault being the current site, and variation being the most frequently visited)

## 3.15.0

### Minor Changes

- [minor][aac9ae7ee8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aac9ae7ee8):

  Licensed links in switcher are now grouped by product, with a dropdown that containing individual site options for sited products

## 3.14.0

### Minor Changes

- [minor][d4e8e68bf1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4e8e68bf1):

  Added adminLinks to switcher viewed event, so we could know when we show try discover more links to users. Fixed suggestedProductLinks that used to be empty on mount due to race conditions"

## 3.13.0

### Minor Changes

- [minor][43a5cd1e3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43a5cd1e3c):

  Adding isDiscoverMoreForEveryoneEnabled and onDiscoverMoreClicked props onto the Atlassian Switcher API

## 3.12.0

### Minor Changes

- [minor][6c449d7c77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c449d7c77):

  Also made cloud ID optional in the prefetch trigger

## 3.11.0

### Minor Changes

- [minor][f0eeeb4f8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0eeeb4f8a):

  Cloud ID is now an optional props. When Cloud ID is not provided, sections like recent containers, admin links, etc will be skipped and not rendered

## 3.10.0

### Minor Changes

- [minor][fee77d9245](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fee77d9245):

  Added an optional parameter to allow an option to disable custom links in Jira and Confluence switcher

## 3.9.0

### Minor Changes

- [minor][7bc30c4cce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bc30c4cce):

  Added a new prop to disable recent containers

## 3.8.2

- Updated dependencies [75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):
  - @atlaskit/drawer@5.0.0

## 3.8.1

### Patch Changes

- [patch][91ec1329f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91ec1329f7):

  Changing flag key for JSW to Opsgenie experiment

## 3.8.0

### Minor Changes

- [minor][3e25438208](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e25438208):

  Enables AtlassianSwitcher to receive recommendationFeatureFlags which is then passed to the RecommendationProvider to be parsed and handle output based on feature flag values.

## 3.7.0

### Minor Changes

- [minor][5ac638ae2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ac638ae2e):

  Revert the change that filteres the current product from the list of products in switcher because that makes filtering too eager

## 3.6.0

### Minor Changes

- [minor][f5d0b1aef8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5d0b1aef8):

  Removed the site-product combination the user is on from the switcher options

## 3.5.1

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 3.5.0

### Minor Changes

- [minor][a6dcd23804](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6dcd23804):

  Add a new provider to suggest a list of recommended products, and refactor existing logic

## 3.4.6

### Patch Changes

- [patch][7016422921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7016422921):

  Passed in empty object in order to get the correct cache key

## 3.4.5

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 3.4.4

### Patch Changes

- [patch][3371cb9ba0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3371cb9ba0):

  Updated Atlassian Switcher prefecth trigger to accept enableUserCentricProducts feature flag

## 3.4.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 3.4.2

### Patch Changes

- [patch][4344114172](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4344114172):

  Update analytics event to include products shown when viewed.

## 3.4.1

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

## 3.4.0

### Minor Changes

- [minor][986a1cc91d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/986a1cc91d):

  Enable prefetching for available-products endpoint

## 3.3.0

### Minor Changes

- [minor][b81d931ee3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81d931ee3):

  Added new OpsGenie logo, fixed the gradient for the StatusPage logo, and refactored atlassian-switcher to use the new logos

## 3.2.0

### Minor Changes

- [minor][85291ccc2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85291ccc2b):

  Infer xflow enabled flag from props

## 3.1.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/drawer@4.2.1
  - @atlaskit/item@10.0.5
  - @atlaskit/navigation@35.1.8
  - @atlaskit/icon@19.0.0

## 3.1.0

### Minor Changes

- [minor][af2d3ce4f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af2d3ce4f0):

  Fire a ui viewed atlassianSwitcher event on mount

## 3.0.0

### Major Changes

- [major][2258719b5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2258719b5f):

  Add enableUserCentricProducts to Switcher. Remove enableExpandLink.

  The expand link is now displayed when user-centric mode is enabled,
  and the amount of products to display exceeds the threshold of 5.

  To upgrade: Delete any references to enableExpandLink/experimental_enableExpandLink

## 2.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/drawer@4.1.3
  - @atlaskit/item@10.0.2
  - @atlaskit/navigation@35.1.5
  - @atlaskit/icon@18.0.0

## 2.1.0

- [minor][caa9ae9dbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/caa9ae9dbf):

  - Split Jira link into individual product links in Atlassian Switcher

## 2.0.1

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/item@10.0.1
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 2.0.0

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/icon@17.0.2
  - @atlaskit/navigation@35.1.1
  - @atlaskit/logo@12.0.0

## 1.1.1

- [patch][d216253463](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d216253463):

  - Fix trigger xflow invoked with incorrect arguments

## 1.1.0

- [minor][b3381f5c07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3381f5c07):

  - Add domain to analytics

## 1.0.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/analytics-gas-types@4.0.4
  - @atlaskit/docs@8.0.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/drawer@4.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/item@10.0.0
  - @atlaskit/logo@11.0.0
  - @atlaskit/lozenge@8.0.0
  - @atlaskit/navigation@35.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/type-helpers@4.0.0
  - @atlaskit/analytics-namespaced-context@4.0.0

## 0.5.0

- [minor][59024ff4c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59024ff4c5):

  - Always include Jira Service Desk cross sell link if the instance does not have Jira Service Desk license.

## 0.4.8

- [patch][7f9fd0ddfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f9fd0ddfc):

  - Improve error messages and analytics

## 0.4.7

- [patch][3eeb2ccf51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3eeb2ccf51):

  - Update translations

## 0.4.6

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 0.4.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/drawer@3.0.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/logo@10.0.4
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/navigation@34.0.4
  - @atlaskit/theme@8.1.7

## 0.4.4

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 0.4.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/drawer@3.0.6
  - @atlaskit/icon@16.0.8
  - @atlaskit/logo@10.0.3
  - @atlaskit/navigation@34.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 0.4.1

- [patch][bcb3d443fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bcb3d443fc):

  - Addressing QA fixes

## 0.4.0

- [minor][e36f791fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e36f791fd6):

  - Improve types

## 0.3.6

- [patch][db2a7ffde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db2a7ffde6):

  - Fixing recent containers bug

## 0.3.5

- [patch][9d6f8d516a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d6f8d516a):

  - Adding expand link support to Atlassian Switcher

## 0.3.4

- [patch][571ad59bb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/571ad59bb7):

  - Pacakge version and feature flag analytics

## 0.3.3

- [patch][9cf7af0d03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cf7af0d03):

  - Data provider analytics

## 0.3.2

- [patch][aacc698f07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aacc698f07):

  - Adds an analytics event to track atlassian switcher dissmisals using the triggerXFlow callback

## 0.3.1

- [patch][57f774683f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57f774683f):

  - Move @atlaskit/logo to peer dependencies

## 0.3.0

- [minor][68443e3d6f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68443e3d6f):

  - Opsgenie app switching support

## 0.2.3

- [patch][a041506c4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a041506c4d):

  - Fixes a bug in global-navigation caused due to a missing asset in atlassian-switcher

## 0.2.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.2.1

- [patch][94acafec27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94acafec27):

  - Adds the error page according to the designs.

## 0.2.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.1.4

- [patch][b08df363b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b08df363b7):

  - Add atlassian-switcher prefetch trigger in global-navigation

## 0.1.3

- [patch][269cd93118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/269cd93118):

  - Progressive loading and prefetch primitives

## 0.1.2

- [patch][6ca66fceac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ca66fceac):

  - Add enableSplitJira to allow multiple jira link displayed if there are jira products

## 0.1.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/drawer@3.0.0
  - @atlaskit/item@9.0.0
  - @atlaskit/logo@10.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/navigation@34.0.0
  - @atlaskit/theme@8.0.0

## 0.1.0

- [minor][6ee7b60c4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ee7b60c4a):

  - Create generic switcher for satellite products

## 0.0.9

- [patch][e7fa9e1308](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7fa9e1308):

  - Fixing icon imports

## 0.0.8

- [patch][ebfdf1e915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfdf1e915):

  - Update sections and grouping according to updated designs

## 0.0.7

- [patch][8a70a0db9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a70a0db9f):

  - SSR compatibility fix

## 0.0.6

- [patch][3437ac9990](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3437ac9990):

  - Firing events according to minimum event spec

## 0.0.5

- [patch][9184dbf08b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9184dbf08b):

  - Fixing package.json issue with atlassian-switcher

## 0.0.4

- [patch][95d9a94bd0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95d9a94bd0):

  - Adding root index for atlassian-switcher

## 0.0.3

- [patch][b56ca0131d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b56ca0131d):

  - Attempting to fix flow issue where atlassian-switcher is not recognized

## 0.0.2

- [patch][235f937d66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/235f937d66):

  - Initial package release

## 0.0.1

- [patch][25921b9e50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25921b9e50):

  - Adding AtlassianSwitcher component
