# @atlaskit/datetime-picker

## 17.1.10

### Patch Changes

- Updated dependencies

## 17.1.9

### Patch Changes

- Updated dependencies

## 17.1.8

### Patch Changes

- Updated dependencies

## 17.1.7

### Patch Changes

- [`329c88647d73e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/329c88647d73e) -
  Improve accessible description of date picker.

## 17.1.6

### Patch Changes

- [`a8247416bb21a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8247416bb21a) -
  Improve accessible description of date picker.

## 17.1.5

### Patch Changes

- [`f5f621a43f60a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f5f621a43f60a) -
  ts-ignore added as a workaround for help-center typecheck

## 17.1.4

### Patch Changes

- [`16194129e5cdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16194129e5cdf) -
  Refactor to use `noop` helper function over noop functions.
- Updated dependencies

## 17.1.3

### Patch Changes

- Updated dependencies

## 17.1.2

### Patch Changes

- Updated dependencies

## 17.1.1

### Patch Changes

- Updated dependencies

## 17.1.0

### Minor Changes

- [`cca11d70019df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cca11d70019df) -
  This fixes a bug with announcing the label for users of assistive technology behind a feature
  flag. If successful, it will roll out in a future release.

## 17.0.18

### Patch Changes

- [`437668dfbdec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437668dfbdec9) -
  Add explicit types to a number of DST components
- Updated dependencies

## 17.0.17

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 17.0.16

### Patch Changes

- Updated dependencies

## 17.0.15

### Patch Changes

- [`74c2f420ee49b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74c2f420ee49b) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 17.0.14

### Patch Changes

- Updated dependencies

## 17.0.13

### Patch Changes

- [`79bb06a0e34dc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/79bb06a0e34dc) -
  Clean up platform_dst_menuonclose_fix
- Updated dependencies

## 17.0.12

### Patch Changes

- Updated dependencies

## 17.0.11

### Patch Changes

- Updated dependencies

## 17.0.10

### Patch Changes

- Updated dependencies

## 17.0.9

### Patch Changes

- Updated dependencies

## 17.0.8

### Patch Changes

- Updated dependencies

## 17.0.7

### Patch Changes

