# @atlaskit/inline-edit

## 12.1.2

### Patch Changes

- Updated dependencies

## 12.1.1

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [`5c29b7f70ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c29b7f70ff) - Instrumented Inline-edit with the new theming package, `@atlaskit/tokens`.

  Tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 12.0.8

### Patch Changes

- Updated dependencies

## 12.0.7

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 12.0.8

### Patch Changes

- [`f9783cebfe6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9783cebfe6) - Added action button wrapper back to fix transparent background color issue

## 12.0.7

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 12.0.6

### Patch Changes

- Updated dependencies

## 12.0.5

### Patch Changes

- [`d65547e28ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d65547e28ba) - Fixed a few UI defects:

  - reset line-height to 1 for inline edit container
  - fixed action buttons background color issue

## 12.0.4

### Patch Changes

- [`ca0546ece25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca0546ece25) - Fixed InlineEditableTextfield entry point config issue, it should have its own entry point as default export.

## 12.0.3

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade `@types/react-select` to `v3.1.2` and fix type breaks
- Updated dependencies

## 12.0.2

### Patch Changes

- [`0e9764f7384`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e9764f7384) - Added codemod-utils as a package dependency, also fixed a few codemod functions

  - elevate `InlineEditStateless` as default component as we have merged stateful and stateless
  - make sure named import works for `InlineEditableTextfield`

## 12.0.1

### Patch Changes

- [`bfb4fe65750`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfb4fe65750) - Added missed codemod (handling editView function defined outside) case for migration

## 12.0.0

### Major Changes

