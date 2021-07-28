# @atlaskit/heading

## 0.1.0

### Minor Changes

- [`ee15e59ba60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee15e59ba60) - This is the initial release of the Heading package. Typography styles have been duplicated from the `@atlaskit/theme` package as standalone components.

### Patch Changes

- [`46816ee8526`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46816ee8526) - Changes heading element mappings to match '@atlaskit/css-reset'.
- [`f9cd2065648`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cd2065648) - Removed redundant styles for text-transform, moved font-size to `rem` insteda of `em`.
- Updated dependencies

## 0.0.4

### Patch Changes

- [`229b32842b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229b32842b5) - Fix .npmignore and tsconfig.json for **tests**

## 0.0.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.0.1

### Patch Changes

- [`b443b5a60f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b443b5a60f) - Renamed template package
