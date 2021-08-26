# @atlaskit/datetime-picker

## 11.0.1

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 11.0.0

### Major Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - [ux] BREAKING CHANGE: Datetime picker now uses date-fns@2.17 (previously <2.0). This change has tightened the requirements of users to provide ISO dates. This was never explicitly supported, but now will cause an error to be thrown for non-ISO dates. For an abundance of caution we're calling this a breaking change to protect users relying on the previous behaviour.

  To upgrade you'll need to ensure any dates passed to the `DateTimePicker` are in ISO format.

## 10.4.2

### Patch Changes

- [`787c731b208`](https://bitbucket.org/atlassian/atlassian-frontend/commits/787c731b208) - Updated package description.

## 10.4.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 10.4.0

### Minor Changes

- [`b162da59aac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b162da59aac) -

  #### New Features:

  Three props were added to `@atlaskit/calendar` and `@atlaskit/datetime-picker` to make disabling dates more practical, performant and expressive:

  - `minDate` for the minimum valid date
  - `maxDate` for the maximum valid date
  - `disabledDateFilter`, a function that takes a date string, and returns whether or not it should be disabled.

  #### Bugs

  - DatePicker: Disabled dates that lie outside of the currently selected month now have correct hover styles

### Patch Changes

- [`c406245d637`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c406245d637) - [ux] Prevents the clear button appearing on disabled DateTimePickers.
- [`4db7f1e42b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4db7f1e42b2) - [ux] Fixed a bug which caused clicks on disabled date pickers to modify internal state. This led to an issue where clicking on a disabled date picker, and then enabling it, would result in an opened date picker.
- Updated dependencies

## 10.3.0

### Minor Changes

- [`f6b951a51f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b951a51f2) - Removes usage of styled-components in favour of standardising on emotion

### Patch Changes

- Updated dependencies

## 10.2.1

### Patch Changes

- [`1f493e1dc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f493e1dc65) - Bump `react-select` to v4.
- Updated dependencies

## 10.2.0

### Minor Changes

- [`1ad2a658d5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ad2a658d5d) - [ux] Added `weekStartDay` prop which gets passed to the underlying `Calendar` instance.

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [`069538e03c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069538e03c6) - Prefixes the testId passed down to the nested Calendar component with '\${testId}--calendar' to ensure testIds are namespaced correctly. This change only affects calendar testIds when used within a DatePicker context.

## 10.0.12

### Patch Changes

- Updated dependencies

## 10.0.11

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 10.0.10

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 10.0.9

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- [`c20be966f07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c20be966f07) - **Internal change**

  - Change `@atlaskit/calendar` ref type import name from `CalendarInternalRef` to `CalendarRef`.
  - Change prop name which is being passed to `@atlaskit/calendar` from `internalRef` to `calendarRef`.

- Updated dependencies

## 10.0.8

### Patch Changes

- [`9c020a0e05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c020a0e05f) - Replaced `@atlaskit/calendar` exported types to access its `navigate()` api

  - Replaced `CalendarClassType` & `ArrowKeys` types with `CalendarInternalRef` type.
  - Also replaced `ref` prop with `internalRef` prop for accessing `navigate()` api.

- Updated dependencies

## 10.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 10.0.5

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 10.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.0.2

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`39e130698b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39e130698b) - Fixes an issue in DatePicker, DateTimePicker and TimePicker where they all had a circular dependency between a type declaration and default props which led to TypeScript marking props with default values as required props. This will no longer occur.
- Updated dependencies

## 10.0.1

### Patch Changes

- [`23f968def3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23f968def3) - Earlier value returned from DateTimePicker component was inconsistent, like for the first time it was without zone offset and after that with zone offset. Now it is consistent with zone offset every-time.
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.4.7

### Patch Changes

- [`038b0fbb8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/038b0fbb8e) - fix typings after reverting DST-461 changes. typeof is fixed in ERT repo (https://github.com/atlassian/extract-react-types/pull/126)

## 9.4.6

### Patch Changes

- [`a39ef6582c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a39ef6582c) - Marks default pops as optional in interface (TimePicker & DatePicker)

## 9.4.5

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.4.4

### Patch Changes

- [`466aec241f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/466aec241f) - Fixing incorrect margin for time-picker
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 9.4.3

### Patch Changes

- [`ccd9c51bd3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccd9c51bd3) - Fixes date picker being affected by an invalid emotion theme provider.

## 9.4.2

### Patch Changes

- Updated dependencies

