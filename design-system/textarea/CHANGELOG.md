# @atlaskit/textarea

## 4.2.1

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [`ae281b57bcd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae281b57bcd) - Instrumented Radio with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes

### Patch Changes

- [`2d7cc544696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d7cc544696) - Updates token usage to match the latest token set
- Updated dependencies

## 4.1.3

### Patch Changes

- [`c5785203506`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5785203506) - Updated homepage in package.json

## 4.1.2

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 4.1.1

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 4.1.0

### Minor Changes

- [`7af2427f3a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7af2427f3a8) - [ux] Update form field examples for validation and add a new prop to RadioGroup component

## 4.0.2

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 4.0.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 4.0.0

### Major Changes

- [`782b6e5182`](https://bitbucket.org/atlassian/atlassian-frontend/commits/782b6e5182) - ### Brief

  The goal of this major for textarea is to improve the component's performance, by both

  reducing static structure and avoiding unnecessary function calls.

  We have made internal refactors and optimizations to improve textarea performance.
  Some changes made are as follows:

  - Moving TextArea to a single element (removed an internal wrapping element)

  - Replace `styled-components` to `emotion` as styling library

  - Moving internal component analytics to a more efficient usePlatformLeafEventHandler hook

  - Refactoring styles to recalculate only when theme & certain props change

  - Controlling CSS change via attributes instead of props

  #### TextArea now has single DOM element

  DOM element 2 -> 1
  Removed div surrounding (wrapper) native textarea element and moved all behaviors
  and CSS to that single element.

  Measuring the height of the textarea element will now get different raw values
  because the text area is now rendering it’s own padding and border,
  but computed height is still the same.

  #### Upgrading with codemod

  ```

  # You first need to have the latest textarea installed before you can run the codemod

  yarn upgrade @atlaskit/textarea@^4.0.0
  ```

# Run the codemod cli

# Pass in a parser for your codebase

npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]

````

## 3.0.5

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 3.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
to prevent duplicates of tslib being bundled.

## 3.0.1

### Patch Changes

- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 3.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 2.2.9

### Patch Changes

- Updated dependencies

## 2.2.8

### Patch Changes

- [`7aa4756beb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aa4756beb) - Change imports to comply with Atlassian conventions- Updated dependencies

## 2.2.7

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- @atlaskit/docs@8.5.1
- @atlaskit/theme@9.5.3
- @atlaskit/analytics-next@6.3.6
- @atlaskit/button@13.3.10

## 2.2.6

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- @atlaskit/docs@8.4.0
- @atlaskit/webdriver-runner@0.3.0
- @atlaskit/button@13.3.9

## 2.2.5

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
- @atlaskit/webdriver-runner@0.2.0
- @atlaskit/button@13.3.8

## 2.2.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

- @atlaskit/docs@8.3.2
- @atlaskit/visual-regression@0.1.9
- @atlaskit/analytics-next@6.3.5
- @atlaskit/button@13.3.7
- @atlaskit/theme@9.5.1
- @atlaskit/type-helpers@4.2.3

## 2.2.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

Added name prop to component prop types.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- @atlaskit/analytics-next@6.3.3

## 2.2.2

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

Rebuilds package to fix typescript typing error.

## 2.2.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 2.2.0

### Minor Changes

- [minor][5679449552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5679449552):

Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 2.1.10

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.1.9

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 2.1.8

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

Change all the imports to theme in Core to use multi entry points

## 2.1.7

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

Updates component maintainers

## 2.1.6

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

**Breaking changes**

- `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
- `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

**Breaking changes to TypeScript annotations**

- `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
- Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
- Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
- Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
- Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
- Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
- Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
- Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
- Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 2.1.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

Consume analytics-next ts type definitions as an ambient declaration.

## 2.1.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

Fixes bug, missing version.json file

## 2.1.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root
  Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 2.1.2

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

Before:

```typescript
withAnalyticsEvents()(Button) as ComponentClass<Props>;
````

After:

```typescript
withAnalyticsEvents<Props>()(Button);
```

## 2.1.1

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 2.1.0

### Minor Changes

- [minor][2b26a6f408](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b26a6f408):

  Added placeholder prop for textareas

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):

  - This major release indicates that this package is no longer under dev preview but is ready for use

## 0.4.6

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 0.4.5

- [patch][cd67ae87f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd67ae87f8):

  - Stop defaultValue from being omitted from props that are spread onto textarea
  - Constraint type of value and defaultValue to string

## 0.4.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/theme@8.1.7

## 0.4.3

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 0.4.2

- [patch][cf018d7630](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf018d7630):

  - Allow RefObject to be passed in as ref (i.e. using React.createRef()) and set inner padding to 0

## 0.4.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.0

- [minor][f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):

  - Fix bug: previous size was size for isCompact, and isCompact did not do anything. Now normal textarea is slightly larger and isCompact makes it the previous size

## 0.3.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.3.1

- [patch][90a14be594](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a14be594):

  - Fix broken type-helpers

## 0.3.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.2.6

- [patch][1b952c437d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b952c437d):

  - Change order of props spread to fix textarea focus glow, and smart resizing when onChange passed in

## 0.2.5

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/theme@8.0.0

## 0.2.4

- [patch][aab267bb3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aab267bb3a):

  - Added test to make sure the props are passed down to hidden input

## 0.2.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.2.2

- [patch][9e6b592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e6b592):

  - Added tslib import for textarea

## 0.2.1

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 0.2.0

- [minor][76a8f1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76a8f1c):

  - Convert @atlaskit/textarea to Typescript
    - Dist paths have changed, if you are importing by exact file path you will need to update your imports `import '@atlaskit/button/dist/es5/components/ButtonGroup'`
    - Flow types are not present any more, Typescript definitions are shipped instead

## 0.1.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.1.0

- [minor][9d77c4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d77c4e):

  - New textarea package, meant to be a replacement for field-text-area, normalised component architecture, removed dependency on @atlaskit/field-base, updated to use new @atlaskit/theme api
