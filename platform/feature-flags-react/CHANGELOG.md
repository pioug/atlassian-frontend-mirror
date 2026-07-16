# @atlaskit/platform-feature-flags-react

## 1.1.1

### Patch Changes

- [`fa0809e8c979c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa0809e8c979c) -
  Apply volt-no-multi-exports: split multi-export files into one-export-per-file

## 1.1.0

### Minor Changes

- [`cd097a2111788`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd097a2111788) -
  Republish packages depending on `@atlaskit/react-compiler-gating` so their published dependency
  reference is updated to the renamed `@atlaskit/react-compiler-gating` scope.

  The earlier rename of `@atlassian/react-compiler-gating` to `@atlaskit/react-compiler-gating` only
  bumped the renamed package itself, so dependent packages were never republished and their
  published versions still referenced the old `@atlassian/react-compiler-gating` name, which is not
  available in the public npm registry. This minor bump republishes all affected packages with the
  corrected dependency.

## 1.0.1

### Patch Changes

- [`ee28cf33718b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee28cf33718b0) -
  Add @atlaskit/react-compiler-gating as a runtime dependency to enable React Compiler platform
  gating.
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

## 0.5.1

### Patch Changes

- [`72290778b16ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72290778b16ca) -
  Enrol mixed platform packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform

## 0.5.0

### Minor Changes

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

## 0.4.4

### Patch Changes

- [`e18437c28f9ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e18437c28f9ab) -
  Improve synced blocks robustness.

## 0.4.3

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`1192906179ab0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1192906179ab0) -
  Clean up platform_editor_conditional_factory_cache so that the global cache is now used always

## 0.3.5

### Patch Changes

- Updated dependencies

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`d93a0869e4023`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d93a0869e4023) -
  Add new contional hooks factory global cache and reset utility (for use in tests)

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#150308](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150308)
  [`e2e32f18299f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e2e32f18299f1) -
  Add conditionalHooksFactory utility function to assist with migrating hooks behind a FG/Experiment

## 0.1.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
