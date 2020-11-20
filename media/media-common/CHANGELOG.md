# @atlaskit/media-common

## 2.4.2

### Patch Changes

- [`0698db3a1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0698db3a1f) - Updated default values for Polling feature Flags

## 2.4.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.4.0

### Minor Changes

- [`f2b871e61d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2b871e61d) - expose NumericalCardDimensions from media-common

## 2.3.0

### Minor Changes

- [`bf98a47a0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf98a47a0f) - Enhance polling strategy to limit to finite attempts with timing backoff
- [`73613210d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73613210d4) - Adding support for Code and Email files so that they are now able to be previewed in the viewer.

## 2.2.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.2.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

## 2.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [`62eb1114c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62eb1114c4) - Enable passing of MediaFeatureFlags through Editor Renderer via MediaOptions to Media components
- [`6faafb144c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faafb144c) - Introduce MediaFeatureFlags. Refactor components to use.
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added support for zip previews in media viewer

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`37f235e7f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37f235e7f7) - remove FF override warning for localhost
- [`641c4c54e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/641c4c54e6) - Format comments of getMediaFeatureFlag utility

## 2.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 1.1.0

### Minor Changes

- [`3ae1f77dd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ae1f77dd4) - Expose MediaType from media-common

## 1.0.1

### Patch Changes

- [patch][bb2fe95478](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb2fe95478):

  Create @atlaskit/media-common- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

  - @atlaskit/docs@8.5.1
