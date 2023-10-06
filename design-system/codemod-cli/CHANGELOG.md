# @atlaskit/codemod-cli

## 0.15.0

### Minor Changes

- [#40270](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40270) [`27bbdfcb6ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27bbdfcb6ad) - This update includes several improvements and fixes to the css-to-design-tokens preset:

  - Resolved transformation errors.
  - Added support for new color properties such as `border-color-left`.
  - Omitted unrecognized functions, including `url`, and certain Less functions to prevent compile errors.
  - Enhanced codemod to only substitute raw, named colors and known variables (like old Atlaskit colors), and to avoid substituting variables not related to colors.
  - Introduced token filtering for more precise token identification.
  - Added parsing for gradient functions and multiple colors.

## 0.14.0

### Minor Changes

- [#39017](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39017) [`26d4e25c2b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26d4e25c2b3) - replace strings that contain only the color name; replace hard-coded colors in template literals that have CSS declarations; better color names for literals that have multiple expressions; replace full value of box-shadow in template literals

## 0.13.4

### Patch Changes

- [#38813](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38813) [`9c4335f135d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c4335f135d) - Updated README.md

## 0.13.3

### Patch Changes

- [#35950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35950) [`50cf866a219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50cf866a219) - bump semver

## 0.13.2

### Patch Changes

- [#32800](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32800) [`07f0eb8e1f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07f0eb8e1f4) - Refactors `theme-to-design-tokens` to improve its accuracy

## 0.13.1

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.13.0

### Minor Changes

- [#34602](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34602) [`c528571ef3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c528571ef3d) - Introduces new codemod "theme-remove-deprecated-mixins" to automate the removal of deprecated color mixins

## 0.12.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.12.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.12.1

### Patch Changes

- [#33377](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33377) [`07020547a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07020547a93) - Safe direct migraiton to design token API. This change is not visible for those who aren't using design tokens

## 0.12.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.11.5

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634) [`cc84a1ed227`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc84a1ed227) - Updates default behaviour of codemods when a suggested token cannot be found
- Updated dependencies

## 0.11.4

### Patch Changes

- [#29170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29170) [`708957d360f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/708957d360f) - Upgrade a dependency package simple-git

## 0.11.3

### Patch Changes

- [#27875](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27875) [`b14dca751fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b14dca751fa) - Exclude the chart tokens from the list of tokens that we pass into the codemod.

## 0.11.2

### Patch Changes

- Updated dependencies

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [#28150](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28150) [`00ea8db4763`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ea8db4763) - Upgrading the simple-git version

## 0.10.5

### Patch Changes

- [#27794](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27794) [`7a958dda205`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a958dda205) - Updates tokens codemods to only suggest active tokens

## 0.10.4

### Patch Changes

- Updated dependencies

## 0.10.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.10.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.10.1

### Patch Changes

- [#23137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23137) [`6ec444547a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ec444547a9) - Applies various fixes to the tokens post-css codemod. Box shadows and border properties are respected syntactically

## 0.10.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570) [`54c548f34ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54c548f34ca) - Adds preset codemod for css-to-design-tokens. This codemod transforms css,scss,less color usage to design tokens.

## 0.9.7

### Patch Changes

- Updated dependencies

## 0.9.6

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes to support Node 16 Typescript definitions from `@types/node`.

## 0.9.5

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.9.4

### Patch Changes

- Updated dependencies

## 0.9.3

### Patch Changes

- [#20310](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20310) [`1977986ea86`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1977986ea86) - Bumping dependencies via Renovate:

  - simple-git

## 0.9.2

### Patch Changes

- [#19927](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19927) [`5c45b17200d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c45b17200d) - Bumping dependencies via Renovate:

  - simple-git

## 0.9.1

### Patch Changes

- Updated dependencies

## 0.9.0

### Minor Changes

- [#19516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19516) [`2b8c48b26ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b8c48b26ab) - Instrumented `@atlaskit/codemod-cli` with none interaction support

  New argument for the codemod-cli has been added to support preselect transform in command line.

## 0.8.7

### Patch Changes

- [#18960](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18960) [`54a44d46e29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a44d46e29) - Renovate Bot upgraded simple-git from ^1.130.0 to 2.48.0

## 0.8.6

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [#18965](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18965) [`e4dd80187f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dd80187f5) - Refactors theme-to-tokens codemod with new token names + simplifies logic

## 0.8.4

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Adds a new codemod preset `theme-to-design-tokens` that helps migrate from atlaskit theme to atlaskit tokens.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Theme preset is now picked up by the CLI.
- Updated dependencies

## 0.8.3

### Patch Changes

- [#17016](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17016) [`f4d22b1c8af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4d22b1c8af) - Ignore directory filtering logic if filtering returns no paths

## 0.8.2

### Patch Changes

- [#16649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16649) [`650aa20f6fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650aa20f6fe) - Upgrade meow dependency

## 0.8.1

### Patch Changes

- [#16252](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16252) [`982e2f3d3d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/982e2f3d3d2) - Directory filtering now defaults to true

## 0.8.0

### Minor Changes

- [#15374](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15374) [`f3d46c395b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3d46c395b4) - Add path filtering to codemod-cli

## 0.7.0

### Minor Changes

- [#13957](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13957) [`d3a285fdc82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3a285fdc82) - Add support for codemods authored as .tsx files

## 0.6.7

### Patch Changes

- [#12535](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12535) [`4a67fb592c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a67fb592c8) - Bump jscodeshift to 0.13.0.
  [Commit Changelog](https://github.com/facebook/jscodeshift/commit/2fd5e11f469427d474983b2d1c47be9408677591).

  ### Added

  - Added a `--fail-on-error` flag to return a `1` error code when errors were found (#416, @marcodejongh)
  - Created `template.asyncExpression` (#405, @jedwards1211)

  ### Changed

  - Removed lodash dependency from tsx parser (#432, @JHilker and @robyoder)

## 0.6.6

### Patch Changes

- [#11911](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11911) [`d0ef46dee01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0ef46dee01) - Removes ts-node / cjs bundle switcher from main entrypoint of codemod-utils and updated codemod-cli scripts to support

## 0.6.5

### Patch Changes

- [#10735](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10735) [`fdbd74cdb32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdbd74cdb32) - Remove --no-babel flag when parser flow is used

## 0.6.4

### Patch Changes

- [#10705](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10705) [`6a0b92d2af9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a0b92d2af9) - MONO-103 Fixed bug were codemod-cli would erronously run

## 0.6.3

### Patch Changes

- [#10392](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10392) [`30c279f85eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30c279f85eb) - Bump atlassian-forks-jscodeshift to "^0.12.2-atlassian-6".

## 0.6.2

### Patch Changes

- [#10060](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10060) [`6c420d1698d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c420d1698d) - Fix application of --no-babel flag

## 0.6.1

### Patch Changes

- [#10014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10014) [`13d9c023e8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d9c023e8d) - Log the package version when running codemod cli

## 0.6.0

### Minor Changes

- [#9924](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9924) [`cdd78d4ff38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdd78d4ff38) - The codemod-cli can fail on error when the flag `--fail-on-error` is passed, it will return a 1 exit code when errors were found during execution of codemods

  This flag `--fail-on-error` was added as part of this [PR](https://github.com/facebook/jscodeshift/pull/416) that forked `jscodeshift`.

  In Atlassian Frontend, we are now using the fork of `jscodeshift`, [atlassian-forks-jscodeshift](https://www.npmjs.com/package/atlassian-forks-jscodeshift) till we get this change back to the library.

  Add `--fail-on-error` in the config to be passed as a flag when the codemod runs - only for branch integrator.

## 0.5.3

### Patch Changes

- [#9832](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9832) [`d72b572dfc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72b572dfc2) - bumped jscodeshift@^0.11.0
- [`d72b572dfc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72b572dfc2) - bumped @types/jscodeshift@^0.11.0

## 0.5.2

### Patch Changes

- [#9482](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9482) [`cfd7c0b5bcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfd7c0b5bcc) - Update the logic to properly check for the env var FAIL_CODEMODS_ON_ERROR and add `--no-babel` when running js file.

## 0.5.1

### Patch Changes

- [#9018](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9018) [`6afd79db199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6afd79db199) - Bump dependency "meow" to version ^6.0.0

## 0.5.0

### Minor Changes

- [#8789](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8789) [`a9e359236b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e359236b4) - The codemod-cli can fail on error when the flag `--fail-on-error` is passed, it will return a 1 exit code when errors were found during execution of codemods
  This flag `--fail-on-error` was added as part of this [PR](https://github.com/facebook/jscodeshift/pull/416) that forked `jscodeshift`.
  In Atlassian Frontend, we are now using the fork of `jscodeshift`, [atlassian-forks-jscodeshift](https://www.npmjs.com/package/atlassian-forks-jscodeshift) till we get this change back to the library.

  Add `--fail-on-error` in the config to be passed as a flag when the codemod runs - only for branch integrator.

## 0.4.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.4.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.4.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.4.1

### Patch Changes

- [#3841](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3841) [`88ceeac950`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88ceeac950) - Fix CLI not working due to missing ts-node dependency

## 0.4.0

### Minor Changes

- [#3197](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3197) [`d9f34d27e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9f34d27e8) - Add --packages flag to automatically run codemods for specific packages
  Add --sinceRef flag to automatically run codemods that have been upgraded since a certain git ref
  Add support for running over multiple filepaths
  Extend support to restricted scoped packages
  Expose programmatic API

### Patch Changes

- [`d9f34d27e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9f34d27e8) - Fix transforms being sourced from nested node_modules directories
  Return non-zero exit codes on failure

## 0.3.4

### Patch Changes

- [#3093](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3093) [`f664568219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f664568219) - Codemods are now presented with their module name prepended to make it easier to see which codemod belongs to which packages

## 0.3.3

### Patch Changes

- [#3062](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3062) [`4be3a868e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4be3a868e1) - Ensure the library is running with the Node environment + adds ts-lib

## 0.3.2

### Patch Changes

- [#3002](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3002) [`78dde805ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78dde805ef) - Fixes an issue with loading presets in javascript

## 0.3.1

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137) [`b4e29ceda2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4e29ceda2) - Fixed broken entrypoint

## 0.3.0

### Minor Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868) [`332a418dd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/332a418dd1) - Adds the concept of presets to act as a library of codemods relevant to an entire library or repo rather than specific component codemods. Also introduces the styled-to-emotion codemod

## 0.2.0

### Minor Changes

- [minor][63787f3327](https://bitbucket.org/atlassian/atlassian-frontend/commits/63787f3327):

  Initial implementation of the Codemod-cli

### Patch Changes

- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
  - @atlaskit/docs@8.5.1