- [#174817](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174817)
  [`4538c912575ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4538c912575ff) -
  Call onMenuOpen and onMenuClose when menu is open or close by calendar button

## 17.0.6

### Patch Changes

- Updated dependencies

## 17.0.5

### Patch Changes

- Updated dependencies

## 17.0.4

### Patch Changes

- Updated dependencies

## 17.0.3

### Patch Changes

- Updated dependencies

## 17.0.2

### Patch Changes

- Updated dependencies

## 17.0.1

### Patch Changes

- [#142578](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142578)
  [`a1e85a3a1ca96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a1e85a3a1ca96) -
  Add componenets API support in selectProps
- Updated dependencies

## 17.0.0

### Major Changes

- [#129617](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129617)
  [`0afd40c7a88c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0afd40c7a88c1) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/datetime-picker`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 16.2.3

### Patch Changes

- Updated dependencies

## 16.2.2

### Patch Changes

- Updated dependencies

## 16.2.1

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 16.2.0

### Minor Changes

- [#129522](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129522)
  [`e1b2aef9e7c6c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1b2aef9e7c6c) -
  DateTimePicker now uses disabled border and background color tokens when disabled.

## 16.1.1

### Patch Changes

- Updated dependencies

## 16.1.0

### Minor Changes

- [#115611](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/115611)
  [`5f9efb77e9d97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f9efb77e9d97) -
  Adds a new prop to allow wrapping the DatePicker calendar, for internal use only.

## 16.0.3

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- Updated dependencies

## 16.0.1

### Patch Changes

- Updated dependencies

## 16.0.0

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

## 15.13.1

### Patch Changes

- Updated dependencies

## 15.13.0

### Minor Changes

- [#103629](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103629)
  [`60472f23c74f1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/60472f23c74f1) -
  Finish conversion of datetime picker components from class components to functional components,
  and cleaning up feature flags.

## 15.12.2

### Patch Changes

- Updated dependencies

## 15.12.1

### Patch Changes

- Updated dependencies

## 15.12.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 15.11.2

### Patch Changes

- [#103710](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103710)
  [`0fc1371775df4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fc1371775df4) -
  Refactor internals and update dev dependencies.

## 15.11.1

### Patch Changes

- [#105750](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105750)
  [`5b235146d0faa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b235146d0faa) -
  Resolve dependency issue that masks test matcher problems.

## 15.11.0

### Minor Changes

- [#102000](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102000)
  [`3e1546043c1c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e1546043c1c3) -
  We are testing adding year buttons to the calendar behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 15.10.6

### Patch Changes

- Updated dependencies

## 15.10.5

### Patch Changes

- [#178643](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178643)
  [`598b1dc3753cc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/598b1dc3753cc) -
  Fix instances of module level FG evaluation
- Updated dependencies

## 15.10.4

### Patch Changes

- [#177875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177875)
  [`d0c3d27216b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0c3d27216b7c) -
  Clean up props for select new improvement on theme and customized components
- Updated dependencies

## 15.10.3

### Patch Changes

- [#177689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177689)
  [`e399f0a6a7c5b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e399f0a6a7c5b) -
  Select: Update use of deprecated props

## 15.10.2

### Patch Changes

- Updated dependencies

## 15.10.1

### Patch Changes

- Updated dependencies

## 15.10.0

### Minor Changes

- [#168398](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168398)
  [`3b1f085cfd51b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3b1f085cfd51b) -
  update calendar button component

## 15.9.6

### Patch Changes

- Updated dependencies

## 15.9.5

### Patch Changes

- [#166087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166087)
  [`3ab7d7da348ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ab7d7da348ab) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 15.9.4

### Patch Changes

- Updated dependencies

## 15.9.3

### Patch Changes

- [#165423](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165423)
  [`f07cb14952573`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f07cb14952573) -
  Update internals of datetime picker to accommodate new props.
- [#165989](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165989)
  [`4e6b0a538b8a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4e6b0a538b8a2) -
  Fix bug that stopped down/up arrow presses from opening the menu on the input field.

## 15.9.2

### Patch Changes

- [#163831](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163831)
  [`bdee2726c1e39`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bdee2726c1e39) -
  Fix bug in calendar date selection caused by underlying `react-select` mousedown event.

## 15.9.1

### Patch Changes

- [#161638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161638)
  [`d2e5e5ce0053d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2e5e5ce0053d) -
  Use new API of layering without UNSAFE prefix

## 15.9.0

### Minor Changes

- [#161715](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161715)
  [`fc083f8b29d92`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc083f8b29d92) -
  update datetime picker to use button component and primitives

## 15.8.0

### Minor Changes

- [#161680](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161680)
  [`e47891c352097`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e47891c352097) -
  Update date picker to include latest primitives and css

## 15.7.1

### Patch Changes

- [`2c624534e7b7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c624534e7b7d) -
  Updated dependency.

## 15.7.0

### Minor Changes

- [#158791](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158791)
  [`2dcea88bcb6c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2dcea88bcb6c7) -
  Support React 18 SSR by removing use of react-uid

## 15.6.0

### Minor Changes

- [#157307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157307)
  [`a1e80ec0a5e4a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a1e80ec0a5e4a) -
  Enable new icons behind a feature flag.
- [#157307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157307)
  [`e6c2d403fadd0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e6c2d403fadd0) -
  Add clearControlLabel to datepicker component.

### Patch Changes

- Updated dependencies

## 15.5.2

### Patch Changes

- Updated dependencies

## 15.5.1

### Patch Changes

- [#156121](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156121)
  [`6e87dd7dd8d3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e87dd7dd8d3a) -
  When `shouldShowCalendarButton` is `true`, ensures that input text properly overflows via
  controlling an underlying select component.
- [#156147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156147)
  [`a5c2ba68d297d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a5c2ba68d297d) -
  We are testing converting the datetime picker from a class component to a functional component
  behind a feature flag. If this fix is successful it will be available in a later release.

## 15.5.0

### Minor Changes

- [#156026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156026)
  [`709b9c76673df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/709b9c76673df) -
  Add clearControlLabel to timepicker component.

### Patch Changes

- Updated dependencies

## 15.4.3

### Patch Changes

- Updated dependencies

## 15.4.2

### Patch Changes

- [#153409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153409)
  [`af63929f9d51a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af63929f9d51a) -
  Fix date-picker conditional component export
- Updated dependencies

## 15.4.1

### Patch Changes

- [#152922](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152922)
  [`db290b80cd2f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db290b80cd2f5) -
  Fix bug in new calendar button escape handling to close.

## 15.4.0

### Minor Changes

- [`aa20e64143c46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aa20e64143c46) -
  DatePicker rewrited to be a functional component

## 15.3.1

### Patch Changes

- Updated dependencies

## 15.3.0

### Minor Changes

- [#132971](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132971)
  [`eca12e4531487`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eca12e4531487) -
  add isRequired prop

### Patch Changes

- [#150734](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150734)
  [`8a55d1695e74a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a55d1695e74a) -
  Use proper icon color for calendar button.

## 15.2.0

### Minor Changes

- [`6f45e454d44fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6f45e454d44fe) -
  [ux] Adds a dedicated button to open the calendar.

## 15.1.4

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select
- Updated dependencies

## 15.1.3

### Patch Changes

- Updated dependencies

## 15.1.2

### Patch Changes

- [#147913](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147913)
  [`cc70a6a79755c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc70a6a79755c) -
  Refactor internal prop destructuring in date picker.

## 15.1.1

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [#146815](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146815)
  [`ef585df54488c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ef585df54488c) -
  [ux] add clearButtonLabel prop in datetime-picker component

## 15.0.3

### Patch Changes

- [#146278](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146278)
  [`c3cf99e129677`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3cf99e129677) -
  Make default value from inner pickers work correctly with datetime picker values.
- [#145891](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145891)
  [`b4b387856090d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b4b387856090d) -
  Ensure inner picker event blur and focus handlers don't interfere or replace internal logic.

## 15.0.2

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- [#145902](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145902)
  [`7d95e270ddda2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d95e270ddda2) -
  Ensure provided onChange handlers on in `*PickerProps` run alongside internal parsing logic
  instead of overriding it.

## 15.0.0

### Major Changes

- [#145306](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145306)
  [`3b17d85b64fcd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3b17d85b64fcd) -
  Remove unused analyticsContext prop and add unit tests for analytics.

## 14.1.2

### Patch Changes

- [`728a2eb75d298`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/728a2eb75d298) -
  Fix bug in handling controlled values.

## 14.1.1

### Patch Changes

- [#143394](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143394)
  [`ed5f5f38c610a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed5f5f38c610a) -
  [ux] update time picker to use updated primitives

## 14.1.0

### Minor Changes

- [#142807](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142807)
  [`e4b42ed1ea941`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e4b42ed1ea941) -
  These two props that were removed on 14.0.0 and no longer impacted the functionality of the
  `DateTimePicker` were misrepresented in the type interface as options and have been fully removed
  now.
  - `timeIsEditable`
  - `times`

  We recommend running the codemod provided in major change 14.0.0. If you have already run this
  once, it does not need to be run again.

## 14.0.5

### Patch Changes

- [#138676](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138676)
  [`9f9a53335523d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f9a53335523d) -
  Use parsed year instead of ISO year in internal `getParsedISO` function.

## 14.0.4

### Patch Changes

- [#137180](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137180)
  [`a12a34f29c819`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a12a34f29c819) -
  Refactor internal functions.
- Updated dependencies

## 14.0.3

### Patch Changes

- [#137357](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137357)
  [`023251c8a0af7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/023251c8a0af7) -
  Converting the time picker from a class component into a functional component.

## 14.0.2

### Patch Changes

- [#136647](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136647)
  [`a3f810c087f5d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3f810c087f5d) -
  Internal changes based on calendar API changes.
- Updated dependencies

## 14.0.1

### Patch Changes

- [#134343](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134343)
  [`e6aa0942ed680`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e6aa0942ed680) -
  Deprecated props that were missed in the last deprecation patch, `13.11.1`.

## 14.0.0

### Major Changes

- [#133339](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133339)
  [`eb8297ababb74`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb8297ababb74) -
  Refactors the API and ratchets down on props in the `selectProps` in favor of top-level
  alternatives. This ensures that there is one way to do each things and there is a clear
  encapsulation of what prop goes to which picker. A codemod is included which will automate all of
  the changes for you.

## 13.11.3

### Patch Changes

- [#132041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132041)
  [`ce77b41a18a18`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce77b41a18a18) -
  Refactoring internal state management within the pickers.

## 13.11.2

### Patch Changes

- [#130953](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130953)
  [`a6c1f10b9f4b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6c1f10b9f4b7) -
  Refactor internal types to make spread props explicit.

## 13.11.1

### Patch Changes

- [#130485](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130485)
  [`d7ffb64c0d672`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7ffb64c0d672) -
  Deprecated props that are either unused or where the usage causes accessibility issues. These will
  be removed in the next major upgrade.

## 13.11.0

### Minor Changes

- [#129307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129307)
  [`8f67a01e4e56f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f67a01e4e56f) -
  Fix internal type issues with regard to forwarding types from underlying `select` package.

## 13.10.1

### Patch Changes

- Updated dependencies

## 13.10.0

### Minor Changes

- [#128236](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128236)
  [`84388abdd587a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/84388abdd587a) -
  The platform.design-system-team.date-picker-input-a11y-fix_cbbxs feature flag has been removed.

## 13.9.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 13.8.1

### Patch Changes

- Updated dependencies

## 13.8.0

### Minor Changes

- [#126987](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126987)
  [`bb13421c0a089`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bb13421c0a089) -
  Surface removal of scroll locking behaviour without feature flag.

## 13.7.6

### Patch Changes

- [#125675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125675)
  [`56a62aafb8d80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56a62aafb8d80) -
  Refactoring to make locally defined variables that were assigned as spread props explicit.

## 13.7.5

### Patch Changes

- [#123484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123484)
  [`404b4cb52e659`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/404b4cb52e659) -
  Launch layering in datetime picker to fix escape close issue

## 13.7.4

### Patch Changes

- [`974d1508085ce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/974d1508085ce) -
  Accessibility changes. Add ability to change focus to the current date using ArrowUp and ArrowDown
  keys while the focus is on the `input`.
- Updated dependencies

## 13.7.3

### Patch Changes

- [#121570](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121570)
  [`6026292f28f06`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6026292f28f06) -
  [ux] Allows `aria-describedby` on all pickers. This will ensure messages from the form's field
  component will be applied properly.

## 13.7.2

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 13.7.1

### Patch Changes

- [#118692](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118692)
  [`754f67840e782`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/754f67840e782) -
  Remove remnants of `extract-react-types`.

## 13.7.0

### Minor Changes

- [#116276](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116276)
  [`7b251aa2db916`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7b251aa2db916) -
  Remove scroll locking behaviour to better support smaller screens.

## 13.6.1

### Patch Changes

- Updated dependencies

## 13.6.0

### Minor Changes

- [#111878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111878)
  [`223959ef57c80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/223959ef57c80) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 13.5.3

### Patch Changes

- [#109381](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109381)
  [`8e216367262ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e216367262ea) -
  [ux] Correct outside border of date time picker to 2px when focused
- Updated dependencies

## 13.5.2

### Patch Changes

- [#102225](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102225)
  [`95ec6562dae8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/95ec6562dae8) -
  Removal of feature flag platform.design-system-team-date-picker-input-focus-fix_awmzp

## 13.5.1

### Patch Changes

- Updated dependencies

## 13.5.0

### Minor Changes

- [#96491](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96491)
  [`67cdb3372708`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67cdb3372708) -
  Add support for React 18 in non-strict mode.

## 13.4.0

### Minor Changes

- [#94675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94675)
  [`5d9e1dccacca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d9e1dccacca) -
  [ux] Update input border color token to meet 3:1 color contrast ratioLight theme:
  color.border.input: #091E4224 → #8590A2Dark mode: color.border.input: #A6C5E229 → #738496

### Patch Changes

- Updated dependencies

## 13.3.6

### Patch Changes

- Updated dependencies

## 13.3.5

### Patch Changes

- [#95171](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95171)
  [`22defdb991da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22defdb991da) -
  [ux] Open date picker calendar when enter or space is pressed while input is focused and calendar
  is closed.

## 13.3.4

### Patch Changes

- [#93577](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93577)
  [`af88f34ad1bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af88f34ad1bc) -
  This removes the `platform.design-system-team.move-onblur-event-to-input-container_3z82c` feature
  flag. The blur event on `DatePicker` should fire after the calendar is closed.

## 13.3.3

### Patch Changes

- [#94805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94805)
  [`cf93487006a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf93487006a9) -
  [ux] Return focus to the date picker input on date selection
- Updated dependencies

## 13.3.2

### Patch Changes

- [#91429](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91429)
  [`3a4be575c5b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a4be575c5b5) -
  Updated TypeScript types for the default props of `DateTimePicker` to improve compatibility with
  React 18

## 13.3.1

### Patch Changes

- [#88752](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88752)
  [`08f18fa02605`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/08f18fa02605) -
  [ux] Update calendar dependency
- Updated dependencies

## 13.3.0

### Minor Changes

- [#68248](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68248)
  [`22e0fd4f6694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22e0fd4f6694) -
  Move the onBlur event from the input to the input container in `DatePicker`. Add the type
  `aria-describedby` in to Field component.

## 13.2.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 13.2.2

### Patch Changes

- [#82543](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82543)
  [`0f3b2fb883d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0f3b2fb883d3) -
  Refactor border width feature to make it work in SSR

## 13.2.1

### Patch Changes

- [#81644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81644)
  [`8ab7a816dca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ab7a816dca7) -
  Revert input border change from the previous version

## 13.2.0

### Minor Changes

- [#80805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80805)
  [`427c2dd9e0d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/427c2dd9e0d6) -
  [ux] Update input border width from 2px to 1px with darker color to meet 3:1 color contrast

### Patch Changes

- Updated dependencies

## 13.1.0

### Minor Changes

- [#79261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79261)
  [`d679c084e0a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d679c084e0a9) -
  Add optional `label` prop to DatePicker and TimePicker to supply an accessible name via
  `aria-label`

## 13.0.12

### Patch Changes

- [#74820](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74820)
  [`419806ebcae0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/419806ebcae0) -
  Export internal utility components to new file to clean up.

## 13.0.11

### Patch Changes

- [#74787](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74787)
  [`c19c3790e6f1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c19c3790e6f1) -
  Cleaning up date picker component by exporting internal utilities.

## 13.0.10

### Patch Changes

- [#74796](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74796)
  [`47a2a39b4033`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47a2a39b4033) -
  Move types for all the pickers to the appropriate `types` file.

## 13.0.9

### Patch Changes

- [#74756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74756)
  [`8e66f751df96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e66f751df96) -
  Use feature flag to roll out border width update from 2px to 1px

## 13.0.8

### Patch Changes

- [#70959](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70959)
  [`689672b7c5b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/689672b7c5b0) -
  [ux] Returns focus to input after pressing `Esc` when inside the calendar popup in a date picker.

## 13.0.7

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 13.0.6

### Patch Changes

- [#63677](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63677)
  [`f320c8ce5039`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f320c8ce5039) -
  This package has been added to the Jira push model.

## 13.0.5

### Patch Changes

- [#61141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61141)
  [`57a79a328287`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57a79a328287) -
  Revert the solution with the hidden span in the Label which was merged in scope of DST-11061.

## 13.0.4

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 13.0.3

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 13.0.2

### Patch Changes

- [#58458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58458)
  [`536478cdcf0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/536478cdcf0b) -
  Made some tiny tweaks to the weekday header so its height is now an integer.

## 13.0.1

### Patch Changes

- [#40391](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40391)
  [`4300c9d6f18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4300c9d6f18) -
  Associate the label with the `Date` / `Time` picker and the clear button. Add hidden span to the
  Label component. This allows to associate a label with a clear button. Unit tests update.

## 13.0.0

### Major Changes

- [#43269](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43269)
  [`c7ab5b9501c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7ab5b9501c) - This
  fixes it so that `<TimePicker timeEditable timeFormat="hh:mm:ss">` will return seconds when the
  timeformat includes seconds whereas previously it would strictly return `HH:mm` and not account
  for the `timeFormat`. It is still not flexible and does not return time in your `timeFormat` to
  avoid causing unexpected breaking changes as that `HH:mm` format has been there for so long.

  There's a theoretical risk that `HH:mm` formats are expected back when `HH:mm:ss` format are used
  and unsed improperly, but any typical parsing of datetime should handle this change perfectly
  fine, with zero breaking change expected.

### Patch Changes

- Updated dependencies

## 12.10.6

### Patch Changes

- Updated dependencies

## 12.10.5

### Patch Changes

- Updated dependencies

## 12.10.4

### Patch Changes

- [#42445](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42445)
  [`5645b5a1132`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5645b5a1132) - Fix TS
  errors for forge-ui in AFM

## 12.10.3

### Patch Changes

- [#41628](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41628)
  [`b05664f7aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b05664f7aba) - Use
  feature flag to toggle if we enable UNSAFE_LAYERING

## 12.10.2

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 12.10.1

### Patch Changes

- [#40400](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40400)
  [`ccff5f6ec7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccff5f6ec7a) -
  Integrate layering into calendar

## 12.10.0

### Minor Changes

- [#39964](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39964)
  [`6c0c0407eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c0c0407eb1) - This
  cleans up the feature flag references for the keyboard accessibility changes, making them fully
  available for all users.

## 12.9.0

### Minor Changes

- [#39720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39720)
  [`4afff68f652`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4afff68f652) - Make
  typing more complete and accurate for date picker.

## 12.8.2

### Patch Changes

- [#39447](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39447)
  [`829d92bcf37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/829d92bcf37) - Remove
  out of date lifecycle methods in favor of up to date methods.

## 12.8.1

### Patch Changes

- [#39448](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39448)
  [`ae2b28c599a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae2b28c599a) - Remove
  unused state value.

## 12.8.0

### Minor Changes

- [#38521](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38521)
  [`0ab32310305`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ab32310305) - [ux] We
  are testing adding keyboard accessibility to the datepicker change behind a feature flag. If this
  fix is successful it will be available in a later release.

## 12.7.12

### Patch Changes

- [#39105](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39105)
  [`5fae4d61ff7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fae4d61ff7) - Move
  event handlers to time picker input

## 12.7.11

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 12.7.10

### Patch Changes

- [#38651](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38651)
  [`e211efc7c5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e211efc7c5f) - [ux] Add
  `lang` attribute to value of pickers.

## 12.7.9

### Patch Changes

- [#38569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38569)
  [`6f1daf0e449`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f1daf0e449) - Prevent
  calander from overlaying input when at the bottom of viewport

## 12.7.8

### Patch Changes

- [#37610](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37610)
  [`e8bb91da805`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8bb91da805) - [ux]
  Ensure menu doesn't close when focus moves within it. Makes future keyboard accessibility
  possible.

## 12.7.7

### Patch Changes

- [#36759](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36759)
  [`ba50169844e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba50169844e) - Remove
  lookahead and lookbehind in format util to support browsers without that functionality.

## 12.7.6

### Patch Changes

- [#35904](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35904)
  [`6d8ce8bb48a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d8ce8bb48a) - Revert
  PR using regex that is not supported by Safari 16.4 and below and can crash a session

## 12.7.5

### Patch Changes

- [#36665](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36665)
  [`22363f962e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22363f962e5) - update
  border width to use border spacing token

## 12.7.4

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 12.7.3

### Patch Changes

- [`758165c64f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/758165c64f6) - Fixes
  bug that made escapes not work correctly in format strings.

## 12.7.2

### Patch Changes

- [#35111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35111)
  [`8f436f0c301`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f436f0c301) - extend
  border contrast feature flag to support confluence

## 12.7.1

### Patch Changes

- [#34881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34881)
  [`774ed69ecef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/774ed69ecef) - Internal
  changes to use space tokens for spacing values. There is no visual change.

## 12.7.0

### Minor Changes

- [#34373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34373)
  [`1d5cd2e273c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d5cd2e273c) - [ux] We
  are testing an input behavior change in date picker behind a feature flag. Now when entering a
  date in the input this value will persist after selecting a date instead of being cleared, acting
  like a standard input. If this fix is successful it will be available in a later release.

## 12.6.1

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 12.6.0

### Minor Changes

- [#33475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33475)
  [`6e51e0d5358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e51e0d5358) - [ux]
  update border width from 2px to 1px and add 1px box-shadow when focus or error

### Patch Changes

- Updated dependencies

## 12.5.3

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051)
  [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 12.5.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 12.5.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 12.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 12.4.0

### Minor Changes

- [#33163](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33163)
  [`e976f3cebd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e976f3cebd0) - Remove
  excessive `aria-labelledby` prop, remove incorret documentation.

## 12.3.13

### Patch Changes

- [#32350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32350)
  [`c71b0ac8222`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c71b0ac8222) - [ux] Add
  default label to time picker element of datetime picker. Update documentation for more accessible
  examples and guidelines.

## 12.3.12

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`e754545d460`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e754545d460) - [ux]
  Ensure no duplicate ID's when using `selectProps` on any of the DateTime Picker components.

## 12.3.11

### Patch Changes

- [#31891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31891)
  [`b50c6475079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b50c6475079) - Make
  clear button in datetime picker a button element that is out of the tab order. This mimics the
  native input element's clear behavior in Safari/Edge.
- [`c0fb88b3af6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0fb88b3af6) - [ux]
  style(calendar): update icon color token from text.subtlest to color.icon

## 12.3.10

### Patch Changes

- [#30882](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30882)
  [`1fc7949b336`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fc7949b336) - [ux]
  Fixes a bug where the background for the calendar element was incorrectly set to
  'elevation.surface'

## 12.3.9

### Patch Changes

- [#29470](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29470)
  [`5546747df1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5546747df1e) -
  Refactoring of code to clean tech debt and make future maintenance easier
- Updated dependencies

## 12.3.8

### Patch Changes

- Updated dependencies

## 12.3.7

### Patch Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932)
  [`98891267a5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98891267a5e) - [ux]
  Dates entered with 5+ digit years will no longer throw a RangeError

## 12.3.6

### Patch Changes

- Updated dependencies

## 12.3.5

### Patch Changes

- Updated dependencies

## 12.3.4

### Patch Changes

- Updated dependencies

## 12.3.3

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`cb8f8e76d25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb8f8e76d25) - Update
  types for react-select and @atlaskit/select upgrade Update commerce-ui entrypoints that caused a
  pipeline issue.
- Updated dependencies

## 12.3.2

### Patch Changes

- Updated dependencies

## 12.3.1

### Patch Changes

- [#27289](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27289)
  [`051095c0d82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/051095c0d82) - [ux]
  Changed the Date Picker controller icon to use `color.icon.disabled` token when in disabled state.

## 12.3.0

### Minor Changes

- [#24968](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24968)
  [`b8841384da6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8841384da6) - Disabled
  background and border styles should not be applied to components that have either no background or
  transparent background to begin with. Textfield and textarea variants that do not have backgrounds
  (sublte or none) have no backgrounds or borders applied when disabled. As such, any comopnents
  that consume these will also be affected.

## 12.2.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 12.2.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`a91fbaf0552`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a91fbaf0552) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- [`0fbb2840aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fbb2840aba) - Add
  isInvalid prop to `@atlastkit/Select`. The prop indicates whether if the component is in the error
  state. If true, it visually shows a red border around the input.

  This replaces validationState to make Select more consistent like other components that uses
  isInvalid prop.

- Updated dependencies

## 12.1.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 12.1.3

### Patch Changes

- [#24008](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24008)
  [`299e4104e10`](https://bitbucket.org/atlassian/atlassian-frontend/commits/299e4104e10) - [ux]
  Added appearance 'none' option to component and adopts appearance handling from @atlaskit/select
- Updated dependencies

## 12.1.2

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`df3d5287649`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df3d5287649) - Internal
  code change turning on new linting rules.
- [`429a576a4b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/429a576a4b2) - fix
  change-event firing for invalid inputs in datetime-picker select.
- [`84afee665fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84afee665fc) - [ux]
  Implemented missing functionality to submit forms on enter press after a date has been selected in
  DatePicker
- [`2a2dcc1cf91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a2dcc1cf91) - Updated
  styles to use new input design tokens. Fixed bug where border radius on datePicker rendered
  incorrectly.
- Updated dependencies

## 12.1.1

### Patch Changes

- [#23350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23350)
  [`3fa327b5d01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fa327b5d01) - [ux]
  Border on a subtle appearance date-picker will now persist after a date is selected and field is
  in focus

## 12.1.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`58d4cd75f7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58d4cd75f7a) - Removed
  deprecated hideIcon prop from DateTimePicker because it is unused and serves no functionality.
  Removed the deprecation notice for the formatDisplayLabel prop in TimePicker

### Patch Changes

- [`c3a1b950d49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3a1b950d49) - DSP-3301
  specifies label to input id
- [`c2f866d31d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2f866d31d1) - [ux] Fix
  timepicker clear icon alignment
- [`7566be18f20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7566be18f20) - [ux]
  Time picker no longer loses focus to the document when tabbing through it in a popup.
- [`574b6c8ba7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/574b6c8ba7f) - [ux]
  DSP-2987 Add code to catch console error
- Updated dependencies

## 12.0.0

### Major Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`27d4f1e7121`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27d4f1e7121) - [ux]
  Updating tokens
- [`d7542d1a7c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7542d1a7c2) - [ux]
  Update Tokens in the code with those that are a better fit. New tokens will be visible only in
  applications configured to use the new Tokens API (currently in alpha).These changes are intended
  to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no
  visual or breaking changes.
- [`c19fb116172`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c19fb116172) - [ux]
  Update Tokens in the code with those that are a better fit. New tokens will be visible only in
  applications configured to use the new Tokens API (currently in alpha).These changes are intended
  to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no
  visual or breaking changes.

### Minor Changes

- [`6f7a4353204`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f7a4353204) - Added
  ability to provide custom aria-labels for next- and previous-month buttons using `nextMonthLabel`
  and `previousMonthLabel`

### Patch Changes

- [`3ec9ed2c4d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ec9ed2c4d0) - Fixed
  handling of custom times that included whitespace characters
- Updated dependencies

## 11.1.11

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`558cc136503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/558cc136503) - Bump
  moment dependency version
- [`e7438659c2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7438659c2e) - Updated
  dependency '@types/react-select' to fix type error
- Updated dependencies

## 11.1.10

### Patch Changes

- Updated dependencies

## 11.1.9

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 11.1.8

### Patch Changes

- Updated dependencies

## 11.1.7

### Patch Changes

- Updated dependencies

## 11.1.6

### Patch Changes

- Updated dependencies

## 11.1.5

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Fix bug
  in inline-edit and Form which prevented date selection in datetimepicker using the keyboard.
- Updated dependencies

## 11.1.4

### Patch Changes

- Updated dependencies

## 11.1.3

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 11.1.2

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 11.1.1

### Patch Changes

- [#15807](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15807)
  [`095021b1e08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/095021b1e08) - renaming
  deprecated lifecycle methods

## 11.1.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`354ef86cca0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/354ef86cca0) -
  Instrumented datetime-picker with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`2b98dfda0a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b98dfda0a6) - Removes
  `@emotion/styled` in favour of `@emotion/core`.
- Updated dependencies

## 11.0.2

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update
  package.jsons to remove unused dependencies.
- Updated dependencies

## 11.0.0

### Major Changes

- [#9328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9328)
  [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - [ux]
  BREAKING CHANGE: Datetime picker now uses date-fns@2.17 (previously <2.0). This change has
  tightened the requirements of users to provide ISO dates. This was never explicitly supported, but
  now will cause an error to be thrown for non-ISO dates. For an abundance of caution we're calling
  this a breaking change to protect users relying on the previous behaviour.

  To upgrade you'll need to ensure any dates passed to the `DateTimePicker` are in ISO format.

## 10.4.2

### Patch Changes

- [#12830](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12830)
  [`787c731b208`](https://bitbucket.org/atlassian/atlassian-frontend/commits/787c731b208) - Updated
  package description.

## 10.4.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 10.4.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`b162da59aac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b162da59aac) -

  #### New Features:

  Three props were added to `@atlaskit/calendar` and `@atlaskit/datetime-picker` to make disabling
  dates more practical, performant and expressive:
  - `minDate` for the minimum valid date
  - `maxDate` for the maximum valid date
  - `disabledDateFilter`, a function that takes a date string, and returns whether or not it should
    be disabled.

  #### Bugs
  - DatePicker: Disabled dates that lie outside of the currently selected month now have correct
    hover styles

### Patch Changes

- [`c406245d637`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c406245d637) - [ux]
  Prevents the clear button appearing on disabled DateTimePickers.
- [`4db7f1e42b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4db7f1e42b2) - [ux]
  Fixed a bug which caused clicks on disabled date pickers to modify internal state. This led to an
  issue where clicking on a disabled date picker, and then enabling it, would result in an opened
  date picker.
- Updated dependencies

## 10.3.0

### Minor Changes

- [#12170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12170)
  [`f6b951a51f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b951a51f2) - Removes
  usage of styled-components in favour of standardising on emotion

### Patch Changes

- Updated dependencies

## 10.2.1

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`1f493e1dc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f493e1dc65) - Bump
  `react-select` to v4.
- Updated dependencies

## 10.2.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`1ad2a658d5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ad2a658d5d) - [ux]
  Added `weekStartDay` prop which gets passed to the underlying `Calendar` instance.

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`069538e03c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069538e03c6) - Prefixes
  the testId passed down to the nested Calendar component with '\${testId}--calendar' to ensure
  testIds are namespaced correctly. This change only affects calendar testIds when used within a
  DatePicker context.

## 10.0.12

### Patch Changes

- Updated dependencies

## 10.0.11

### Patch Changes

- [#9299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9299)
  [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) -
  Downgrade back to date-fns 1.30.1 We discovered big bundle size increases associated with the
  date-fns upgrade. We're reverting the upgarde to investigate

## 10.0.10

### Patch Changes

- [#8291](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8291)
  [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade
  date-fns to 2.17

## 10.0.9

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- [`c20be966f07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c20be966f07) -
  **Internal change**
  - Change `@atlaskit/calendar` ref type import name from `CalendarInternalRef` to `CalendarRef`.
  - Change prop name which is being passed to `@atlaskit/calendar` from `internalRef` to
    `calendarRef`.

- Updated dependencies

## 10.0.8

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`9c020a0e05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c020a0e05f) - Replaced
  `@atlaskit/calendar` exported types to access its `navigate()` api
  - Replaced `CalendarClassType` & `ArrowKeys` types with `CalendarInternalRef` type.
  - Also replaced `ref` prop with `internalRef` prop for accessing `navigate()` api.

- Updated dependencies

## 10.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 10.0.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 10.0.5

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 10.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 10.0.2

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages
- [`39e130698b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39e130698b) - Fixes an
  issue in DatePicker, DateTimePicker and TimePicker where they all had a circular dependency
  between a type declaration and default props which led to TypeScript marking props with default
  values as required props. This will no longer occur.
- Updated dependencies

## 10.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`23f968def3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23f968def3) - Earlier
  value returned from DateTimePicker component was inconsistent, like for the first time it was
  without zone offset and after that with zone offset. Now it is consistent with zone offset
  every-time.
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 10.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.4.7

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`038b0fbb8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/038b0fbb8e) - fix
  typings after reverting DST-461 changes. typeof is fixed in ERT repo
  (https://github.com/atlassian/extract-react-types/pull/126)

## 9.4.6

### Patch Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`a39ef6582c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a39ef6582c) - Marks
  default pops as optional in interface (TimePicker & DatePicker)

## 9.4.5

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 9.4.4

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`466aec241f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/466aec241f) - Fixing
  incorrect margin for time-picker
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies

## 9.4.3

### Patch Changes

- [#2490](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2490)
  [`ccd9c51bd3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccd9c51bd3) - Fixes date
  picker being affected by an invalid emotion theme provider.

## 9.4.2

### Patch Changes

- Updated dependencies

## 9.4.1

### Patch Changes

- [#1891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1891)
  [`d2876ee14f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2876ee14f) - FIX: Add
  `hideIcon` prop back for backwards compatibility in MINOR

## 9.4.0

### Minor Changes

- [minor][449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):

  Add a clear icon for datepicker, timepicker and datetimepicker

### Patch Changes

- [patch][ca494abcd5](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca494abcd5):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [62390c4755](https://bitbucket.org/atlassian/atlassian-frontend/commits/62390c4755):

- Updated dependencies
  [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):
- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
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

- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 9.2.9

### Patch Changes

- [patch][4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

  Upgraded react-scrolllock package- Updated dependencies
  [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

- Updated dependencies
  [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 9.2.8

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

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/calendar@9.2.5
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/select@11.0.8
  - @atlaskit/textfield@3.1.8

## 9.2.6

### Patch Changes

- [patch][116cb9b00f](https://bitbucket.org/atlassian/atlassian-frontend/commits/116cb9b00f):

  FIX: Valid time string in ISO output of Datetime picker- Updated dependencies
  [296a8b114b](https://bitbucket.org/atlassian/atlassian-frontend/commits/296a8b114b):

- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies
  [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
  - @atlaskit/locale@1.0.6
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7

## 9.2.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
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

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
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
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/field-text@9.0.14
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/field-base@13.0.16
  - @atlaskit/popper@3.1.8

## 9.2.2

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages-
  Updated dependencies
  [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):
  - @atlaskit/select@11.0.2
  - @atlaskit/locale@1.0.3

## 9.2.1

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 9.2.0

### Minor Changes

- [minor][c423fbf5eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c423fbf5eb):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

## 9.1.0

### Minor Changes

- [minor][17a07074e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17a07074e8):

  Fix padding to be consistent with other Atlaskit form fields. This change includes removing
  padding from around the icon itself, and adding padding to the icon container, as well as altering
  the padding around the input container.

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

- Updated dependencies
  [8c725d46ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c725d46ec):
  - @atlaskit/calendar@9.0.0

## 8.1.0

### Minor Changes

- [minor][e3d466543f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3d466543f):

  Add locale support for Calendar/DateTimePicker/DatePicker/TimePicker:
  - New prop `locale` enables localization for date/time format in `DatePicker`, `TimePicker` and
    `DateTimePicker`, and months/days in `Calendar`.
  - Deprecated `dateFormat`, `timeFormat` and `formatDisplayLabel` props. Please use `locale`
    instead. If provided, these props will override `locale`.
  - Default date/time placeholders now use `locale` to format the date.
  - The default date parser for `DatePicker` has been changed from `date-fns.parse` to one based on
    the `locale` prop and accept text in a format that matches the placeholder.

## 8.0.17

### Patch Changes

- [patch][8784191ef6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8784191ef6):

  Date, Time, and DateTime pickers now correctly clear their value when the Backspace or Delete key
  is pressed

## 8.0.16

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

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

- Updated dependencies
  [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/calendar@8.0.6
  - @atlaskit/field-text@9.0.7
  - @atlaskit/select@10.0.3
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2
  - @atlaskit/modal-dialog@10.1.3

## 8.0.11

- Updated dependencies
  [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/popper@3.0.0
  - @atlaskit/calendar@8.0.5

## 8.0.10

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.9

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/select@10.0.0

## 8.0.8

### Patch Changes

- [patch][19d9d0f13f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19d9d0f13f):

  Fixing a rare bug in Safari and malformed date string.

## 8.0.7

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
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

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
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

- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
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
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 7.0.5

- Updated dependencies
  [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/popper@1.0.0

## 7.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
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

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
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

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
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

## 6.5.1

- Updated dependencies
  [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
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
  - onChange is now called only when the user selects or clears a value. The date passed to onChange
    will always be a valid date

## 6.3.25

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
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
  - AK-5672 - Refactor parseTime by separating logic and concerns into smaller, testable functions.
    Fixes meridiem issues.

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

- [patch] Datetime Picker modal sticks to bottom, if needed
  [0149735](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0149735)

## 6.3.15

- [patch] Added logic to onCalendarChange for impossibly large dates. These dates now get converted
  to the last day of the month, as opposed to default js behaviour. '2018-02-31' now converts to
  '2018-02-28' as opposed to '2018-03-02'
  [4b23458](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b23458)

## 6.3.14

- [patch] Fixing blank state for datetime-picker in Firefox.
  [0e6d838](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e6d838)

## 6.3.13

- [patch] Updated dependencies
  [1a752e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a752e6)
  - @atlaskit/popper@0.3.0

## 6.3.12

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.3.11

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/calendar@7.0.9
  - @atlaskit/field-base@11.0.8
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/select@6.0.2
  - @atlaskit/icon@14.0.0

## 6.3.10

- [patch] Updated dependencies
  [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/select@6.0.0

## 6.3.9

- [patch] Fixes bug on next and prev month navigation.
  [c4770a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4770a0)

## 6.3.8

- [patch] TimePicker not longer throws console error when input cleared
  [dba1bb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dba1bb0)

## 6.3.7

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/select@5.0.17
  - @atlaskit/modal-dialog@7.0.0

## 6.3.6

- [patch] Updated dependencies
  [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/select@5.0.16
  - @atlaskit/webdriver-runner@0.1.0

## 6.3.5

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.3.3

- [patch] Updating datetime-picker and select styles
  [981b96c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/981b96c)

## 6.3.2

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
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

- [patch] Removed some broken styles from the datetime-picker menu
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)

- [none] Updated dependencies
  [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
  - @atlaskit/field-base@11.0.4
- [none] Updated dependencies
  [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/field-base@11.0.4
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
- [none] Updated dependencies
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
  - @atlaskit/field-base@11.0.4
- [patch] Updated dependencies
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/popper@0.2.0
  - @atlaskit/modal-dialog@6.0.8
  - @atlaskit/field-base@11.0.4

## 6.3.0

- [minor] added formatDisplayLabel prop to timePicker and datePicker to enable configuration of the
  label string rendered in the input
  [bce02a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bce02a8)
- [none] Updated dependencies
  [bce02a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bce02a8)

## 6.2.0

- [minor] Added parseDateValue prop to datetimepicker which accepts a function that takes an iso
  datestring, a date value, a time value and a zone value and returns an object containing a
  formatted dateValue, timeValue and zoneValue. The defaultProp uses date-fn's parse and format
  functions under the hood. [6249709](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6249709)
- [none] Updated dependencies
  [6249709](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6249709)

## 6.1.2

- [patch] Replace @atlaskit/layer in date time picker with @atlaskit/popper, changed configuration
  of flipBehaviour modifier to use viewport as the element boundary rather than the window.
  [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
- [patch] Updated datetime-picker to use @atlaskit/popper internally instead of @atlaskit/layer.
  Minor fix to @atlaskit/popper, boundariesElement for flipbehaviour is now viewport and not window.
  [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)
- [patch] Updated dependencies
  [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
  - @atlaskit/popper@0.1.2
- [none] Updated dependencies
  [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)

## 6.1.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
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

- [minor] Added parseInputValue prop to datePicker and timePicker, which allows for the
  customisation of logic around parsing input values into the requisite date object. Also added
  datePickerProps and timePickerProps props to dateTimePicker to expose these two (and later other
  datePicker and timePicker explicit props) at the dateTimePicker level
  [9a75b8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a75b8b)
- [none] Updated dependencies
  [9a75b8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a75b8b)

## 6.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
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

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
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

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/select@5.0.2
  - @atlaskit/modal-dialog@6.0.1
  - @atlaskit/field-text@7.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/calendar@7.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 6.0.0

- [major] Provides analytics for common component interations. See the
  [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for
  more details. If you are using enzyme for testing you will have to use
  [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme).
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
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
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
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

- [patch] Updated dependencies
  [da661fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da661fd)
  - @atlaskit/select@4.5.2

## 5.4.4

- [patch] atlaskit/select now invokes a makeAnimated function to wrap passed in components in
  default animated behaviour. As this invocation returns a new set of react components each time,
  we've also implemented a lightweight component cache using memoize-one and react-fast-compare.
  Additionally updates made to datetime-picker to not instantiate a new component on render
  everytime (for performance reasons as well as to satisfy our caching logic), we now also pass
  relevant state values through the select as props to be ingested by our custom components, instead
  of directly capturing them within lexical scope.
  [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)
- [patch] Updated dependencies
  [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)
  - @atlaskit/select@4.5.0

## 5.4.3

- [patch] Fix disabled dates could be selected with keyboard
  [832b4ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/832b4ab)
- [patch] Updated dependencies
  [832b4ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/832b4ab)

## 5.4.2

- [patch] Fix Calendar width increasing for some months
  [29ffb24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29ffb24)
- [patch] Updated dependencies
  [29ffb24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29ffb24)
  - @atlaskit/calendar@6.2.2

## 5.4.1

- [patch] Calendar chevrons use large versions
  [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)
- [patch] Updated dependencies
  [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)
  - @atlaskit/calendar@6.2.1

## 5.4.0

- [minor] Visual changes to match ADG3 guidelines
  [059d111](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/059d111)
- [minor] Updated dependencies
  [059d111](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/059d111)
  - @atlaskit/calendar@6.2.0

## 5.3.3

- [patch] Updated dependencies
  [b53da28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53da28)
  - @atlaskit/select@4.3.6

## 5.3.2

- [patch] Remove or update \$FlowFixMe
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1
  - @atlaskit/modal-dialog@5.2.6

## 5.3.1

- [patch] TimePicker timesIsEditable invalid values are set to empty strings
  [b710290](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b710290)
- [patch] Updated dependencies
  [b710290](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b710290)

## 5.3.0

- [minor] Backspace now clears input & fixed tab clearing input
  [5783a8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5783a8d)
- [minor] Updated dependencies
  [5783a8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5783a8d)

## 5.2.1

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
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

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
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

- [minor] Fixed DatetimePicker not clearing input on ESC
  [c58f3db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c58f3db)

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
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

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
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

- [patch] Fix DateTimePicker not setting TimePicker value
  [0c073e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c073e6)

## 4.1.0

- [minor] Updated dependencies
  [59ab4a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ab4a6)
  - @atlaskit/select@3.1.0

## 4.0.4

- [patch] Fixes for parsing & formatting of values
  [0c843bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c843bc)

## 4.0.3

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
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

- [patch] Fix create option being displayed when timeIsEditable is false
  [7e99ba3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e99ba3)

## 4.0.1

- [patch] Updated dependencies
  [92ae24e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92ae24e)
  - @atlaskit/select@3.0.1

## 4.0.0

- [major] Updated dependencies
  [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
  - @atlaskit/select@3.0.0

## 3.1.1

- [patch] Updated dependencies
  [7468739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7468739)
  - @atlaskit/select@2.0.2

## 3.1.0

- [minor] Add dateFormat prop to customise the display format of dates
  [3daced9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3daced9)

## 3.0.5

- [patch] Fixed subtle appearance on focus
  [2b1e018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b1e018)

## 3.0.4

- [patch] Better styles for disabled dates
  [866c497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/866c497)

## 3.0.3

- [patch] Added appearance prop to enable subtle (no icon) appearance
  [c10fd5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c10fd5d)

## 3.0.2

- [patch] Remove unused dependencies
  [3cfb3fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cfb3fe)

## 3.0.1

- [patch] Added isInvalid prop to DateTimePicker DatePicker & TimePicker
  [101c306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/101c306)

## 2.0.6

- [patch] Added timeIsEditable prop to enable user created times
  [4695e5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4695e5d)

## 2.0.3

- [patch] Change pickers to use fixed positioning and scroll lock to allow them to break out of
  modals. [d4981fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4981fe)

## 2.0.2

- [patch] Fix datetime picker without a value and defaultValue not working
  [a88aee0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a88aee0)

## 2.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.0.1

- [patch] Fix picker value not being able to be set programatically
  [17c7a15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17c7a15)
- [patch] Fix `isDisabled` not restricting pickers from opening
  [f396f2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f396f2e)

## 1.0.0

- [major] QoL and consistency changes to the calendar and datetime-picker APIs. Added the ability to
  specify a string to the DateTimePicker component. Remove stateless components and make each
  component stateless or stateful using the controlled / uncontrolled pattern. Misc prop renames for
  consistency. [ab21d8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab21d8e)

## 0.7.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 0.7.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 0.6.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 0.6.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 0.6.0

- [minor] Make all internal state able to be controlled or uncontrolled obviating the need for the
  usage of stateless components.
  [3d81d42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d81d42)

## 0.5.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 0.4.0

- [minor] datetime picker will take full width if width is not passes
  [7a9add1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a9add1)

## 0.3.3

- [patch] Update dependencies
  [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 0.3.2

- [patch] calling onchange on hook when datepickers is set to empty state
  [9e288cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e288cc)

## 0.3.0

- [minor] add autoFocus prop to DateTimePicker
  [c8de434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8de434)

## 0.2.0

- [minor] DateTimePicker is now controlled.
  [1318f4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1318f4e)
- [minor] Add DateTimePickerStateless component. Fix issue where DateTimePicker tries to call
  selectField on the dualPicker, which didn't exist. Add ability to have a controlled
  DateTimePicker. [4bd0167](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4bd0167)
- [minor] Add DateTimePickerStateless and refactor DateTimePicker to use that internally, and expose
  DateTimePickerStateless as public API.
  [bbbadf5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbbadf5)

## 0.1.2

- [patch] bump icon dependency
  [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 0.1.0

- [minor] Added TimePicker and DateTimePicker. Improved docs and examples. [4b49f4d](4b49f4d)

## 0.0.5

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)
