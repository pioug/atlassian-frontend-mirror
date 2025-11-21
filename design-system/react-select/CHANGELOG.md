# @atlaskit/react-select

## 3.9.1

### Patch Changes

- [`062b55b337dd8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/062b55b337dd8) -
  aria-autocomplete is omitted when isSearchable is false.

## 3.9.0

### Minor Changes

- [`2568622464f45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2568622464f45) -
  release previously feature-gated change to textfield, textarea, and select to increase font size
  to 16px on mobile

## 3.8.9

### Patch Changes

- [`7264c5e8ee76b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7264c5e8ee76b) -
  export additional type

## 3.8.8

### Patch Changes

- Updated dependencies

## 3.8.7

### Patch Changes

- Updated dependencies

## 3.8.6

### Patch Changes

- [`e02c11e7be73c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e02c11e7be73c) -
  types made more explicit

## 3.8.5

### Patch Changes

- [`2c386d1fc1477`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c386d1fc1477) -
  ts-ignore added as a workaround for help-center local consumption

## 3.8.4

### Patch Changes

- Updated dependencies

## 3.8.3

### Patch Changes

- Updated dependencies

## 3.8.2

### Patch Changes

- Updated dependencies

## 3.8.1

### Patch Changes

- [`7368596d0c740`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7368596d0c740) -
  Typescript updates

## 3.8.0

### Minor Changes

- [`a3ea761f650bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a3ea761f650bb) -
  [ux] Updates react-select styles to reflect our new visual design language. These changes were
  previously behind a feature flag and are now fully rolled out.

## 3.7.1

### Patch Changes

- [`437668dfbdec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437668dfbdec9) -
  Add explicit types to a number of DST components
- Updated dependencies

## 3.7.0

### Minor Changes

- [`b19759f83390f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b19759f83390f) -
  [ux] Updates react-select styles to reflect our new visual design language. These changes were

### Patch Changes

- Updated dependencies

## 3.6.1

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.
- Updated dependencies

## 3.6.0

### Minor Changes

- [`153fad932190f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/153fad932190f) -
  [ux] Added a new prop shouldKeepInputOnSelect to the select component to prevent clearing the
  input when isMulti is true

## 3.5.4

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 3.5.3

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 3.5.2

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 3.5.1

### Patch Changes

- [`d281a835c4897`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d281a835c4897) -
  [ux]
  - `TeamCreateDialog`
    - Fixed incorrect ariaDescribedBy identifier so that VoiceOver can read out the error message.
    - Programmatically focus the input on submit when there is an error.

- Updated dependencies

## 3.5.0

### Minor Changes

- [`782e1924230d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/782e1924230d5) -
  Introduced new optional "shouldPreventEscapePropagation" prop to prevent Escape keydown event
  propagation

## 3.4.5

### Patch Changes

- Updated dependencies

## 3.4.4

### Patch Changes

- [`4129d4df5bb4d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4129d4df5bb4d) -
  Revert the changes done to add prop hasOtherFocusableElements flag

## 3.4.3

### Patch Changes

