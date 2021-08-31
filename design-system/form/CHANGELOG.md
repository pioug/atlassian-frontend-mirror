# @atlaskit/form

## 8.3.1

### Patch Changes

- Updated dependencies

## 8.3.0

### Minor Changes

- [`4cab1a3d163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cab1a3d163) - Form is now instrumented with the new tokens theme implementation. This change is interoperable with the previous theme implementation.

### Patch Changes

- Updated dependencies

## 8.2.4

### Patch Changes

- [`f701489305f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f701489305f) - Export Field directly for types to be exported explicitly.
- Updated dependencies

## 8.2.3

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 8.2.2

### Patch Changes

- [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade `@types/react-select` to `v3.1.2` and fix type breaks
- Updated dependencies

## 8.2.1

### Patch Changes

- [`5af85edf960`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af85edf960) - Internal code style change of default exports

## 8.2.0

### Minor Changes

- [`fa4256f9b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa4256f9b0) - Add getState to FormProps for inspecting internal Form state (errors, values, et al)
- [`9552363cb7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9552363cb7) - [ux] Added a RangeField component to address issues surrounding Range having a different interface to other kinds of inputs. Use a RangeField instead of a Field when using a Range inside of a Form. You must provide a `defaultValue`.

## 8.1.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.1.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 8.1.5

### Patch Changes

- Updated dependencies

## 8.1.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 8.1.3

### Patch Changes

- [`741e4240d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/741e4240d0) - Final form dependencies have been upgraded to their latest versions
- [`3773e0ad4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3773e0ad4e) - There was an issue where the validate function in Field would return an incorrect value or even go unresponsive when mixing async and sync validators. This has been fixed by updating the version of `final-form`. The test that validates this is working has been re-enabled.
- Updated dependencies

## 8.1.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 8.1.1

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 8.1.0

### Minor Changes

- [`694fee4dcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/694fee4dcc) - Adding validating status to meta for async validations, and make sure the default value of error in form is a string

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 8.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.4.1

### Patch Changes

- [`2e4000e57b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e4000e57b) - Form now fully supports object and array field names.

## 7.4.0

### Minor Changes

- [`fc690a7dd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc690a7dd4) - HelperMessage, ErrorMessage and ValidMessage now have an optional prop testId that will set the attribute value data-testid.

## 7.3.1

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 7.3.0

### Minor Changes

- [`56d6259cf5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56d6259cf5) - Change FormHeader and FormSection to use h2 and h3 respectively for headings instead of h1 and h2.

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 7.2.2

### Patch Changes

- Updated dependencies

## 7.2.1

### Patch Changes

- [patch][0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):

  Change imports to comply with Atlassian conventions- Updated dependencies [62390c4755](https://bitbucket.org/atlassian/atlassian-frontend/commits/62390c4755):

- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):
- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [a4acc95793](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4acc95793):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [ca494abcd5](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca494abcd5):
- Updated dependencies [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/calendar@9.2.7
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/datetime-picker@9.4.0
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/droplist@10.0.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 7.2.0

### Minor Changes

- [minor][294c05bcdf](https://bitbucket.org/atlassian/atlassian-frontend/commits/294c05bcdf):

  Form now exposes a `setFieldValue` command which enables the ability to imperatively change field values. For example, if you have an input field whos value is concatinated to the next of the next input.

### Patch Changes

- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [f0af33ead6](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0af33ead6):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/datetime-picker@9.2.9
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/radio@3.2.0
  - @atlaskit/docs@8.5.0

## 7.1.5

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
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/field-range@8.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/calendar@9.2.6
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/datetime-picker@9.2.8
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/droplist@10.0.3
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/radio@3.1.11
  - @atlaskit/section-message@4.1.7
  - @atlaskit/select@11.0.9
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9
  - @atlaskit/toggle@8.1.6
  - @atlaskit/tooltip@15.2.5

## 7.1.4

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/calendar@9.2.5
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/datetime-picker@9.2.7
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/droplist@10.0.2
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/radio@3.1.10
  - @atlaskit/section-message@4.1.6
  - @atlaskit/select@11.0.8
  - @atlaskit/textarea@2.2.5
  - @atlaskit/textfield@3.1.8
  - @atlaskit/toggle@8.1.5
  - @atlaskit/tooltip@15.2.4

## 7.1.3

### Patch Changes

- [patch][eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):

  Fixes form typing to a form event - widens the type to allow no event to be passed.- [patch][c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):

  Fixed an ambigous type definition for FormApi- Updated dependencies [116cb9b00f](https://bitbucket.org/atlassian/atlassian-frontend/commits/116cb9b00f):

- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/datetime-picker@9.2.6
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/checkbox@10.1.8

## 7.1.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/calendar@9.2.4
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/datetime-picker@9.2.5
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/droplist@10.0.1
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/multi-select@14.0.1
  - @atlaskit/radio@3.1.9
  - @atlaskit/section-message@4.1.5
  - @atlaskit/select@11.0.7
  - @atlaskit/single-select@9.0.1
  - @atlaskit/textarea@2.2.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/tooltip@15.2.3

## 7.1.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/droplist@10.0.0
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/multi-select@14.0.0
  - @atlaskit/single-select@9.0.0
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/datetime-picker@9.2.4
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/calendar@9.2.3
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/radio@3.1.8
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5
  - @atlaskit/tooltip@15.2.2

## 7.1.0

### Minor Changes

- [minor][ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):

  Adds the ability to reset a form to it's default state. This is useful for cases where a user might want to manually clear their information.

### Patch Changes

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/docs@8.3.0

## 7.0.1

### Patch Changes

- [patch][ec76622d34](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec76622d34):

  Adds missing type definition for name to fieldProps, which are passed down to children components- [patch][d93de8e56e](https://bitbucket.org/atlassian/atlassian-frontend/commits/d93de8e56e):

  Fix clearing for Selects. Fix defaultValue for non-primitive values.- Updated dependencies [e20d7996ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/e20d7996ca):

- Updated dependencies [6e55ab88df](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e55ab88df):
  - @atlaskit/radio@3.1.7
  - @atlaskit/select@11.0.5

## 7.0.0

### Major Changes

- [major][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix internal use of `props.name` property which could cause the internal fieldId to be incorrectly set- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/select@11.0.3
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/field-text-area@6.0.15
  - @atlaskit/field-text@9.0.14
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/radio@3.1.5
  - @atlaskit/textfield@3.1.4
  - @atlaskit/textarea@2.2.3
  - @atlaskit/datetime-picker@9.2.3

## 6.3.2

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/calendar@9.2.1
  - @atlaskit/modal-dialog@10.3.6
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/datetime-picker@9.2.1

## 6.3.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.3.0

### Minor Changes

- [minor][32c55df1d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32c55df1d2):

  Add align prop for FormFooter

## 6.2.5

- Updated dependencies [d1444cc6ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1444cc6ef):
  - @atlaskit/datetime-picker@9.0.0

## 6.2.4

- Updated dependencies [8c725d46ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c725d46ec):
  - @atlaskit/datetime-picker@8.1.1
  - @atlaskit/calendar@9.0.0

## 6.2.3

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/modal-dialog@10.3.1
  - @atlaskit/radio@3.0.18
  - @atlaskit/select@10.1.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 6.2.2

### Patch Changes

- [patch][2deee10c17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2deee10c17):

  Bugfix - DS-6661 - The componentWillUnmount method is not overridden properly in Form component as it has been misspelled as 'componenWillUnmount'.

## 6.2.1

### Patch Changes

- [patch][5ccdfaeef2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ccdfaeef2):

  Fixes bug where onSubmit function in Form may not be called if reference changes

## 6.2.0

### Minor Changes

- [minor][1f2c548ffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f2c548ffa):

  Fixes an issue where Select inside a Form would not be clearable

## 6.1.12

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.1.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.1.10

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 6.1.9

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 6.1.8

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.1.7

- Updated dependencies [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/icon@19.0.2
  - @atlaskit/modal-dialog@10.1.2
  - @atlaskit/textfield@3.0.0

## 6.1.6

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 6.1.5

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/toggle@8.0.0

## 6.1.4

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/datetime-picker@8.0.9
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/select@10.0.0

## 6.1.3

- Updated dependencies [19d9d0f13f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19d9d0f13f):
  - @atlaskit/datetime-picker@8.0.8

## 6.1.2

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/modal-dialog@10.0.8
  - @atlaskit/radio@3.0.7
  - @atlaskit/select@9.1.10
  - @atlaskit/checkbox@9.0.0

## 6.1.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/calendar@8.0.3
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/datetime-picker@8.0.7
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/droplist@9.0.8
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/multi-select@13.0.7
  - @atlaskit/radio@3.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/select@9.1.8
  - @atlaskit/single-select@8.0.6
  - @atlaskit/textfield@2.0.3
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 6.1.0

### Minor Changes

- [minor][7bbf303d01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bbf303d01):

  - Improved form validation user experience when field validation and submission validation used together on the same field
  - Improved form validation docs

## 6.0.7

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 6.0.6

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/dropdown-menu@8.0.5
  - @atlaskit/droplist@9.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 6.0.5

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/calendar@8.0.1
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/datetime-picker@8.0.5
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/droplist@9.0.4
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/multi-select@13.0.5
  - @atlaskit/radio@3.0.3
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/single-select@8.0.4
  - @atlaskit/textfield@2.0.1
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 6.0.4

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/modal-dialog@10.0.2
  - @atlaskit/radio@3.0.2
  - @atlaskit/select@9.1.4
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 6.0.3

- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [1da5351f72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da5351f72):
  - @atlaskit/datetime-picker@8.0.3
  - @atlaskit/icon@17.1.2
  - @atlaskit/select@9.1.2
  - @atlaskit/modal-dialog@10.0.0
  - @atlaskit/radio@3.0.0

## 6.0.2

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/checkbox@7.0.1
  - @atlaskit/field-radio-group@6.0.1
  - @atlaskit/field-range@7.0.1
  - @atlaskit/field-text@9.0.1
  - @atlaskit/field-text-area@6.0.1
  - @atlaskit/icon@17.1.1
  - @atlaskit/multi-select@13.0.2
  - @atlaskit/single-select@8.0.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 6.0.1

- [patch][19bbcb44ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19bbcb44ed):

  - Upgrade final-form dependency. No behavioural or API changes.

## 6.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 5.2.10

- Updated dependencies [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
- Updated dependencies [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/textarea@1.0.0
  - @atlaskit/modal-dialog@8.0.9
  - @atlaskit/textfield@1.0.0

## 5.2.9

- Updated dependencies [6c4e41ff36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c4e41ff36):
  - @atlaskit/radio@1.0.0

## 5.2.8

- [patch][cb7ec50eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb7ec50eca):

  - Internal changes only. Form is compatible with SSR.

## 5.2.7

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/calendar@7.0.22
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/datetime-picker@7.0.4
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/droplist@8.0.5
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/field-text@8.0.3
  - @atlaskit/field-text-area@5.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/multi-select@12.0.3
  - @atlaskit/radio@0.5.3
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/single-select@7.0.3
  - @atlaskit/textarea@0.4.4
  - @atlaskit/textfield@0.4.4
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 5.2.6

- [patch][9b0bdd73c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0bdd73c2):

  - Remove unused inline edit dependency from package

## 5.2.5

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/calendar@7.0.21
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/datetime-picker@7.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/droplist@8.0.3
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/field-text-area@5.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-edit@8.0.2
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/multi-select@12.0.2
  - @atlaskit/radio@0.5.2
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/single-select@7.0.2
  - @atlaskit/textarea@0.4.1
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 5.2.4

- Updated dependencies [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - @atlaskit/textarea@0.4.0

## 5.2.3

- Updated dependencies [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/modal-dialog@8.0.3
  - @atlaskit/textfield@0.4.0

## 5.2.2

- [patch][a1217df379](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1217df379):

  - Internal changes only. Form is now compatible with ssr.

## 5.2.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/calendar@7.0.20
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/datetime-picker@7.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/droplist@8.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/field-text-area@5.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-edit@8.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/multi-select@12.0.1
  - @atlaskit/radio@0.5.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/single-select@7.0.1
  - @atlaskit/textfield@0.3.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/textarea@0.3.0

## 5.2.0

- [minor][fe7683f9d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe7683f9d6):

  - Feature: Submit form on Cmd + Enter on Mac and Ctrl + Enter on Mac and Windows

## 5.1.8

- [patch][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

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

## 5.1.7

- Updated dependencies [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/modal-dialog@7.2.4
  - @atlaskit/textfield@0.2.0

## 5.1.6

- [patch][887c85ffdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/887c85ffdc):

  - Form now provides a `getValues` function to it's child render function. The `getValues` function returns an object containing the current value of all fields.

## 5.1.5

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/datetime-picker@6.5.1
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 5.1.4

- [patch][0c0f20c9cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c0f20c9cf):

  - Fix typo in Field.js

## 5.1.3

- [patch][a360a3d2b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a360a3d2b6):

  - Bugfix: field entry in form state gets deleted when Field is unmounted
  - Bugfix: Shallow equal check in Field works correctly across different types

## 5.1.2

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/calendar@7.0.17
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/datetime-picker@6.3.25
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/droplist@7.0.18
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/inline-edit@7.1.8
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/multi-select@11.0.14
  - @atlaskit/radio@0.4.6
  - @atlaskit/section-message@1.0.16
  - @atlaskit/select@6.1.19
  - @atlaskit/single-select@6.0.12
  - @atlaskit/toggle@5.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 5.1.1

- [patch][58e7bc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58e7bc1):

  - Added example of Form use within a ModalDialog - no changes required

## 5.1.0

- [minor][b36a82f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36a82f):

  - **feature:** Uses context to automatically assosiate a message to field. No upgrade changes required. Can remove fieldId prop on Message components if you are using that prop currently.

## 5.0.0

- [major][647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):

  - **Breaking:** this version is a major overhaul of the package.
    - **Conceptual changes:** The `Form` component must be the source of truth for the form state. This means you keep track of far less state in your application.
    - **API changes:** `Form`, `Field` and `CheckboxField` components use render props. This was done to maximise the flexiblity of the what can be rendered inside `Form` or `Field`s.
    - **Accessibility:** Creating accessible forms is easier than ever with this release. It is straight forward to link validation messages or helper text with a field. See the examples for details.

## 4.0.21

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/calendar@7.0.16
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/datetime-picker@6.3.21
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/droplist@7.0.17
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/field-text-area@4.0.14
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-edit@7.1.7
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/multi-select@11.0.13
  - @atlaskit/radio@0.4.4
  - @atlaskit/section-message@1.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/single-select@6.0.11
  - @atlaskit/theme@7.0.1
  - @atlaskit/toggle@5.0.14
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 4.0.20

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/calendar@7.0.15
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/datetime-picker@6.3.20
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/droplist@7.0.16
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/field-range@5.0.11
  - @atlaskit/field-text@7.0.16
  - @atlaskit/field-text-area@4.0.13
  - @atlaskit/icon@15.0.1
  - @atlaskit/inline-edit@7.1.6
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/multi-select@11.0.12
  - @atlaskit/radio@0.4.3
  - @atlaskit/section-message@1.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/single-select@6.0.10
  - @atlaskit/toggle@5.0.13
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 4.0.19

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/calendar@7.0.14
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/datetime-picker@6.3.19
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/droplist@7.0.14
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/inline-edit@7.1.5
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/multi-select@11.0.11
  - @atlaskit/radio@0.4.2
  - @atlaskit/section-message@1.0.12
  - @atlaskit/select@6.1.9
  - @atlaskit/single-select@6.0.9
  - @atlaskit/toggle@5.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 4.0.18

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/calendar@7.0.13
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/datetime-picker@6.3.18
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/droplist@7.0.13
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/field-text-area@4.0.12
  - @atlaskit/icon@14.6.1
  - @atlaskit/inline-edit@7.1.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/multi-select@11.0.10
  - @atlaskit/radio@0.4.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/single-select@6.0.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/toggle@5.0.11
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 4.0.17

- Updated dependencies [b42680b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42680b):
  - @atlaskit/radio@0.4.0

## 4.0.16

- Updated dependencies [8199088](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8199088):
  - @atlaskit/radio@0.3.0

## 4.0.15

- [patch][e6d3f57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6d3f57):

  - Check that content children of FormSection are valid elements before cloning

## 4.0.14

- [patch][c8d935f" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8d935f"
  d):

  - Fixing form header styles

## 4.0.13

- [patch] Fixed rendering of FieldGroup legends [af05f8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af05f8e)

## 4.0.12

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 4.0.11

- [patch] Empty form headings and sections no longer result in extra spacing [ac537db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac537db)

## 4.0.10

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/calendar@7.0.9
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/datetime-picker@6.3.11
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/droplist@7.0.10
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/inline-edit@7.1.1
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/multi-select@11.0.7
  - @atlaskit/section-message@1.0.8
  - @atlaskit/select@6.0.2
  - @atlaskit/single-select@6.0.6
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 4.0.9

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/datetime-picker@6.3.10
  - @atlaskit/select@6.0.0

## 4.0.8

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 4.0.7

- [patch] Deprecates field-radio-group from form components. Adds @atlaskit/radio to field components [dcdb61b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dcdb61b)

## 4.0.6

- [patch] Fix isRequired applied to all fields [cb73e27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb73e27)

## 4.0.5

- [patch] Updated dependencies [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/button@9.0.9
  - @atlaskit/modal-dialog@7.0.1
  - @atlaskit/select@5.0.18
  - @atlaskit/checkbox@5.0.0

## 4.0.4

- [patch] Form validate now correctly returns fieldState & checks isRequired [87cea82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cea82)

## 4.0.3

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/datetime-picker@6.3.7
  - @atlaskit/icon@13.8.1
  - @atlaskit/select@5.0.17
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 4.0.2

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/datetime-picker@6.3.6
  - @atlaskit/select@5.0.16
  - @atlaskit/webdriver-runner@0.1.0

## 4.0.1

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 4.0.0

- [major] Removed required prop, consolidated the logic into the isRequired prop. [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)

## 3.1.8

- [patch] Fix Form submit handlers being called when no onSubmit prop is passed [1086a6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1086a6b)

## 3.1.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/toggle@5.0.6
  - @atlaskit/single-select@6.0.4
  - @atlaskit/select@5.0.9
  - @atlaskit/section-message@1.0.5
  - @atlaskit/multi-select@11.0.5
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/inline-edit@7.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text-area@4.0.6
  - @atlaskit/field-text@7.0.6
  - @atlaskit/field-range@5.0.4
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/droplist@7.0.7
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/datetime-picker@6.3.2
  - @atlaskit/checkbox@4.0.4
  - @atlaskit/calendar@7.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 3.1.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/select@5.0.8
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/multi-select@11.0.4
  - @atlaskit/inline-edit@7.0.4
  - @atlaskit/field-text-area@4.0.4
  - @atlaskit/field-text@7.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/checkbox@4.0.3
  - @atlaskit/calendar@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/field-range@5.0.3
  - @atlaskit/section-message@1.0.4
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/datetime-picker@6.1.1
  - @atlaskit/icon@13.2.4
  - @atlaskit/droplist@7.0.5
  - @atlaskit/dropdown-menu@6.1.5

## 3.1.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/single-select@6.0.3
  - @atlaskit/section-message@1.0.3
  - @atlaskit/multi-select@11.0.3
  - @atlaskit/inline-edit@7.0.3
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/checkbox@4.0.2
  - @atlaskit/calendar@7.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/field-text-area@4.0.3
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/droplist@7.0.4
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/modal-dialog@6.0.5
  - @atlaskit/datetime-picker@6.0.3

## 3.1.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/select@5.0.6
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/inline-edit@7.0.2
  - @atlaskit/field-text-area@4.0.2
  - @atlaskit/field-text@7.0.2
  - @atlaskit/toggle@5.0.3
  - @atlaskit/checkbox@4.0.1
  - @atlaskit/calendar@7.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/field-range@5.0.1
  - @atlaskit/section-message@1.0.2
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/datetime-picker@6.0.2
  - @atlaskit/icon@13.2.1
  - @atlaskit/droplist@7.0.3
  - @atlaskit/dropdown-menu@6.1.3

## 3.1.2

- [patch] Removed incorrect min-height for forms. Fixed select dev dep range for form. [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
- [none] Updated dependencies [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
  - @atlaskit/select@5.0.5

## 3.1.1

- [patch] Update docs, change dev deps [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/single-select@6.0.2
  - @atlaskit/select@5.0.4
  - @atlaskit/multi-select@11.0.2

## 3.1.0

- [minor] Improvements & fixes for Form validation & state management [e33f19d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e33f19d)
- [minor] Updated dependencies [e33f19d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e33f19d)
  - @atlaskit/select@5.0.3

## 3.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/select@5.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/droplist@7.0.1
  - @atlaskit/dropdown-menu@6.1.1

## 3.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/inline-edit@7.0.0
  - @atlaskit/field-text-area@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/dropdown-menu@6.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/inline-edit@7.0.0
  - @atlaskit/field-text-area@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/dropdown-menu@6.0.0

## 2.1.5

- [patch] fix styled-components syntax error [60c715f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60c715f)
- [none] Updated dependencies [60c715f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60c715f)
  - @atlaskit/select@4.3.5

## 2.1.4

- [patch] Fix Field validator error on empty strings [470a1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/470a1fb)
- [patch] Updated dependencies [470a1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/470a1fb)
  - @atlaskit/select@4.3.2

## 2.1.3

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/tooltip@10.3.1
  - @atlaskit/select@4.3.1
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/single-select@5.2.1
  - @atlaskit/multi-select@10.2.1
  - @atlaskit/field-text-area@3.1.2
  - @atlaskit/button@8.2.2
  - @atlaskit/checkbox@3.1.2
  - @atlaskit/calendar@6.1.3
  - @atlaskit/field-radio-group@3.1.2
  - @atlaskit/icon@12.3.1

## 2.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/select@4.2.3
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/single-select@5.1.2
  - @atlaskit/multi-select@10.1.2
  - @atlaskit/inline-edit@6.1.3
  - @atlaskit/field-text-area@3.1.1
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/theme@4.0.4
  - @atlaskit/field-range@4.0.3
  - @atlaskit/checkbox@3.0.6
  - @atlaskit/calendar@6.1.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/datetime-picker@5.2.1
  - @atlaskit/icon@12.1.2
  - @atlaskit/droplist@6.1.2
  - @atlaskit/dropdown-menu@5.0.4

## 2.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/single-select@5.1.1
  - @atlaskit/select@4.2.1
  - @atlaskit/multi-select@10.1.1
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/inline-edit@6.1.2
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/droplist@6.1.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/checkbox@3.0.5
  - @atlaskit/calendar@6.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 2.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/single-select@5.1.0
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/select@4.2.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/inline-edit@6.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/checkbox@3.0.4
  - @atlaskit/calendar@6.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text-area@3.0.3
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/datetime-picker@5.2.0
  - @atlaskit/multi-select@10.1.0
  - @atlaskit/droplist@6.1.0
  - @atlaskit/button@8.1.0

## 2.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/select@4.0.1
  - @atlaskit/datetime-picker@5.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/toggle@4.0.1
  - @atlaskit/inline-edit@6.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/field-text-area@3.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/checkbox@3.0.1
  - @atlaskit/calendar@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/field-range@4.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/droplist@6.0.1
  - @atlaskit/dropdown-menu@5.0.1

## 2.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/select@4.0.0
  - @atlaskit/datetime-picker@5.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/single-select@5.0.0
  - @atlaskit/multi-select@10.0.0
  - @atlaskit/inline-edit@6.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-text-area@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/checkbox@3.0.0
  - @atlaskit/calendar@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/droplist@6.0.0
  - @atlaskit/dropdown-menu@5.0.0

## 1.0.4

- [patch] Updated dependencies [6859cf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6859cf6)
  - @atlaskit/field-text@5.1.0
  - @atlaskit/field-text-area@2.1.0

## 1.0.3

- [patch] Fix pinned field-text dep [050ad7b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/050ad7b)

## 1.0.2

- [patch] Updated dependencies [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
  - @atlaskit/select@3.0.0
  - @atlaskit/datetime-picker@4.0.0

## 1.0.0

- [patch] Form developer preview [d8b2b03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8b2b03)
- [major] Form package developer preview release [9b28847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b28847)
