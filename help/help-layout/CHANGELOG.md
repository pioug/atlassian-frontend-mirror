# @atlaskit/help-layout

## 6.3.11

### Patch Changes

- [`bc7821de4d118`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc7821de4d118) -
  Sorted type and interface props to improve Atlaskit docs

## 6.3.10

### Patch Changes

- Updated dependencies

## 6.3.9

### Patch Changes

- [`ed0c6e0bb869f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ed0c6e0bb869f) -
  Remove references to deprecated @atlaskit/navigation

## 6.3.8

### Patch Changes

- Updated dependencies

## 6.3.7

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 6.3.6

### Patch Changes

- Updated dependencies

## 6.3.5

### Patch Changes

- Updated dependencies

## 6.3.4

### Patch Changes

- Updated dependencies

## 6.3.3

### Patch Changes

- Updated dependencies

## 6.3.2

### Patch Changes

- Updated dependencies

## 6.3.1

### Patch Changes

- [#160530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160530)
  [`3d97095c489a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d97095c489a5) -
  Internal change to align styling solutions.
- Updated dependencies

## 6.3.0

### Minor Changes

- [#157993](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157993)
  [`c12accd6f87ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c12accd6f87ad) -
  [ux] Adding back button for ai chat history

### Patch Changes

- Updated dependencies

## 6.2.3

### Patch Changes

- [#154681](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154681)
  [`fb0a99c10712e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb0a99c10712e) -
  Renamed contentRender prop for AI enabled feature

## 6.2.2

### Patch Changes

- [#153983](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153983)
  [`f9c637ec4160b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9c637ec4160b) -
  [ux] UI bug fixes when AI enabled

## 6.2.1

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [#150389](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150389)
  [`c80e7098610aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c80e7098610aa) -
  [ux] Adding dynamic header for side tab experience

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [#148345](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148345)
  [`dca737c2952f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dca737c2952f7) -
  [ux] Enabling side tab view via sideNavTabs prop

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- [#144736](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144736)
  [`ff74b78729adb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff74b78729adb) -
  Internal change to move to Compiled CSS-in-JS styling.

## 6.0.1

### Patch Changes

- [#143181](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143181)
  [`7f74322e75b83`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f74322e75b83) -
  Removed `styled-components` from peer dependencies.

## 6.0.0

### Major Changes

- [#142027](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142027)
  [`92f1353dc03cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92f1353dc03cc) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/help-layout`, you will need to ensure that
  your bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in
  support for `.css` imports, so you may not need to do anything. If you are using a different
  bundler, please refer to the documentation for that bundler to understand how to handle `.css`
  imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 5.0.0

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

## 4.5.2

### Patch Changes

- Updated dependencies

## 4.5.1

### Patch Changes

- Updated dependencies

## 4.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 4.4.7

### Patch Changes

- [#107045](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107045)
  [`3c95bcb3b29aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c95bcb3b29aa) -
  [ux] refactoring placement of title and close button in IPH header around the isAIEnabled prop

## 4.4.6

### Patch Changes

- [#105756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105756)
  [`1151bcad0025a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1151bcad0025a) -
  [ux] refactoring placement of footer in IPH

## 4.4.5

### Patch Changes

- Updated dependencies

## 4.4.4

### Patch Changes

- [#98234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98234)
  [`98766713e142d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/98766713e142d) -
  Internal changes to typography.

## 4.4.3

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 4.4.2

### Patch Changes

- Updated dependencies

## 4.4.1

### Patch Changes

- Updated dependencies

## 4.4.0

### Minor Changes

- [#163604](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163604)
  [`cfcfc83a1f870`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cfcfc83a1f870) -
  Enable new icons behind a feature flag.

## 4.3.8

### Patch Changes

- [#153797](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153797)
  [`413eaa2995ab6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/413eaa2995ab6) -
  [ux] Increased header title to h1 for better accessibility
- Updated dependencies

## 4.3.7

### Patch Changes

- Updated dependencies

## 4.3.6

### Patch Changes

- [#144706](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144706)
  [`8b74177bff7a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b74177bff7a7) -
  Updated to React 18

## 4.3.5

### Patch Changes

- Updated dependencies

## 4.3.4

### Patch Changes

- Updated dependencies

## 4.3.3

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- Updated dependencies

## 4.3.1

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#107776](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107776)
  [`414da12cd107`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/414da12cd107) -
  Use header elements for acccessibility

## 4.2.18

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 4.2.17

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 4.2.16

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 4.2.15

### Patch Changes

- [#77102](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77102)
  [`b93a56e5ee66`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b93a56e5ee66) -
  Internal change to enforce token usage for spacing properties. There is no expected visual or
  behaviour change.

## 4.2.14

### Patch Changes

- [#72218](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72218)
  [`de9ef5e93a22`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de9ef5e93a22) -
  [ux] Add accessible label to close button for help panel

## 4.2.13

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 4.2.12

### Patch Changes

- [#63677](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63677)
  [`f320c8ce5039`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f320c8ce5039) -
  This package has been added to the Jira push model.

## 4.2.11

### Patch Changes

- Updated dependencies

## 4.2.10

### Patch Changes

- [#57178](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57178)
  [`018d8853290a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/018d8853290a) -
  Upgrade Emotion v10 (@emotion/core) to Emotion v11 (@emotion/react). No behaviour change expected.

## 4.2.9

### Patch Changes

- Updated dependencies

## 4.2.8

### Patch Changes

- Updated dependencies

## 4.2.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 4.2.6

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 4.2.5

### Patch Changes

- [#35450](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35450)
  [`7bdb050c04e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7bdb050c04e) - Internal
  change to use space tokens for spacing properties. There is no visual change.

## 4.2.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 4.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.2.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.2.1

### Patch Changes

- [#33218](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33218)
  [`7e051bad115`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e051bad115) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 4.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 4.1.15

### Patch Changes

- [#31643](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31643)
  [`ad5cbfa5a71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad5cbfa5a71) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 4.1.14

### Patch Changes

- Updated dependencies

## 4.1.13

### Patch Changes

- Updated dependencies

## 4.1.12

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 4.1.11

### Patch Changes

- Updated dependencies

## 4.1.10

### Patch Changes

- Updated dependencies

## 4.1.9

### Patch Changes

- Updated dependencies

## 4.1.8

### Patch Changes

- [#26424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26424)
  [`0c19f354255`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c19f354255) -
  Consolidate In Product Help & Self-Help Experiences ownership

## 4.1.7

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.1.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.1.5

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 4.1.3

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#19089](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19089)
  [`b03b488246c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b03b488246c) - [ux]
  Added new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha).

  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark
  mode users should expect no visual or breaking changes.

## 4.0.1

### Patch Changes

- [#16511](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16511)
  [`78c9f070230`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78c9f070230) - Bump
  algoliasearch version from ^3.33.0 to ^3.35.1. In @atlaskit/help we updated the example 3 and
  moved Algolia API related code to it's own react hook

## 4.0.0

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

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#13328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13328)
  [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update
  the team information in the packages maintained by the In Product Help team

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#10051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10051)
  [`cbed2edbd0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbed2edbd0c) - [ux]
  Ranamed prop "title" to "headerTitle". Added the prop "headerContent" where we can pass a
  React.node to render underneath the header title

## 2.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.0.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#5164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5164)
  [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo
  analytics-next file restructure to allow external ts definitions to continue working

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

- [#3711](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3711)
  [`3f24892368`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f24892368) - Added
  help-layout component to the atlaskit library
