# @atlaskit/dummy-pkg-a

## 4.0.1

### Patch Changes

- [`f609e52c6387e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f609e52c6387e) -
  Dummy changes

## 4.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [`6da5b8691a214`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6da5b8691a214) -
  publish new entry points
- [`2c596808285c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c596808285c9) -
  test updated entry points

## 3.0.2

### Patch Changes

- [`68a304549e110`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68a304549e110) -
  add new test entrypoint

## 3.0.1

### Patch Changes

- [#183409](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183409)
  [`7d94e9d6dc5bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d94e9d6dc5bf) -
  testing of root protocol transformation

## 3.0.0

### Major Changes

- [#122348](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122348)
  [`52a5a10a8a7d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/52a5a10a8a7d2) -
  dummy major bump

## 2.3.0

### Minor Changes

- [#122173](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122173)
  [`096b7b4d6fd7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/096b7b4d6fd7d) -
  Dummy minor bump

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- [#171039](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171039)
  [`869fa4f1764ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/869fa4f1764ef) -
  Updates publishConfig to point to internal public mirror registry

## 2.2.6

### Patch Changes

- [#159710](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159710)
  [`32d3888363bfd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32d3888363bfd) -
  Removing platform stable code and testing the publishing

## 2.2.5

### Patch Changes

- [#133711](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133711)
  [`f5d361476bf50`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5d361476bf50) -
  Testing Platform deploy

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- [#107712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107712)
  [`d92a2eda04dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d92a2eda04dd) -
  Dummy change to test platform-stable publish

## 2.2.2

### Patch Changes

- [#101895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101895)
  [`47aca9800baf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47aca9800baf) -
  Platform stable publish changes

## 2.2.1

### Patch Changes

- [#90568](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90568)
  [`6a37e9674cbe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a37e9674cbe) -
  Test bump for platform-stable publish

## 2.2.0

### Minor Changes

- [#89268](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89268)
  [`ee9e3be7782b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee9e3be7782b) -
  Testing version bump

### Patch Changes

- [#89236](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89236)
  [`9f284257e8b3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f284257e8b3) -
  Bump to test publishing on platform stable

## 2.1.0

### Minor Changes

- [#86418](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86418)
  [`c6685f05fca9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6685f05fca9) -
  Test publishing with new npm token

## 2.0.0

### Major Changes

- [#86165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86165)
  [`0bb52be716f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0bb52be716f3) -
  Upgrading @atlaskit/dummy-pkg-a to major to check if there will unsaved yarn.lock changes post
  master-publish build

## 1.5.4

### Patch Changes

- [#86055](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86055)
  [`f2d0f60304e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2d0f60304e9) -
  Testing with Yarn V3

## 1.5.3

### Patch Changes

- [#85269](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85269)
  [`5b5f95c55ff0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b5f95c55ff0) -
  Release new version to validate storybook issues in Jira

## 1.5.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.5.1

### Patch Changes

- [#71162](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71162)
  [`aea9bf83e2da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aea9bf83e2da) -
  test publish

## 1.5.0

### Minor Changes

- [`b156ba57ebfd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b156ba57ebfd) -
  Test publishing from native flow

## 1.4.12

### Patch Changes

- Testing shadow master build publishing.

## 1.4.11

### Patch Changes

- Testing shadow master build publishing.

## 1.4.10

### Patch Changes

- Testing shadow master build publishing.

## 1.4.9

### Patch Changes

- [#71704](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71704)
  [`3740c0523a90`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3740c0523a90) -
  Testing Renovate

## 1.4.8

### Patch Changes

- [#56341](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56341)
  [`8fd8323ab8de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fd8323ab8de) - AFM
  publish test

## 1.4.4

### Patch Changes

- [#39529](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39529)
  [`6e58363363a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e58363363a) - Testing
  publishing from platform-shadow-master pipeline

## 1.4.3

### Patch Changes

- [#37967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37967)
  [`569fd1b3beb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/569fd1b3beb) - Update
  text behind FF

## 1.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#32922](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32922)
  [`22bfcc9beb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22bfcc9beb6) - Adding
  `@atlaskit/platform-feature-flags` and exporting a function to render different codepath based on
  platform feature flags.

## 1.2.0

### Minor Changes

- [#32741](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32741)
  [`48defcf4814`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48defcf4814) - No
  changes - bump only

## 1.0.2

### Patch Changes

- [#31513](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31513)
  [`e4ff243e423`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4ff243e423) - Empty
  release to test end to end
