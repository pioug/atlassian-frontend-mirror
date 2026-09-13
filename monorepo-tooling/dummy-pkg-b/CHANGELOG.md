# @atlaskit/dummy-pkg-a

## 2.0.1

### Patch Changes

- [`f609e52c6387e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f609e52c6387e) -
  Dummy changes
- Updated dependencies

## 2.0.0

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

## 1.6.2

### Patch Changes

- [#183775](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183775)
  [`275e9b15334ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/275e9b15334ba) -
  test release for root protocol

## 1.6.1

### Patch Changes

- [#122348](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122348)
  [`52a5a10a8a7d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/52a5a10a8a7d2) -
  dummy major bump
- Updated dependencies

## 1.6.0

### Minor Changes

- [#122173](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122173)
  [`096b7b4d6fd7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/096b7b4d6fd7d) -
  Dummy minor bump

### Patch Changes

- Updated dependencies

## 1.5.6

### Patch Changes

- [#171161](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171161)
  [`ef5a0a58f57df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ef5a0a58f57df) -
  Test release to test releasing to public mirror registry

## 1.5.5

### Patch Changes

- [#117981](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117981)
  [`3c8813a85e1cc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c8813a85e1cc) -
  Testing the new publishing flow

## 1.5.4

### Patch Changes

- [#110174](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110174)
  [`14cd3db1c8183`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14cd3db1c8183) -
  Testing the new publishing flow

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- [#85269](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85269)
  [`5b5f95c55ff0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b5f95c55ff0) -
  Release new version to validate storybook issues in Jira

## 1.5.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.5.0

### Minor Changes

- [#34570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34570)
  [`a66f7d251c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66f7d251c5) - Update
  exported value

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

- [#32741](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32741)
  [`48defcf4814`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48defcf4814) - No
  changes - bump only

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#31513](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31513)
  [`e4ff243e423`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4ff243e423) - Empty
  release to test end to end