- [#200709](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200709)
  [`4e4c55892eecf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e4c55892eecf) -
  [ux] Prevent input from being cleared from selecting an option with multi-select enabled and fix
  cursor in search field
- Updated dependencies

## 3.4.2

### Patch Changes

- [#199732](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199732)
  [`6a3dc4b33b338`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6a3dc4b33b338) -
  Clean up label property in css

## 3.4.1

### Patch Changes

- Updated dependencies

## 3.4.0

### Minor Changes

- [#192272](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192272)
  [`94b0093816679`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94b0093816679) -
  conditionally handle the blur & menu close for the select based on the focusable elements other
  than options

### Patch Changes

- Updated dependencies

## 3.3.1

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [#190303](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190303)
  [`ad9134117de54`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad9134117de54) -
  Deprecation of the `styles` prop. For styling purposes, use the `components` API with the `xcss`
  prop.

### Patch Changes

- [#190337](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190337)
  [`d94e09ebf7502`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d94e09ebf7502) -
  Clean up unused compiled-react-select feature flag

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#175869](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175869)
  [`e7f822af7edc1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7f822af7edc1) -
  Updated usages of deprecated icons with replacement icons

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#180250](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180250)
  [`105957fce131e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/105957fce131e) -
  Deprecation of the `className` prop. If `className` is used for testing purposes, you should use
  `testId` as an appropriate locator. If using `className` for styling purposes, use the
  `components` API with the `xcss` prop.

## 3.0.2

### Patch Changes

- [#178284](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178284)
  [`1c7de1d8fc547`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c7de1d8fc547) -
  Remove emotion dependency

## 3.0.1

### Patch Changes

- [#178086](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178086)
  [`40baa376a7a68`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40baa376a7a68) -
  Clean up emotion components

## 3.0.0

### Major Changes

- [#155023](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155023)
  [`7a305b4f49968`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7a305b4f49968) -
  [ux] Migrated underlying `react-select` implementation from `@emotion/react` to `@compiled/react`
  to improve performance, align with the rest of the Atlaskit tech stack, and support React 18
  Streaming SSR. Style customization should now be applied via the `components` prop with the new
  `xcss` prop, which allows for safe and bounded style overrides. The `styles` prop is still
  supported for most inline styles, but pseudo-classes and advanced selectors are no longer
  supported and will be ignored.

  If you use the `styles` prop with selectors like `:hover`, `:focus`, `:active`, `:disabled`,
  `:before`, `:after`, attribute selectors, combinators, at-rules, or similar, you must migrate to
  the new `components` API and use the `xcss` prop. See the
  [examples](https://atlassian.design/components/eslint-plugin-design-system/enforce-inline-styles-in-select/usage)
  for details.

  This is a breaking change for any consumers relying on advanced selectors in the `styles` prop.

### Patch Changes

- Updated dependencies

## 2.7.6

### Patch Changes

- [#175058](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175058)
  [`cfb3a1596d972`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfb3a1596d972) -
  Add same class names in emotion compoent as compiled select for GA
- Updated dependencies

## 2.7.5

### Patch Changes

- [#173706](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173706)
  [`a37d69dbb048b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a37d69dbb048b) -
  Remove onMenuClose call when input is blur

## 2.7.4

### Patch Changes

- Updated dependencies

## 2.7.3

### Patch Changes

- [#169844](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169844)
  [`5d93bf6663968`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d93bf6663968) -
  Set compiled menuPortal to 1 as the same as emotion menuPortal

## 2.7.2

### Patch Changes

- [#168875](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168875)
  [`b118c9669e117`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b118c9669e117) -
  Clean up design-system-select-fix-placement
- Updated dependencies

## 2.7.1

### Patch Changes

- Updated dependencies

## 2.7.0

### Minor Changes

- [#155546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155546)
  [`4133da7ce5d92`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4133da7ce5d92) -
  This cleans up the feature flag references for assistive technology improvements, making them
  fully available to all people.

## 2.6.6

### Patch Changes

- [#167524](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167524)
  [`c1abb6d08436a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1abb6d08436a) -
  Prepare changes for compiled react-select

## 2.6.5

### Patch Changes

- [#166244](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166244)
  [`be0b732d3b803`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be0b732d3b803) -
  Prepare changes for compiled react-select

## 2.6.4

### Patch Changes

- Updated dependencies

## 2.6.3

### Patch Changes

- [#161473](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161473)
  [`fe691319dea70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe691319dea70) -
  Update value container class name to -value-container

## 2.6.2

### Patch Changes

- [#161448](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161448)
  [`7926a078306bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7926a078306bf) -
  Update accessibility for description

## 2.6.1

### Patch Changes

- [#159414](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159414)
  [`51ab2e7b0a12d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51ab2e7b0a12d) -
  Added aria label for options dialog

## 2.6.0

### Minor Changes

- [#158127](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158127)
  [`b7989ac128aef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7989ac128aef) -
  Added "shouldOmitDefaultDescription" prop for `Select` to omit default description being set for
  "aria-describedby" attribute

## 2.5.0

### Minor Changes

- [#155681](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155681)
  [`679a437d9a866`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/679a437d9a866) -
  The feature flag for registering `Select` and `PopupSelect` with the experimental open layer
  observer has now been cleaned up.

### Patch Changes

- Updated dependencies

## 2.4.10

### Patch Changes

- [#157159](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157159)
  [`8da004db78761`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8da004db78761) -
  Migrate menuPortal inline styles to compiled styles

## 2.4.9

### Patch Changes

- [#156309](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156309)
  [`684b2b1960644`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/684b2b1960644) -
  Remove all possible CSS selector patterns that would be invalid in inline styles

## 2.4.8

### Patch Changes

- Updated dependencies

## 2.4.7

### Patch Changes

- [#150364](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150364)
  [`8b38cbb81c263`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b38cbb81c263) -
  Add emotion class on compiled components to continue support of class queries temporarily, please
  avoid using any class to style or query'

## 2.4.6

### Patch Changes

- [#149640](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149640)
  [`0f41428da5608`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f41428da5608) -
  Remove label in compiled styles

## 2.4.5

### Patch Changes

- [#146587](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146587)
  [`f296c108b483f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f296c108b483f) -
  Filter out unsupported styles from styles props under feature flag

## 2.4.4

### Patch Changes

- [#142181](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142181)
  [`d6934885b334e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6934885b334e) -
  Fixed some new icons that were enabled with the incorrect feature flag.

## 2.4.3

### Patch Changes

- [#143201](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143201)
  [`8995008d9cff5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8995008d9cff5) -
  Improve assistive technology support for Async loading.

## 2.4.2

### Patch Changes

- [#140048](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140048)
  [`f05dae04933f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f05dae04933f3) -
  Improve assistive technology support for removing selected values with Multiselect.

## 2.4.1

### Patch Changes

- [#141760](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141760)
  [`2df2e25329cb8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2df2e25329cb8) -
  [ux] Resolved issue where group `Heading` component would render even when no labels were provided

## 2.4.0

### Minor Changes

- [#141922](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141922)
  [`a48b38cffa7e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a48b38cffa7e6) -
  Create a compiled select and use feature flag to toggle it

### Patch Changes

- [#141922](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141922)
  [`a48b38cffa7e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a48b38cffa7e6) -
  Migrate emotion components to compiled components under compiled folder

## 2.3.0

### Minor Changes

- [#140608](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140608)
  [`572d25e55053e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/572d25e55053e) -
  Create a compiled select and use feature flag to toggle it

### Patch Changes

- [#140608](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140608)
  [`fe641f68c1d27`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe641f68c1d27) -
  Migrate emotion components to compiled components under compiled folder
- Updated dependencies

## 2.2.1

### Patch Changes

- [#140556](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140556)
  [`5f8b3f708ef6f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f8b3f708ef6f) -
  Create emotion version of components under emotion folder

## 2.2.0

### Minor Changes

- [#137501](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137501)
  [`fb85ce5c05391`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb85ce5c05391) -
  Testing unsafe experimental options, to be removed at a later time.

## 2.1.0

### Minor Changes

- [#135853](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135853)
  [`37d9e41733fc5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/37d9e41733fc5) -
  Select components now sync with the experimental open layer observer, using the
  useNotifyOpenLayerObserver hook.

  This is used to close any open select menus when page layout slots are resized.

  These changes are behind feature flags.

## 2.0.7

### Patch Changes

- [#131835](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131835)
  [`11b3a9f6a407e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11b3a9f6a407e) -
  [Popup Select] Improve assistive technology support by reducing reliance on live regions.

## 2.0.6

### Patch Changes

- [#123298](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123298)
  [`8a9b860d5da36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a9b860d5da36) -
  [ux] Improved accessibility for selected values

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#122557](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122557)
  [`d8b5709e3f003`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d8b5709e3f003) -
  Fix aria-label on multi select remove button to support non-string content

## 2.0.3

### Patch Changes

- [#120299](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120299)
  [`8e94f6d9a4d9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e94f6d9a4d9f) -
  Remove unused internal exports and functions and update dependencies.

## 2.0.2

### Patch Changes

- [#119038](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119038)
  [`5c68906e5ab22`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c68906e5ab22) -
  [ux] Update accessible description for when multiple selections are available

## 2.0.1

### Patch Changes

- [#119843](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119843)
  [`7bd0d851d1c39`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bd0d851d1c39) -
  [ux] Clean up ARIA props that are no longer needed

## 2.0.0

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

## 1.7.5

### Patch Changes

- [#114403](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114403)
  [`73c26a58b3d36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73c26a58b3d36) -
  Update rendering of multiselect description to support SSR

## 1.7.4

### Patch Changes

- [#114436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114436)
  [`bbcb49e3d0f31`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bbcb49e3d0f31) -
  Clean up extra testId

## 1.7.3

### Patch Changes

- [#106179](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106179)
  [`84a6c5a582438`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/84a6c5a582438) -
  Add support for testId to Select

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#108838](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108838)
  [`6afd2ca314368`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6afd2ca314368) -
  Replace the helper to verify devices with ds-lib util

## 1.7.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.6.4

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 1.6.2

### Patch Changes

- [#102821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102821)
  [`911b2ffd1013f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/911b2ffd1013f) -
  Remove stopPropagation call in Escape key press events

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#177875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177875)
  [`d0c3d27216b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0c3d27216b7c) -
  Remove theme prop and merge customized components for performance

## 1.5.2

### Patch Changes

- [#167291](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167291)
  [`4645a4d115b15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4645a4d115b15) -
  Fix the calculation of scroll space below to place menu bottom as much as possible

## 1.5.1

### Patch Changes

- [#174296](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174296)
  [`b9f79083be192`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9f79083be192) -
  Adding extra semantics to listbox

## 1.5.0

### Minor Changes

- [#173737](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173737)
  [`667640085e5c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/667640085e5c7) -
  Update the font size for the textarea and select components at the `xs` breakpoint. The font size
  will be increased to 16px to prevent IOS Safari from zooming in on the text field when it is
  focused. Styles for larger breakpoints will remain unchanged.

  Apply a fix to the textfield component to ensure monospace is correctly applied to the input at
  the `media.above.xs` breakpoint.

  These changes are currently behind a feature gate and will be evaluated for effectiveness. If
  successful, they will be included in a future release.

## 1.4.2

### Patch Changes

- [#172260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172260)
  [`9934fe89f1e6a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9934fe89f1e6a) -
  Improving assisstive technology support by adding better semantics and reducing live region usage

## 1.4.1

### Patch Changes

- [#167336](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167336)
  [`ddb0846c39a88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddb0846c39a88) -
  Integrate styles of select and react-select in a single place

## 1.4.0

### Minor Changes

- [#166811](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166811)
  [`6bfa3f552b209`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6bfa3f552b209) -
  Remove unstyled prop

## 1.3.3

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.3.2

### Patch Changes

- [#163217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163217)
  [`560d23ab4dfbe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/560d23ab4dfbe) -
  Add null check on safari for SSR

## 1.3.1

### Patch Changes

- [#162105](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162105)
  [`4edf9a851c491`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4edf9a851c491) -
  Improve the aria live for searching and reduce the live message when menu is open

## 1.3.0

### Minor Changes

- [#160447](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160447)
  [`515ed7a31a9fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/515ed7a31a9fb) -
  Make async select by default in select

## 1.2.0

### Minor Changes

- [#157818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157818)
  [`87c14ad1a3efa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87c14ad1a3efa) -
  Use semantic tags and arias for combobox and listbox and reduce aria-live

## 1.1.0

### Minor Changes

- [#156026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156026)
  [`709b9c76673df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/709b9c76673df) -
  add clearControlLabel prop to pass aria-label to clear icon button

## 1.0.6

### Patch Changes

- [#154659](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154659)
  [`110ee6d55bdb1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/110ee6d55bdb1) -
  Remove ts-ignore comments

## 1.0.5

### Patch Changes

- [#150547](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150547)
  [`e26194391b9dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e26194391b9dd) -
  Add react18 support

## 1.0.4

### Patch Changes

- [#150410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150410)
  [`010ae8c2986e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/010ae8c2986e6) -
  If select is within react-beatiful-dnd, don't prevent onMouseDown event to fix select is not
  clickable in dnd

## 1.0.3

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#140869](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140869)
  [`f08b672eb884b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f08b672eb884b) -
  Add back removed props as deprecated for easier migration

## 1.0.0

### Major Changes

- [#139777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139777)
  [`79c93576c6fff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/79c93576c6fff) -
  Delete/deprecate props that are unused, used incorrectly, or bad for accessibility.

## 0.0.2

### Patch Changes

- [#135374](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135374)
  [`c7db6f8caf0cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c7db6f8caf0cd) -
  Export async creatable API

## 0.0.1

### Patch Changes

- [#132974](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132974)
  [`c515f82f96ef1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c515f82f96ef1) -
  Initial fork of react-select
