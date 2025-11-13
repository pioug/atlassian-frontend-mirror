# @atlaskit/select

## 21.4.0

### Minor Changes

- [`2568622464f45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2568622464f45) -
  release previously feature-gated change to textfield, textarea, and select to increase font size
  to 16px on mobile

### Patch Changes

- Updated dependencies

## 21.3.10

### Patch Changes

- Updated dependencies

## 21.3.9

### Patch Changes

- Updated dependencies

## 21.3.8

### Patch Changes

- [`e02c11e7be73c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e02c11e7be73c) -
  types made more explicit
- Updated dependencies

## 21.3.7

### Patch Changes

- [`2c386d1fc1477`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c386d1fc1477) -
  ts-ignore added as a workaround for help-center local consumption
- Updated dependencies

## 21.3.6

### Patch Changes

- Updated dependencies

## 21.3.5

### Patch Changes

- Updated dependencies

## 21.3.4

### Patch Changes

- Updated dependencies

## 21.3.3

### Patch Changes

- [`437668dfbdec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437668dfbdec9) -
  Add explicit types to a number of DST components
- Updated dependencies

## 21.3.2

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 21.3.1

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.
- Updated dependencies

## 21.3.0

### Minor Changes

- [`153fad932190f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/153fad932190f) -
  [ux] Added a new prop shouldKeepInputOnSelect to the select component to prevent clearing the
  input when isMulti is true

### Patch Changes

- Updated dependencies

## 21.2.10

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 21.2.9

### Patch Changes

- [`20056074447a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20056074447a2) -
  Switch to more semantically accurate label prop in internal radio and radio group instances.
- Updated dependencies

## 21.2.8

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 21.2.7

### Patch Changes

- [`3b5b4a919aaaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b5b4a919aaaf) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 21.2.6

### Patch Changes

- Updated dependencies

## 21.2.5

### Patch Changes

- Updated dependencies

## 21.2.4

### Patch Changes

- Updated dependencies

## 21.2.3

### Patch Changes

- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.
- Updated dependencies

## 21.2.2

### Patch Changes

- Updated dependencies

## 21.2.1

### Patch Changes

- Updated dependencies

## 21.2.0

### Minor Changes

