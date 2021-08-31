# @atlaskit/calendar

## 12.1.1

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [`89c0316aa2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89c0316aa2c) - Instrumented Calendar with the new theming package, `@atlaskit/tokens`. Tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`2d7cc544696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d7cc544696) - Updates token usage to match the latest token set
- Updated dependencies

## 12.0.3

### Patch Changes

- Updated dependencies

## 12.0.2

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17

## 12.0.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 12.0.0

### Major Changes

- [`4ab5a7e9069`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ab5a7e9069) - ### Major:

  Removes `defaultDisabled` prop, a stateless/uncontrolled variant of the `disabled` prop. As a stateless calendar would never change its disabled dates, this prop was unnecessary.

  ### New Features:

  Adds three props to make disabling dates more practical, performant and expressive in `@atlaskit/calendar`. These features are also available for DatePicker:

  - `minDate` for the minimum valid date
  - `maxDate` for the maximum valid date
  - `disabledDateFilter`, a function that takes a date string, and returns whether or not it should be disabled.

  ### Bugs

  - Disabled dates that lie outside of the currently selected month now have correct hover styles

### Patch Changes

- Updated dependencies

## 11.1.1

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 11.1.0

### Minor Changes

- [`d872280cff1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d872280cff1) - Calendar now exports a `WeekDay` type. This is the type used by the `weekStartDay` prop.

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- [`4eb2615652c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eb2615652c) - Internal refactor to use common utils.
- Updated dependencies

## 11.0.0

### Major Changes

- [`8ed4c2efc42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ed4c2efc42) - In this version we made calendar dramatically faster and lighter 🤩

  - General performance improvements
  - Moved from using tables to CSS grid to display the days
  - Removed unnecessary DOM elements
  - The `className` and `style` props have been added
  - **BREAKING** The `innerProps` prop has been removed, generally consumers have only used this for style props which are now available directly

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed**

  ```bash
  yarn upgrade @atlaskit/calendar@^11.0.0
  ```

  Once upgraded,
  use `@atlaskit/codemod-cli` via `npx`:

  ```bash
  npx @atlaskit/codemod-cli --parser babel --extensions ts,tsx,js [relativePath]
  ```

  The CLI will show a list of components and versions so select `@atlaskit/calendar@^11.0.0` and you will automatically be upgraded.
  If your usage of calendar cannot be upgraded a comment will be left that a manual change is required.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage.
  For Atlassians,
  refer to the [documentation](https://developer.atlassian.com/cloud/framework/atlassian-frontend/codemods/01-atlassian-codemods/) for more details on the codemod CLI.

### Patch Changes

- [`c119fdd32e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c119fdd32e7) - Internal change to update usage of the custom `glyph` prop in @atlaskit/icon.
- Updated dependencies

## 10.3.3

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 10.3.2

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 10.3.1

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- [`42785088a12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42785088a12) - - Migrate old entry points to new one. Calendar now has only following exports:

  - **default export**. Can be imported like:
    - `import Calendar from '@atlaskit/calendar'`
  - **named type exports** (`CalendarProps`, `ChangeEvent`, `SelectEvent`).
    Can be imported like:
    - `import { CalendarProps, ChangeEvent, SelectEvent } from '@atlaskit/calendar'`
    - `import { CalendarProps, ChangeEvent, SelectEvent } from '@atlaskit/calendar/types'`.

  **Internal change**

  - Remove reference of private types and props from the documentation. Right now private type is `CalendarInternalRef` and private prop is `calendarRef`.
  - Rename calendar exported private ref type from `CalendarInternalRef` to `CalendarRef`.
  - Rename calendar private prop from `internalRef` to `calendarRef`.

- [`f74ba30c53c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f74ba30c53c) - **Internal change**

  - We have improved re-rendering quite a bit by memoizing components, loops and rendered elements.
  - Duplicate "pad-to-two" util has been removed.
  - Refactored few variables/functions/types.
  - Extracted out few components for readability purpose.

