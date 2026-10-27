# @atlaskit/react-compiler-gating

## 0.2.5

### Patch Changes

- [`18a1c474f8fd9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18a1c474f8fd9) -
  Behind the `confluence_cache_react_compiler_fg` experiment, `isReactCompilerActivePlatform` caches
  its result for the page load once Statsig has initialised. It never caches before initialisation,
  when the experiment returns its default. The React Compiler calls this function once per compiled
  function when its module first runs, often during hydration.

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- [`780f3cf64aa2a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/780f3cf64aa2a) -
  Add license file to the package
- [`6a852c693020a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6a852c693020a) -
  Rename `@atlassian/react-compiler-gating` to `@atlaskit/react-compiler-gating` and make it
  publishable to the public npm registry. This is a mechanical scope rename with no runtime
  behaviour change; all consumers and the parcel React Compiler registry are updated to the new
  package name.

## 0.2.2

### Patch Changes

- [`ee28cf33718b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee28cf33718b0) -
  Add @atlaskit/react-compiler-gating as a runtime dependency to enable React Compiler platform
  gating.

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`53d4cf2641b7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53d4cf2641b7a) -
  Add gated logic to provide react-compiler support for platform packages
