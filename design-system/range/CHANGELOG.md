# @atlaskit/range

## 7.3.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 7.2.0

### Minor Changes

- [#93978](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93978)
  [`1a198c473f9d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a198c473f9d) -
  Add support for React 18 in non-strict mode.

## 7.1.8

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 7.1.7

### Patch Changes

- [#38731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38731)
  [`9af31f3c1ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9af31f3c1ae) - Delete
  version.json

## 7.1.6

### Patch Changes

- [#38201](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38201)
  [`356d6ebed05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/356d6ebed05) - This
  package is now onboarded onto the product push model.

## 7.1.5

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 7.1.4

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 7.1.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 7.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 7.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 7.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 7.0.4

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`22b754d311f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22b754d311f) - Updates
  usage of removed design token `utilities.UNSAFE_util.transparent` in favour of its replacement
  `utilities.UNSAFE.transparent`
- Updated dependencies

## 7.0.3

### Patch Changes

- Updated dependencies

## 7.0.2

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`78741dd1644`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78741dd1644) - [ux]
  Breaking visual changes to range to afford better contrast:

  - The scrubber now applies the same color as the foreground
  - The disabled state has been altered; it's now a consistently applied opacity state overlay
    across the whole element
  - The input now uses :focus-visible, rather than :focus and applies an offset focus ring

## 6.1.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 6.1.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`1966ffa850d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1966ffa850d) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 6.0.9

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 6.0.8

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 6.0.7

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`8202e37941b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8202e37941b) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 6.0.6

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.

## 6.0.5

### Patch Changes

- Updated dependencies

## 6.0.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 6.0.3

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Major Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`17d9edaa415`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17d9edaa415) - In
  preparation for compiled adoption, internal styling has been rewritten to remove dynamic styles.
  This includes custom theming using the `theme` prop, which has been removed.

  If you are not using the `theme` prop, there should be no breaking changes.

## 5.1.4

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 5.1.3

### Patch Changes

- Updated dependencies

## 5.1.2

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 5.1.1

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 5.1.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`21c178539a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21c178539a2) - [ux]
  Instrumented range with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 5.0.11

### Patch Changes

- Updated dependencies

## 5.0.10

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 5.0.9

### Patch Changes

- [#11980](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11980)
  [`b0183dd2972`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0183dd2972) - Updated
  package.json decriptions and documentation. Docs have moved from atlaskit.atlassian.com to
  atlassian.design

## 5.0.8

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 5.0.7

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed
  extraneous/unnecessary dependencies for design system components.

## 5.0.6

### Patch Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930)
  [`3137d05e06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3137d05e06) - [ux] Fixed
  rendering bug inside of Range. Now the blue trackbar snaps to a step in the range to align with
  the position of the thumb.

## 5.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 5.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 5.0.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages
- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form
  elements now have a default font explicitly set

## 5.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 4.0.0

### Major Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`da1c8c16d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da1c8c16d4) - In this
  version we made range dramatically faster and lighter 🤩

  ### Changes

  In `4.0.0` we bring significant performance improvements all for just the cost of 1 breaking
  change 😮. That's not all folks because this update comes with a 🤑 FREE 🤑 codemod for you to
  upgrade with.

  - Range no longer has a `peerDependency` on `styled-components@3`. Internally range is now using
    `@emotion/core` for styling
  - A performance issue made the range noticeably laggy with large ranges. With this change we are
    no longer creating new classes on each step change and instead updating a css variable, making
    Range noticeably smoother.
  - Changed the `inputRef` prop to be `ref` which returns the `ref` of the range input using
    `React.forwardRef`. This new `ref` prop will accept the type of the old `inputRef` prop,
    `(input?: HTMLInputElement) => any`, as well as if `ref` is created with `React.createRef`.
  - A new example that shows off how to rate limit your `onChange` event

  ### Automatic upgrading

  ```
  # You first need to have the latest range installed before you can run the codemod
  yarn upgrade @atlaskit/range@^4.0.0

  # Run the codemod cli
  # Pass in a parser for your codebase
  npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
  ```

  #### Notes

  - You first need to upgrade to `4.0.0` **before** you run the codemod cli. This is because the cli
    will look in your local `node_modules` for the codemod which is published inside the `spinner`
    package.
  - The codemod is pretty clever, and will respect aliasing as well as using custom naming for the
    default import

  #### Ez pz lemon squeezy

  The codemod will change the `inputRef` prop to `ref`

  ```diff
  - <Range inputRef={inputRef} />
  + <Range ref={inputRef} />

  - <Range
  -   inputRef={ref => {
  -     myRangeRef = ref;
  -   }}
  - />
  + <Range
  +   ref={ref => {
  +     myRangeRef = ref;
  +   }}
  + />

  ```

## 3.0.12

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 3.0.11

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
- Updated dependencies
  [6a8bc6f866](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a8bc6f866):
  - @atlaskit/theme@9.5.0
  - @atlaskit/checkbox@10.1.5
  - @atlaskit/tooltip@15.2.1

## 3.0.10

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 3.0.9

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.0.8

- Updated dependencies
  [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 3.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 3.0.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.0.5

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 3.0.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 3.0.3

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 3.0.2

- Updated dependencies
  [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/checkbox@9.0.0

## 3.0.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 3.0.0

### Major Changes

- [major][4a08d1912e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a08d1912e):

  @atlaskit/range has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 2.0.2

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/tooltip@15.0.0

## 2.0.1

- Updated dependencies
  [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/theme@9.1.0

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][546b636a36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/546b636a36):

  - This major release indicates that this package is no longer under dev preview but is ready for
    use

## 0.2.2

- [patch][1f2a181b0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f2a181b0f):

  - onChange is no longer overridden by spread props. As a result this component should now work in
    uncontrolled mode

## 0.2.1

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 0.2.0

- [minor][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only
  distribute esm. This means all distributed code will be transpiled, but will still contain
  `import` and `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder,
  we have to worry about how consumers might be using things that aren't _actually_ supposed to be
  used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of
  packages bundling all of theme, just to use a single color, especially in situations where tree
  shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have
  multiple distributions as they would need to have very different imports from of their own
  internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node
  environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but
  we see this as a pretty sane path forward which should lead to some major bundle size decreases,
  saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in
  [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for
  external) if you have any questions or queries about this.

## 0.1.3

- [patch][aab267bb3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aab267bb3a):

  - Added test to make sure the props are passed down to hidden input

## 0.1.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 0.1.1

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and
    make theming simpler. Update all dependant components.

## 0.1.0

- [minor][8945a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8945a58):

  - Initial release