- Updated dependencies

## 10.3.0

### Minor Changes

- [`d069f7834ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d069f7834ef) - Calendar now accepts a `weekStartDay` prop that controls which day of the week should be used at the start. This prop accepts the following values:

  - `0` sunday (default value)
  - `1` monday
  - `2` tuesday
  - `3` wednesday
  - `4` thursday
  - `5` friday
  - `6` saturday

- [`ccde1b6b939`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccde1b6b939) - Convert all styles of Calendar from styled-components to emotion CSS and apply different styles via data-attributes.
  Internally theme mode is now accessed via Global theme context and used to generate colors.
- [`e20f4c2806e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e20f4c2806e) - Improvement in internal analytics performance

  **Dev changes**

  - Migrated from `@atlaskit/analytics-next` React HOC to React hooks. This improved re-rendering quite a bit.

### Patch Changes

- [`aedbf4ed383`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aedbf4ed383) - **Internal change**

  We have removed [calendar-base](https://www.npmjs.com/package/calendar-base) dependency which was not maintained for quite sometime and moved its logic internally. This will help us fixing any issue we might get or any new functionality we might want to support.

- Updated dependencies

## 10.2.0

### Minor Changes

- [`4dae77b2678`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4dae77b2678) - Calendar now accepts a `weekStartDay` prop that controls which day of the week should be used at the start. This prop accepts the following values:

  - `0` sunday (default value)
  - `1` monday
  - `2` tuesday
  - `3` wednesday
  - `4` thursday
  - `5` friday
  - `6` saturday

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [`985961ce983`](https://bitbucket.org/atlassian/atlassian-frontend/commits/985961ce983) - Internal change from class to function components

  - We have converted all the components from class to functional. This improved performance quite a bit. Initial rendering, hydration, interaction, bundlesize and re-rendering; all have been improved.
  - We have made all the prop typings optional now. Earlier they were not aligned with the prop values (which were all optional earlier).
  - We have stopped exporting internal `CalendarClassType` and `ArrowKeys` types which were not compatible with functional components. Instead we have exported `CalendarInternalRef` type temporarily for backward compatibility and a new optional prop `internalRef` which consumers can use to access internal api's. Right now only `@atlaskit/datetime-picker` uses `navigate()` api for navigation which will be removed soon. This new type and prop are not recommended. So please don't use them.
  - We have also exported a new type `SelectEvent` along with already exported `ChangeEvent`, which consumers can use with `onSelect` and `onChange` prop.
  - We have also added `ref` support which points to the top level element. Earlier it was not officially supported.
  - Dev changes includes: folder restructuring and cleanup, lodash removal, memoizing components etc.

## 10.0.10

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.0.9

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 10.0.8

### Patch Changes

- Updated dependencies

## 10.0.7

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 10.0.6

### Patch Changes

- Updated dependencies

## 10.0.5

### Patch Changes

- [`b284fba3d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b284fba3d1) - Components that had missing names are now fixed - this helps when looking for them using the React Dev Tools.

## 10.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 10.0.3

### Patch Changes

- [`8598d0bd13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8598d0bd13) - Remove unnecessary code and tests for IE11.
- Updated dependencies

## 10.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.0.1

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.2.10

### Patch Changes

- [`69643331c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69643331c3) - Prevent day names table header from wrapping into two line

## 9.2.9

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.2.8

### Patch Changes

- Updated dependencies

## 9.2.7

### Patch Changes

- [patch][62390c4755](https://bitbucket.org/atlassian/atlassian-frontend/commits/62390c4755):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/webdriver-runner@0.3.4

## 9.2.6

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
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
  - @atlaskit/select@11.0.9

## 9.2.5

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/select@11.0.8

## 9.2.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/locale@1.0.5

## 9.2.3

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/locale@1.0.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6

## 9.2.2

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files

## 9.2.1

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/locale@1.0.2

## 9.2.0

### Minor Changes

- [minor][7fe4bcf86d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe4bcf86d):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 9.1.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.1.0

### Minor Changes

- [minor][cc42bbc6ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc42bbc6ad):

  Exporting type of Calendar class and some components are relying on it

## 9.0.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 9.0.0

### Major Changes

- [major][8c725d46ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c725d46ec):

  @atlaskit/calendar has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.1.0

### Minor Changes

- [minor][e3d466543f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3d466543f):

  Add locale support for Calendar/DateTimePicker/DatePicker/TimePicker:

  - New prop `locale` enables localization for date/time format in `DatePicker`, `TimePicker` and
    `DateTimePicker`, and months/days in `Calendar`.
  - Deprecated `dateFormat`, `timeFormat` and `formatDisplayLabel` props. Please use `locale` instead. If provided, these
    props will override `locale`.
  - Default date/time placeholders now use `locale` to format the date.
  - The default date parser for `DatePicker` has been changed from `date-fns.parse` to one based on the `locale` prop and
    accept text in a format that matches the placeholder.

## 8.0.10

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 8.0.9

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 8.0.8

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 8.0.7

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 8.0.6

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2

## 8.0.5

### Patch Changes

- [patch][ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):

  popper has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/icon@19.0.0

## 8.0.2

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/icon@18.0.0

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.22

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/theme@8.1.7

## 7.0.21

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 7.0.20

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 7.0.19

- [patch][f8cf9e271e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f8cf9e271e):

  - Internal changes only. Calendar is now ssr-friendly.

## 7.0.18

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/theme@8.0.0

## 7.0.17

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/icon@16.0.0

## 7.0.16

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 7.0.15

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/theme@7.0.0

## 7.0.14

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/icon@15.0.0

## 7.0.13

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 7.0.12

- [patch][21f5216](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5216):

  - Remove enzyme-to-json as it is used in our jestFrameworkSetup.js

## 7.0.11

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 7.0.10

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.0.9

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/icon@14.0.0

## 7.0.8

- [patch] Fixes bug on next and prev month navigation. [c4770a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4770a0)

## 7.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 7.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/icon@13.2.4

## 7.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 7.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/icon@13.2.1

## 7.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 7.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 6.2.2

- [patch] Fix Calendar width increasing for some months [29ffb24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29ffb24)
- [patch] Updated dependencies [29ffb24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29ffb24)

## 6.2.1

- [patch] Calendar chevrons use large versions [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)
- [patch] Updated dependencies [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)

## 6.2.0

- [minor] Visual changes to match ADG3 guidelines [059d111](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/059d111)
- [minor] Updated dependencies [059d111](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/059d111)

## 6.1.3

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 6.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/icon@12.1.2

## 6.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 6.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 6.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 6.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 5.0.4

- [patch] Fix issue causing a mouseup to select a date. It is now bound to click. [1cd0b7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cd0b7e)

## 5.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 5.0.1

- [patch] Better styles for disabled dates [866c497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/866c497)

## 5.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.0.0

- [major] QoL and consistency changes to the calendar and datetime-picker APIs. Added the ability to specify a string to the DateTimePicker component. Remove stateless components and make each component stateless or stateful using the controlled / uncontrolled pattern. Misc prop renames for consistency. [ab21d8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab21d8e)

## 3.2.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.1.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.1.2

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.1.1

- [patch] Flatten examples for easier consumer use [145b632](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/145b632)

## 3.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.0.13

- [patch] Fixed issue where hovering over a disabled date would not show a disabled cursor. [5c21f9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c21f9b)

## 3.0.12

- [patch] Fix calendar dates not being selectable in IE11 [a65e3b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a65e3b0)

## 3.0.10

- [patch] stopped disabled dates from triggering onClick prop [3b42698](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b42698)

## 3.0.9

- [patch] did some clean up with accessibility of calendar [48797f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48797f2)

## 3.0.6

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 3.0.4

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)
