# @atlaskit/embedded-document

## 1.0.0

### Major Changes

- [#181024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181024)
  [`8e80c487ca307`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e80c487ca307) - ##
  Make `@atlaskit/editor-common` a peer dependency

  **WHAT:** `@atlaskit/editor-common` has been moved from `dependencies` to `peerDependencies` in
  all editor plugin packages.

  **WHY:** This change ensures that only a single version of `@atlaskit/editor-common` is used in
  consuming applications, preventing issues caused by multiple versions of singleton libraries (such
  as context mismatches or duplicated state). This is especially important for packages that rely on
  shared context or singletons.

  **HOW TO ADJUST:**

  - Consumers must now explicitly install `@atlaskit/editor-common` in their own project if they use
    any of these editor plugins.
  - Ensure the version you install matches the version required by the plugins.
  - You can use the
    [`check-peer-dependencies`](https://www.npmjs.com/package/check-peer-dependencies) package to
    verify that all required peer dependencies are installed and compatible.
  - Example install command:
    ```
    npm install @atlaskit/editor-common
    ```
    or
    ```
    yarn add @atlaskit/editor-common
    ```

  **Note:** This is a breaking change. If `@atlaskit/editor-common` is not installed at the
  application level, you may see errors or unexpected behavior.

### Patch Changes

- Updated dependencies

## 0.11.20

### Patch Changes

- Updated dependencies

## 0.11.19

### Patch Changes

- Updated dependencies

## 0.11.18

### Patch Changes

- Updated dependencies

## 0.11.17

### Patch Changes

- Updated dependencies

## 0.11.16

### Patch Changes

- Updated dependencies

## 0.11.15

### Patch Changes

- Updated dependencies

## 0.11.14

### Patch Changes

- Updated dependencies

## 0.11.13

### Patch Changes

- Updated dependencies

## 0.11.12

### Patch Changes

- Updated dependencies

## 0.11.11

### Patch Changes

- Updated dependencies

## 0.11.10

### Patch Changes

- Updated dependencies

## 0.11.9

### Patch Changes

- Updated dependencies

## 0.11.8

### Patch Changes

- Updated dependencies

## 0.11.7

### Patch Changes

- Updated dependencies

## 0.11.6

### Patch Changes

- Updated dependencies

## 0.11.5

### Patch Changes

- Updated dependencies

## 0.11.4

### Patch Changes

- Updated dependencies

## 0.11.3

### Patch Changes

- Updated dependencies

## 0.11.2

### Patch Changes

- Updated dependencies

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 0.10.2

### Patch Changes

- Updated dependencies

## 0.10.1

### Patch Changes

- Updated dependencies

## 0.10.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 0.9.107

### Patch Changes

- Updated dependencies

## 0.9.106

### Patch Changes

- Updated dependencies

## 0.9.105

### Patch Changes

- Updated dependencies

## 0.9.104

### Patch Changes

- Updated dependencies

## 0.9.103

### Patch Changes

- Updated dependencies

## 0.9.102

### Patch Changes

- Updated dependencies

## 0.9.101

### Patch Changes

- Updated dependencies

## 0.9.100

### Patch Changes

- Updated dependencies

## 0.9.99

### Patch Changes

- Updated dependencies

## 0.9.98

### Patch Changes

- Updated dependencies

## 0.9.97

### Patch Changes

- [#174760](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174760)
  [`f25387429be19`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f25387429be19) -
  Removed internal re-exports
- Updated dependencies

## 0.9.96

### Patch Changes

- Updated dependencies

## 0.9.95

### Patch Changes

- Updated dependencies

## 0.9.94

### Patch Changes

- Updated dependencies

## 0.9.93

### Patch Changes

- Updated dependencies

## 0.9.92

### Patch Changes

- Updated dependencies

## 0.9.91

### Patch Changes

- Updated dependencies

## 0.9.90

### Patch Changes

- Updated dependencies

## 0.9.89

### Patch Changes

- Updated dependencies

## 0.9.88

### Patch Changes

- Updated dependencies

## 0.9.87

### Patch Changes

- Updated dependencies

## 0.9.86

### Patch Changes

- Updated dependencies

## 0.9.85

### Patch Changes

- Updated dependencies

## 0.9.84

### Patch Changes

- Updated dependencies

## 0.9.83

### Patch Changes

- Updated dependencies

## 0.9.82

### Patch Changes

- Updated dependencies

## 0.9.81

### Patch Changes

- Updated dependencies

## 0.9.80

### Patch Changes

- Updated dependencies

## 0.9.79

### Patch Changes

- Updated dependencies

## 0.9.78

### Patch Changes

- Updated dependencies

## 0.9.77

### Patch Changes

- Updated dependencies

## 0.9.76

### Patch Changes

- Updated dependencies

## 0.9.75

### Patch Changes

- Updated dependencies

## 0.9.74

### Patch Changes

- Updated dependencies

## 0.9.73

### Patch Changes

- Updated dependencies

## 0.9.72

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 0.9.71

### Patch Changes

- Updated dependencies

## 0.9.70

### Patch Changes

- Updated dependencies

## 0.9.69

### Patch Changes

- Updated dependencies

## 0.9.68

### Patch Changes

- Updated dependencies

## 0.9.67

### Patch Changes

- Updated dependencies

## 0.9.66

### Patch Changes

- Updated dependencies

## 0.9.65

### Patch Changes

- Updated dependencies

## 0.9.64

### Patch Changes

- Updated dependencies

## 0.9.63

### Patch Changes

- Updated dependencies

## 0.9.62

### Patch Changes

- Updated dependencies

## 0.9.61

### Patch Changes

- Updated dependencies

## 0.9.60

### Patch Changes

- Updated dependencies

## 0.9.59

### Patch Changes

- Updated dependencies

## 0.9.58

### Patch Changes

- Updated dependencies

## 0.9.57

### Patch Changes

- Updated dependencies

## 0.9.56

### Patch Changes

- Updated dependencies

## 0.9.55

### Patch Changes

- Updated dependencies

## 0.9.54

### Patch Changes

- Updated dependencies

## 0.9.53

### Patch Changes

- Updated dependencies

## 0.9.52

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 0.9.51

### Patch Changes

- Updated dependencies

## 0.9.50

### Patch Changes

- Updated dependencies

## 0.9.49

### Patch Changes

- Updated dependencies

## 0.9.48

### Patch Changes

- Updated dependencies

## 0.9.47

### Patch Changes

- Updated dependencies

## 0.9.46

### Patch Changes

- [#106586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106586)
  [`f3486a7d141c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3486a7d141c) -
  Update usage of akEditorGutterPadding to its dynamic version which can increase padding to support
  editor drag and drop. Breakout logic is also updated to accommodate extra padding.
- Updated dependencies

## 0.9.45

### Patch Changes

- Updated dependencies

## 0.9.44

### Patch Changes

- Updated dependencies

## 0.9.43

### Patch Changes

- Updated dependencies

## 0.9.42

### Patch Changes

- Updated dependencies

## 0.9.41

### Patch Changes

- Updated dependencies

## 0.9.40

### Patch Changes

- Updated dependencies

## 0.9.39

### Patch Changes

- Updated dependencies

## 0.9.38

### Patch Changes

- Updated dependencies

## 0.9.37

### Patch Changes

- Updated dependencies

## 0.9.36

### Patch Changes

- Updated dependencies

## 0.9.35

### Patch Changes

- Updated dependencies

## 0.9.34

### Patch Changes

- Updated dependencies

## 0.9.33

### Patch Changes

- Updated dependencies

## 0.9.32

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 0.9.31

### Patch Changes

- Updated dependencies

## 0.9.30

### Patch Changes

- Updated dependencies

## 0.9.29

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`
- Updated dependencies

## 0.9.28

### Patch Changes

- Updated dependencies

## 0.9.27

### Patch Changes

- Updated dependencies

## 0.9.26

### Patch Changes

- [#81438](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81438)
  [`1baa2be11bcc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1baa2be11bcc) -
  React 18 types for embedded document

## 0.9.25

### Patch Changes

- Updated dependencies

## 0.9.24

### Patch Changes

- Updated dependencies

## 0.9.23

### Patch Changes

- Updated dependencies

## 0.9.22

### Patch Changes

- [#75947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75947)
  [`43549c3789b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43549c3789b1) -
  Migrate @atlaskit/editor-core to use declarative entry points
- Updated dependencies

## 0.9.21

### Patch Changes

- Updated dependencies

## 0.9.20

### Patch Changes

- Updated dependencies

## 0.9.19

### Patch Changes

- [#77259](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77259)
  [`9086164a5b62`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9086164a5b62) -
  Use spacing tokens instead of hardcoded values

## 0.9.18

### Patch Changes

- Updated dependencies

## 0.9.17

### Patch Changes

- Updated dependencies

## 0.9.16

### Patch Changes

- Updated dependencies

## 0.9.15

### Patch Changes

- [#67410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67410)
  [`155e3b00ce67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/155e3b00ce67) -
  Migrate @atlaskit/embedded-document to use declarative entry points

## 0.9.14

### Patch Changes

- Updated dependencies

## 0.9.13

### Patch Changes

- Updated dependencies

## 0.9.12

### Patch Changes

- Updated dependencies

## 0.9.11

### Patch Changes

- Updated dependencies

## 0.9.10

### Patch Changes

- Updated dependencies

## 0.9.9

### Patch Changes

- Updated dependencies

## 0.9.8

### Patch Changes

- Updated dependencies

## 0.9.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 0.9.6

### Patch Changes

- Updated dependencies

## 0.9.5

### Patch Changes

- Updated dependencies

## 0.9.4

### Patch Changes

- Updated dependencies

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.9.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.9.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.8.17

### Patch Changes

- Updated dependencies

## 0.8.16

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.8.15

### Patch Changes

- Updated dependencies

## 0.8.14

### Patch Changes

- Updated dependencies

## 0.8.13

### Patch Changes

- Updated dependencies

## 0.8.12

### Patch Changes

- Updated dependencies

## 0.8.11

### Patch Changes

- Updated dependencies

## 0.8.10

### Patch Changes

- Updated dependencies

## 0.8.9

### Patch Changes

- Updated dependencies

## 0.8.8

### Patch Changes

- Updated dependencies

## 0.8.7

### Patch Changes

- Updated dependencies

## 0.8.6

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.8.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.8.3

### Patch Changes

- Updated dependencies

## 0.8.2

### Patch Changes

- Updated dependencies

## 0.8.1

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`3e0d1d605e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e0d1d605e6) - Marking
  @atlaskit/embedded-document as deprecated as it is no longer being used.

### Patch Changes

- Updated dependencies

## 0.7.49

### Patch Changes

- Updated dependencies

## 0.7.48

### Patch Changes

- Updated dependencies

## 0.7.47

### Patch Changes

- Updated dependencies

## 0.7.46

### Patch Changes

- Updated dependencies

## 0.7.45

### Patch Changes

- Updated dependencies

## 0.7.44

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 0.7.43

### Patch Changes

- Updated dependencies

## 0.7.42

### Patch Changes

- Updated dependencies

## 0.7.41

### Patch Changes

- Updated dependencies

## 0.7.40

### Patch Changes

- Updated dependencies

## 0.7.39

### Patch Changes

- Updated dependencies

## 0.7.38

### Patch Changes

- Updated dependencies

## 0.7.37

### Patch Changes

- Updated dependencies

## 0.7.36

### Patch Changes

- Updated dependencies

## 0.7.35

### Patch Changes

- Updated dependencies

## 0.7.34

### Patch Changes

- Updated dependencies

## 0.7.33

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13753
  Updated editor-common import entries.
- Updated dependencies

## 0.7.32

### Patch Changes

- Updated dependencies

## 0.7.31

### Patch Changes

- Updated dependencies

## 0.7.30

### Patch Changes

- Updated dependencies

## 0.7.29

### Patch Changes

- Updated dependencies

## 0.7.28

### Patch Changes

- Updated dependencies

## 0.7.27

### Patch Changes

- Updated dependencies

## 0.7.26

### Patch Changes

- Updated dependencies

## 0.7.25

### Patch Changes

- Updated dependencies

## 0.7.24

### Patch Changes

- Updated dependencies

## 0.7.23

### Patch Changes

- Updated dependencies

## 0.7.22

### Patch Changes

- Updated dependencies

## 0.7.21

### Patch Changes

- Updated dependencies

## 0.7.20

### Patch Changes

- Updated dependencies

## 0.7.19

### Patch Changes

- Updated dependencies

## 0.7.18

### Patch Changes

- Updated dependencies

## 0.7.17

### Patch Changes

- Updated dependencies

## 0.7.16

### Patch Changes

- Updated dependencies

## 0.7.15

### Patch Changes

- Updated dependencies

## 0.7.14

### Patch Changes

- Updated dependencies

## 0.7.13

### Patch Changes

- Updated dependencies

## 0.7.12

### Patch Changes

- Updated dependencies

## 0.7.11

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.7.10

### Patch Changes

- Updated dependencies

## 0.7.9

### Patch Changes

- Updated dependencies

## 0.7.8

### Patch Changes

- Updated dependencies

## 0.7.7

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.7.6

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`78b192acc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78b192acc9) - ED-10169
  Update imports for style constants from @atlaskit/editor-common to @atlaskit/editor-shared-styles
- Updated dependencies

## 0.7.5

### Patch Changes

- Updated dependencies

## 0.7.4

### Patch Changes

- Updated dependencies

## 0.7.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.7.2

### Patch Changes

- Updated dependencies

## 0.7.1

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.6.22

### Patch Changes

- Updated dependencies

## 0.6.21

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies
- Updated dependencies

## 0.6.20

### Patch Changes

- Updated dependencies

## 0.6.19

### Patch Changes

- Updated dependencies
  [7e4d4a7ed4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4d4a7ed4):
- Updated dependencies
  [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies
  [b202858f6c](https://bitbucket.org/atlassian/atlassian-frontend/commits/b202858f6c):
- Updated dependencies
  [9cee2b03e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cee2b03e8):
- Updated dependencies
  [26de083801](https://bitbucket.org/atlassian/atlassian-frontend/commits/26de083801):
- Updated dependencies
  [d3cc97a424](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3cc97a424):
- Updated dependencies
  [00f64f4eb8](https://bitbucket.org/atlassian/atlassian-frontend/commits/00f64f4eb8):
- Updated dependencies
  [4f70380793](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70380793):
- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [5b301bcdf6](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b301bcdf6):
- Updated dependencies
  [729a4e4960](https://bitbucket.org/atlassian/atlassian-frontend/commits/729a4e4960):
- Updated dependencies
  [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies
  [5f075c4fd2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f075c4fd2):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [c8d0ce5b94](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d0ce5b94):
- Updated dependencies
  [384791fb2b](https://bitbucket.org/atlassian/atlassian-frontend/commits/384791fb2b):
- Updated dependencies
  [c6b145978b](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b145978b):
- Updated dependencies
  [736507f8e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/736507f8e0):
- Updated dependencies
  [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies
  [9e3646b59e](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e3646b59e):
- Updated dependencies
  [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
- Updated dependencies
  [e477132440](https://bitbucket.org/atlassian/atlassian-frontend/commits/e477132440):
  - @atlaskit/editor-core@122.0.0
  - @atlaskit/editor-common@45.1.0
  - @atlaskit/button@13.3.11
  - @atlaskit/renderer@58.0.0

## 0.6.18

### Patch Changes

- Updated dependencies
  [2a87a3bbc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a87a3bbc5):
- Updated dependencies
  [cf7a2d7506](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf7a2d7506):
- Updated dependencies
  [759f0a5ca7](https://bitbucket.org/atlassian/atlassian-frontend/commits/759f0a5ca7):
- Updated dependencies
  [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies
  [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies
  [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies
  [bdb4da1fc0](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb4da1fc0):
- Updated dependencies
  [c51f0b4c70](https://bitbucket.org/atlassian/atlassian-frontend/commits/c51f0b4c70):
- Updated dependencies
  [16c193eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/16c193eb3e):
- Updated dependencies
  [7ec160c0e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ec160c0e2):
- Updated dependencies
  [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies
  [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies
  [5167f09a83](https://bitbucket.org/atlassian/atlassian-frontend/commits/5167f09a83):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [91ff8d36f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/91ff8d36f0):
- Updated dependencies
  [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies
  [a1ee397cbc](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1ee397cbc):
- Updated dependencies
  [dc84dfa3bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc84dfa3bc):
- Updated dependencies
  [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies
  [550c4b5018](https://bitbucket.org/atlassian/atlassian-frontend/commits/550c4b5018):
- Updated dependencies
  [03a83cb954](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a83cb954):
- Updated dependencies
  [e21800fd1c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e21800fd1c):
- Updated dependencies
  [258a36b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/258a36b51f):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies
  [1a48183584](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a48183584):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies
  [41917f4c16](https://bitbucket.org/atlassian/atlassian-frontend/commits/41917f4c16):
- Updated dependencies
  [de6548dae5](https://bitbucket.org/atlassian/atlassian-frontend/commits/de6548dae5):
- Updated dependencies
  [9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):
- Updated dependencies
  [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies
  [91304da441](https://bitbucket.org/atlassian/atlassian-frontend/commits/91304da441):
- Updated dependencies
  [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies
  [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies
  [971df84f45](https://bitbucket.org/atlassian/atlassian-frontend/commits/971df84f45):
- Updated dependencies
  [17a46dd016](https://bitbucket.org/atlassian/atlassian-frontend/commits/17a46dd016):
- Updated dependencies
  [0ab75c545b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ab75c545b):
- Updated dependencies
  [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies
  [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies
  [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies
  [5f75dd27c9](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f75dd27c9):
- Updated dependencies
  [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies
  [287be84065](https://bitbucket.org/atlassian/atlassian-frontend/commits/287be84065):
- Updated dependencies
  [fb8725beac](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb8725beac):
  - @atlaskit/editor-core@121.0.0
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/renderer@57.0.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.6.17

### Patch Changes

- Updated dependencies
  [9fd8ba7707](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8ba7707):
- Updated dependencies
  [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies
  [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies
  [4c691c3b5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c691c3b5f):
- Updated dependencies
  [d63513575b](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63513575b):
- Updated dependencies
  [48f0ecf23e](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f0ecf23e):
- Updated dependencies
  [130b83ccba](https://bitbucket.org/atlassian/atlassian-frontend/commits/130b83ccba):
- Updated dependencies
  [5180a51c0d](https://bitbucket.org/atlassian/atlassian-frontend/commits/5180a51c0d):
- Updated dependencies
  [067febb0a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/067febb0a7):
- Updated dependencies
  [66cf61863f](https://bitbucket.org/atlassian/atlassian-frontend/commits/66cf61863f):
- Updated dependencies
  [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies
  [22d9c96ed2](https://bitbucket.org/atlassian/atlassian-frontend/commits/22d9c96ed2):
- Updated dependencies
  [a9e9604c8e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e9604c8e):
- Updated dependencies
  [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies
  [b41beace3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/b41beace3f):
- Updated dependencies
  [02425bf2d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/02425bf2d7):
- Updated dependencies
  [953cfadbe3](https://bitbucket.org/atlassian/atlassian-frontend/commits/953cfadbe3):
- Updated dependencies
  [29b0315dcb](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b0315dcb):
- Updated dependencies
  [aa4dc7f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa4dc7f5d6):
- Updated dependencies
  [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies
  [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies
  [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies
  [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies
  [6242ec17a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/6242ec17a2):
- Updated dependencies
  [6b65ae4f04](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b65ae4f04):
- Updated dependencies
  [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies
  [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-core@120.0.0
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/renderer@56.0.0

## 0.6.16

### Patch Changes

- Updated dependencies
  [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies
  [cc0d9f6ede](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0d9f6ede):
- Updated dependencies
  [6384746272](https://bitbucket.org/atlassian/atlassian-frontend/commits/6384746272):
- Updated dependencies
  [956a70b918](https://bitbucket.org/atlassian/atlassian-frontend/commits/956a70b918):
- Updated dependencies
  [3494940acd](https://bitbucket.org/atlassian/atlassian-frontend/commits/3494940acd):
- Updated dependencies
  [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies
  [ebee5c7429](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebee5c7429):
- Updated dependencies
  [680a61dc5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/680a61dc5a):
- Updated dependencies
  [57096fc043](https://bitbucket.org/atlassian/atlassian-frontend/commits/57096fc043):
- Updated dependencies
  [b17120e768](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17120e768):
- Updated dependencies
  [92e0b393f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/92e0b393f5):
- Updated dependencies
  [ac8639dfd8](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8639dfd8):
- Updated dependencies
  [2f0df19890](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f0df19890):
- Updated dependencies
  [2475d1c9d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/2475d1c9d8):
- Updated dependencies
  [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies
  [113d075684](https://bitbucket.org/atlassian/atlassian-frontend/commits/113d075684):
- Updated dependencies
  [af8a3763dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/af8a3763dd):
- Updated dependencies
  [21a1faf014](https://bitbucket.org/atlassian/atlassian-frontend/commits/21a1faf014):
- Updated dependencies
  [94116c6018](https://bitbucket.org/atlassian/atlassian-frontend/commits/94116c6018):
- Updated dependencies
  [9fadef064b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fadef064b):
- Updated dependencies
  [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies
  [f8ffc8320f](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8ffc8320f):
- Updated dependencies
  [469e9a2302](https://bitbucket.org/atlassian/atlassian-frontend/commits/469e9a2302):
- Updated dependencies
  [a41d2345eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41d2345eb):
- Updated dependencies
  [4ef23b6a15](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ef23b6a15):
- Updated dependencies
  [8cc5cc0603](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc5cc0603):
- Updated dependencies
  [5d8a0d4f5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8a0d4f5f):
- Updated dependencies
  [faa96cee2a](https://bitbucket.org/atlassian/atlassian-frontend/commits/faa96cee2a):
- Updated dependencies
  [535286e8c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/535286e8c4):
- Updated dependencies
  [c7b205c83f](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7b205c83f):
- Updated dependencies
  [703b72cdba](https://bitbucket.org/atlassian/atlassian-frontend/commits/703b72cdba):
- Updated dependencies
  [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies
  [cd662c7e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd662c7e4c):
- Updated dependencies
  [de64f9373c](https://bitbucket.org/atlassian/atlassian-frontend/commits/de64f9373c):
- Updated dependencies
  [93ac94a762](https://bitbucket.org/atlassian/atlassian-frontend/commits/93ac94a762):
- Updated dependencies
  [172a864d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/172a864d19):
- Updated dependencies
  [6a417f2e52](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a417f2e52):
- Updated dependencies
  [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies
  [fdf6c939e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf6c939e8):
- Updated dependencies
  [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/editor-core@119.0.0
  - @atlaskit/renderer@55.0.0
  - @atlaskit/button@13.3.9

## 0.6.15

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies
  [6403a54812](https://bitbucket.org/atlassian/atlassian-frontend/commits/6403a54812):

- Updated dependencies
  [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):
- Updated dependencies
  [f46330c0ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/f46330c0ab):
- Updated dependencies
  [d6f207a598](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f207a598):
- Updated dependencies
  [40359da294](https://bitbucket.org/atlassian/atlassian-frontend/commits/40359da294):
- Updated dependencies
  [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies
  [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies
  [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies
  [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies
  [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies
  [7aad7888b4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aad7888b4):
- Updated dependencies
  [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies
  [a5c3717d0b](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c3717d0b):
- Updated dependencies
  [b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):
- Updated dependencies
  [37a79cb1bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/37a79cb1bc):
- Updated dependencies
  [47d7b34f75](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d7b34f75):
- Updated dependencies
  [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies
  [5a0167db78](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a0167db78):
- Updated dependencies
  [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies
  [b3b2f413c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b2f413c1):
- Updated dependencies
  [8f41931365](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f41931365):
- Updated dependencies
  [a4ddcbf7e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ddcbf7e2):
- Updated dependencies
  [d59113061a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d59113061a):
- Updated dependencies
  [cedfb7766c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cedfb7766c):
- Updated dependencies
  [2361b8d044](https://bitbucket.org/atlassian/atlassian-frontend/commits/2361b8d044):
- Updated dependencies
  [1028ab4db3](https://bitbucket.org/atlassian/atlassian-frontend/commits/1028ab4db3):
- Updated dependencies
  [57ea6ea77a](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ea6ea77a):
- Updated dependencies
  [ff6e928368](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff6e928368):
- Updated dependencies
  [4b3ced1d9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3ced1d9f):
- Updated dependencies
  [fdc0861682](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdc0861682):
- Updated dependencies
  [00ddcd52df](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ddcd52df):
- Updated dependencies
  [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies
  [198639cd06](https://bitbucket.org/atlassian/atlassian-frontend/commits/198639cd06):
- Updated dependencies
  [13f0bbc125](https://bitbucket.org/atlassian/atlassian-frontend/commits/13f0bbc125):
- Updated dependencies
  [d7749cb6ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7749cb6ab):
- Updated dependencies
  [c9842c9ada](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9842c9ada):
- Updated dependencies
  [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-core@118.0.0
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/renderer@54.0.0

## 0.6.14

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/button@13.3.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/editor-core@117.0.2
  - @atlaskit/renderer@53.2.7
  - @atlaskit/util-service-support@5.0.1

## 0.6.13

### Patch Changes

- Updated dependencies
  [06cd97123e](https://bitbucket.org/atlassian/atlassian-frontend/commits/06cd97123e):
- Updated dependencies
  [07b5311cb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b5311cb9):
- Updated dependencies
  [a4ded5368c](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ded5368c):
- Updated dependencies
  [6f16f46632](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f16f46632):
- Updated dependencies
  [a1f50e6a54](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1f50e6a54):
- Updated dependencies
  [31558e1872](https://bitbucket.org/atlassian/atlassian-frontend/commits/31558e1872):
- Updated dependencies
  [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies
  [43e03f1c58](https://bitbucket.org/atlassian/atlassian-frontend/commits/43e03f1c58):
- Updated dependencies
  [63fe41d5c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/63fe41d5c2):
- Updated dependencies
  [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies
  [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies
  [64752f2827](https://bitbucket.org/atlassian/atlassian-frontend/commits/64752f2827):
- Updated dependencies
  [f67dc5ae22](https://bitbucket.org/atlassian/atlassian-frontend/commits/f67dc5ae22):
- Updated dependencies
  [e40acffdfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40acffdfc):
- Updated dependencies
  [0709d95a8a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0709d95a8a):
- Updated dependencies
  [28dcebde63](https://bitbucket.org/atlassian/atlassian-frontend/commits/28dcebde63):
- Updated dependencies
  [710897f340](https://bitbucket.org/atlassian/atlassian-frontend/commits/710897f340):
- Updated dependencies
  [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies
  [bbbe360b71](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbbe360b71):
- Updated dependencies
  [3b37ec4c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b37ec4c28):
- Updated dependencies
  [655599414e](https://bitbucket.org/atlassian/atlassian-frontend/commits/655599414e):
  - @atlaskit/editor-core@117.0.0
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/renderer@53.2.6
  - @atlaskit/button@13.3.6

## 0.6.12

### Patch Changes

- Updated dependencies
  [6042417190](https://bitbucket.org/atlassian/atlassian-frontend/commits/6042417190):
- Updated dependencies
  [26942487d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/26942487d1):
- Updated dependencies
  [d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):
- Updated dependencies
  [8db35852ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db35852ab):
- Updated dependencies
  [98a904dd02](https://bitbucket.org/atlassian/atlassian-frontend/commits/98a904dd02):
- Updated dependencies
  [2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):
- Updated dependencies
  [97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):
- Updated dependencies
  [9219b332cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/9219b332cb):
- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [29643d4593](https://bitbucket.org/atlassian/atlassian-frontend/commits/29643d4593):
- Updated dependencies
  [99fc6250f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fc6250f9):
- Updated dependencies
  [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies
  [4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):
- Updated dependencies
  [1f84cf7583](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f84cf7583):
- Updated dependencies
  [218fe01736](https://bitbucket.org/atlassian/atlassian-frontend/commits/218fe01736):
- Updated dependencies
  [dfb3b76a4b](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb3b76a4b):
- Updated dependencies
  [985db883ac](https://bitbucket.org/atlassian/atlassian-frontend/commits/985db883ac):
- Updated dependencies
  [bed9c11960](https://bitbucket.org/atlassian/atlassian-frontend/commits/bed9c11960):
- Updated dependencies
  [a30fe6c66e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a30fe6c66e):
- Updated dependencies
  [fdf30da2db](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf30da2db):
- Updated dependencies
  [d1c470507c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c470507c):
- Updated dependencies
  [fc1678c70d](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc1678c70d):
- Updated dependencies
  [2edd170a68](https://bitbucket.org/atlassian/atlassian-frontend/commits/2edd170a68):
- Updated dependencies
  [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies
  [5abcab3f7e](https://bitbucket.org/atlassian/atlassian-frontend/commits/5abcab3f7e):
- Updated dependencies
  [5d13d33a60](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d13d33a60):
- Updated dependencies
  [1d421446bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d421446bc):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/editor-core@116.0.0
  - @atlaskit/editor-common@43.2.0
  - @atlaskit/renderer@53.2.3
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5

## 0.6.11

### Patch Changes

- Updated dependencies
  [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):
- Updated dependencies
  [a6663b9325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6663b9325):
- Updated dependencies
  [5e4d1feec3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4d1feec3):
- Updated dependencies
  [0f8d5df4cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f8d5df4cf):
- Updated dependencies
  [ecfbe83dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecfbe83dfb):
- Updated dependencies
  [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies
  [93b445dcdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b445dcdc):
- Updated dependencies
  [ded174361e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ded174361e):
- Updated dependencies
  [80eb127904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80eb127904):
- Updated dependencies
  [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies
  [8c84ed470e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c84ed470e):
- Updated dependencies
  [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies
  [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies
  [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies
  [40bec82851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bec82851):
- Updated dependencies
  [8b652147a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b652147a5):
- Updated dependencies
  [b4fda095ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4fda095ef):
- Updated dependencies
  [0603c2fbf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0603c2fbf7):
- Updated dependencies
  [72d4c3298d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d4c3298d):
- Updated dependencies
  [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies
  [5ef337766c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ef337766c):
- Updated dependencies
  [dc0999afc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc0999afc2):
- Updated dependencies
  [6764e83801](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6764e83801):
- Updated dependencies
  [553915553f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/553915553f):
- Updated dependencies
  [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies
  [7f8de51c36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f8de51c36):
- Updated dependencies
  [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies
  [3a7c0bfa32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7c0bfa32):
- Updated dependencies
  [5455e35bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5455e35bc0):
- Updated dependencies
  [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies
  [2bb3af2382](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bb3af2382):
- Updated dependencies
  [611dbe68ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/611dbe68ff):
- Updated dependencies
  [0ea0587ac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ea0587ac5):
- Updated dependencies
  [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies
  [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/editor-core@115.0.0
  - @atlaskit/renderer@53.2.0
  - @atlaskit/theme@9.3.0

## 0.6.10

- Updated dependencies
  [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
  - @atlaskit/editor-core@114.1.0
  - @atlaskit/renderer@53.1.0
  - @atlaskit/editor-common@42.0.0

## 0.6.9

- Updated dependencies
  [f28c191f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f28c191f4a):
- Updated dependencies
  [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-core@114.0.0
  - @atlaskit/renderer@53.0.0
  - @atlaskit/editor-common@41.2.1

## 0.6.8

- Updated dependencies
  [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/editor-core@113.2.1
  - @atlaskit/util-service-support@5.0.0

## 0.6.7

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.-
  [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of
  "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

- Updated dependencies
  [4585681e3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4585681e3d):
  - @atlaskit/renderer@52.0.0
  - @atlaskit/editor-core@113.2.0

## 0.6.6

- Updated dependencies
  [166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):
- Updated dependencies
  [40ead387ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40ead387ef):
- Updated dependencies
  [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-core@113.0.0
  - @atlaskit/renderer@51.0.0
  - @atlaskit/editor-common@41.0.0

## 0.6.5

- Updated dependencies
  [08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):
  - @atlaskit/editor-core@112.44.2
  - @atlaskit/editor-common@40.0.0
  - @atlaskit/renderer@50.0.0

## 0.6.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 0.6.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 0.6.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 0.6.1

- Updated dependencies
  [ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):
  - @atlaskit/editor-core@112.13.9
  - @atlaskit/renderer@49.0.0

## 0.6.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 0.5.2

- Updated dependencies
  [5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):
  - @atlaskit/editor-core@112.0.0

## 0.5.1

- Updated dependencies
  [154372926b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154372926b):
  - @atlaskit/editor-core@111.0.0

## 0.5.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 0.4.6

- Updated dependencies
  [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/editor-core@109.0.0
  - @atlaskit/renderer@47.0.0

## 0.4.5

- Updated dependencies
  [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/editor-core@108.0.0
  - @atlaskit/renderer@46.0.0

## 0.4.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/button@12.0.3
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/editor-core@107.13.4
  - @atlaskit/renderer@45.6.1
  - @atlaskit/theme@8.1.7

## 0.4.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/theme@8.1.6
  - @atlaskit/editor-core@107.12.5
  - @atlaskit/renderer@45.4.3
  - @atlaskit/button@12.0.0

## 0.4.2

- Updated dependencies
  [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/editor-core@107.0.0
  - @atlaskit/renderer@45.0.0

## 0.4.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.4.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.3.0

- [minor][97cb912458](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97cb912458):

  - ED-6520: Enable noImplicitAny for embedded-document

## 0.2.9

- Updated dependencies
  [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-core@105.0.0
  - @atlaskit/renderer@43.0.0

## 0.2.8

- Updated dependencies
  [4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):
  - @atlaskit/editor-core@104.0.0
  - @atlaskit/renderer@42.0.0

## 0.2.7

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/editor-core@103.0.3
  - @atlaskit/renderer@41.2.1
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/theme@8.0.0

## 0.2.6

- Updated dependencies
  [60f0ad9a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f0ad9a7e):
  - @atlaskit/editor-core@103.0.0

## 0.2.5

- Updated dependencies
  [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/editor-core@102.0.0
  - @atlaskit/renderer@41.0.0

## 0.2.4

- Updated dependencies
  [4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):
  - @atlaskit/editor-core@101.0.0
  - @atlaskit/renderer@40.0.0

## 0.2.3

- Updated dependencies
  [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-common@32.0.2
  - @atlaskit/renderer@39.0.2
  - @atlaskit/editor-core@100.0.0

## 0.2.2

- Updated dependencies
  [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/editor-core@99.0.0
  - @atlaskit/renderer@39.0.0

## 0.2.1

- [patch][aa4daed8c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa4daed8c6):

  - Editor and Renderer props should be optional

## 0.2.0

- [minor][6ebe368d95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ebe368d95):

  - Allow passing through renderer props

## 0.1.1

- [patch][248e9f4db1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/248e9f4db1):

  - Make sure component goes into create-mode when document does not exist

## 0.1.0

- [minor][406952f08d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/406952f08d):

  - Allow passing through editor props

## 0.0.19

- Updated dependencies
  [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-core@98.0.0
  - @atlaskit/renderer@38.0.0

## 0.0.18

- Updated dependencies
  [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-core@97.0.0
  - @atlaskit/renderer@37.0.0

## 0.0.17

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/editor-core@96.0.0
  - @atlaskit/renderer@36.0.0

## 0.0.16

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/renderer@35.0.1
  - @atlaskit/editor-core@95.0.0

## 0.0.15

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-core@94.0.0
  - @atlaskit/renderer@35.0.0

## 0.0.14

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-core@93.0.0
  - @atlaskit/renderer@34.0.0

## 0.0.13

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-core@92.0.0
  - @atlaskit/renderer@33.0.0

## 0.0.12

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-core@91.0.0
  - @atlaskit/renderer@32.0.0

## 0.0.11

- [patch][5b00acc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b00acc):

  - support fetch by objectId

## 0.0.10

- [patch][062da38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/062da38):

  - update should use documentId from current state

## 0.0.9

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/button@10.0.4
  - @atlaskit/editor-core@90.2.1
  - @atlaskit/renderer@31.0.7
  - @atlaskit/theme@7.0.0

## 0.0.8

- Updated dependencies [3a7224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7224a):
  - @atlaskit/editor-core@90.0.0

## 0.0.7

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/theme@6.2.1
  - @atlaskit/editor-core@89.0.4
  - @atlaskit/renderer@31.0.2
  - @atlaskit/button@10.0.0

## 0.0.6

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-core@89.0.0
  - @atlaskit/renderer@31.0.0

## 0.0.5

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-core@88.0.0
  - @atlaskit/renderer@30.0.0

## 0.0.4

- [patch] Updated dependencies
  [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)
  - @atlaskit/editor-core@87.0.0

## 0.0.3

- [patch] Updated dependencies
  [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-core@86.0.0
  - @atlaskit/renderer@29.0.0

## 0.0.2

- [patch] Patch embedded-document
  [b362fbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b362fbd)

## 0.0.1

- [patch] Embedded Documents
  [3c9cf49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c9cf49)
