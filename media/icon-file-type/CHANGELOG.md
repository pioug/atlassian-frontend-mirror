# @atlaskit/icon-file-type

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

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

## 6.9.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 6.8.0

### Minor Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  Re-building the icons due to UNSAFE types and entrypoints being renamed in the `@atlaskit/icon`
  package.

### Patch Changes

- Updated dependencies

## 6.7.0

### Minor Changes

- [#155379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155379)
  [`d703fb68d3059`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d703fb68d3059) -
  Run build-glyphs in icon packages.
- [#155379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155379)
  [`d703fb68d3059`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d703fb68d3059) -
  Add static imports for icon metadata.

### Patch Changes

- Updated dependencies

## 6.6.0

### Minor Changes

- [#154636](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154636)
  [`6bd3aebdb9761`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6bd3aebdb9761) -
  Run build-glyphs in icon packages.

### Patch Changes

- Updated dependencies

## 6.5.0

### Minor Changes

- [#132147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132147)
  [`580c0e6f55a69`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/580c0e6f55a69) -
  Updates to support React 18

## 6.4.9

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 6.4.8

### Patch Changes

- [#80509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80509)
  [`fcf7481f594f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcf7481f594f) -
  Upgrade dependency of `@emotion/styled` to version 11

## 6.4.7

### Patch Changes

- [#64934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64934)
  [`532734a858a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/532734a858a1) -
  Update to internal metadata order, following update of @atlaskit/icon-build-process

## 6.4.6

### Patch Changes

- Updated dependencies

## 6.4.5

### Patch Changes

- [#42577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42577)
  [`d51b45b02fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d51b45b02fb) - Add
  component to push model consumption in JFE

## 6.4.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 6.4.3

### Patch Changes

- [#33728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33728)
  [`48e4a655534`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48e4a655534) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 6.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 6.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 6.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 6.3.8

### Patch Changes

- [#32171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32171)
  [`daefffa7e1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/daefffa7e1a) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 6.3.7

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`ea9ecef219f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea9ecef219f) - Updated
  Icon File Type documentation with new tab structure

## 6.3.6

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`d2f7ffb6b78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2f7ffb6b78) - [ux]
  Updated the fill color of the following file icons to use new colors from the new color palette to
  avoid contrast issue in dark mode:

  - archive
  - excel-spreadsheet
  - executable
  - figma
  - generic
  - google-form
  - presentation
  - word-document

## 6.3.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 6.3.4

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 6.3.3

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`df2bb5891ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df2bb5891ef) - Use
  named export of base icon in all icon-\* glyphs

## 6.3.2

### Patch Changes

- [#10522](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10522)
  [`72ef8bafec9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72ef8bafec9) - Add
  "./glyph" entry point.

## 6.3.1

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`877e9e0b9f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/877e9e0b9f6) - Icon
  package dependency now uses carat range.

## 6.3.0

### Minor Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`62968ed79be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62968ed79be) - Icon
  file type now utilises the base icon from `@atlaskit/icon`.

### Patch Changes

- [`469f36d9629`](https://bitbucket.org/atlassian/atlassian-frontend/commits/469f36d9629) - Icon
  build tooling has been updated.
- [`3de10e7652e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3de10e7652e) -
  Documentation updates and fixes to types for all icon packages.
- [`d98f1bb1169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d98f1bb1169) - Local
  build tooling improvements.
- [`3f36b048938`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f36b048938) - The
  color props have been removed from the TypeScript type definitions. The behavior has never worked
  with the glyphs but was included in the type definitions incorrectly.
- Updated dependencies

## 6.2.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`6967b72747c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6967b72747c) - Icon
  file type now ships with cjs, esm, and es2019 bundles for exported components and utils. Glyphs
  unfortunately aren't included and still only export cjs bundles.

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- [`f922302ad53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f922302ad53) - Icons no
  longer ship with the `focusable` attribute in their glyph exports. This attribute was only
  required for IE11 support. This is purely a build change and has no effect on user API.

## 6.1.4

### Patch Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`0741b1556f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0741b1556f6) - All icon
  glpyhs are now built without inline extends helpers, reducing their bundlesize.
- [`8d6c79b9055`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d6c79b9055) - Typedefs
  of glyphs have been updated to reflect an API change that occured in version 15. For context,
  `onClick` was removed as a functional prop but it was still supported by the types. This may have
  resulted in a confusing developer experience although the fundamental behaviour has been
  consistent since version 15.

## 6.1.3

### Patch Changes

- [#7425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7425)
  [`b9f0d16300`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9f0d16300) -
  Re-generated icons using a newer version of the build process

## 6.1.2

### Patch Changes

- [#7589](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7589)
  [`c65f28c058`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c65f28c058) - Change
  codemod to return raw source if it is not transforming a file.

  Otherwise it would run prettier which can lead to some invalid syntax outputted in edge cases.
  This is likely due to an issue in either `codemod-cli` or `jscodeshift`.

## 6.1.1

### Patch Changes

- [#7458](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7458)
  [`8990bf36a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8990bf36a9) - Add a
  missing codemod for the entrypoint change in 6.1.0

  ***

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed before you can run the
  codemod**

  `yarn upgrade @atlaskit/PACKAGE@^VERSION`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to
  [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details
  on the codemod CLI.

## 6.1.0

### Minor Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`fbdf356800`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbdf356800) - Remove
  undocumented metadata export from main entry point. To import metadata instead do it from the
  /metadata entrypoint.

## 6.0.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 6.0.5

### Patch Changes

- Updated dependencies

## 6.0.4

### Patch Changes

- [#4649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4649)
  [`d6ff4c7dce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6ff4c7dce) - Removes
  unused (and incorrect) es2019 key in package.json

## 6.0.3

### Patch Changes

- [#4682](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4682)
  [`f51e6ff443`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f51e6ff443) - License
  updated to Apache 2.0 (previously under the ADG license)

## 6.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 6.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 6.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- [patch][aff1210e19](https://bitbucket.org/atlassian/atlassian-frontend/commits/aff1210e19):

  Figma file type icon added.- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies
  [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 5.0.3

### Patch Changes

- [patch][fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):

  Corrects accessibility behavior for wrapping span. It now will now:

  - conditionally set the `aria-label` if `label` is defined
  - conditionally set the `role` to either `img` if `label` is defined, or `presentation` if it is
    not defined- Updated dependencies
    [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
  - @atlaskit/docs@8.4.0
  - @atlaskit/button@13.3.9
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/textfield@3.1.9
  - @atlaskit/tooltip@15.2.5

## 5.0.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 5.0.1

### Patch Changes

- [patch][65c8aab025](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c8aab025):

  Fix main/module fields in package.json pointing to the wrong place- Updated dependencies
  [ccbd1b390b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ccbd1b390b):

  - @atlaskit/build-utils@2.6.0

## 5.0.0

### Major Changes

- [major][f9b5e24662](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9b5e24662):

  @atlaskit/icon-file-type and @atlaskit/icon-object have been converted to TypeScript to provide
  static typing. Flow types are no longer provided. No API or bahavioural changes.

## 4.0.10

### Patch Changes

- [patch][4dd459fc56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4dd459fc56):

  Dependency 'uuid' is unused in package.jon.

## 4.0.9

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 4.0.8

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.7

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 4.0.6

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 4.0.5

### Patch Changes

- [patch][9885da7ac4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9885da7ac4):

  Adding missing Atlassian / ADG License.

## 4.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 4.0.3

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/tooltip@15.0.0

## 4.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 4.0.1

- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/modal-dialog@10.0.0

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 3.0.8

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-text@8.0.3
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 3.0.7

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 3.0.6

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 3.0.5

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 3.0.4

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/modal-dialog@8.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 3.0.3

- [patch][1d1f6d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d1f6d1):

  - Make icon glyphs not import metadata

## 3.0.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/field-text@7.0.18
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 3.0.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-text@7.0.16
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 3.0.0

- [major][ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):

  - Remove onClick props as icon is only a presentational placeholder. Please wrap icon into a
    Button or a Link component.

## 2.0.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/field-text@7.0.15
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 2.0.0

- [patch][29b160f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29b160f):

  - Simplify the icons build process

  Icons no longer need a custom `build` step to be accurate on npm. This has come about by renaming
  the `es5` folder to `cjs`. If you weren't reaching into our package's internals, you shouldn't
  notice.

- [major][80304f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80304f0):

  **NOTE** Unless you are using the `iconsInfo` export, this change is not breaking.

  - Rename `iconsInfo` to `metadata` to more accurately reflect its role

  This change comes with rethinking what is exported from this object, which no longer includes
  copies of the icons. If you need to rely on the metadata to get the packages, each should be
  required by your own code.

  The `icon-explorer` has an example of how to do this.

- Updated dependencies [b29bec1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b29bec1):
  - @atlaskit/icon-build-process@0.1.0

## 1.0.4

- [patch] Update to use babel-7 for build processes
  [e7bb74d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7bb74d)

## 1.0.3

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 1.0.2

- [patch] Publish utils folder
  [272208b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/272208b)

## 1.0.1

- [patch] icon-file-type and icon-object publish glyphs, svgs, and es5 instead of just dist
  [0823d35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0823d35)

## 1.0.0

- [major] Release icon-object and icon-file-type
  [709b239](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/709b239)
