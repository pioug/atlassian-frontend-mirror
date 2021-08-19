# @atlaskit/popper

## 5.2.2

### Patch Changes

- [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal wiring up to the tokens techstack, no code changes.

## 5.2.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 5.2.0

### Minor Changes

- [`f6b951a51f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b951a51f2) - Removes usage of styled-components in favour of standardising on emotion

## 5.1.0

### Minor Changes

- [`81f4f9f7562`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81f4f9f7562) - Update core `@popperjs/core` dependency to `^2.9.1`, fixing some positioning bugs, such as in parents with `will-change` CSS properties set. For more information on the specific changes, see the popper docs.

## 5.0.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 5.0.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 5.0.2

### Patch Changes

- [`fc8f6e61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc8f6e61f3) - Fix codemod utilities being exposed through the codemod cli

## 5.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 5.0.0

### Major Changes

- [`044869b067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/044869b067) - This major release of Popper upgrades from react-popper v.1.3.6 to 2.2.3, which includes version 2 of Popper JS (@popperjs/core). This is a complete re-write of popper.js which comes with bundle-size and performance improvements, as well as a number of bug fixes and longer-term support.

  There are a number of major changes for consumers are listed below; ⚙️ indicates the change has codemod support:

  - **Component Props**:
    - ⚙️ `offset` is no longer a string, but an array of two integers (i.e. '0px 8px' is now [0, 8])
  - **Render Props**:
    - ⚙️ `outOfBoundaries` has been replaced with `isReferenceHidden`, and is now true when the popper is hidden (i.e. by a
      scroll container)
    - ⚙️ `scheduleUpdate`, for async updates, has been renamed to `update`, and now returns a Promise.
    - **✨new** `hasPopperEscaped` tracks when the reference element is fully clipped or hidden
    - **✨new** `forceUpdate` is exposed to perform synchronous updates
  - **Types**:
    - @atlaskit/popper now exports a number of useful types from both `@popperjs/core` (`Placement`) and `react-popper`
      (`ManagerProps`, `ReferenceProps`, `PopperProps`, `PopperArrowProps`, `PopperChildrenProps`, `StrictModifier`,
      `Modifier`).
    - Custom modifiers are now more strongly typed; to improve the specificity of the types, pass a generic type with
      the modifier names you plan to use.
  - **Custom modifiers**:
    This only affects users applying custom modifiers via the `modifiers` prop:
  - the `modifiers` prop has been significantly updated:
  - The format is now an array of objects, each labelled via a `name` key:value pair. Previously the prop
    was an object where each property was the modifier name.
  - Prop options are grouped together in an `options` object
  - default boundary paddings have been removed from `preventOverflow` and `flip`; to restore original
    padding, set `padding: 5`
  - modifiers that supported a `boundariesElement` option now have two options in its place:
    - `boundary`, which takes `clippingParents` (similar to `scrollParent`)
    - `rootBoundary` which takes `viewport` or `document` (replacing `viewport` and `window`respectively)

  Each modifier has more internal changes not listed here: see [the Popper JS docs](https://popper.js.org/docs/v2/modifiers/) for more information, as well as the [Popper migration guide](https://popper.js.org/docs/v2/migration-guide/) for an example of the new list structure.

  Due to the highly specific nature of these modifiers, codemod support is not provided for this change

  Note: due to a bug in `react-popper`, a console.error message relating to React `act()` may be raised on some tests. It should not cause test failures. This issue has been raised in [the React Popper issue tracker](https://github.com/popperjs/react-popper/issues/368)

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version of popper installed before you can run the codemod**

  `yarn upgrade @atlaskit/popper@^5.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage.
  For Atlassians, refer to [this doc](https://developer.atlassian.com/cloud/framework/atlassian-frontend/codemods/01-atlassian-codemods/) for more details on the codemod CLI.

## 4.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 4.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 3.1.13

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 3.1.12

### Patch Changes

- [patch][cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/button@13.3.11

## 3.1.11

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/theme@9.5.1

## 3.1.10

### Patch Changes

- [patch][671de2d063](https://bitbucket.org/atlassian/atlassian-frontend/commits/671de2d063):

  Updates `offset` prop description.

## 3.1.9

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5

## 3.1.8

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.

## 3.1.7

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for @atlaskit/popup

## 3.1.6

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.1.5

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 3.1.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.1.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.1.2

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 3.1.1

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 3.1.0

### Minor Changes

- [minor][0a3116e217](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a3116e217):

  Add ability to overwrite and adjust modifiers in popper

## 3.0.1

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 3.0.0

### Major Changes

- [major][ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):

  popper has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 2.0.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):

  - This major release indicates that this package is no longer under dev preview but is ready for use

## 0.4.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/theme@8.1.7

## 0.4.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 0.4.0

- [minor][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 0.3.7

- [patch][efc35d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efc35d1):

  - Internal changes: - Adding react-dom and build utils as dev dependencies - Adding unit test for server side rendering use-case - Adding unit test to cover Popper component

## 0.3.6

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.3.5

- [patch][82fc5f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82fc5f5):

  - Pinning react-popper to 1.0.2 to avoid recursive bug

## 0.3.4

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 0.3.3

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/theme@7.0.0

## 0.3.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.3.1

- [patch] Fix referenceElement overriding ref from Reference component [874d5bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/874d5bd)

## 0.3.0

- [minor] Adds replacementElement prop to enable onboarding use-case. See prop documentation [here](https://github.com/FezVrasta/react-popper#usage-without-a-reference-htmlelement) [1a752e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a752e6)

## 0.2.5

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 0.2.4

- [patch] Fixed popper placement offset to not fire deprecation warning. [4fcff1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4fcff1c)

## 0.2.3

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 0.2.2

- [patch] Using the latest popper to avoid recursive setState calls. [9dceca9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9dceca9)

## 0.2.1

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 0.2.0

- [minor] Bumped react-popper version to get bug fixes, also added offset prop [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
- [none] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
- [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
- [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
- [none] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)

## 0.1.2

- [patch] Replace @atlaskit/layer in date time picker with @atlaskit/popper, changed configuration of flipBehaviour modifier to use viewport as the element boundary rather than the window. [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
- [patch] Updated datetime-picker to use @atlaskit/popper internally instead of @atlaskit/layer. Minor fix to @atlaskit/popper, boundariesElement for flipbehaviour is now viewport and not window. [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)
- [none] Updated dependencies [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
- [none] Updated dependencies [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)

## 0.1.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 0.1.0

- [minor] Dev release for popper [e987222](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e987222)