- [`b9987e84f3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9987e84f3f) - In this version we bring significant performance improvements as well as improving the experience of using `inline-edit`.

  - removed dynamic loading of inline dialog allowing consumers to compose their own experiences
  - merged controlled & uncontrolled inline edit components
  - split `InlineEditableTextfield` to its own entry-point

  ### Handling errors with inline edit

  You can now customise `editView` when its content is invalid. For example, use the `errorMessage` and `isInvalid` props to show errors with inline dialog:

  ```jsx
  editView={({ errorMessage, ...fieldProps }) => (
    <InlineDialog
      isOpen={fieldProps.isInvalid}
      content={<div>{errorMessage}</div>}
      placement="right"
    >
      <TextField {...fieldProps} autoFocus />
    </InlineDialog>
  )}
  ```

  ### Controlled and uncontrolled component

  From this version, inline edit will act as either controlled or uncontrolled based on the props passed in. Please refer to [the example here](https://atlaskit.atlassian.com/packages/design-system/inline-edit/example/stateless) for more details.

  When in controlled, you can control the state by set `isEditing` through `onCancel`, `onConfirm` and `onEdit` callbacks.

  ### InlineEditableTextfield

  From this version, `InlineEditableTextfield` now has its own entrypoint so you can import only what you use. Like so:

  ```jsx
  import InlineEditableTextfield from '@atlaskit/inline-edit/inline-editable-textfield';
  ```

  **Running the codemod cli**
  To run the codemod: **You first need to have the latest version installed before you can run the codemod**

  `yarn upgrade @atlaskit/inline-edit@^12.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  The CLI will show a list of components and versions so select `@atlaskit/inline-edit@^12.0.0` and you will automatically be upgraded. If your usage of PACKAGE cannot be upgraded a comment will be left that a manual change is required.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage.
  For Atlassians, refer to [this doc](https://developer.atlassian.com/cloud/framework/atlassian-frontend/codemods/01-atlassian-codemods/) for more details on the codemod CLI.

### Patch Changes

- Updated dependencies

## 11.0.11

### Patch Changes

- [`a4c112b2ad7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4c112b2ad7) - Fixed inline edit not submitting automatically when blurred

## 11.0.10

### Patch Changes

- [`f5cf9fc9e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5cf9fc9e9) - ### General conversion for inline-edit

  There is no breaking change in this conversion, only some mechanical changes applied:

  - replaced `styled-components` to `emotion`
  - converted class component to function component
  - restructured the folder
  - updated examples (using `emotion` and function component too)
  - added more virtual regression test cases for more scenario
  - shifted to `react-testing-library` from `enzyme` for unit tests

## 11.0.9

### Patch Changes

- Updated dependencies

## 11.0.8

### Patch Changes

- [`9da1032552`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9da1032552) - Adds the onCancel prop as an optional event handler called when a user clicks close, or presses escape. This has no behaviour change but allows users more granularity in how they handle the component's lifecycle.
- Updated dependencies

## 11.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 11.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 11.0.5

### Patch Changes

- Updated dependencies

## 11.0.4

### Patch Changes

- Updated dependencies

## 11.0.3

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 11.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 11.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable
- Updated dependencies

## 11.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 10.0.33

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 10.0.32

### Patch Changes

- Updated dependencies

## 10.0.31

### Patch Changes

- [patch][ffe88383f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffe88383f4):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [3a09573b4e](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a09573b4e):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/inline-dialog@12.1.12
  - @atlaskit/form@7.2.1
  - @atlaskit/webdriver-runner@0.3.4

## 10.0.30

### Patch Changes

- [patch][f8b56268e3](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8b56268e3):

  Use elevation mixin instead of hardcoded solution.- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/form@7.1.5
  - @atlaskit/inline-dialog@12.1.11
  - @atlaskit/select@11.0.9
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9

## 10.0.29

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/form@7.1.4
  - @atlaskit/inline-dialog@12.1.10
  - @atlaskit/select@11.0.8
  - @atlaskit/textarea@2.2.5
  - @atlaskit/textfield@3.1.8

## 10.0.28

### Patch Changes

- [patch][37873285a5](https://bitbucket.org/atlassian/atlassian-frontend/commits/37873285a5):

  Fixes inline edit blowing up when blurred.- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):

- Updated dependencies [55b726b9af](https://bitbucket.org/atlassian/atlassian-frontend/commits/55b726b9af):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
  - @atlaskit/form@7.1.3
  - @atlaskit/tag@9.1.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7

## 10.0.27

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/select@11.0.7
  - @atlaskit/tag-group@9.0.6
  - @atlaskit/tag@9.0.13
  - @atlaskit/textarea@2.2.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1

## 10.0.26

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/form@7.1.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/inline-dialog@12.1.8
  - @atlaskit/select@11.0.6
  - @atlaskit/tag@9.0.12
  - @atlaskit/textfield@3.1.5

## 10.0.25

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Pull in update to form to fix a bug which could cause the internal fieldId to be incorrectly set- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/form@7.0.0
  - @atlaskit/textfield@3.1.4
  - @atlaskit/textarea@2.2.3
  - @atlaskit/inline-dialog@12.1.6

## 10.0.24

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/form@6.3.2
  - @atlaskit/inline-dialog@12.1.5
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4

## 10.0.23

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 10.0.22

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 10.0.21

### Patch Changes

- [patch][7f9c665733](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f9c665733):

  Remove babel/runtime as a dependency

## 10.0.20

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 10.0.19

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 10.0.18

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 10.0.17

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 10.0.16

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 10.0.15

- Updated dependencies [cc461c0022](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc461c0022):
  - @atlaskit/tag-group@9.0.0

## 10.0.14

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

## 10.0.13

- Updated dependencies [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/form@6.1.7
  - @atlaskit/icon@19.0.2
  - @atlaskit/textfield@3.0.0

## 10.0.12

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 10.0.11

- Updated dependencies [1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):
  - @atlaskit/tag-group@8.0.2
  - @atlaskit/tag@9.0.0

## 10.0.10

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 10.0.9

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 10.0.8

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 10.0.7

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 10.0.6

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 10.0.5

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/form@6.1.4
  - @atlaskit/inline-dialog@12.0.5
  - @atlaskit/select@10.0.0

## 10.0.4

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/form@6.1.1
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/select@9.1.8
  - @atlaskit/tag@8.0.5
  - @atlaskit/textfield@2.0.3
  - @atlaskit/icon@19.0.0

## 10.0.3

### Patch Changes

- [patch][e91900a440](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e91900a440):

  Change ReadViewContainer height to min-height to allow multiple lines in read view and add max-width and word-break to prevent overflow

## 10.0.2

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/form@6.0.5
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/select@9.1.5
  - @atlaskit/tag@8.0.3
  - @atlaskit/textfield@2.0.1
  - @atlaskit/icon@18.0.0

## 10.0.1

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/inline-dialog@12.0.0

## 10.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 9.0.5

- Updated dependencies [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
- Updated dependencies [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/form@5.2.10
  - @atlaskit/textarea@1.0.0
  - @atlaskit/textfield@1.0.0

## 9.0.4

- [patch][458331c958](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/458331c958):

  - Added index.ts to .npmignore to prevent jest tests resolving that instead of index.js

## 9.0.3

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 9.0.2

- [patch][074c382946](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/074c382946):

  - Add isRequired prop, remove duplicate defaultProps in code (internal change only) and add padding to examples on website to prevent unnecessary scrollbar

## 9.0.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/select@8.1.1
  - @atlaskit/tag@7.0.2
  - @atlaskit/textarea@0.4.4
  - @atlaskit/textfield@0.4.4
  - @atlaskit/theme@8.1.7

## 9.0.0

- [major][71e2d2cb3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71e2d2cb3c):

  - **Breaking:** this version is a major overhaul of the package. Check out the [upgrade
    guide in the Atlaskit website](https://atlaskit.atlassian.com/packages/core/inline-edit/docs/upgrade-guide)
    for more information.
    - **New API:** The exposed named exports are now InlineEdit and InlineEditableTextfield.
      These components are built to be standalone, not used within a Form, but updating data
      individually. The props API for each of these components is similar in some ways, but
      simplified and clarified.
      - InlineEdit is a controlled component which receives a read view and an edit view as
        props, and facilitates the changing of editing state. It is designed to be simple but
        flexible.
      - InlineEditableTextfield is a component which abstracts away most of the complexity
        of the InlineEdit component and simply switches between a single line of text and a
        textfield.
    - **Underlying technical improvements:**
      - This new version supports the use of Textfield and Textarea components (as an
        improvement over the soon-to-be deprecated Field-text and Field-text-area components).
      - This new version includes validation with an inline dialog which is not loaded if a
        validate function is not provided, improving performance.
  - **Typescript:** Inline Edit is now written in Typescript. The props are exported as
    Typescript types. This also means we are dropping support for Flow in this component.

## 8.0.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/multi-select@12.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 8.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/multi-select@12.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 8.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

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

## 7.1.8

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-base@11.0.14
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/multi-select@11.0.14
  - @atlaskit/tag@6.1.4
  - @atlaskit/icon@16.0.0

## 7.1.7

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/field-base@11.0.13
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon@15.0.2
  - @atlaskit/multi-select@11.0.13
  - @atlaskit/tag@6.1.3
  - @atlaskit/tag-group@6.0.8
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 7.1.6

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-base@11.0.12
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/field-text@7.0.16
  - @atlaskit/icon@15.0.1
  - @atlaskit/input@4.0.8
  - @atlaskit/multi-select@11.0.12
  - @atlaskit/tag@6.1.2
  - @atlaskit/theme@7.0.0

## 7.1.5

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/field-base@11.0.11
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/multi-select@11.0.11
  - @atlaskit/tag@6.1.1
  - @atlaskit/icon@15.0.0

## 7.1.4

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon@14.6.1
  - @atlaskit/multi-select@11.0.10
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 7.1.3

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 7.1.2

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.1.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-base@11.0.8
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/multi-select@11.0.7
  - @atlaskit/tag@6.0.8
  - @atlaskit/icon@14.0.0

## 7.1.0

- [minor] Moved the internal @atlaskit/input component to a named export of inline-edit [c96c668](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c96c668)

## 7.0.8

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tag@6.0.5
  - @atlaskit/multi-select@11.0.5
  - @atlaskit/input@4.0.4
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text@7.0.6
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 7.0.5

- [patch] Remove blur of FieldBase wrapper when isEditing is false to fix edited fields not showing focus [75f032b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75f032b)
- [patch] Updated dependencies [75f032b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75f032b)

## 7.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/field-base@11.0.3
  - @atlaskit/multi-select@11.0.4
  - @atlaskit/input@4.0.3
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/tag@6.0.4
  - @atlaskit/tag-group@6.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/icon@13.2.4

## 7.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/tag@6.0.3
  - @atlaskit/tag-group@6.0.3
  - @atlaskit/multi-select@11.0.3
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/input@4.0.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/field-base@11.0.2

## 7.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/field-base@11.0.1
  - @atlaskit/input@4.0.1
  - @atlaskit/field-text@7.0.2
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/tag@6.0.2
  - @atlaskit/tag-group@6.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/icon@13.2.1

## 7.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/multi-select@11.0.1
  - @atlaskit/field-text@7.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/tag@6.0.1
  - @atlaskit/tag-group@6.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/field-radio-group@4.0.1

## 7.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/tag@6.0.0
  - @atlaskit/tag-group@6.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/tag@6.0.0
  - @atlaskit/tag-group@6.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0

## 6.2.0

- [minor] Updated prop description for button. Added button label props for inline-edit accessibility. [11205df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11205df)
- [none] Updated dependencies [11205df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11205df)
  - @atlaskit/button@8.2.6

## 6.1.4

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/field-radio-group@3.1.3
  - @atlaskit/icon@12.6.1

## 6.1.3

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-base@10.1.2
  - @atlaskit/multi-select@10.1.2
  - @atlaskit/input@3.0.2
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/tag@5.0.4
  - @atlaskit/tag-group@5.1.1
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/icon@12.1.2

## 6.1.2

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/tag@5.0.3
  - @atlaskit/multi-select@10.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/field-base@10.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 6.1.1

- [patch] Updated dependencies [b9f0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f0068)
  - @atlaskit/input@3.0.1
  - @atlaskit/field-text@6.0.3

## 6.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/tag-group@5.1.0
  - @atlaskit/tag@5.0.2
  - @atlaskit/icon@12.1.0
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/multi-select@10.1.0
  - @atlaskit/field-base@10.1.0
  - @atlaskit/button@8.1.0

## 6.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/tag@5.0.1
  - @atlaskit/tag-group@5.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/field-base@10.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 6.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/tag@5.0.0
  - @atlaskit/tag-group@5.0.0
  - @atlaskit/multi-select@10.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/input@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 5.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tag@4.1.1
  - @atlaskit/tag-group@4.0.1
  - @atlaskit/multi-select@9.0.2
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/field-base@9.0.3
  - @atlaskit/input@2.0.2
  - @atlaskit/field-text@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 5.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.6.3

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 4.6.2

- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 4.6.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 4.5.18

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.5.17

- [patch] Fix inline edit not stretching all edit views correctly [f45f667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f45f667)

## 4.5.16

- [patch] tweaks confirm and cancel button sizes and position [f416077](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f416077)

## 4.5.15

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 4.5.13

- [patch] bump mention to 9.1.1 to fix mention autocomplete bug [c7708c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7708c6)

## 4.5.10

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 4.5.9

- [patch] Updated inline-edit test type, migrated item, updated pagination imports to account for removed root index file [b48c074](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b48c074)

## 4.5.8

- [patch] Manually bumped package ver to account for desync between ak and ak mk 2 versions [5518730](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5518730)

## 4.5.7

- [patch] Migrated to new mk2 repo & build system [99089df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99089df)

## 4.5.6 (2017-11-30)

- bug fix; release stories with fixed console errors ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 4.5.5 (2017-11-14)

- bug fix; fix inline-edit component edit mode triggering when clicking outside hover width (issues closed: ak-3800) ([16fd4c0](https://bitbucket.org/atlassian/atlaskit/commits/16fd4c0))

## 4.5.4 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.5.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 4.5.2 (2017-10-15)

- bug fix; update dependencies for react 16 compatibility ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 4.5.1 (2017-10-05)

- bug fix; stop invalid icon being pushed out of the field box and therefore hidden ([e65c163](https://bitbucket.org/atlassian/atlaskit/commits/e65c163))

## 4.5.0 (2017-09-19)

- feature; allow readview of inline-edit to fit container width (issues closed: #ak-3118) ([652edaf](https://bitbucket.org/atlassian/atlaskit/commits/652edaf))

## 4.4.6 (2017-09-06)

- bug fix; text in inline edit readview can be highlighted (issues closed: #ak-2685) ([3b99f10](https://bitbucket.org/atlassian/atlaskit/commits/3b99f10))

## 4.4.5 (2017-09-05)

- bug fix; inline edit wraps correctly using tags in ie11 (issues closed: #ak-3261) ([b894b85](https://bitbucket.org/atlassian/atlaskit/commits/b894b85))
- bug fix; cause wrap of multi-select to be respected ([751ba47](https://bitbucket.org/atlassian/atlaskit/commits/751ba47))
- bug fix; fixes lots of alignment issues with field-base, including using tag-groups in the vi ([db40514](https://bitbucket.org/atlassian/atlaskit/commits/db40514))
- bug fix; changing the Edit button for inline-edit to not submit forms ([5b4d16c](https://bitbucket.org/atlassian/atlaskit/commits/5b4d16c))

## 4.4.4 (2017-08-21)

- bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 4.4.3 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 4.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 4.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.1.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-05-30)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- refactored inline-edit to styled-components ([c4dae85](https://bitbucket.org/atlassian/atlaskit/commits/c4dae85))
- breaking; Now exports InlineEdit (default) and InlineEditStateless
- ISSUES CLOSED: AK-2389

## 2.3.3 (2017-05-19)

- fix; update dependencies ([eb22a43](https://bitbucket.org/atlassian/atlaskit/commits/eb22a43))

## 2.3.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.3.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.3.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 2.2.1 (2017-04-18)

- fix; remove ignoring clicks on the icon ([c5d6a3c](https://bitbucket.org/atlassian/atlaskit/commits/c5d6a3c))

## 2.2.0 (2017-03-28)

- feature; add isInvalid and inlineMessage props, which display a warning icon and warning dia ([d08665e](https://bitbucket.org/atlassian/atlaskit/commits/d08665e))
- feature; update inline dialog to display the warning dialog only when the field is focused ([b6fb4f6](https://bitbucket.org/atlassian/atlaskit/commits/b6fb4f6))

## 2.0.9 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.0.7 (2017-03-21)

- fix; remove the style wrapper for edit views with no field-base ([a380dfc](https://bitbucket.org/atlassian/atlaskit/commits/a380dfc))
- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.0.6 (2017-03-20)

- feature; shouldWrapEditViewWithFieldBase prop on inline-edit and style fixes for single-sele ([4946f21](https://bitbucket.org/atlassian/atlaskit/commits/4946f21))

## 2.0.5 (2017-02-28)

- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 2.0.3 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 2.0.3 (2017-02-28)

- fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 2.0.2 (2017-02-28)

- fix; adds usage.md for inline-edit, adds docs (no class was present previously), removes jsdoc ([459da9e](https://bitbucket.org/atlassian/atlaskit/commits/459da9e))

## 2.0.1 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 2.0.0 (2017-02-24)

- fix; fixes AK-1786: Buttons moved to bottom-right ([5ccc241](https://bitbucket.org/atlassian/atlaskit/commits/5ccc241))
- fix; fixes AK-1787: buttons with z-index + shadow ([014af88](https://bitbucket.org/atlassian/atlaskit/commits/014af88))
- fix; fixes AK-1788 remove pencil icon onHover ([00a2d3b](https://bitbucket.org/atlassian/atlaskit/commits/00a2d3b))
- fix; fixes AK-1789 adds a hasSpinner to field-base + inline-edit update to use it ([32de1d0](https://bitbucket.org/atlassian/atlaskit/commits/32de1d0))
- fix; fixes AK-1813 ie11 / safari / firefox missalignments ([55ed568](https://bitbucket.org/atlassian/atlaskit/commits/55ed568))
- fix; fixes missing focus styles on field base after tabbing ([0b26516](https://bitbucket.org/atlassian/atlaskit/commits/0b26516))
- fix; inline-edit updated to use isLoading instead of hasSpinner ([313abe3](https://bitbucket.org/atlassian/atlaskit/commits/313abe3))
- fix; spinner related tests fixed ([e6d8ad5](https://bitbucket.org/atlassian/atlaskit/commits/e6d8ad5))
- fix; storybook clean up and button margin fixed ([e06b9c5](https://bitbucket.org/atlassian/atlaskit/commits/e06b9c5))
- breaking; specs 1.2

## 1.0.4 (2017-02-16)

- fix; fix inconsistent stories when pressing enter on edit mode ([76c3904](https://bitbucket.org/atlassian/atlaskit/commits/76c3904))
- fix; fixes a bug when inline-edit switch to read view programatically ([3a93e51](https://bitbucket.org/atlassian/atlaskit/commits/3a93e51))
- fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 1.0.3 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.2 (2017-02-07)

- fix; update field base to the lates version and fix inline edit ([1a33181](https://bitbucket.org/atlassian/atlaskit/commits/1a33181))
