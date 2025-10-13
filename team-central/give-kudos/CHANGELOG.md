# @atlassian/give-kudos

## 4.4.1

### Patch Changes

- Updated dependencies

## 4.4.0

### Minor Changes

- [`717fa73957ecf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/717fa73957ecf) -
  Migrate ai, jira, notifications, proforma and team-central pkgs to use i18n NPM packages

## 4.3.12

### Patch Changes

- Updated dependencies

## 4.3.11

### Patch Changes

- Updated dependencies

## 4.3.10

### Patch Changes

- Updated dependencies

## 4.3.9

### Patch Changes

- Updated dependencies

## 4.3.8

### Patch Changes

- Updated dependencies

## 4.3.7

### Patch Changes

- Updated dependencies

## 4.3.6

### Patch Changes

- Updated dependencies

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

- [#158114](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158114)
  [`68a4a8356d5bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68a4a8356d5bf) -
  New prop for prepopulating kudos user picker via project key or goal key

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#157474](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157474)
  [`836751d5b664b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/836751d5b664b) -
  Adding new mixed kudos to types

## 4.1.3

### Patch Changes

- [#156675](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156675)
  [`961628fddd7d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/961628fddd7d8) -
  Internal change to move towards Compiled CSS-in-JS styling solution.
- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- [#145703](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145703)
  [`2e93703d26d60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e93703d26d60) -
  Fixed capitalization on kudos creation action flag message

## 4.1.0

### Minor Changes

- [#144593](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144593)
  [`5ca0075ee0408`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5ca0075ee0408) -
  PTC-11485 Updated title for create team flag, added actions and exposed onCreateKudosSuccess to
  Kudos
- [#143734](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143734)
  [`aeb5f206e7d70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aeb5f206e7d70) -
  Added teamid to create kudos opened event to track team active status

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

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

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#113831](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113831)
  [`a04d71bf2e845`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a04d71bf2e845) -
  [ux] Updated flags logic and icons

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#105389](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105389)
  [`e7d05b3fb5162`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7d05b3fb5162) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version, you will need to ensure that your bundler is configured
  to handle `.css` imports correctly. Most bundlers come with built-in support for `.css` imports,
  so you may not need to do anything. If you are using a different bundler, please refer to the
  documentation for that bundler to understand how to handle `.css` imports.

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#161561](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161561)
  [`81f0df6c487a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/81f0df6c487a1) -
  [ux] Legacy icons migration behind feature flag

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#144464](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144464)
  [`6c617d6eb76ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c617d6eb76ba) -
  [ux] Added flag event type KUDOS_FAILED for when a generic error occurs while creating a kudos.
  You can now send a message to the parent which will add a generic kudos error flag in the root
  container.

## 2.1.13

### Patch Changes

- Updated dependencies

## 2.1.12

### Patch Changes

- Updated dependencies

## 2.1.11

### Patch Changes

- [#141350](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141350)
  [`85981116041dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85981116041dd) -
  Added react 18 to peer dependency

## 2.1.10

### Patch Changes

- Updated dependencies

## 2.1.9

### Patch Changes

- Updated dependencies

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

- Updated dependencies

## 2.1.4

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 2.1.3

### Patch Changes

- [#90546](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90546)
  [`e3e2542b4963`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e3e2542b4963) -
  Update TypeScript type parameters when using `FormattedMessage` from `react-intl` to improve
  compatibility with React 18

## 2.1.2

### Patch Changes

- [#78714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78714)
  [`454e72b7bf53`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/454e72b7bf53) -
  [ux] using the intl wrap correctly

  This changeset exists because a PR touches these packages in a way that doesn't require a release

## 2.1.1

### Patch Changes

- [#75997](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75997)
  [`6d14ed2a344b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d14ed2a344b) -
  [ux] adding intl wrap

## 2.1.0

### Minor Changes

- [#65577](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65577)
  [`757870c8a6d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/757870c8a6d4) -
  localise all strings in package

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#43141](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43141)
  [`90eb988ffd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90eb988ffd4) - Add
  typecheck for GiveKudosLauncher JSON.parse call

## 2.0.1

### Patch Changes

- [#38301](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38301)
  [`7490bbf65f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7490bbf65f2) -
  Exporting types

## 2.0.0

### Major Changes

- [#36918](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36918)
  [`4ebab06438a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ebab06438a) - [ux]
  Added types for the flag event listener. Added new flags for jira kudos success and failure.

## 1.1.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 1.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [#30930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30930)
  [`97a77b71c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97a77b71c06) - Remove
  unneded @emotion/core devDep.

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#27889](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27889)
  [`e4c65882fae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4c65882fae) -
  Migrating from styled-components to emotion to fix VULN-1026121

## 0.8.1

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [#25940](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25940)
  [`62d324028bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62d324028bb) - Set z
  index for kudos drawer to modal layer

## 0.7.0

### Minor Changes

- [#23625](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23625)
  [`8561663af05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8561663af05) - Add
  analytics when kudos drawer opened

## 0.6.0

### Minor Changes

- [#23706](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23706)
  [`5f8c2104be0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8c2104be0) - [ux] Add
  icon to kudos created flag and increase kudos drawer z index

## 0.5.0

### Minor Changes

- [#23074](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23074)
  [`e5fbc101e73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5fbc101e73) - Remove
  analytics prop from give kudos component

## 0.4.0

### Minor Changes

- [#22915](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22915)
  [`f0564695480`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0564695480) - Move
  GiveKudosLauncher into a Portal

## 0.3.0

### Minor Changes

- [#22527](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22527)
  [`e2eac5d9f0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2eac5d9f0c) - [ux] Add
  lazy loading support

## 0.2.0

### Minor Changes

- [#22495](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22495)
  [`dd476d8114a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd476d8114a) - [ux]
  Move give kudos to a public package and rename to atlaskit/give-kudos

## 0.1.0

### Minor Changes

- [#22426](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22426)
  [`5bf301d7026`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bf301d7026) - [ux]
  Initial release

## 0.0.1

### Patch Changes

- [`650c976b33d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650c976b33d) - Initial
  version