- [#179366](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179366)
  [`675f6b4bd17c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/675f6b4bd17c3) -
  Adds experimental changes to default popper behavior in `PopupSelect` behind the
  `platform_dst_nav4_layering_in_main_slot_fixes` feature gate. When enabled, `PopupSelect` popups
  will no longer slide across the trigger. Instead they will behave like other popups and stay
  anchored next to the trigger.

## 21.1.1

### Patch Changes

- Updated dependencies

## 21.1.0

### Minor Changes

- [#175869](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175869)
  [`e7f822af7edc1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7f822af7edc1) -
  Updated usages of deprecated icons with replacement icons

### Patch Changes

- Updated dependencies

## 21.0.1

### Patch Changes

- [#178284](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178284)
  [`1c7de1d8fc547`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c7de1d8fc547) -
  Remove emotion dependency
- Updated dependencies

## 21.0.0

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

## 20.7.2

### Patch Changes

- [#175058](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175058)
  [`cfb3a1596d972`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfb3a1596d972) -
  Add same class names in emotion compoent as compiled select for GA
- Updated dependencies

## 20.7.1

### Patch Changes

- Updated dependencies

## 20.7.0

### Minor Changes

- [#155546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155546)
  [`4133da7ce5d92`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4133da7ce5d92) -
  This cleans up the feature flag references for assistive technology improvements, making them
  fully available to all people.

### Patch Changes

- Updated dependencies

## 20.6.2

### Patch Changes

- Updated dependencies

## 20.6.1

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 20.6.0

### Minor Changes

- [#149822](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149822)
  [`f9ab0e846ae21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9ab0e846ae21) -
  Updated to support `size` prop for new icons from `@atlaskit/icon`.

### Patch Changes

- Updated dependencies

## 20.5.0

### Minor Changes

- [#155681](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155681)
  [`679a437d9a866`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/679a437d9a866) -
  The feature flag for registering `Select` and `PopupSelect` with the experimental open layer
  observer has now been cleaned up.

### Patch Changes

- Updated dependencies

## 20.4.1

### Patch Changes

- Updated dependencies

## 20.4.0

### Minor Changes

- [#142856](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142856)
  [`578fbeefd6128`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/578fbeefd6128) -
  Remove feature flag to allow new controls

### Patch Changes

- Updated dependencies

## 20.3.1

### Patch Changes

- [#142578](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142578)
  [`a1e85a3a1ca96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a1e85a3a1ca96) -
  Export more types from atlaskit/react-select

## 20.3.0

### Minor Changes

- [#137501](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137501)
  [`fb85ce5c05391`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb85ce5c05391) -
  Testing unsafe experimental options, to be removed at a later time.

### Patch Changes

- Updated dependencies

## 20.2.0

### Minor Changes

- [#138461](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138461)
  [`455c7f648d71a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/455c7f648d71a) -
  Internal refactor to PopupSelect behind a feature flag.
  - No longer closing the popup when the internal select menu's onMenuClose is called.
  - It now registers with the experimental open layer observer, allowing it to close when the
    observer gives the close signal (e.g. when resizing a page layout slot).

### Patch Changes

- Updated dependencies

## 20.1.0

### Minor Changes

- [#135853](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135853)
  [`63233b4c0a6a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63233b4c0a6a7) -
  PopupSelect will now close when the internal select menu's onMenuClose is called.

  This is used to close any open select menus when page layout slots are resized.

  This change is behind a feature flag.

### Patch Changes

- Updated dependencies

## 20.0.8

### Patch Changes

- [#131835](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131835)
  [`11b3a9f6a407e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11b3a9f6a407e) -
  [Popup Select] Improve assistive technology support by reducing reliance on live regions.
- Updated dependencies

## 20.0.7

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 20.0.6

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 20.0.5

### Patch Changes

- [#128582](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128582)
  [`02b4780b7a0a4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02b4780b7a0a4) -
  [ux] Improve assistive technology support for filtered results.

## 20.0.4

### Patch Changes

- Updated dependencies

## 20.0.3

### Patch Changes

- Updated dependencies

## 20.0.2

### Patch Changes

- Updated dependencies

## 20.0.1

### Patch Changes

- [#120713](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120713)
  [`acea5ba3fdbdb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acea5ba3fdbdb) -
  Remove old codemod and update dependencies.

## 20.0.0

### Major Changes

- [#110498](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/110498)
  [`53ad7ff63b09a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53ad7ff63b09a) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/select`, you will need to ensure that your bundler is configured to
  handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- [#119843](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119843)
  [`7bd0d851d1c39`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bd0d851d1c39) -
  [ux] Clean up ARIA props that are no longer needed

## 19.0.0

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

## 18.10.6

### Patch Changes

- Updated dependencies

## 18.10.5

### Patch Changes

- [#106179](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106179)
  [`100bd1199507c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/100bd1199507c) -
  Add support for testId

## 18.10.4

### Patch Changes

- Updated dependencies

## 18.10.3

### Patch Changes

- [#110434](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110434)
  [`29da4bcb1cd78`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/29da4bcb1cd78) -
  Inprove device vevification with common utils

## 18.10.2

### Patch Changes

- Updated dependencies

## 18.10.1

### Patch Changes

- [#108810](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108810)
  [`213d393f5b7da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/213d393f5b7da) -
  Convert input-option from class component to functional component

## 18.10.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 18.9.6

### Patch Changes

- [#107242](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107242)
  [`af82a4f946f03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af82a4f946f03) -
  Remove fallback color in checkbox/radio select

## 18.9.5

### Patch Changes

- Updated dependencies

## 18.9.4

### Patch Changes

- [#106683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106683)
  [`77ffefbd46831`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77ffefbd46831) -
  Remove aria-label from visual-only search indicator

## 18.9.3

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 18.9.2

### Patch Changes

- [#103332](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103332)
  [`87b2300ef656e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87b2300ef656e) -
  Remove stop propogation in popup select

## 18.9.1

### Patch Changes

- Updated dependencies

## 18.9.0

### Minor Changes

- [#177875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177875)
  [`d0c3d27216b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0c3d27216b7c) -
  Remove theme prop and merge customized components for performance

### Patch Changes

- Updated dependencies

## 18.8.2

### Patch Changes

- [#174375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174375)
  [`89790d380dd8c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89790d380dd8c) -
  Restore aria-live messages for PopupSelect

## 18.8.1

### Patch Changes

- [#174836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174836)
  [`8d2c4dcde79da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d2c4dcde79da) -
  Update use of deprecated aria-label to proper label in PopupSelect
- Updated dependencies

## 18.8.0

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

### Patch Changes

- Updated dependencies

## 18.7.1

### Patch Changes

- [#172260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172260)
  [`9934fe89f1e6a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9934fe89f1e6a) -
  Improving assisstive technology support by adding better semantics and reducing live region usage

## 18.7.0

### Minor Changes

- [#171558](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171558)
  [`d6493a162ba82`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d6493a162ba82) -
  Update types to improve React 18 compatibility.

### Patch Changes

- Updated dependencies

## 18.6.1

### Patch Changes

- [#167336](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167336)
  [`ddb0846c39a88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddb0846c39a88) -
  Integrate styles of select and react-select in a single place

## 18.6.0

### Minor Changes

- [#167480](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167480)
  [`e78013c5d716b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e78013c5d716b) -
  Update checkbox and radio select to match new icon styles behind feature flag.

### Patch Changes

- Updated dependencies

## 18.5.3

### Patch Changes

- [#167181](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167181)
  [`5bc9dc0796474`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5bc9dc0796474) -
  Remove `react-focus-lock-next` dependency
- Updated dependencies

## 18.5.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 18.5.1

### Patch Changes

- [#165031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165031)
  [`380a955e9f249`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/380a955e9f249) -
  Internal change only -- remove usages of react-node-resolver as it is incompatible with React 18.

## 18.5.0

### Minor Changes

- [#160447](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160447)
  [`515ed7a31a9fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/515ed7a31a9fb) -
  Make async select by default in select

### Patch Changes

- Updated dependencies

## 18.4.3

### Patch Changes

- [#158691](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158691)
  [`453919c3f78d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/453919c3f78d3) -
  Pass isInvalid to internal react-select from select prop to support aria-invalid on input

## 18.4.2

### Patch Changes

- Updated dependencies

## 18.4.1

### Patch Changes

- [#157857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157857)
  [`8cf1d1a9589a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8cf1d1a9589a6) -
  Hide flag emoji in country select for better AT support

## 18.4.0

### Minor Changes

- [#157818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157818)
  [`87c14ad1a3efa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87c14ad1a3efa) -
  Use semantic tags and arias for combobox and listbox and reduce aria-live

### Patch Changes

- Updated dependencies

## 18.3.0

### Minor Changes

- [#156026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156026)
  [`709b9c76673df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/709b9c76673df) -
  Add clearControlLabel to select component.

### Patch Changes

- Updated dependencies

## 18.2.0

### Minor Changes

- [#155000](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155000)
  [`46cb627917bf7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46cb627917bf7) -
  Export props for `IndicatorsContainer` component.

## 18.1.3

### Patch Changes

- Updated dependencies

## 18.1.2

### Patch Changes

- [#153221](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153221)
  [`e362b41d4b35f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e362b41d4b35f) -
  This version removes `tab-event-should-close-popupSelect` feature flag. Tab and Shift+Tab now
  dismisses the list of opened popup select options and allows users to navigate to next or previous
  elements accordingly.

## 18.1.1

### Patch Changes

- [#150983](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150983)
  [`a06534942509c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a06534942509c) -
  Remove `react-uid` and use an ID generator that is compatible with React16 and React 18; Strict
  React 18 behind a flag.
- Updated dependencies

## 18.1.0

### Minor Changes

- [#150241](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150241)
  [`73de70dc13e2e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73de70dc13e2e) -
  Updated group heading styles introduced in v17.19.0 are now default and no longer behind a feature
  flag.

## 18.0.0

### Major Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select

## 17.19.3

### Patch Changes

- [#146891](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146891)
  [`1946e3bf8c6c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1946e3bf8c6c9) -
  Internal change only: update feature flag names.

## 17.19.2

### Patch Changes

- [#147255](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147255)
  [`f344b9735b94a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f344b9735b94a) -
  Updated dependencies

## 17.19.1

### Patch Changes

- Updated dependencies

## 17.19.0

### Minor Changes

- [#140648](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140648)
  [`0fee45dd431ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fee45dd431ca) -
  Updated group heading styles to align to new modernised typography styles. Headings are no longer
  all uppercase and are now bold. This change is behind a feature flag.

## 17.18.0

### Minor Changes

- [#134622](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134622)
  [`66b5d35764e86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/66b5d35764e86) -
  Updated select open menu handler and fixed tests
  (https://product-fabric.atlassian.net/browse/DSP-20454)

## 17.17.0

### Minor Changes

- [#139873](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139873)
  [`141a2cdfda71c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/141a2cdfda71c) -
  Fix select and radio icons when icon facade feature flag is enabled by opting out of new icons.

### Patch Changes

- Updated dependencies

## 17.16.0

### Minor Changes

- [#139165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139165)
  [`c140497da3215`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c140497da3215) -
  [ux] Enable new icons behind a feature flag.

## 17.15.2

### Patch Changes

- [#137619](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137619)
  [`a91489985e535`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a91489985e535) -
  [ux] Tab and Shift+Tab now dismisses the list of opened popup select options and allows users to
  navigate to next or previous elements accordingly.

## 17.15.1

### Patch Changes

- [#131911](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131911)
  [`2f9601a8a634b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f9601a8a634b) -
  This version removes `platform.design-system-team.use-default-select-in-popup-select_46rmj`
  feature flag. The `PopupSelect` component now uses the internal `Select` component ensure the
  accessibility of options with group labels for assistive technologies.

## 17.15.0

### Minor Changes

- [`0d3bdaf1e3d68`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d3bdaf1e3d68) -
  [ux] Set the color.text.subtle token for 'No options' text to meet a 4.5:1 color contrast.

## 17.14.0

### Minor Changes

- [#130406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130406)
  [`9d04736c97bfe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9d04736c97bfe) -
  Added feature flag for fixing react18 bug(https://product-fabric.atlassian.net/browse/DSP-19701)
  for handling menu triggers

## 17.13.2

### Patch Changes

- [#129726](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129726)
  [`778c15c1d279a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/778c15c1d279a) -
  [ux] Removed feature flag `platform.design-system-team.select-new-typography_7m89c` resulting in
  minor visual changes to typography.

## 17.13.1

### Patch Changes

- Updated dependencies

## 17.13.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 17.12.1

### Patch Changes

- Updated dependencies

## 17.12.0

### Minor Changes

- [`8b8090800a35d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b8090800a35d) -
  Bump peer dependency for react-dom to include version 17 and 18.

## 17.11.13

### Patch Changes

- [#127125](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127125)
  [`8ebc56af5f1ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ebc56af5f1ca) -
  Revert due to HOT-110871 - causing Jira red master
- Updated dependencies

## 17.11.12

### Patch Changes

- [`941edf62401ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/941edf62401ae) -
  This version removes `platform.design-system-team.use-default-select-in-popup-select_46rmj`
  feature flag. The `PopupSelect` component now uses the internal `Select` component ensure the
  accessibility of options with group labels for assistive technologies.

## 17.11.11

### Patch Changes

- [#125980](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125980)
  [`d908d9c41ed27`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d908d9c41ed27) -
  The parent group label in `CountrySelect` must be announced with options.
- Updated dependencies

## 17.11.10

### Patch Changes

- [#123901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123901)
  [`19b70fe0c7efc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19b70fe0c7efc) -
  [ux] Updating multi value labels font size using composite font token. If successful, these
  changes will be made available in a later release.

## 17.11.9

### Patch Changes

- [#124328](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124328)
  [`69cea8c513faa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/69cea8c513faa) -
  Add announcement of focused option for the first open of Popup select

## 17.11.8

### Patch Changes

- [#123484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123484)
  [`e241c04ab92d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e241c04ab92d5) -
  Remove abandoned feature flag usage

## 17.11.7

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 17.11.6

### Patch Changes

- [#118744](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118744)
  [`998268697de7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/998268697de7d) -
  Remove remnants of `extract-react-types`.

## 17.11.5

### Patch Changes

- Updated dependencies

## 17.11.4

### Patch Changes

- Updated dependencies

## 17.11.3

### Patch Changes

- Updated dependencies

## 17.11.2

### Patch Changes

- [#114458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114458)
  [`854b5695ee062`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/854b5695ee062) -
  Making updates to feature flagged font size changes. If successful, these changes will be made
  available in a later release.

## 17.11.1

### Patch Changes

- Updated dependencies

## 17.11.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 17.10.4

### Patch Changes

- [#111724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111724)
  [`c260b95b219de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c260b95b219de) -
  Update react-select typescript module augmentation path

## 17.10.3

### Patch Changes

- Updated dependencies

## 17.10.2

### Patch Changes

- [#101221](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101221)
  [`9e50bb672a7f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e50bb672a7f) -
  Add the `aria-describedby` to `Select` component if we do not have options.

## 17.10.1

### Patch Changes

- [#105349](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105349)
  [`1d0720a5e5f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1d0720a5e5f9) -
  We are testing typography changes in group headings behind a feature flag. If this change is
  successful it will be available in a later release.

## 17.10.0

### Minor Changes

- [#104208](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104208)
  [`0d4480895db7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d4480895db7) -
  Add support for React 18 in non-strict mode.

## 17.9.0

### Minor Changes

- [#96841](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96841)
  [`6cca90095b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6cca90095b7e) -
  `ClearIndicator` button now uses the `Pressable` primitive.

### Patch Changes

- Updated dependencies

## 17.8.0

### Minor Changes

- [#94675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94675)
  [`5d9e1dccacca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d9e1dccacca) -
  [ux] Update input border color token to meet 3:1 color contrast ratioLight theme:
  color.border.input: #091E4224 → #8590A2Dark mode: color.border.input: #A6C5E229 → #738496

### Patch Changes

- Updated dependencies

## 17.7.1

### Patch Changes

- [#95999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95999)
  [`af0f52708e93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af0f52708e93) -
  Visual border of invalid state should be 2px

## 17.7.0

### Minor Changes

- [#85404](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85404)
  [`54d6e7a58943`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/54d6e7a58943) -
  use `@atlaskit/select` component in `PopupSelect`. This allows `PopupSelect` to receive all the
  improvements from `@atlaskit/select`.

## 17.6.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 17.6.0

### Minor Changes

- [#88021](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88021)
  [`2cf5300457e7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2cf5300457e7) -
  Convert AtlaskitSelect from react class component to function component

### Patch Changes

- [#73901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73901)
  [`2aefab5730ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2aefab5730ab) -
  ECA11Y-207 Added Tab navigation for video panel controls and handling key press on them

## 17.5.0

### Minor Changes

- [#87916](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87916)
  [`373dc429147d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/373dc429147d) -
  Reverted "Convert AtlaskitSelect from react class component to function component"

## 17.4.0

### Minor Changes

- [#86848](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86848)
  [`fa9de32b502e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fa9de32b502e) -
  Convert AtlaskitSelect from react class component to function component

## 17.3.4

### Patch Changes

- [#83706](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83706)
  [`2c6f01982c94`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c6f01982c94) -
  Fixed aria-describedby attribute being incorrect when components prop is passed

## 17.3.3

### Patch Changes

- [#83130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83130)
  [`4efd62cdc533`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4efd62cdc533) -
  SHPLVIII-481: Assign name to default export components to fix quick-fix imports

## 17.3.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 17.3.1

### Patch Changes

- [#81644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81644)
  [`8ab7a816dca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ab7a816dca7) -
  Revert input border change from the previous version

## 17.3.0

### Minor Changes

- [#80805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80805)
  [`427c2dd9e0d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/427c2dd9e0d6) -
  [ux] Update input border width from 2px to 1px with darker color to meet 3:1 color contrast

### Patch Changes

- Updated dependencies

## 17.2.0

### Minor Changes

- [#78814](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78814)
  [`bfe34a286ad8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfe34a286ad8) -
  DSP-17230 Update RadioOption to accept generic type arg for OptionType

## 17.1.3

### Patch Changes

- [#75946](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75946)
  [`cc843d47d71e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc843d47d71e) -
  Reverted the feature flag which reduced re-renders in `<PopupSelect>` as it had other unintended
  side-effects.

## 17.1.2

### Patch Changes

- [#74756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74756)
  [`8e66f751df96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e66f751df96) -
  Use feature flag to roll out border width update from 2px to 1px

## 17.1.1

### Patch Changes

- [#73588](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73588)
  [`d06aa1426a45`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d06aa1426a45) -
  Thess packages has been added to the Jira push model.

## 17.1.0

### Minor Changes

- [#72872](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72872)
  [`26b963783de7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26b963783de7) -
  DSP-16671 Update CheckboxSelect to accept generic type arg for OptionType

## 17.0.5

### Patch Changes

- [#69863](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69863)
  [`6c9b587369cf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c9b587369cf) -
  Support to add additional aria-describedby on select when isSearchable is false

## 17.0.4

### Patch Changes

- [#58732](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58732)
  [`a3a08f8f4a03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3a08f8f4a03) -
  update aria-describedby attribute to not be undefined

## 17.0.3

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 17.0.2

### Patch Changes

- [#58316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58316)
  [`eb496c9a3474`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb496c9a3474) -
  Bug fixes for configuraton panel boolean & enum fields

## 17.0.1

### Patch Changes

- Updated dependencies

## 17.0.0

### Major Changes

- [#41866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41866)
  [`ed8b6957789`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8b6957789) - Removes
  any usage of deprecated legacy theming APIs. These have been superseeded by design tokens.

### Patch Changes

- Updated dependencies

## 16.7.6

### Patch Changes

- [#42697](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42697)
  [`37d5038129d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37d5038129d) - Revise
  types for `ClearIndicator` usage inside `AtlaskitSelect`

## 16.7.5

### Patch Changes

- [#42429](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42429)
  [`1cc562c4005`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1cc562c4005) - upgrade
  shallow-equal version to 3.1.0

## 16.7.4

### Patch Changes

- [#41990](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41990)
  [`7a88114cef7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a88114cef7) - added
  type dependency for @types/react-node-resolver

## 16.7.3

### Patch Changes

- [#41553](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41553)
  [`89f1ebf3c96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89f1ebf3c96) - Fix
  popup select close issue when pressing escape

## 16.7.2

### Patch Changes

- [#41115](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41115)
  [`6f2d15a60eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f2d15a60eb) - Remove
  unused variables in components and PopupSelect

## 16.7.1

### Patch Changes

- [#40647](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40647)
  [`0de92f17021`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0de92f17021) - Bump
  react-focus-lock to latest version

## 16.7.0

### Minor Changes

- [#40209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40209)
  [`31496cc7c8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31496cc7c8a) - [ux]
  Adds accessible name to the search input for popup select components via new `label` prop or
  `placeholder` prop if `label` is not provided.

## 16.6.0

### Minor Changes

- [#40039](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40039)
  [`f03e630c03e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f03e630c03e) - [ux]
  Adds keydown handler to target spread props for better accessibility for keyboard users.

## 16.5.14

### Patch Changes

- [#40096](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40096)
  [`aee1bdd977d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aee1bdd977d) - Update
  select checkbox and radio icon to have 1px border under FF

## 16.5.13

### Patch Changes

- [#39015](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39015)
  [`a22d71ff733`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a22d71ff733) - [ux]
  Select component now respects explicitly passed value set to aria-describedby attribute.

## 16.5.12

### Patch Changes

- [#38708](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38708)
  [`872a49e0bd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/872a49e0bd8) - Fixed
  color contrast for grouped text label in the Select component

## 16.5.11

### Patch Changes

- [#38796](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38796)
  [`479e6a92e33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/479e6a92e33) - Move css
  styles out to top-level scope for more consistency.

## 16.5.10

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 16.5.9

### Patch Changes

- [#38520](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38520)
  [`2c77d477cbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c77d477cbb) - Ensures
  static linting occurs in the techstack, fixes one example's eslint error.

## 16.5.8

### Patch Changes

- [#38518](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38518)
  [`5c22f7ade33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c22f7ade33) - Convert
  CSS tagged templates to explicit function calls with objects.

## 16.5.7

### Patch Changes

- [#36663](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36663)
  [`919bf219a91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/919bf219a91) - use
  border token for border width

## 16.5.6

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 16.5.5

### Patch Changes

- [#35267](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35267)
  [`96ac277d0d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ac277d0d7) - [ux] -
  created custom onFocus function, which overwrites built in onFocus method for ariaLiveMessages;
  - function is conditionally invoked only for grouped select options to enable group label
    announcement with it's group options;

## 16.5.4

### Patch Changes

- [#35111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35111)
  [`8f436f0c301`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f436f0c301) - extend
  border contrast feature flag to support confluence

## 16.5.3

### Patch Changes

- [#34881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34881)
  [`774ed69ecef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/774ed69ecef) - Internal
  changes to use space tokens for spacing values. There is no visual change.

## 16.5.2

### Patch Changes

- [#33774](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33774)
  [`449ab6d341b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ab6d341b) - Clear
  control keyboard access for Select component

## 16.5.1

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 16.5.0

### Minor Changes

- [#34303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34303)
  [`3c38b01cfd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c38b01cfd9) - Added
  screen reader text to announce multi selects support multiple options. This will be announced
  prior to any placeholder text.

## 16.4.0

### Minor Changes

- [#34251](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34251)
  [`45bcfb68efb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45bcfb68efb) - Testing
  behind a feature flag: reduce re-renders in `<PopupSelect>` by using an available renderProps to
  both disable and block scrolling at the right time as well as avoid rendering the `<Select>` to a
  portal not visible to the user.

## 16.3.1

### Patch Changes

- [#34230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34230)
  [`1cd0d824b3c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1cd0d824b3c) - NO-ISSUE
  Add basic memoization on CheckboxSelect and RadioSelect to avoid unnecessary re-renders with
  otherwise static references.

## 16.3.0

### Minor Changes

- [#33475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33475)
  [`6e51e0d5358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e51e0d5358) - [ux]
  update border width from 2px to 1px and add 1px box-shadow when focus or error

## 16.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 16.2.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 16.2.1

### Patch Changes

- [#32947](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32947)
  [`ffeeae59446`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffeeae59446) - Migrates
  unit tests from enzyme to RTL.

## 16.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 16.1.9

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`79ddcb13067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79ddcb13067) - [ux]
  style(select): update fallback of select placeholder to N200'

## 16.1.8

### Patch Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299)
  [`8a8aac2b848`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a8aac2b848) - [ux]
  Adds proper disabled styling to the isMulti component.

## 16.1.7

### Patch Changes

- [#31495](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31495)
  [`c3a92e0b058`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3a92e0b058) - Export
  placeholder props from figma plugin

## 16.1.6

### Patch Changes

- [#31338](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31338)
  [`74c1b81a476`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74c1b81a476) - Replaces
  use of `gridSize` with space tokens. There is no expected visual change.

## 16.1.5

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125)
  [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) -
  Introduce shape tokens to some packages.

## 16.1.4

### Patch Changes

- Updated dependencies

## 16.1.3

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`22b754d311f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22b754d311f) - Updates
  usage of removed design token `utilities.UNSAFE_util.transparent` in favour of its replacement
  `utilities.UNSAFE.transparent`
- Updated dependencies

## 16.1.2

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 16.1.1

### Patch Changes

- [#29396](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29396)
  [`81bb765f055`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81bb765f055) - Missing
  export for type MultiValueRemoveProps added

## 16.1.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`017e3dccdf3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/017e3dccdf3) - Add
  SelectInstance for export
- [`2368982b4d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2368982b4d2) - Add
  MultiValueRemoveProps, SelectInstance to export

### Patch Changes

- [`c74089f0c6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74089f0c6d) - Revert
  the onOpen and onClose logic in PopupSelect

## 16.0.3

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- Updated dependencies

## 16.0.1

### Patch Changes

- [#27813](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27813)
  [`e7046ed0fb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7046ed0fb1) - - Add
  MultiValueRemoveProps to export
  - Add SelectInstance for export
  - Revert the onOpen and onClose logic in PopupSelect

## 16.0.0

### Major Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`95b3630e9b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95b3630e9b5) - Update
  `@atlaskit/select` to use react-select v5, and update types

  Use forwardRef for all wrapped components - this means that if you were accessing anything on the
  Select instance using a ref, the ref will now reference the internal Select directly (see below
  for how to upgrade)

  Replace HOCs with hooks - if you were using our HOCs to create custom Selects (i.e.,
  makeCreatableSelect, manageState, makeAsyncSelect) these have now been replaced by hooks (i.e.,
  useCreatable, useStateManager, useAsync)

  Remove imports of `@types/react-select` - no longer required as react-select v5 now uses
  Typescript,

  **_ Example _**

  @atlaskit/select v15 and earlier:

  ```javascript
  import { makeAsyncSelect } from '@atlaskit/select';

  const AsyncSelect = makeAsyncSelect(ProxyBaseSelect);

  return (
    <AsyncSelect ... />
  )
  ```

  @atlaskit/select v16:

  ```javascript
  import Select, { useAsync } from '@atlaskit/select';

  const asyncProps = useAsync({
    promiseFn: useCallback(() => loadOptions(inputValue), [inputValue])
  });

  return (
    <Select
      inputValue={inputValue}
      isLoading={asyncProps.isLoading}
      options={!asyncProps.isLoading ? asyncProps.data : []}
      ...
    />
  )
  ```

  Remove dependency on AutosizeInput - our new solution uses CSS grid which IE11 does not fully
  support; also .prefix\_\_input now targets the input and NOT the container

  `IndicatorProps` is deprecated and replaced with
  `ClearIndicatorProps, DropdownIndicatorProps, LoadingIndicatorProps`. Examples can be viewed in
  the constellation docs

  `onInputChange` now requires a 2nd argument of type `InputActionMeta`

  `NoticeProps` should be used as the prop to customize `LoadingMessage` and `NoOptionsMessage`
  components

- [`b8430db3873`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8430db3873) - "select
  package now uses declarative entry points. atlaskit/select now exports all necessary types.
  Consumers should now import directly from atlaskit/select, not from eg atlaskit/select/types"

### Minor Changes

- [`c55a340ea4c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55a340ea4c) -
  Consumers using Popup Select custom modifiers will now have typescript errors. This is how to fix
  them.

  Custom popper.js modifiers passed into Popup Select are now strictly typed, providing additional
  type safety and IDE code-completion.

  To support this, a third generic for <PopupSelect/> has been added. This generic takes a union of
  the names of each modifier you include in popperProps.

  If you currently set custom modifiers like this:

  ```javascript
  import {OptionType, PopupSelect} from '@atlaskit/select'

  <PopupSelect<OptionType, false>
    popperProps = {modifiers: [
        {name: 'custom-modifier', ...},
        {name: 'custom-modifier-2', ...}
    ]}>
    ...
  </>
  ```

  In order to avoid type errors in the new release, you will need to add a generic to PopupSelect
  specifying the modifiers you are providing:

  ```javascript
  import {OptionType, PopupSelect} from '@atlaskit/select'
  type myModifiers = 'custom-modifier' | 'custom-modifier-2'

  <PopupSelect<OptionType, false, myModifiers>>
  ```

  In addition, the ModifierList type is now exported. ModifierList is a union type containing the
  names of the default modifiers passed into PopupSelect. If you need to use them as well:

  ```javascript
  import {OptionType, PopupSelect, ModifierList} from '@atlaskit/select'
  type myModifiers = ModifierList | 'custom-modifier' | 'custom-modifier-2'

  <PopupSelect<OptionType, false, myModifiers>>
  ```

### Patch Changes

- Updated dependencies

## 15.7.7

### Patch Changes

- [#27523](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27523)
  [`8048ae661df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8048ae661df) - [ux]
  Fixed bug where consumers extending the styles of PopupSelect would not receive the correct base
  styles in their custom styles functions.

## 15.7.6

### Patch Changes

- Updated dependencies

## 15.7.5

### Patch Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`a0bf7e532ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0bf7e532ff) - Fix
  validationState taking precedent over isInvalid
- Updated dependencies

## 15.7.4

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 15.7.3

### Patch Changes

- [#25307](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25307)
  [`5e578b89178`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e578b89178) - Fixed an
  issue in PopupSelect that caused the page to scroll to the top.

## 15.7.2

### Patch Changes

- [#25314](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25314)
  [`bedbdec0e82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bedbdec0e82) - Update
  hover state appearance of subtle Textarea, Textfield and Select components to match the hover
  states of their default counterparts.

## 15.7.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 15.7.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`0fbb2840aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fbb2840aba) - Add
  isInvalid prop to `@atlastkit/Select`. The prop indicates whether if the component is in the error
  state. If true, it visually shows a red border around the input.

  This replaces validationState to make Select more consistent like other components that uses
  isInvalid prop.

- [`8cf1c311f38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cf1c311f38) - Add
  additional type check for the modifier generic in PopupSelect.
- [`41ce212cfe2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41ce212cfe2) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- [`2d61e38e5d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d61e38e5d3) - [ux]
  Adds isSearchable option to Popup Select
- [`908a0f65b91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/908a0f65b91) - [ux]
  Hides clear icon on selections in disabled multi-select
- [`de1b2769486`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de1b2769486) - Update
  design tokens used for Select's borders, to new border.input tokens
- Updated dependencies

## 15.6.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 15.6.1

### Patch Changes

- [#24436](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24436)
  [`d9f112c7b09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9f112c7b09) - Reverts
  change to multiSelect's remove behaviour when using tokens, fixing issue with a pointer-events:
  none style

## 15.6.0

### Minor Changes

- [#24008](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24008)
  [`68cc8008851`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68cc8008851) - [ux]
  Introduces appearance prop to component, with 'default', 'subtle' and 'none' variants

## 15.5.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`c17c6943be2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c17c6943be2) - Updated
  appearance of multi-select tags; when delete button is hovered, the appearance now matches
  @atlaskit/tag. The change is only visible with design token CSS enabled (in light or dark mode)
- [`45cae79ec0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45cae79ec0f) - [ux]
  Internal changes to <CountrySelect /> to no longer override container and menu width. The
  behaviour is now the same as the default Select component. Visual changes are possible if the
  <CountrySelect /> is being used in an unconstrained container (it will now expand to fill as is
  the default).

  Component now also uses the correct types (previously set to `any`). Props are still passed
  through so there is no runtime effect, but this may effect compilation for users providing props
  that are unsupported by the runtime.

- [`6e6ff42cd4c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e6ff42cd4c) - Replaces
  focus-trap with react-focus-lock in line with implementation in Jira Frontend.

### Patch Changes

- [`1c4840e546a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c4840e546a) - fix
  popup select alignment bug
- [`dec5021eefd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dec5021eefd) - [ux]
  Trigger onMenuClose prop when popup select closes.
- [`fe575d49d66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe575d49d66) - Updated
  styles to use new input design tokens

## 15.4.0

### Minor Changes

- [#22818](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22818)
  [`4609a8a733a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4609a8a733a) - Made
  SelectWithoutAnalytics component and InputActionMeta type available from @atlaskit/select

## 15.3.2

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 15.3.1

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`8f6f225ac11`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f6f225ac11) - Updated
  prop types for Popup Select
- [`e4b612d1c48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4b612d1c48) - Internal
  migration to bind-event-listener for safer DOM Event cleanup

## 15.3.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`145c9cea461`](https://bitbucket.org/atlassian/atlassian-frontend/commits/145c9cea461) - [ux]
  Added 2 new props for controlling the open state of PopupSelect:
  - `isOpen` controls whether the popup is open (controlled)
  - `defaultIsOpen` controls whether the popup is initially open on mount (uncontrolled)

### Patch Changes

- [`db58fa26cbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db58fa26cbf) - [ux]
  Updated input tokens within `@atlaskit/select`.
- [`4624991be21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4624991be21) - [ux]
  Fixes a regression affecting MacOS Safari. The cursor incorrectly displayed as 'text' rather than
  'default' when the pointer was over a select option.
- [`e7438659c2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7438659c2e) - Updated
  dependency '@types/react-select' to fix type error

## 15.2.13

### Patch Changes

- Updated dependencies

## 15.2.12

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Updated
  types for @atlaskit/select to support Typescript 4.2.4

## 15.2.11

### Patch Changes

- Updated dependencies

## 15.2.10

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 15.2.9

### Patch Changes

- Updated dependencies

## 15.2.8

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`b2c25c19e38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2c25c19e38) -
  PopupSelect now uses `@atlaskit/visually-hidden` under the hood.
- Updated dependencies

## 15.2.7

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Bump
  react-fast-compare to latest version (3.2.0)
- Updated dependencies

## 15.2.6

### Patch Changes

- Updated dependencies

## 15.2.5

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 15.2.4

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`401179b652b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/401179b652b) -
  PopupSelect now returns focus to the "trigger" element on close.
- Updated dependencies

## 15.2.3

### Patch Changes

- [#15694](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15694)
  [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal
  upgrade of memoize-one to 6.0.0

## 15.2.2

### Patch Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`6fb4421c4c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fb4421c4c1) - Fixed
  the validation token for Select in the Dark theme.
- Updated dependencies

## 15.2.1

### Patch Changes

- Updated dependencies

## 15.2.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`f7cbc6631cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7cbc6631cf) -
  Instrumented select with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha).

  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark
  mode users should expect no visual or breaking changes.

### Patch Changes

- [`3fc13e11952`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fc13e11952) - Fix
  input text colour when using tokens
- Updated dependencies

## 15.1.0

### Minor Changes

- [#13477](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13477)
  [`1dfc276fa55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dfc276fa55) - Expose
  InputActionMeta in atlaskit/select. Convert withSmarts from class to function component. Fix
  analytics.

## 15.0.2

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`ce350569ced`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce350569ced) - The
  `aria-live` prop is now `assertive` by default to help option selection to stay in sync with
  screen reader announcements.
- Updated dependencies

## 15.0.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 15.0.0

### Major Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`8c9055949d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9055949d4) - [ux]
  Options and Placeholders are now easier to see for users with low vision. We have also improved
  the experience in Windows High Contrast Mode.

### Patch Changes

- [`d5a9d28e06a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5a9d28e06a) - Removed
  animated functionality as the exit animation on multi-values isn’t working well in `react-select`
- Updated dependencies

## 14.1.0

### Minor Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`1ffa16e7d54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ffa16e7d54) - [ux] An
  argument of `PopupSelect`'s `target` render props was extended with `aria-haspopup`,
  `aria-expanded`, and `aria-controls` fields . You should pass this fields to custom trigger like
  `({isOpen, ...triggerProps}) => <button {...triggerProps}>Trigger</button>`. Provided aria
  attributes help users who use assistive technologies understand a component better.

### Patch Changes

- [`56dbb93df94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56dbb93df94) - [ux]
  Fixed failing color contrast issues for the Checkbox and Radio icons in CheckboxSelect and
  RadioSelect respectively.

## 14.0.1

### Patch Changes

- [#12205](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12205)
  [`76f16d562bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76f16d562bc) - Removed
  styled-components as a peerDependency

## 14.0.0

### Major Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`1f493e1dc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f493e1dc65) - Bump
  `react-select` to v4. This brings some API changes and it uses `emotion` v11.

### Patch Changes

- [`6ac48c99a54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ac48c99a54) - The
  entire content of a selected country, including the abbreviated name and the country code, is
  announced to a screen reader not just the country name.
- Updated dependencies

## 13.3.1

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`0e3333cd10a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e3333cd10a) - Corrects
  usage of modal dialog types.
- Updated dependencies

## 13.3.0

### Minor Changes

- [#8388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8388)
  [`0115b3b722b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0115b3b722b) - Update
  PopupSelect dependency `@popperjs/core` to `^2.9.1`, fixing some positioning bugs, such as in
  parents with `will-change` CSS properties set. For more information on the specific changes, see
  the popper docs.

## 13.2.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade
  `@types/react-select` to `v3.1.2` and fix type breaks

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- Updated dependencies

## 13.1.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 13.1.0

### Minor Changes

- [#6228](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6228)
  [`c3d2088249`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3d2088249) - expose
  GroupedOptionsType type

## 13.0.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- [#4346](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4346)
  [`fc8f6e61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc8f6e61f3) - Fix
  codemod utilities being exposed through the codemod cli

## 13.0.3

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 13.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 13.0.1

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 13.0.0

### Major Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`b85482c030`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85482c030) - Upgraded
  Popper JS to version 2.2.3, which comes with bug fixes, performance improvements and a reduced
  bundle size when combined with @popperjs/core. As a result, PopupSelect has some changes to the
  values accepted by the `popperProps` prop.

  Changes labelled with ⚙️ have codemod support:
  - ⚙️ the `positionFixed` prop has been replaced with `strategy`, which takes either `"fixed"` or
    `"absolute"`
  - the `modifiers` prop has been significantly updated:
    - The format is now an array of objects, each labelled via a `name` key:value pair. Previously
      the prop was an object where each property was the modifier name.
    - Prop options are grouped together in an `options` object
    - default boundary paddings have been removed from `preventOverflow` and `flip`; to restore
      original padding, set `padding: 5`
    - modifiers that supported a `boundariesElement` option now have two options in its place:
      - `boundary`, which takes `clippingParents` (similar to `scrollParent`)
      - `rootBoundary` which takes `viewport` or `document` (replacing `viewport` and
        `window`respectively)
    - Each modifier has more internal changes not listed here: see
      [the Popper JS docs](https://popper.js.org/docs/v2/modifiers/) for more information

  Note: due to a bug in `react-popper`, a console.error message relating to React `act()` may be
  raised on some tests using PopupSelect. It should not cause test failures. This issue has been
  raised in [the React Popper issue tracker](https://github.com/popperjs/react-popper/issues/368)

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version of select installed before you can
  run the codemod**

  `yarn upgrade @atlaskit/select@^13.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to
  [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details
  on the codemod CLI.

### Patch Changes

- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form
  elements now have a default font explicitly set
- [`aecfa8c991`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aecfa8c991) - Remove
  non-standard CSS property
  [-ms-overflow-style](https://developer.mozilla.org/en-US/docs/Archive/Web/CSS/-ms-overflow-style).
  `-ms-overflow-style` is a Microsoft extension controlling the behavior of scrollbars when the
  content of an element overflows.

## 12.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 12.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`5ccf97c849`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ccf97c849) - Popup
  Select click and keydown events would not bubble if parent element stopped propagation. Have
  changed these events to use capture mode instead.

## 12.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 11.0.14

### Patch Changes

- Updated dependencies

## 11.0.13

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 11.0.12

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`6aec273747`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6aec273747) - FIX:
  Dropdown chevron fixed to reflect ADG spec
- Updated dependencies

## 11.0.11

### Patch Changes

- Updated dependencies

## 11.0.10

### Patch Changes

- [patch][449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):

  Add a clear icon for datepicker, timepicker and datetimepicker-
  [patch][6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):

  FIX: Style changes for disabled select options- Updated dependencies
  [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies
  [2bfc59f090](https://bitbucket.org/atlassian/atlassian-frontend/commits/2bfc59f090):
- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies
  [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies
  [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/drawer@5.3.6
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/logo@12.3.4
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/form@7.2.1
  - @atlaskit/webdriver-runner@0.3.4

## 11.0.9

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies
  [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/drawer@5.3.5
  - @atlaskit/form@7.1.5
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/spinner@12.1.6
  - @atlaskit/tooltip@15.2.5

## 11.0.8

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/drawer@5.3.4
  - @atlaskit/form@7.1.4
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/spinner@12.1.5
  - @atlaskit/tooltip@15.2.4

## 11.0.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 11.0.6

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/form@7.1.1
  - @atlaskit/logo@12.3.1
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/drawer@5.3.1
  - @atlaskit/tooltip@15.2.2

## 11.0.5

### Patch Changes

- [patch][6e55ab88df](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e55ab88df):

  Fixes disabled state by adding not-allowed cursor.- Updated dependencies
  [ec76622d34](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec76622d34):

- Updated dependencies
  [d93de8e56e](https://bitbucket.org/atlassian/atlassian-frontend/commits/d93de8e56e):
  - @atlaskit/form@7.0.1

## 11.0.4

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
- Updated dependencies
  [6a8bc6f866](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a8bc6f866):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/checkbox@10.1.5
  - @atlaskit/spinner@12.1.3
  - @atlaskit/tooltip@15.2.1

## 11.0.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes PopupSelect to be on the modal layer. This fixes it not being shown when inside the
  ModalDialog and Drawer components.-
  [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow
  types are no longer provided. No API changes.-
  [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Disabled text entry into search filter when filter is hidden-
  [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Adds types field to package json.-
  [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/drawer@5.2.0

## 11.0.2

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages

## 11.0.1

### Patch Changes

- [patch][b9e23d337a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e23d337a):

  @types/react-select is now explicitly listed as a dependency

## 11.0.0

### Major Changes

- [major][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 10.2.2

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow
  types are no longer provided.

  ### Breaking

  ** getTokens props changes ** When defining the value function passed into a ThemeProvider, the
  getTokens parameter cannot be called without props; if no props are provided an empty object `{}`
  must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes ** Color palettes have been moved into their own file. Users will need to
  update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 10.2.1

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for
  @atlaskit/popup

## 10.2.0

### Minor Changes

- [minor][17a07074e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17a07074e8):

  Fix padding to be consistent with other Atlaskit form fields. This change includes removing
  padding from around the icon itself, and adding padding to the icon container, as well as altering
  the padding around the input container.

## 10.1.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 10.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 10.1.1

- Updated dependencies
  [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/form@6.2.3
  - @atlaskit/modal-dialog@10.3.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 10.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 10.0.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 10.0.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 10.0.6

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 10.0.5

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full
  typescript support so it is recommended that typescript consumers use it also.

## 10.0.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 10.0.3

- Updated dependencies
  [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2
  - @atlaskit/checkbox@9.0.5
  - @atlaskit/modal-dialog@10.1.3
  - @atlaskit/tooltip@15.0.9

## 10.0.2

### Patch Changes

- [patch][f20ac3080c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f20ac3080c):

  Removed unused dependencies from package.json for select: react-transition-group was unused.

## 10.0.1

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 10.0.0

### Major Changes

- [major][790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):

  Major bump to react-select which includes a bump from emotion 9 --> 10, this will impact users who
  are currently creating custom components using emotion. Empty values in selects have also now been
  changed to be more deterministic across single and multi select. See
  https://github.com/JedWatson/react-select/issues/3585 for details

## 9.1.10

- Updated dependencies
  [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/modal-dialog@10.0.8
  - @atlaskit/checkbox@9.0.0

## 9.1.9

### Patch Changes

- [patch][ef04b7fe05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef04b7fe05):

  Cleaned up event listeners on unmount

## 9.1.8

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/form@6.1.1
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 9.1.7

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 9.1.6

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/form@6.0.6
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 9.1.5

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/form@6.0.5
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 9.1.4

- Updated dependencies
  [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/form@6.0.4
  - @atlaskit/modal-dialog@10.0.2
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 9.1.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):
  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 9.1.2

- Updated dependencies
  [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0
  - @atlaskit/form@6.0.3
  - @atlaskit/icon@17.1.2
  - @atlaskit/modal-dialog@10.0.0

## 9.1.1

- Updated dependencies
  [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/icon@17.0.2
  - @atlaskit/logo@12.0.0

## 9.1.0

- [minor][3d5ab16856](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d5ab16856):
  - Add missing dependency @emotion/core

## 9.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):
  - Clean couple of TODO's that were already done

## 9.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 8.1.1

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/logo@10.0.4
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 8.1.0

- [minor][b50c289008](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b50c289008):
  - Don't close popup select when cleared.

## 8.0.5

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/logo@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 8.0.4

- [patch][2a90c65e27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a90c65e27):
  - Fix, and guard against, missing refs

## 8.0.3

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/form@5.2.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/logo@10.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 8.0.2

- [patch][87808b7791](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87808b7791):
  - AK-5973 expose handleKeyDown as prop for PopupSelect

## 8.0.1

- [patch][69c6f6acb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c6f6acb7):
  - Minor bug fixes in 2.4.2 react-select patch. See the release notes for details here
    https://github.com/JedWatson/react-select/releases/tag/v2.4.2

## 8.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
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

## 7.2.2

- [patch][39850f9615](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39850f9615):
  - Popup select set focus to selected option, instead of the first option, when the menu opens

## 7.2.1

- [patch][37c2eeec43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37c2eeec43):
  - Added possibility to add compact styling for multi select component

## 7.2.0

- [minor][46ffd45f21](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46ffd45f21):
  - Added ability to toggle animations in atlaskit/select, updated UserPicker to disable animations
    using this new behaviour

## 7.1.2

- [patch][bcdb413cb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bcdb413cb4):
  - Encapsulate checkbox/radio option styles inside the primitive

## 7.1.1

- [patch][896bf5bef9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/896bf5bef9):
  - Fix bug breaking mobile UX, and causing menu to not be openable on touch

## 7.1.0

- [minor][571ec20522](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/571ec20522):
  - Updated react-select to 2.4.0, includes updates to BEM modifiers in options, for more
    information see the react-select release notes
    https://github.com/JedWatson/react-select/releases/tag/v2.4.0
  - Added makeAnimated invocation back to createSelect, as multi select in modal bug has been
    resolved.
  - Export makeAsyncSelect and makeCreatableSelect function from src

## 7.0.0

- [major][06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - popup select "target" is now a function that must resolve to a node

## 6.1.20

- [patch][957778f085](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/957778f085):
  - Expose CheckboxOption and RadioOption from select package

## 6.1.19

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/form@5.1.2
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 6.1.18

- [patch][6148c6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6148c6c):
  - AK-5693 apply styles to loading indicator

## 6.1.17

- [patch][e9ccac7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9ccac7):
  - pin react-select at 2.1.x to avoid SSR issues in 2.2.0

## 6.1.16

- [patch][b9b1900](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9b1900):
  - Use @atlaskit/select instead of @atlaskit/single-select on the Fullscreen examples on website

## 6.1.15

- [patch][6195ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6195ac3):
  - remove animated functionality to temporarily resolve blocking issue with portal

## 6.1.14

- [patch][a048a85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a048a85):
  - Updated to be compatible with new Forms API

- Updated dependencies [647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - @atlaskit/form@5.0.0

## 6.1.13

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/form@4.0.21
  - @atlaskit/icon@15.0.2
  - @atlaskit/logo@9.2.6
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 6.1.12

- [patch][82fc5f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82fc5f5):
  - Pinning react-popper to 1.0.2 to avoid recursive bug

## 6.1.11

- [patch][bfc508c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfc508c):
  - CheckboxSelect options now have correct flex styles on the option value

## 6.1.10

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/form@4.0.20
  - @atlaskit/icon@15.0.1
  - @atlaskit/logo@9.2.5
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 6.1.9

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/form@4.0.19
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 6.1.8

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/form@4.0.18
  - @atlaskit/icon@14.6.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 6.1.7

- [patch][1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - Fixed issue where tooltips and modals would initially render in the wrong location

## 6.1.6

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):
  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow
    to type check properly

## 6.1.5

- [patch][fcf97d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fcf97d8):
  - Fix countries and mismatched flags

## 6.1.4

- [patch][6ab8e95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ab8e95" d):
  - Removed wrapping div from around selects as it is no longer needed when using the latest
    inline-dialog component.

## 6.1.3

- [patch][dab963b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dab963b" d):
  - Make sure portal binds to DOM only

## 6.1.2

- [patch][0782e03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0782e03" d):
  - bumped react-select to 2.1.1 minor bug fixes including mirroring the logic for the backspace key
    to delete, and stripping theme props from Input and GroupHeading dom elements. See
    https://github.com/JedWatson/react-select/releases/tag/v2.1.1 for details

## 6.1.1

- [patch] fixed popupselect bug by replacing Fragment with div element containing the requisite
  event handlers [80dd688](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80dd688)

## 6.1.0

- [minor] Change tabSelectsValue to default to false in @atlaskit/select, bumped react-select dep to
  2.1.0, see release logs for details https://github.com/JedWatson/react-select/releases/tag/2.1.0
  [dd4cbea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd4cbea)

## 6.0.4

- [patch] fix issues with PopupSelect and NavigationSwitcher
  [b4e19c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4e19c3)

## 6.0.3

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.2

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/form@4.0.10
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 6.0.1

- [patch] Fixing analytics events for checkbox/radio/select
  [3e428e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e428e3)

## 6.0.0

- [major] Bumped react-select dep from 2.0.0-beta.7 to 2.0.0. This includes a breaking change to
  custom components, the innerRef property is now declared on the root of the props object, as
  opposed to being part of the innerProps object passed to each component. For a full list of
  changes in 2.0.0 please see the react-select changelog here.
  https://github.com/JedWatson/react-select/blob/master/HISTORY.md
  [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)

## 5.0.19

- [patch] Added a multi-select example for PopupSelect
  [483a335](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/483a335)

## 5.0.18

- [patch] Updated dependencies
  [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/button@9.0.9
  - @atlaskit/form@4.0.5
  - @atlaskit/modal-dialog@7.0.1
  - @atlaskit/checkbox@5.0.0

## 5.0.17

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/form@4.0.3
  - @atlaskit/icon@13.8.1
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 5.0.16

- [patch] Updated dependencies
  [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/form@4.0.2
  - @atlaskit/webdriver-runner@0.1.0

## 5.0.15

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 5.0.14

- [patch] Updated dependencies
  [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)
  - @atlaskit/form@4.0.0

## 5.0.13

- [patch] Using the latest popper to avoid recursive setState calls.
  [9dceca9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9dceca9)

## 5.0.11

- [patch] Updating datetime-picker and select styles
  [981b96c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/981b96c)

## 5.0.10

- [patch] add switcher to nav-next ui components docs page
  [e083d63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e083d63)
- [none] Updated dependencies
  [e083d63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e083d63)

## 5.0.9

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/form@3.1.6
  - @atlaskit/checkbox@4.0.4
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 5.0.8

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/checkbox@4.0.3
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/icon@13.2.4
  - @atlaskit/form@3.1.5

## 5.0.7

- [patch] Fix bug with Popup select not opening if target was an SVG object
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/checkbox@4.0.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/modal-dialog@6.0.5
  - @atlaskit/form@3.1.4

## 5.0.6

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [patch] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/checkbox@4.0.1
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/icon@13.2.1
  - @atlaskit/form@3.1.3

## 5.0.5

- [patch] Removed incorrect min-height for forms. Fixed select dev dep range for form.
  [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
- [none] Updated dependencies
  [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
  - @atlaskit/form@3.1.2

## 5.0.4

- [patch] Updated dependencies
  [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/form@3.1.1

## 5.0.3

- [patch] Updated dependencies
  [e33f19d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e33f19d)
  - @atlaskit/form@3.1.0

## 5.0.2

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/modal-dialog@6.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 5.0.1

- [patch] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/form@3.0.1

## 5.0.0

- [major] Provides analytics for common component interations. See the
  [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for
  more details. If you are using enzyme for testing you will have to use
  [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme).
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/form@3.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/form@3.0.0

## 4.5.2

- [patch] Update loading indicator to be inline with ADG3
  [da661fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da661fd)
- [none] Updated dependencies
  [da661fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da661fd)

## 4.5.1

- [patch] fixed actionMeta not being passed to onChange of PopupSelect
  [83833be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83833be)
- [none] Updated dependencies
  [83833be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83833be)

## 4.5.0

- [minor] atlaskit/select now invokes a makeAnimated function to wrap passed in components in
  default animated behaviour. As this invocation returns a new set of react components each time,
  we've also implemented a lightweight component cache using memoize-one and react-fast-compare.
  Additionally updates made to datetime-picker to not instantiate a new component on render
  everytime (for performance reasons as well as to satisfy our caching logic), we now also pass
  relevant state values through the select as props to be ingested by our custom components, instead
  of directly capturing them within lexical scope.
  [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)
- [none] Updated dependencies
  [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)

## 4.4.0

- [minor] Added nav-next "Switcher" component. Minor fixes and dep bump for select.
  [ed5d8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5d8d1)
- [none] Updated dependencies
  [ed5d8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5d8d1)

## 4.3.6

- [patch] ADG3 guideline allignemnt, updated padding and height, update colors for hover and active,
  update icons [b53da28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53da28)
- [none] Updated dependencies
  [b53da28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53da28)

## 4.3.5

- [patch] Updated dependencies
  [60c715f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60c715f)
  - @atlaskit/form@2.1.5

## 4.3.4

- [patch] Updated dependencies
  [a78cd4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a78cd4d)
  - @atlaskit/icon@12.6.2

## 4.3.3

- [patch] Replace internal styled components with emotion styled components
  [415a64a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/415a64a)
- [none] Updated dependencies
  [415a64a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/415a64a)

## 4.3.2

- [patch] Updated dependencies
  [470a1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/470a1fb)
  - @atlaskit/form@2.1.4

## 4.3.1

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [patch] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/tooltip@10.3.1
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/button@8.2.2
  - @atlaskit/checkbox@3.1.2
  - @atlaskit/icon@12.3.1
  - @atlaskit/form@2.1.3

## 4.3.0

- [minor] Fixes types for Flow 0.74
  [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies
  [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/tooltip@10.3.0
  - @atlaskit/button@8.2.0
  - @atlaskit/checkbox@3.1.0
  - @atlaskit/icon@12.2.0

## 4.2.3

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [patch] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/checkbox@3.0.6
  - @atlaskit/icon@12.1.2
  - @atlaskit/form@2.1.2

## 4.2.2

- [patch] Added upgrade guide, updated atlaskit/docs dep on react-markings to expose md parser
  customisations [aef4aea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aef4aea)
- [none] Updated dependencies
  [aef4aea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aef4aea)
  - @atlaskit/docs@4.2.0

## 4.2.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/checkbox@3.0.5
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 4.2.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/checkbox@3.0.4
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 4.1.0

- [minor] Fix InlineDialog closing on Select option click. Added Select prop onClickPreventDefault
  which is enabled by default
  [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)
- [minor] Updated dependencies
  [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)

## 4.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/checkbox@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/checkbox@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 3.2.0

- [minor] Add named export "CompositeSelect" to the Atlaskit select package
  [9c34042](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c34042)

## 3.1.0

- [minor] Added `spacing` prop, which allows for a compact mode that supports 32px trigger height
  for single-select, bumped react-select to beta.6
  [59ab4a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ab4a6)
- [minor] added `spacing` prop to support `compact` mode for single select.
- bumped react-select to beta.6, this includes the following changes:
  - `actionMeta` for `remove-value` and `pop-value` events now contain a `removedValue` property.
  - Fixed bug with `css` attribute being applied to DOM element in SingleValue.
  - selectValue now filters items based on getOptionValue method.
  - Added `createOptionPosition` prop for Creatable select, which allows the user to specify whether
    the createOption element displays as the first or last option in the menu.
  - Added touch handling logic to detect user intent to scroll the page when interacting with the
    select control.

## 3.0.2

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/checkbox@2.0.2
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 3.0.1

- [patch] Fix imports for creaetable, async and async creatable selects
  [92ae24e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92ae24e)

## 3.0.0

- [major] Update to react-select@beta.4, removed developer preview warning. Stable release
  [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
- BREAKING: Removed `maxValueHeight` prop and functionality, this is a breaking change that affects
  multi -value components predominantly. The control will now expand to accommodate contained
  values, as opposed to constraining to a maxValueHeight with a scrollable area.
- `Async`, `Creatable`, `AsyncCreatable` components now imported from `react-select` and not from
  `react-select/lib/*`.
- Internal cx implementation refactored to reduce specificity of css-in-js base styles. By default
  these base-styles will be overridden by css styles associated to provided class names.
- Fixed animated component bug where setting isSearchable to false would throw warnings in the
  console.
- Added a `classNamePrefix` prop which now controls the class names applied to internal components,
  `className` prop is now intended for adding a className to the bounding selectContainer only. If
  the classNamePrefix field is left undefined, then the className prop will currently fulfill both
  these roles, however a warning will be shown and _this functionality is intended to be deprecated
  in future releases_.
- Added --is-disabled className modifier to the default Option component
- Fixed IE11 issues around element overflow in the menuList, and scroll indicators in the control.
- Added multi-value keyboard navigation using left and right arrow keys.
- Added fix to ensure focus is on the input when the menu opens.

## 2.0.2

- [patch] Release to align @atlaskit/select styles and theme with ADG3 guideline.
  [7468739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7468739)

## 2.0.0

- [major] Classname prop added, if this is given a value we surface logical semantic classes
  prefixed with the supplied value to enable styling via css otherwise a generated hash value is
  used.W e also now export icon components from the components object to facilitate easier
  customisation. Previously this behaviour was enforced, and classes were given semantic values and
  prefixed with ‘react-select’ by default (i.e. react-select\_\_dropdown-indicator) . See the
  following commit for details
  https://github.com/JedWatson/react-select/commit/109d1aadb585cc5fd113d03309d80bd59b5eaf9b Also in
  this release, IE 11 display bugfix for centre alligned elements in a flex parent, fix for react15
  compatibility, fix for bug where long tail values were not being truncated properly in the control
  [8d19b24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d19b24)

## 1.3.1

- [patch] Update react-select version to fix flowtype errors
  [240a083](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/240a083)

## 1.3.0

- [minor] Update react-select dep in @atlaskit/select to alpha.10
  [4073781](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4073781)

## 1.2.0

- [minor] @atlaskit/select now exports the createFilter
  [df7d845](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df7d845)

## 1.1.1

- [patch] Re-export some exports from react-select for use in other packages.
  [eda9906](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eda9906)

## 1.1.0

- [minor] Added default text-truncation behaviour for options in radio and checkbox selects
  [5b37cc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b37cc1)

## 1.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 0.3.0

- [minor] Added Creatable and AsyncCreatable exports, added menuPortalTarget prop to portal select
  menu, updated selects to expose intenral focus and blur methods'
  [a7b06f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7b06f4)

## 0.2.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 0.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 0.1.7

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 0.1.6

- [patch] Update to alpha.6 and cleanup CountrySelect
  [c972f53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c972f53)

## 0.1.5

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 0.1.4

- [patch] misc updates to select package
  [bd000c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd000c7)

## 0.1.3

- [patch] added temporary SelectWraper to demonstrate validation
  [0ef5343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ef5343)

## 0.1.2

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 0.1.1

- [patch] initial release of the select package
  [1b8e01d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b8e01d)

## 0.1.0

- Initial release
