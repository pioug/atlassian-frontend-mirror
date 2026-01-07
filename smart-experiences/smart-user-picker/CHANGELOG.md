# @atlassian/smart-user-picker

## 8.8.0

### Minor Changes

- [`386987f274ff5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/386987f274ff5) -
  Add support for `restrictTo` prop to filter recommendations by user IDs and group IDs. This allows
  filtering down results based on specific groups or users in a site.

  **New prop:** `restrictTo?: { userIds?: string[], groupIds?: string[] }`

  This prop is passed directly to the URS recommendations endpoint's `searchQuery.restrictTo` field,
  enabling you to constrain recommendations to a specific set of users and/or groups.

  **Feature gate:** `smart-user-picker-restrict-to-gate` - The prop is only forwarded to the backend
  when this feature gate is enabled.

## 8.7.0

### Minor Changes

- [`ae3f597598ae8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae3f597598ae8) -
  Added prop to toggle the ability to return only verified teams. Only applies when includeTeams is
  true.

## 8.6.0

### Minor Changes

- [`0d41d4c92fe89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d41d4c92fe89) -
  [ux] Added `fetchOptions` prop to SmartUserPicker to support custom option fetching. When
  provided, this function will be called instead of the default recommendation API, allowing
  consumers to override the default fetching behavior with their own implementation.

## 8.5.0

### Minor Changes

- [`bef521afc400f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bef521afc400f) -
  Adds prop to set user picker & smart user picker as open/closed

### Patch Changes

- Updated dependencies

## 8.4.1

### Patch Changes

- [`768acbc14a366`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/768acbc14a366) -
  Update smart-user-picker docs
- Updated dependencies

## 8.4.0

### Minor Changes

- [`f680d15e02105`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f680d15e02105) -
  Move from customQuery to searchEmail argument in URS query

## 8.3.1

### Patch Changes

- [`56ac0cf74b37d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56ac0cf74b37d) -
  Migrated teams assets to new service

## 8.3.0

### Minor Changes

- [`be2f98085fa9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be2f98085fa9f) -
  [ux] Introduce additional email props to smart user picker (displayEmailInByline,
  enableEmailSearch, allowEmailSelectionWhenEmailMatched) and one type adjustment to user picker

### Patch Changes

- Updated dependencies

## 8.2.1

### Patch Changes

- [`411addc8f1770`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/411addc8f1770) -
  Migrate elements, search, smart-experiences, web-platform, forge, jql and bitbucket pkgs to use
  i18n NPM pkgs from Traduki
- Updated dependencies

## 8.2.0

### Minor Changes

- [`272ab9229ad98`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/272ab9229ad98) -
  add additional userResolvers prop to support adding additional contacts to existing user
  recommendations

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [`101f35dfba2ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/101f35dfba2ae) -
  add an optional second param to transformOptions to make the query string available to
  transformOptions callbacks, similar to filterOptions

## 8.0.1

### Patch Changes

- [#139492](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139492)
  [`27030518ad18e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27030518ad18e) -
  The SmartUserPicker currently calls the teams v3 api which has been deprecated since December,
  resulting in 404 api calls. This change has updated the api from v3 to v4 so that api calls can be
  made and data successfull retrieved.

## 8.0.0

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

## 7.0.1

### Patch Changes

