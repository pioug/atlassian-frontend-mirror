# @atlaskit/feature-flag-client

## 4.4.0

### Minor Changes

- [`3b893b75e05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b893b75e05) - Prevent sending automatic exposures when evaluating flags with no explanation

## 4.3.1

### Patch Changes

- [`a0e3bec2bda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0e3bec2bda) - Explicilty set exposure trigger reason to exposure event tags

## 4.3.0

### Minor Changes

- [`b74ad8c4eed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b74ad8c4eed) - Cache the result of the first evaluation for each flag key to skip un-necessary validation checks on subsequent calls

## 4.2.1

### Patch Changes

- [`1eb2ab20e1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1eb2ab20e1c) - Fix a bug which caused the value property to be removed from the object returned from getFlag

## 4.2.0

### Minor Changes

- [`1388ead86af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1388ead86af) - Migrated to declarative entry points. This has removed all entrypoints except for @atlaskit/feature-flag-client and @atlaskit/feature-flag-client/types
- [`63c23e6bc25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63c23e6bc25) - Added a new getRawValue method that can be used to evaluate flags without performing any type safety checks
  Added a new getFlagStats method that returns usage information about each flag. This currently only contains an "evaluationCount" per used flag key.
  Performance improvements for repeat evaluations. Flag objects are now cached after the first evaluation, so that subsequent evaluations do not need to perform the same validation checks again.
  Added automatic exposure events for some error cases where the default value is served, such as when the flag does not exist or the value does not match one of the expected variants

## 4.1.3

### Patch Changes

- [`5eddf1c36bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5eddf1c36bb) - remove version.json and replace with build time params

## 4.1.2

### Patch Changes

- [`66c38f2f1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66c38f2f1b) - Setting highPriority field to true for manually fired exposure events to keep backwards compatibility

## 4.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 4.1.0

### Minor Changes

- [`0206cc79b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0206cc79b8) - - Feature Flag Client now includes a client method `setAutomaticExposuresMode` which can be enabled to automatically fire exposure events whenever a flag is evaluated. These automatic events can be identified by the tag `['autoExposure']`.
  - Feature Flag Client will now set the `highPriority` field to false on all exposure events. This means that when the analytics web client starts its new delay mechanism, the sending of exposure events will be delayed.

## 4.0.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 4.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 4.0.1

### Patch Changes

- [`42cbd7edb8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42cbd7edb8) - Update reference to team in package.json

## 4.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 3.1.8

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2

## 3.1.7

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.1.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.1.5

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 3.1.4

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 3.1.3

### Patch Changes

- [patch][6edcd3bc31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6edcd3bc31):

  Add the ability to send custom attributes with the exposure event

## 3.1.2

### Patch Changes

- [patch][0ccf9ade40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ccf9ade40):

  Use process.env.NODE_ENV to check for node environment, in all files

## 3.1.1

- [patch][2e25dad67e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e25dad67e):

  - Change process.env check to process.env.NODE_ENV check

## 3.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 3.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 2.1.2

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 2.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 2.1.0

- [minor][a89f1bf6cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a89f1bf6cd):

  - Enable noImplicitAny for growth/feature-flag-client

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.1.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0

## 1.1.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/docs@6.0.0

## 1.1.0

- [minor] Expect "kind" instead of "reason" from products [5930bab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5930bab)

## 1.0.5

- [patch] MEP-211: Supporting "value" attribute [8c0ddfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0ddfc)

## 1.0.4

- [patch] MEP-103: Allowing simple flags to have strings or booleans as values [4e6f8ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e6f8ab)

## 1.0.3

- [patch] MEP-103 : Support short form of a feature flag for variants [0ac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ac7332)

## 1.0.2

- [patch] MEP-103: Including flagKey in the attributes [afd42f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/afd42f7)

## 1.0.1

- [patch] MEP-103: Adding missing source to event shape [0e870d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e870d8)

## 1.0.0

- [major] Receive analyticsHandler instead of analyticClient [f082105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f082105)

## 0.1.0

- [minor] Implementing new version of the feature flag client [a7dbdbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7dbdbb)

## 0.0.4

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/renderer@22.0.0

## 0.0.3

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/renderer@21.0.0

## 0.0.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/renderer@20.0.11

## 0.0.1

- [patch] Moving feature flag client to atlaskit [c61ba5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c61ba5f)