## 9.4.1

### Patch Changes

- [`d2876ee14f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2876ee14f) - FIX: Add `hideIcon` prop back for backwards compatibility in MINOR

## 9.4.0

### Minor Changes

- [minor][449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):

  Add a clear icon for datepicker, timepicker and datetimepicker

### Patch Changes

- [patch][ca494abcd5](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca494abcd5):

  Change imports to comply with Atlassian conventions- Updated dependencies [62390c4755](https://bitbucket.org/atlassian/atlassian-frontend/commits/62390c4755):

- Updated dependencies [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/calendar@9.2.7
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/webdriver-runner@0.3.4

## 9.3.0

### Minor Changes

- [minor][5d8fc8d0ec](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8fc8d0ec):

  Remove the calendar icon from the datetimepicker

### Patch Changes

- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 9.2.9

### Patch Changes

- [patch][4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

  Upgraded react-scrolllock package- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 9.2.8

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
  - @atlaskit/field-base@14.0.2
  - @atlaskit/field-range@8.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/calendar@9.2.6
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/select@11.0.9
  - @atlaskit/textfield@3.1.9

## 9.2.7

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/calendar@9.2.5
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/select@11.0.8
  - @atlaskit/textfield@3.1.8

## 9.2.6

### Patch Changes

- [patch][116cb9b00f](https://bitbucket.org/atlassian/atlassian-frontend/commits/116cb9b00f):

  FIX: Valid time string in ISO output of Datetime picker- Updated dependencies [296a8b114b](https://bitbucket.org/atlassian/atlassian-frontend/commits/296a8b114b):

- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
  - @atlaskit/locale@1.0.6
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7

## 9.2.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/calendar@9.2.4
  - @atlaskit/field-base@14.0.1
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/popper@3.1.11
  - @atlaskit/select@11.0.7
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/locale@1.0.5

## 9.2.4

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/locale@1.0.4
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/calendar@9.2.3
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5

## 9.2.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

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
  - @atlaskit/field-text@9.0.14
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/field-base@13.0.16
  - @atlaskit/popper@3.1.8

## 9.2.2

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2
  - @atlaskit/locale@1.0.3

## 9.2.1

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 9.2.0

### Minor Changes

- [minor][c423fbf5eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c423fbf5eb):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 9.1.0

### Minor Changes

- [minor][17a07074e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17a07074e8):

  Fix padding to be consistent with other Atlaskit form fields. This change includes removing padding from around the icon itself, and adding padding to the icon container, as well as altering the padding around the input container.

## 9.0.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.0

### Major Changes

- [major][d1444cc6ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1444cc6ef):

  Converting datetime-picker to typescript. Dropping support for flow

## 8.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 8.1.1

- Updated dependencies [8c725d46ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c725d46ec):
  - @atlaskit/calendar@9.0.0

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

## 8.0.17

### Patch Changes

- [patch][8784191ef6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8784191ef6):

  Date, Time, and DateTime pickers now correctly clear their value when the Backspace or Delete key is pressed

## 8.0.16

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 8.0.15

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 8.0.14

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 8.0.13

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 8.0.12

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/calendar@8.0.6
  - @atlaskit/field-text@9.0.7
  - @atlaskit/select@10.0.3
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2
  - @atlaskit/modal-dialog@10.1.3

## 8.0.11

- Updated dependencies [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/popper@3.0.0
  - @atlaskit/calendar@8.0.5

## 8.0.10

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.9

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/select@10.0.0

## 8.0.8

### Patch Changes

- [patch][19d9d0f13f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19d9d0f13f):

  Fixing a rare bug in Safari and malformed date string.

## 8.0.7

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/calendar@8.0.3
  - @atlaskit/field-base@13.0.6
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/select@9.1.8
  - @atlaskit/icon@19.0.0

## 8.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.5

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/calendar@8.0.1
  - @atlaskit/field-base@13.0.4
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/select@9.1.5
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 8.0.4

### Patch Changes

- [patch][8d54773dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d54773dea):

  Remove meridian time in parseInputValue in TimePicker

## 8.0.3

- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/icon@17.1.2
  - @atlaskit/select@9.1.2
  - @atlaskit/modal-dialog@10.0.0

## 8.0.2

- [patch][06819642ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06819642ba):

  - Internal refactor and clean up

## 8.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.5

- Updated dependencies [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/popper@1.0.0

## 7.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/calendar@7.0.22
  - @atlaskit/field-base@12.0.2
  - @atlaskit/field-range@6.0.4
  - @atlaskit/field-text@8.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/popper@0.4.3
  - @atlaskit/select@8.1.1
  - @atlaskit/theme@8.1.7

## 7.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/calendar@7.0.21
  - @atlaskit/field-text@8.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/popper@0.4.2
  - @atlaskit/select@8.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 7.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 7.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/calendar@7.0.20
  - @atlaskit/field-text@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/popper@0.4.1
  - @atlaskit/select@8.0.3
  - @atlaskit/theme@8.0.1
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0

## 7.0.0

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

## 6.5.1

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 6.5.0

- [minor][a48dddb43c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a48dddb43c):

  - onChange will only be fired when a complete datetime is supplied by the user

## 6.4.2

- [patch][0cd7f505b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cd7f505b3):

  - Iso date parsing on IE11 and Edge is now consistent with other browsers

## 6.4.1

- [patch][348d3aed19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/348d3aed19):

  - Datepicker will now reset the focused date on the calendar every time it is opened

## 6.4.0

- [minor][52827feffb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52827feffb):

  - onChange is now called only when the user selects or clears a value. The date passed to onChange will always be a valid date

## 6.3.25

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/calendar@7.0.17
  - @atlaskit/field-base@11.0.14
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/select@6.1.19
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 6.3.24

- [patch][55e0a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55e0a3a):

  - Fixes keyboard entry bug

- [patch][075dfa2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/075dfa2):

  - Allowing control of input value in datetime-picker

## 6.3.23

- [patch][4c4bdc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c4bdc5):

  - AK-5672 - Refactor parseTime by separating logic and concerns into smaller, testable functions. Fixes meridiem issues.

- [patch][58a40bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58a40bf):

  - Factoring in meridiem for 24hr time in editable

## 6.3.22

- [patch][5c548ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c548ea):

  - Removing extraneous wrapping span around icons which was causing an accessibility error

## 6.3.21

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/calendar@7.0.16
  - @atlaskit/field-base@11.0.13
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon@15.0.2
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/popper@0.3.6
  - @atlaskit/select@6.1.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.3.20

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/calendar@7.0.15
  - @atlaskit/field-base@11.0.12
  - @atlaskit/field-range@5.0.11
  - @atlaskit/field-text@7.0.16
  - @atlaskit/icon@15.0.1
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/popper@0.3.3
  - @atlaskit/select@6.1.10
  - @atlaskit/theme@7.0.0

## 6.3.19

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/calendar@7.0.14
  - @atlaskit/field-base@11.0.11
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/select@6.1.9
  - @atlaskit/icon@15.0.0

## 6.3.18

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/calendar@7.0.13
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon@14.6.1
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/popper@0.3.2
  - @atlaskit/select@6.1.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 6.3.17

- [patch][b332c91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b332c91):

  - upgrades verison of react-scrolllock to SSR safe version

## 6.3.16

- [patch] Datetime Picker modal sticks to bottom, if needed [0149735](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0149735)

## 6.3.15

- [patch] Added logic to onCalendarChange for impossibly large dates. These dates now get converted to the last day of the month, as opposed to default js behaviour. '2018-02-31' now converts to '2018-02-28' as opposed to '2018-03-02' [4b23458](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b23458)

## 6.3.14

- [patch] Fixing blank state for datetime-picker in Firefox. [0e6d838](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e6d838)

## 6.3.13

- [patch] Updated dependencies [1a752e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a752e6)
  - @atlaskit/popper@0.3.0

## 6.3.12

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.3.11

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/calendar@7.0.9
  - @atlaskit/field-base@11.0.8
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/select@6.0.2
  - @atlaskit/icon@14.0.0

## 6.3.10

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/select@6.0.0

## 6.3.9

- [patch] Fixes bug on next and prev month navigation. [c4770a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4770a0)

## 6.3.8

- [patch] TimePicker not longer throws console error when input cleared [dba1bb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dba1bb0)

## 6.3.7

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/select@5.0.17
  - @atlaskit/modal-dialog@7.0.0

## 6.3.6

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/select@5.0.16
  - @atlaskit/webdriver-runner@0.1.0

## 6.3.5

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.3.3

- [patch] Updating datetime-picker and select styles [981b96c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/981b96c)

## 6.3.2

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/select@5.0.9
  - @atlaskit/popper@0.2.1
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text@7.0.6
  - @atlaskit/field-range@5.0.4
  - @atlaskit/field-base@11.0.5
  - @atlaskit/calendar@7.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 6.3.1

- [patch] Removed some broken styles from the datetime-picker menu [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)

- [none] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
  - @atlaskit/field-base@11.0.4
- [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/field-base@11.0.4
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
- [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
  - @atlaskit/field-base@11.0.4
- [patch] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
  - @atlaskit/field-base@11.0.4

## 6.3.0

- [minor] added formatDisplayLabel prop to timePicker and datePicker to enable configuration of the label string rendered in the input [bce02a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bce02a8)
- [none] Updated dependencies [bce02a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bce02a8)

## 6.2.0

- [minor] Added parseDateValue prop to datetimepicker which accepts a function that takes an iso datestring, a date value, a time value and a zone value and returns an object containing a formatted dateValue, timeValue and zoneValue. The defaultProp uses date-fn's parse and format functions under the hood. [6249709](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6249709)
- [none] Updated dependencies [6249709](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6249709)

## 6.1.2

- [patch] Replace @atlaskit/layer in date time picker with @atlaskit/popper, changed configuration of flipBehaviour modifier to use viewport as the element boundary rather than the window. [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
- [patch] Updated datetime-picker to use @atlaskit/popper internally instead of @atlaskit/layer. Minor fix to @atlaskit/popper, boundariesElement for flipbehaviour is now viewport and not window. [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)
- [patch] Updated dependencies [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
  - @atlaskit/popper@0.1.2
- [none] Updated dependencies [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)

## 6.1.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/select@5.0.8
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/field-base@11.0.3
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/calendar@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/field-range@5.0.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/icon@13.2.4

## 6.1.0

- [minor] Added parseInputValue prop to datePicker and timePicker, which allows for the customisation of logic around parsing input values into the requisite date object. Also added datePickerProps and timePickerProps props to dateTimePicker to expose these two (and later other datePicker and timePicker explicit props) at the dateTimePicker level [9a75b8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a75b8b)
- [none] Updated dependencies [9a75b8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a75b8b)

## 6.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/icon@13.2.2
  - @atlaskit/calendar@7.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/modal-dialog@6.0.5
  - @atlaskit/field-base@11.0.2

## 6.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/select@5.0.6
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/field-base@11.0.1
  - @atlaskit/field-text@7.0.2
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/calendar@7.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/field-range@5.0.1
  - @atlaskit/layer@5.0.2
  - @atlaskit/icon@13.2.1

## 6.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/select@5.0.2
  - @atlaskit/modal-dialog@6.0.1
  - @atlaskit/field-text@7.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/calendar@7.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 6.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/select@5.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/select@5.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0

## 5.4.5

- [patch] Updated dependencies [da661fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da661fd)
  - @atlaskit/select@4.5.2

## 5.4.4

- [patch] atlaskit/select now invokes a makeAnimated function to wrap passed in components in default animated behaviour. As this invocation returns a new set of react components each time, we've also implemented a lightweight component cache using memoize-one and react-fast-compare. Additionally updates made to datetime-picker to not instantiate a new component on render everytime (for performance reasons as well as to satisfy our caching logic), we now also pass relevant state values through the select as props to be ingested by our custom components, instead of directly capturing them within lexical scope. [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)
- [patch] Updated dependencies [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)
  - @atlaskit/select@4.5.0

## 5.4.3

- [patch] Fix disabled dates could be selected with keyboard [832b4ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/832b4ab)
- [patch] Updated dependencies [832b4ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/832b4ab)

## 5.4.2

- [patch] Fix Calendar width increasing for some months [29ffb24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29ffb24)
- [patch] Updated dependencies [29ffb24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29ffb24)
  - @atlaskit/calendar@6.2.2

## 5.4.1

- [patch] Calendar chevrons use large versions [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)
- [patch] Updated dependencies [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)
  - @atlaskit/calendar@6.2.1

## 5.4.0

- [minor] Visual changes to match ADG3 guidelines [059d111](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/059d111)
- [minor] Updated dependencies [059d111](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/059d111)
  - @atlaskit/calendar@6.2.0

## 5.3.3

- [patch] Updated dependencies [b53da28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53da28)
  - @atlaskit/select@4.3.6

## 5.3.2

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1
  - @atlaskit/modal-dialog@5.2.6

## 5.3.1

- [patch] TimePicker timesIsEditable invalid values are set to empty strings [b710290](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b710290)
- [patch] Updated dependencies [b710290](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b710290)

## 5.3.0

- [minor] Backspace now clears input & fixed tab clearing input [5783a8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5783a8d)
- [minor] Updated dependencies [5783a8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5783a8d)

## 5.2.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/select@4.2.3
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/field-base@10.1.2
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/field-range@4.0.3
  - @atlaskit/layer@4.0.3
  - @atlaskit/calendar@6.1.2
  - @atlaskit/icon@12.1.2

## 5.2.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/select@4.2.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/calendar@6.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/layer@4.0.1
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/field-base@10.1.0
  - @atlaskit/button@8.1.0

## 5.1.0

- [minor] Fixed DatetimePicker not clearing input on ESC [c58f3db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c58f3db)

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/select@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/field-base@10.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/calendar@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/field-range@4.0.1
  - @atlaskit/docs@4.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/select@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/calendar@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 4.1.1

- [patch] Fix DateTimePicker not setting TimePicker value [0c073e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c073e6)

## 4.1.0

- [minor] Updated dependencies [59ab4a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ab4a6)
  - @atlaskit/select@3.1.0

## 4.0.4

- [patch] Fixes for parsing & formatting of values [0c843bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c843bc)

## 4.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/select@3.0.2
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/field-base@9.0.3
  - @atlaskit/field-text@5.0.3
  - @atlaskit/calendar@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/field-range@3.0.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1

## 4.0.2

- [patch] Fix create option being displayed when timeIsEditable is false [7e99ba3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e99ba3)

## 4.0.1

- [patch] Updated dependencies [92ae24e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92ae24e)
  - @atlaskit/select@3.0.1

## 4.0.0

- [major] Updated dependencies [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
  - @atlaskit/select@3.0.0

## 3.1.1

- [patch] Updated dependencies [7468739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7468739)
  - @atlaskit/select@2.0.2

## 3.1.0

- [minor] Add dateFormat prop to customise the display format of dates [3daced9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3daced9)

## 3.0.5

- [patch] Fixed subtle appearance on focus [2b1e018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b1e018)

## 3.0.4

- [patch] Better styles for disabled dates [866c497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/866c497)

## 3.0.3

- [patch] Added appearance prop to enable subtle (no icon) appearance [c10fd5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c10fd5d)

## 3.0.2

- [patch] Remove unused dependencies [3cfb3fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cfb3fe)

## 3.0.1

- [patch] Added isInvalid prop to DateTimePicker DatePicker & TimePicker [101c306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/101c306)

## 2.0.6

- [patch] Added timeIsEditable prop to enable user created times [4695e5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4695e5d)

## 2.0.3

- [patch] Change pickers to use fixed positioning and scroll lock to allow them to break out of modals. [d4981fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4981fe)

## 2.0.2

- [patch] Fix datetime picker without a value and defaultValue not working [a88aee0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a88aee0)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.0.1

- [patch] Fix picker value not being able to be set programatically [17c7a15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17c7a15)
- [patch] Fix `isDisabled` not restricting pickers from opening [f396f2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f396f2e)

## 1.0.0

- [major] QoL and consistency changes to the calendar and datetime-picker APIs. Added the ability to specify a string to the DateTimePicker component. Remove stateless components and make each component stateless or stateful using the controlled / uncontrolled pattern. Misc prop renames for consistency. [ab21d8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab21d8e)

## 0.7.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 0.7.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 0.6.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 0.6.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 0.6.0

- [minor] Make all internal state able to be controlled or uncontrolled obviating the need for the usage of stateless components. [3d81d42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d81d42)

## 0.5.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 0.4.0

- [minor] datetime picker will take full width if width is not passes [7a9add1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a9add1)

## 0.3.3

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 0.3.2

- [patch] calling onchange on hook when datepickers is set to empty state [9e288cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e288cc)

## 0.3.0

- [minor] add autoFocus prop to DateTimePicker [c8de434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8de434)

## 0.2.0

- [minor] DateTimePicker is now controlled. [1318f4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1318f4e)
- [minor] Add DateTimePickerStateless component. Fix issue where DateTimePicker tries to call selectField on the dualPicker, which didn't exist. Add ability to have a controlled DateTimePicker. [4bd0167](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4bd0167)
- [minor] Add DateTimePickerStateless and refactor DateTimePicker to use that internally, and expose DateTimePickerStateless as public API. [bbbadf5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbbadf5)

## 0.1.2

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 0.1.0

- [minor] Added TimePicker and DateTimePicker. Improved docs and examples. [4b49f4d](4b49f4d)

## 0.0.5

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)