- [#115319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115319)
  [`d3a55e50e9513`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3a55e50e9513) -
  QS-5272 migrate atlassian smart user picker to r18 concurrent
- [#115319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115319)
  [`b0c914f8d10d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b0c914f8d10d7) -
  QS-5272 runReact18 true

## 7.0.0

### Major Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 6.11.2

### Patch Changes

- [#166035](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166035)
  [`2c941c7061475`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c941c7061475) -
  Update documenation to point to the Search Experiences team

## 6.11.1

### Patch Changes

- [#156181](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156181)
  [`48acf4f55ef4a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48acf4f55ef4a) -
  Export isGroup & use it in share analytics

## 6.11.0

### Minor Changes

- [#153007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153007)
  [`1c28c3db19101`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c28c3db19101) -
  Show verified icon for teams in user picker

### Patch Changes

- Updated dependencies

## 6.10.3

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select

## 6.10.2

### Patch Changes

- Updated dependencies

## 6.10.1

### Patch Changes

- Updated dependencies

## 6.10.0

### Minor Changes

- [#121686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121686)
  [`806f67cf6655e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/806f67cf6655e) -
  [ux] passing an optional productAttributes

## 6.9.4

### Patch Changes

- [#120040](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120040)
  [`b05a6549cb562`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b05a6549cb562) -
  Showcase proper a11y usage in the main example of Smart User Picker, improve documentation

## 6.9.3

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 6.9.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.9.1

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 6.9.0

### Minor Changes

- [#76695](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76695)
  [`815a632ae2c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/815a632ae2c2) -
  export isExternalUser

## 6.8.0

### Minor Changes

- [#73914](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73914)
  [`7acf8bb50dea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7acf8bb50dea) -
  Added support for external users being returned by the user-recommendations service. Non-licensed
  users will have a `type` of `external_user` and have `isExternal` set to `true`. A new prop
  `overrideByline` was also added to allow for the byline to be customised as SmartUserPicker does
  not currently set any bylines on options.

### Patch Changes

- Updated dependencies

## 6.7.0

### Minor Changes

- [#70375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70375)
  [`14ab45c8b78b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14ab45c8b78b) -
  Adding tooltip to option shown on hover

### Patch Changes

- Updated dependencies

## 6.6.0

### Minor Changes

- [#68110](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68110)
  [`8f8a81b663ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f8a81b663ca) -
  [ux] Introduced includeNonLicensedUsers prop to request including non licensed users from the
  recommendation API.

## 6.5.0

### Minor Changes

- [#68878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68878)
  [`6c49996cd842`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c49996cd842) -
  update user recommendations api to return user's title

### Patch Changes

- Updated dependencies

## 6.4.3

### Patch Changes

- [#67296](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67296)
  [`8b0a2a9e0969`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b0a2a9e0969) -
  This package has been added to the Jira push model.

## 6.4.2

### Patch Changes

- [#60464](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60464)
  [`a30f9a5f3e0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a30f9a5f3e0d) -
  Removing unused dependencies

## 6.4.1

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 6.4.0

### Minor Changes

- [#59712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59712)
  [`229363c1c1b3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/229363c1c1b3) -
  Add required attribute to the user-picker components and add its consumption in the share
  component.

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [#39115](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39115)
  [`38c3ed63070`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38c3ed63070) - Export
  sub-components of Option

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [#38945](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38945)
  [`406273e2aa8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/406273e2aa8) - Export
  Option component from /option entrypoint

### Patch Changes

- Updated dependencies

## 6.1.6

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 6.1.5

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 6.1.4

### Patch Changes

- [#37101](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37101)
  [`78f0d4b929c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78f0d4b929c) - [ux]
  Color of guest lozenges in the smartUserPicker changed from purple ('new') to grey ('default')

## 6.1.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 6.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 6.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 6.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 6.0.7

### Patch Changes

- [#31718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31718)
  [`365dc58e26b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/365dc58e26b) - UFO
  failures for options shown will now only be recorded when the status code is a 5xx

## 6.0.6

### Patch Changes

- Updated dependencies

## 6.0.5

### Patch Changes

- [#29737](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29737)
  [`6a4f3d27fee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a4f3d27fee) - Add
  contextType to UFO events for options rendered

## 6.0.4

### Patch Changes

- Updated dependencies

## 6.0.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 6.0.2

### Patch Changes

- [#24705](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24705)
  [`44dcc64d558`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44dcc64d558) - Updated
  dependencies

## 6.0.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 6.0.0

### Major Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`be2c0ae7ba4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be2c0ae7ba4) - The
  `setSmartUserPickerEnv` export has been removed. This should be a no-op upgrade as it was only
  used internally for test/example files in other packages.

## 5.1.3

### Patch Changes

- [#23257](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23257)
  [`977329d177c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/977329d177c) - Import
  version json and use attributes rather than importing directly

## 5.1.2

### Patch Changes

- [#23075](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23075)
  [`7536b86964b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7536b86964b) - Update
  context key for URS from orgId to organizationId

## 5.1.1

### Patch Changes

- [#22015](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22015)
  [`ff97c74b6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff97c74b6f0) - Add
  TeamMember as export from user-picker

## 5.1.0

### Minor Changes

- [#21796](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21796)
  [`cc40ab95bd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc40ab95bd4) - Adds a
  list of team members under OptionData for Teams

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 5.0.4

### Patch Changes

- [#20467](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20467)
  [`f805f47c19a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f805f47c19a) - Smart
  User Picker now catches errors emitted from the optional `onError` fallback data source, and also
  now only sends a UFO failure event if the primary data source (URS) fails AND the `onError` prop
  either fails or is not provided.

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [#18817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18817)
  [`6fc78303271`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fc78303271) - UFO
  measurement of how long it takes the list of users to be shown

## 5.0.1

### Patch Changes

- [#19129](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19129)
  [`0850fe46fc8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0850fe46fc8) - Track
  mount errors in Smart User Picker

## 5.0.0

### Major Changes

- [#19144](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19144)
  [`67ca990e9cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67ca990e9cf) - Changing
  the URL for default value hydration from /graphql to /api/gateway/graphql

## 4.0.1

### Patch Changes

- [#19078](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19078)
  [`73bf59c717d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73bf59c717d) - update
  dependency on @atlaskit/user-picker to ensure defaultValue fix is applied

## 4.0.0

### Major Changes

- [#18930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18930)
  [`5df1ae17438`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5df1ae17438) -
  @atlassian/smart-user-picker will now be made public and renamed @atlaskit/smart-user-picker to
  provide a 1-1 replacement for @atlaskit/user-picker/smart-user-picker (UR-3417).

## 3.1.0

### Minor Changes

- [#18908](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18908)
  [`d2a8de20d08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2a8de20d08) - Add
  support in SmartUserPicker for org id for team search

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- [#18561](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18561)
  [`e4109a66653`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4109a66653) - Smart
  user picker initial render performance is now measured using @atlassian/ufo

## 3.0.4

### Patch Changes

- [#18303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18303)
  [`7f48efc8487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f48efc8487) - Use
  baseUrl prop in default user value hydration query

## 3.0.3

### Patch Changes

- [#18056](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18056)
  [`405d07e48fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/405d07e48fa) - updating
  props doc

## 3.0.2

### Patch Changes

- [#17940](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17940)
  [`9fd6117d5e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd6117d5e4) - Fix
  behavior of base URL so that API calls use baseUrl as base url

## 3.0.1

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 3.0.0

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

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- [#15694](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15694)
  [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal
  upgrade of memoize-one to 6.0.0

## 2.1.3

### Patch Changes

- [#15454](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15454)
  [`a92e3bdb515`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a92e3bdb515) - Relaxed
  product enum typing to take in any string

## 2.1.2

### Patch Changes

- [#15171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15171)
  [`93c8a8f0bd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93c8a8f0bd5) - Expose
  types from @atlaskit/user-picker from smart-user-picker

## 2.1.1

### Patch Changes

- [#14494](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14494)
  [`4ac918aad80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ac918aad80) - Added
  helper documentation for easier onboarding onto Atlaskit Editor

## 2.1.0

### Minor Changes

- [#14007](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14007)
  [`674d31d565e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/674d31d565e) - Added
  default value hydration for non-jira/conf products, team default value hydration, and changed
  default debounce time to 150ms

## 2.0.0

### Major Changes

- [#13189](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13189)
  [`ccda387eede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccda387eede) -
  smart-user-picker extracted out from user-picker to smart-user-picker package. smart-user-picker
  in user-picker is now deprecated but still backwards compatible. Please use
  @atlassian/smart-user-picker for smart-user-picker.

### Patch Changes

- [#13476](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13476)
  [`5ac7831fc59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ac7831fc59) - updating
  UP dependency
- Updated dependencies

## 1.0.1

### Patch Changes

- [#12373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12373)
  [`869e1fdef2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/869e1fdef2f) - [ux]
  Prioritize filterOptions prop over onEmpty. Now, filterOptions is called AFTER onEmpty is applied
  to URS suggestions. This means that SUP can show empty results if filterOptions filters out all
  results. This fixes a bug where updated filterOptions does not get applied to suggestions.
