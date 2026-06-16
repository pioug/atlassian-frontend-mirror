# @atlaskit/simple-xdm

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

## 1.2.1

### Patch Changes

- [`29ab57db0034f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/29ab57db0034f) -
  Remove platform_deprecate_lp_cc_embed checks

## 1.2.0

### Minor Changes

- [`963b9761f89e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/963b9761f89e5) -
  Migrate embedded confluence to @atlaskit/simple-xdm due to deprecation of simple-xdm standalone
  repository

## 1.1.1

### Patch Changes

- [`64f80db3e663a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64f80db3e663a) -
  Add @atlassian/a11y-jest-testing to devDependencies.
- Updated dependencies

## 1.1.0

### Minor Changes

- [`4258f0e10a669`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4258f0e10a669) -
  preserve host frame offset in the embedded confluence context

## 1.0.5

### Patch Changes

- [`bbabc624ff789`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bbabc624ff789) -
  Sorted type and interface props to improve Atlaskit docs

## 1.0.4

### Patch Changes

- [#178402](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178402)
  [`d5b99c5a12a30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5b99c5a12a30) -
  Add in line of code that went missing during migration

## 1.0.3

### Patch Changes

- [#176014](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176014)
  [`d6c312b136793`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6c312b136793) -
  Improving FedRAMP compatibility

## 1.0.2

### Patch Changes

- [#174010](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174010)
  [`d32f088557e43`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d32f088557e43) -
  Rename package

## 1.0.1

### Patch Changes

- [#152064](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152064)
  [`3525e1adfc76b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3525e1adfc76b) -
  Minor readme update to publish package
