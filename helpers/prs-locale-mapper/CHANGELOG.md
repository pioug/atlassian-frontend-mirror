# @atlaskit/prs-locale-mapper

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

## 1.1.6

### Patch Changes

- [#110418](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110418)
  [`7212cb7995ec3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7212cb7995ec3) -
  Adds test locales en-XA, en-XB and en-ZZ to the mapper to prevent defaulting to en

## 1.1.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.1.4

### Patch Changes

- [#39492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39492)
  [`3b1e84fa050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b1e84fa050) - Enrol
  components on push-model consumpion in Jira Frontend.

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

## 1.0.1

### Patch Changes

- [#29544](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29544)
  [`675a9779b66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/675a9779b66) - Fixed
  chinese locales in prs locale mapper
