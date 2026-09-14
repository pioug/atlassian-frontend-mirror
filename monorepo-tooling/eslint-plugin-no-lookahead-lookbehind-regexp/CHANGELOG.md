# @atlaskit/eslint-plugin-no-lookahead-lookbehind-regexp

## 1.1.0

### Minor Changes

- [`bd2c5b0112185`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd2c5b0112185) -
  Remove stale API report artifacts from published Platform packages.

## 1.0.0

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

## 0.1.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.1.2

### Patch Changes

- [#81166](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81166)
  [`a249a1bd29a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a249a1bd29a6) -
  Upgrade ESLint to version 8

## 0.1.1

### Patch Changes

- [#81102](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81102)
  [`450951126ecc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/450951126ecc) -
  Removed unused dev dependency (@types/estree)
