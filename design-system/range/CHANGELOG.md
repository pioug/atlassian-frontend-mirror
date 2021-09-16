# @atlaskit/range

## 5.0.11

### Patch Changes

- Updated dependencies

## 5.0.10

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 5.0.9

### Patch Changes

- [`b0183dd2972`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0183dd2972) - Updated package.json decriptions and documentation. Docs have moved from atlaskit.atlassian.com to atlassian.design

## 5.0.8

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 5.0.7

### Patch Changes

- [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed extraneous/unnecessary dependencies for design system components.

## 5.0.6

### Patch Changes

- [`3137d05e06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3137d05e06) - [ux] Fixed rendering bug inside of Range. Now the blue trackbar snaps to a step in the range to align with the position of the thumb.

## 5.0.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 5.0.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 5.0.1

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 5.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 4.0.0

### Major Changes

- [`da1c8c16d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da1c8c16d4) - In this version we made range dramatically faster and lighter 🤩

  ### Changes

  In `4.0.0` we bring significant performance improvements all for just the cost of 1 breaking change 😮. That's not all folks because this update comes with a 🤑 FREE 🤑 codemod for you to upgrade with.

  - Range no longer has a `peerDependency` on `styled-components@3`. Internally range is now using `@emotion/core` for styling
  - A performance issue made the range noticeably laggy with large ranges. With this change we are no longer creating new classes on each step change and instead updating a css variable, making Range noticeably smoother.
  - Changed the `inputRef` prop to be `ref` which returns the `ref` of the range input using `React.forwardRef`. This new `ref` prop will accept the type of the old `inputRef` prop, `(input?: HTMLInputElement) => any`, as well as if `ref` is created with `React.createRef`.
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

  - You first need to upgrade to `4.0.0` **before** you run the codemod cli. This is because the cli will look in your local `node_modules` for the codemod which is published inside the `spinner` package.
  - The codemod is pretty clever, and will respect aliasing as well as using custom naming for the default import

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

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 3.0.11

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
- Updated dependencies [6a8bc6f866](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a8bc6f866):
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

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 3.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

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

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/checkbox@9.0.0

## 3.0.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 3.0.0

### Major Changes

- [major][4a08d1912e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a08d1912e):

  @atlaskit/range has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 2.0.2

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/tooltip@15.0.0

## 2.0.1

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/theme@9.1.0

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][546b636a36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/546b636a36):

  - This major release indicates that this package is no longer under dev preview but is ready for use

## 0.2.2

- [patch][1f2a181b0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f2a181b0f):

  - onChange is no longer overridden by spread props. As a result this component should now work in uncontrolled mode

## 0.2.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 0.2.0

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

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 0.1.0

- [minor][8945a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8945a58):

  - Initial release
