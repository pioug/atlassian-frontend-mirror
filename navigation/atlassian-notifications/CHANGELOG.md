# @atlaskit/atlassian-notifications

## 0.6.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 0.5.0

### Minor Changes

- [#150749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150749)
  [`9921483ef0acd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9921483ef0acd) -
  Add support for React 18.

## 0.4.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.4.4

### Patch Changes

- [#82299](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82299)
  [`d98b668a6b2b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d98b668a6b2b) -
  Enforced usage of spacing tokens instead of hard coded values for spacing styles

## 0.4.3

### Patch Changes

- [#66000](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66000)
  [`c220c7a6e5f6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c220c7a6e5f6) -
  Migrate @atlaskit/atlassian-notifications to use declarative entry points

## 0.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 0.3.4

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`c873be831a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c873be831a5) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 0.3.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.3.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.3.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 0.3.0

### Minor Changes

- [#10658](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10658)
  [`b0b891e9edf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0b891e9edf) - Adding
  new optional prop to enable new notification experience

## 0.2.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.2.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.2.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.2.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`60dd4ecc69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60dd4ecc69) - Changed
  export all to export individual components in index

## 0.2.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 0.1.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2

## 0.1.3

### Patch Changes

- [patch][0393e3f04e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0393e3f04e):

  Fixing types

## 0.1.2

### Patch Changes

- [patch][e1dc937728](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1dc937728):

  Adding a private \_url prop for notifications to enable testing/examples

## 0.1.1

### Patch Changes

- [patch][5eb3d1fc75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5eb3d1fc75):

  Removed spinner from the notifications package (handled by the iframe content instead)
