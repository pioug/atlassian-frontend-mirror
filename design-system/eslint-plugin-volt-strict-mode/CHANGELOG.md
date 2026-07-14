# @atlaskit/eslint-plugin-volt-strict-mode

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`2f56c78f969b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f56c78f969b8) -
  Update i18n NPM package versions for teamwork-graph (Group 16)

### Patch Changes

- Updated dependencies

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

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`77e318cfe5e32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77e318cfe5e32) -
  Initial release of the Volt Strict Mode lint rule package
