# @atlaskit/object

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

## 1.0.17

### Patch Changes

- Updated dependencies

## 1.0.16

### Patch Changes

- Updated dependencies

## 1.0.15

### Patch Changes

- Updated dependencies

## 1.0.14

### Patch Changes

- [`02483200273ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02483200273ec) -
  Enrol all Design System UI packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform.
- Updated dependencies

## 1.0.13

### Patch Changes

- Updated dependencies

## 1.0.12

### Patch Changes

- Updated dependencies

## 1.0.11

### Patch Changes

- Updated dependencies

## 1.0.10

### Patch Changes

- Updated dependencies

## 1.0.9

### Patch Changes

- Updated dependencies

## 1.0.8

### Patch Changes

- Updated dependencies

## 1.0.7

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`951d5982db119`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/951d5982db119) -
  Released for general availability

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- [`e1c9823b0b420`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1c9823b0b420) - -
  Added new metadata export
  - Changed name of 'issue' object to 'work-item'
- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [`7cb0fde4106a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7cb0fde4106a7) -
  Fixed an issue with exports.

## 0.2.0

### Minor Changes

- [`ad24b64141bbf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad24b64141bbf) -
  Added new objects "Idea" and "Database".

## 0.1.0

### Minor Changes

- [`9e77915865d6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e77915865d6e) -
  Initial package creation.

### Patch Changes

- Updated dependencies
