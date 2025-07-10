# @atlaskit/right-side-panel

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#145839](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145839)
  [`275b54ae946ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/275b54ae946ff) -
  [ux] Adding width prop

## 3.0.1

### Patch Changes

- [#144736](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144736)
  [`ff74b78729adb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff74b78729adb) -
  Internal change to move to Compiled CSS-in-JS styling.

## 3.0.0

### Major Changes

- [#142581](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142581)
  [`94d88942d9b95`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94d88942d9b95) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/right-side-panel`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 2.0.0

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

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.2.15

### Patch Changes

- Updated dependencies

## 1.2.14

### Patch Changes

- Updated dependencies

## 1.2.13

### Patch Changes

- Updated dependencies

## 1.2.12

### Patch Changes

- [#144706](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144706)
  [`8b74177bff7a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b74177bff7a7) -
  Updated to React 18

## 1.2.11

### Patch Changes

- Updated dependencies

## 1.2.10

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 1.2.9

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.2.8

### Patch Changes

- [#80509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80509)
  [`fcf7481f594f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcf7481f594f) -
  Upgrade dependency of `@emotion/styled` to version 11

## 1.2.7

### Patch Changes

- [#72083](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72083)
  [`4f8e79eb0b7a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f8e79eb0b7a) -
  Enrolling @atlaskit/right-side-panel to push model in JFE.

## 1.2.6

### Patch Changes

- [#67949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67949)
  [`4ceb213f9313`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ceb213f9313) -
  Migrate packages to use declarative entry points
- Updated dependencies

## 1.2.5

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 1.2.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 1.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.2.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.2.1

### Patch Changes

- [#33218](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33218)
  [`7e051bad115`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e051bad115) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 1.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.1.14

### Patch Changes

- [#31643](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31643)
  [`ad5cbfa5a71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad5cbfa5a71) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 1.1.13

### Patch Changes

- Updated dependencies

## 1.1.12

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 1.1.11

### Patch Changes

- Updated dependencies

## 1.1.10

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- [#26424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26424)
  [`0c19f354255`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c19f354255) -
  Consolidate In Product Help & Self-Help Experiences ownership

## 1.1.7

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.1.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#19074](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19074)
  [`aa70f95a3de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa70f95a3de) - [ux]
  Added new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha).

  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark
  mode users should expect no visual or breaking changes.

## 1.0.0

### Major Changes

- [#14810](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14810)
  [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) -
  ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including
  breaking API changes, types and tests in atlassian-frontend packages

  What changed: Upgraded our react-intl support from ^2.6.0 to ^5.18.1. This means editor packages
  now rely on consumers installing ^5.18.1, otherwise editor usage of react-intl will mismatch with
  actual installed react-intl APIs. Why change was made: As part of a coordinated upgrade effort
  across AF packages, as react-intl v2 is quite dated. How consumer should update their code: Ensure
  react-intl ^5.18.1 is installed in consuming applications.

  Upgrade guide: To consume atlassian-frontend packages that use react-intl5 setup a second provider
  for the new version, using an npm alias

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

## 0.4.6

### Patch Changes

- Updated dependencies

## 0.4.5

### Patch Changes

- [#13328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13328)
  [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update
  the team information in the packages maintained by the In Product Help team

## 0.4.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.4.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.4.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.3.6

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 0.3.5

### Patch Changes

- [#2430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2430)
  [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all
  packages that are used by confluence that have a broken es2019 dist

## 0.3.4

### Patch Changes

- [#2099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2099)
  [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add
  missing tslib dependency

## 0.3.3

### Patch Changes

- [patch][f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  Remove unused dependencies

## 0.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/navigation@36.0.1
  - @atlaskit/page@11.0.12
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1

## 0.3.1

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/navigation@36.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/page@11.0.11

## 0.3.0

### Minor Changes

- [minor][49c89962de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c89962de):

  right-side-panel:\* added props skipAnimationOnMount, mountOnEnter, unmountOnExit,
  disableEnterAnimation, disableExitAnimation

## 0.2.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.2.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 0.2.0

### Minor Changes

- [minor][617591dd61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/617591dd61):

  Added props onOpenAnimationFinished and onCloseAnimationFinished to execute function once the
  open/close animation finished

## 0.1.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 0.1.7

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 0.1.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.1.5

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 0.1.4

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 0.1.3

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 0.1.2

### Patch Changes

- [patch][06940860ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06940860ea):

  Added unit test

## 0.1.1

### Patch Changes

- [patch][a19a3616a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a19a3616a6):

  Update examples
