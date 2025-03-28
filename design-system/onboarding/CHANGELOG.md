# @atlaskit/onboarding

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- Updated dependencies

## 13.0.3

### Patch Changes

- [#123425](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123425)
  [`9d24a5a33ee9e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d24a5a33ee9e) -
  Add setTimeout to defer state update on cloned target to avoid content shifting issue when
  scrollbars are on the page

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

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

## 12.3.6

### Patch Changes

- Updated dependencies

## 12.3.5

### Patch Changes

- Updated dependencies

## 12.3.4

### Patch Changes

- [#114282](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114282)
  [`ff1c7111d8dd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff1c7111d8dd5) -
  Update dependencies and remove unused internal exports.

## 12.3.3

### Patch Changes

- Updated dependencies

## 12.3.2

### Patch Changes

- Updated dependencies

## 12.3.1

### Patch Changes

- Updated dependencies

## 12.3.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 12.2.3

### Patch Changes

- Updated dependencies

## 12.2.2

### Patch Changes

- [#180301](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180301)
  [`16990dd2ac6e5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16990dd2ac6e5) -
  Internal changes to typography styles. There may be some minor visual changes to align with
  modernized typography styles.

## 12.2.1

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [#176005](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176005)
  [`a7f4659856234`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a7f4659856234) -
  Adds optional render prop API to `SpotlightTarget` component. You can now use a function as the
  children of `SpotlightTarget` and explicitly connect the `targetRef` to your component. This
  provides fine-grained control over which element is cloned and avoids the need for a wrapping div
  element.

### Patch Changes

- [#176005](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176005)
  [`3f689d259d12e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f689d259d12e) -
  GA layering into spotlight

## 12.1.9

### Patch Changes

- Updated dependencies

## 12.1.8

### Patch Changes

- [#167574](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167574)
  [`30792384f2240`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30792384f2240) -
  Removed feature flag to switch useElementBox to the 'polling' ResizeMethod. Now only props should
  be used to control this.

## 12.1.7

### Patch Changes

- [#167181](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167181)
  [`5bc9dc0796474`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5bc9dc0796474) -
  Remove `react-focus-lock-next` dependency

## 12.1.6

### Patch Changes

- [#166087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166087)
  [`3ab7d7da348ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ab7d7da348ab) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 12.1.5

### Patch Changes

- Updated dependencies

## 12.1.4

### Patch Changes

- Updated dependencies

## 12.1.3

### Patch Changes

- [#161637](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161637)
  [`6d8bd88d4f892`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d8bd88d4f892) -
  [ux] Add default id to heading and reference it to spotlight dialog as accessible name if heading
  exists.

## 12.1.2

### Patch Changes

- [#161638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161638)
  [`d2e5e5ce0053d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2e5e5ce0053d) -
  Use new API of layering without UNSAFE prefix

## 12.1.1

### Patch Changes

- [#161203](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161203)
  [`65b24f1c77e69`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/65b24f1c77e69) -
  Make spread props more explicit and types more accurate throughout all components.

## 12.1.0

### Minor Changes

- [#159268](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159268)
  [`960359d2e994c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/960359d2e994c) -
  Updated logic for node-resolver-spotlight-target to remove extra span from document

### Patch Changes

- Updated dependencies

## 12.0.0

### Major Changes

- [#158161](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158161)
  [`1bf871b6178fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1bf871b6178fe) -
  Make spotlight watch for changes to wrapped component

## 11.17.0

### Minor Changes

- [#158301](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158301)
  [`71f646cbd1ba6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/71f646cbd1ba6) -
  [ux] Fixes issue where focus moved beyond spotlight container in screen reader mode. Additionally
  spotlight dialog now supports props to add/reference label to it.

## 11.16.1

### Patch Changes

- Updated dependencies

## 11.16.0

### Minor Changes

- [#154699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154699)
  [`fddbc0849871c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fddbc0849871c) -
  DSP-21285 replacing platform-design-system-dsp-20687-transition-group with
  platform_design_system_team_transition_group_r18

## 11.15.8

### Patch Changes

- Updated dependencies

## 11.15.7

### Patch Changes

- [#153563](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153563)
  [`f737df437eb7a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f737df437eb7a) -
  Support close type in popup to not close all layers
- Updated dependencies

## 11.15.6

### Patch Changes

- [#152429](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152429)
  [`5d414827c3394`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d414827c3394) -
  Removes usages of deprecated CustomThemeButton in favor of the new Button

## 11.15.5

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`a25693d44cd74`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a25693d44cd74) -
  Updated dependencies

## 11.15.4

### Patch Changes

- Updated dependencies

## 11.15.3

### Patch Changes

- [#146891](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146891)
  [`1946e3bf8c6c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1946e3bf8c6c9) -
  Internal change only: update feature flag names.

## 11.15.2

### Patch Changes

- [#146525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146525)
  [`2ec1031034a2b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ec1031034a2b) -
  Integrate layering into spotlight

## 11.15.1

### Patch Changes

- Updated dependencies

## 11.15.0

### Minor Changes

- [#144362](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144362)
  [`73d292c184200`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73d292c184200) -
  [ux] Fix for bug DSP-21004. Update cloned content on mutation

## 11.14.0

### Minor Changes

- [`2d1da097bd763`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d1da097bd763) -
  DSP-20687 removing usage of findDOMNode in react-transition-group behind ff

## 11.13.0

### Minor Changes

- [#135285](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135285)
  [`5129525d797c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5129525d797c8) -
  DSP-20262 react-node-resolver removal behind ff

## 11.12.3

### Patch Changes

- [#134051](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134051)
  [`85b8f6cd01de0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85b8f6cd01de0) -
  Removes redundant usage of analytics-next from the spotlight dialog. No functional or behavioural
  changes

## 11.12.2

### Patch Changes

- Updated dependencies

## 11.12.1

### Patch Changes

- Updated dependencies

## 11.12.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 11.11.1

### Patch Changes

- Updated dependencies

## 11.11.0

### Minor Changes

- [`8b8090800a35d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b8090800a35d) -
  Bump peer dependency for react-dom to include version 17 and 18.

### Patch Changes

- Updated dependencies

## 11.10.5

### Patch Changes

- Updated dependencies

## 11.10.4

### Patch Changes

- [#125754](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125754)
  [`aa57c66a5b798`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aa57c66a5b798) -
  Migrating ipm-choreographer out of post-office and into platform. Fixing tests and lint checks for
  ipm-choreographer, and adding a bugfix for Engagekit. Also, a minor change to @atlaskit/onboarding
  to export the SpotlightProps interface.

## 11.10.3

### Patch Changes

- Updated dependencies

## 11.10.2

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 11.10.1

### Patch Changes

- Updated dependencies

## 11.10.0

### Minor Changes

- [#117762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117762)
  [`e7423e403d743`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7423e403d743) -
  [ux] Add `onBlanketClicked` prop to `SpotlightManager`.

## 11.9.0

### Minor Changes

- [`393f732d5423f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/393f732d5423f) -
  [ux] Adding an optional prop to Spotlight, so it can used for scrollIntoView 'block' parameter.
  This is to fix the unnecessary scroll of the non-portalled popup targets.

### Patch Changes

- Updated dependencies

## 11.8.2

### Patch Changes

- Updated dependencies

## 11.8.1

### Patch Changes

- Updated dependencies

## 11.8.0

### Minor Changes

- [#114901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114901)
  [`61f6a496bcddf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/61f6a496bcddf) -
  Added a possible fix (behind a feature flag) for a positioning bug with the Spotlight component.

## 11.7.2

### Patch Changes

- Updated dependencies

## 11.7.1

### Patch Changes

- Updated dependencies

## 11.7.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 11.6.0

### Minor Changes

- [#109747](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109747)
  [`abd5924f09fbd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/abd5924f09fbd) -
  Internal change to manually set Heading colour to avoid potential context issues. This should
  resolve issues where the Heading colour may have been incorrectly set.

## 11.5.8

### Patch Changes

- Updated dependencies

## 11.5.7

### Patch Changes

- Updated dependencies

## 11.5.6

### Patch Changes

- [#100605](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100605)
  [`f12f3d4764e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12f3d4764e2) -
  Reverts an attempted bug fix in 11.5.2 that re-added a theme provider to spotlight card to prevent
  custom theme buttons inheriting other themes

## 11.5.5

### Patch Changes

- [#97580](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97580)
  [`e07d5ea81fc8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e07d5ea81fc8) -
  Update internal usage of typography heading
- Updated dependencies

## 11.5.4

### Patch Changes

- [#96898](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96898)
  [`255626d6dcd8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/255626d6dcd8) -
  [ux] Remove zIndex for legacy browsers
- Updated dependencies

## 11.5.3

### Patch Changes

- Updated dependencies

## 11.5.2

### Patch Changes

- [#96747](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96747)
  [`3fdc807b70fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3fdc807b70fb) -
  Re-add custom theme wrapper to prevent buttons accidentally inheriting themes. To be removed when
  component is updated to use new buttons.

## 11.5.1

### Patch Changes

- [#95529](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95529)
  [`48e3bdade8f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48e3bdade8f8) -
  Internal changes.

## 11.5.0

### Minor Changes

- [#93698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93698)
  [`36175212c2f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36175212c2f4) -
  Add support for React 18 in non-strict mode.

## 11.4.0

### Minor Changes

- [#94745](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94745)
  [`a0e6d0465080`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a0e6d0465080) -
  [ux] Internal changes to typography + small visual change to background color.

### Patch Changes

- Updated dependencies

## 11.3.2

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 11.3.1

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 11.3.0

### Minor Changes

- [#84838](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84838)
  [`e3dc0b4099fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e3dc0b4099fe) -
  [ux] Now the pulsing animations in both the standard Spotlight and the dedicated Pulse component
  respect `prefers-reduced-motion` user preferences. If a user sets their system preferences to
  reduce motion, instead of a pulsing animation we will show a static 'discovery' outline.

## 11.2.7

### Patch Changes

- [#85076](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85076)
  [`3032fb024382`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3032fb024382) -
  Associates the heading prop with the accessible label for the benefits modal.

## 11.2.6

### Patch Changes

- [#83188](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83188)
  [`cd5d06cd3329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd5d06cd3329) -
  Minor adjustments to improve compatibility with React 18

## 11.2.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 11.2.4

### Patch Changes

- Updated dependencies

## 11.2.3

### Patch Changes

- [#71144](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71144)
  [`d8feaa592375`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8feaa592375) -
  This package has been added to the Jira push model.

## 11.2.2

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 11.2.1

### Patch Changes

- [#67032](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67032)
  [`038e62a39d23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/038e62a39d23) -
  [ux] Ensure spotlight dialog always uses heading level 2. This will eventually become heading
  level 1 once the dialog becomes a true modal.

## 11.2.0

### Minor Changes

- [#64059](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64059)
  [`d69cb4f14309`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d69cb4f14309) -
  [ux] Adds `headingLevel` to the SpotlightCard component. This will allow the usage of the correct
  heading level depending on context.

## 11.1.3

### Patch Changes

- Updated dependencies

## 11.1.2

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 11.1.1

### Patch Changes

- [#58458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58458)
  [`536478cdcf0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/536478cdcf0b) -
  Tweaked ModalBody left and right padding to better align to the spacing scale.

## 11.1.0

### Minor Changes

- [#58176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58176)
  [`32032c9c1289`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32032c9c1289) -
  [ux] Fix spotlight padding and font style issues on tabs.

## 11.0.0

### Major Changes

- [#54210](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/54210)
  [`524ec7b6505d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524ec7b6505d) -
  Removed all remaining legacy theming logic from the Onboarding component.

## 10.8.12

### Patch Changes

- [#43073](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43073)
  [`2d760e89b53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d760e89b53) -
  headingId is the id of heading in spotlightCard, which is used as the value of aria-labelledby
  attribute of `<div>` element containing the modal dialog heading for screen reader recognising the
  dialog

## 10.8.11

### Patch Changes

- [#41764](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41764)
  [`77fd34690e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77fd34690e9) - Add
  missing dependencies to fix typechecking under local consumption

## 10.8.10

### Patch Changes

- [#41644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41644)
  [`35821e3b157`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35821e3b157) - Wrap
  ReactElement in React.Fragment to fix typechecking under local consumption

## 10.8.9

### Patch Changes

- [#40647](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40647)
  [`0de92f17021`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0de92f17021) - Bump
  react-focus-lock to latest version

## 10.8.8

### Patch Changes

- [#39128](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39128)
  [`3c114ea4257`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c114ea4257) - Update
  type definitions to conform to inherited changes from `@types/react@16.14.15`.

## 10.8.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 10.8.6

### Patch Changes

- [#38215](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38215)
  [`36e3e86da5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36e3e86da5d) -
  SpotlightCard width prop now accepts either a number or the string `'100%'` and refactors how our
  range of 160px – 600px works via css `min-width` and `max-width` instead of raw math.

## 10.8.5

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 10.8.4

### Patch Changes

- [#35716](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35716)
  [`df6aac8c5a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df6aac8c5a6) - When
  providing an image path to `SpotlightCard`, there is no longer an additional space that appears
  between the image and content padding.
- Updated dependencies

## 10.8.3

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 10.8.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 10.8.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 10.8.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 10.7.2

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 10.7.1

### Patch Changes

- [#32294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32294)
  [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages
  of `process` are now guarded by a `typeof` check.

## 10.7.0

### Minor Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299)
  [`e3fa4437cf5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3fa4437cf5) - [ux]
  Updates focus appearance of components using buttons and custom buttons. These states now use an
  offset outline which is consistent with other applications of focus in Atlassian components.

### Patch Changes

- Updated dependencies

## 10.6.12

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.
- Updated dependencies

## 10.6.11

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125)
  [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) -
  Introduce shape tokens to some packages.

## 10.6.10

### Patch Changes

- Updated dependencies

## 10.6.9

### Patch Changes

- Updated dependencies

## 10.6.8

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 10.6.7

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 10.6.6

### Patch Changes

- [#28159](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28159)
  [`716af1d3387`](https://bitbucket.org/atlassian/atlassian-frontend/commits/716af1d3387) - Bump
  @atlaskit/heading from 1.0.0 to 1.0.1 to avoid resolving to poison dependency version

## 10.6.5

### Patch Changes

- Updated dependencies

## 10.6.4

### Patch Changes

- Updated dependencies

## 10.6.3

### Patch Changes

- Updated dependencies

## 10.6.2

### Patch Changes

- Updated dependencies

## 10.6.1

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 10.6.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`e0015d4e201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0015d4e201) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- [`05efb20bca8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05efb20bca8) - Fixes an
  issue with the Spotlight target element height when this is determined by a parent element.
- Updated dependencies

## 10.5.4

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 10.5.3

### Patch Changes

- [#25075](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25075)
  [`7ca0e5a0c31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ca0e5a0c31) - Update
  "subtle" action in Onboarding component to use correct tokens
- [#25074](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25074)
  [`0e5102ee5ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e5102ee5ab) - Update
  "subtle-link" action in Onboarding component to use correct tokens

## 10.5.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 10.5.1

### Patch Changes

- [#24237](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24237)
  [`994508770f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/994508770f7) - Bumps
  the `@atlaskit/heading` dependency forward to a higher minimum version.

## 10.5.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`0c0a8c64d54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c0a8c64d54) - Removes
  internal usage of the deprecated theme prop.

### Patch Changes

- [`a3241bd63a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3241bd63a3) - Updates
  jsdoc for all exported outputs of onboarding.
- Updated dependencies

## 10.4.2

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 10.4.1

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`e4b612d1c48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4b612d1c48) - Internal
  migration to bind-event-listener for safer DOM Event cleanup

## 10.4.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`3124aa6ae24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3124aa6ae24) - The
  onboarding package now exports a `ModalTransition` component for use with the benefits modal. This
  resolves an issue that can occur when using `ModalTransition` from a different version of
  `@atlaskit/modal-dialog` than the one that Onboarding is bringing in.

### Patch Changes

- [`e7ad64befa5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ad64befa5) - [ux]
  Updated input tokens within `@atlaskit/onboarding`.

## 10.3.11

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 10.3.10

### Patch Changes

- Updated dependencies

## 10.3.9

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 10.3.8

### Patch Changes

- Updated dependencies

## 10.3.7

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`ac9343c3ed4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac9343c3ed4) - Replaces
  usage of deprecated design tokens. No visual or functional changes
- [`dcd92130cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcd92130cc4) - Migrate
  deleted background accent tokens to replacements
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 10.3.6

### Patch Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`bd38851d12f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd38851d12f) - [ux]
  Fixed the missing Spotlight button border by updating the token usages.
- Updated dependencies

## 10.3.5

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal
  code change turning on a new linting rule.

## 10.3.4

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 10.3.3

### Patch Changes

- Updated dependencies

## 10.3.2

### Patch Changes

- [#17672](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17672)
  [`9a5740d1ec3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a5740d1ec3) - [ux] The
  `pulse` prop now works correctly for `<SpotlightPulse />`. Previously, it was applying the pulse
  to the `SpotlightPulse` target regardless of the `pulse` value. Now it checks the value of `pulse`
  and applies the animation accordingly.

## 10.3.1

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`3fced6aa641`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fced6aa641) - Bumped
  `react-focus-lock` to version `^2.2.1`.
- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 10.3.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`50081f13de7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50081f13de7) -
  Instrumented `@atlaskit/onboarding` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 10.2.6

### Patch Changes

- [#15694](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15694)
  [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal
  upgrade of memoize-one to 6.0.0

## 10.2.5

### Patch Changes

- [#15632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15632)
  [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds
  explicit type to button usages components.

## 10.2.4

### Patch Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`d77725f926f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d77725f926f) - Replaced
  usage of `styled-components` with `@emotion/core`.
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal
  changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 10.2.3

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`115c009e2ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/115c009e2ef) - Refactor
  to use new modal dialog API.
- Updated dependencies

## 10.2.2

### Patch Changes

- Updated dependencies

## 10.2.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 10.2.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`1b1cb960767`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b1cb960767) - The
  `headingAfterElement` prop has been added to the spotlight component which can be used to add a
  supplementary action.

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.

## 10.1.9

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 10.1.8

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 10.1.7

### Patch Changes

- Updated dependencies

## 10.1.6

### Patch Changes

- [#5164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5164)
  [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo
  analytics-next file restructure to allow external ts definitions to continue working

## 10.1.5

### Patch Changes

- Updated dependencies

## 10.1.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 10.1.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 10.1.2

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 10.1.1

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`5d6c324306`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d6c324306) - Expose
  useSpotlight hook which returns #isTargetRendered function. We can use this function to check
  whether target is rendered or not.

### Patch Changes

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

## 9.2.0

### Minor Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`2c8d296246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c8d296246) - Adds
  support for the `subtle` button appearance in the Spotlight dialog theme to align more closely
  with ADG guidelines. Also visually re-orders action items so that the primary item in the actions
  list appears on the right hand side, but still recieves focus first.

## 9.1.10

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 9.1.9

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 9.1.8

### Patch Changes

- Updated dependencies

## 9.1.7

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`6faa22760b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faa22760b) - Add
  modalButtonTheme, spotlightButtonTheme,- Updated dependencies

## 9.1.6

### Patch Changes

- [patch][d150e2d7f6](https://bitbucket.org/atlassian/atlassian-frontend/commits/d150e2d7f6):

  Change imports to comply with Atlassian conventions- Updated dependencies
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
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/webdriver-runner@0.3.4

## 9.1.5

### Patch Changes

- [patch][0389a42cc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/0389a42cc5):

  Positioning fix for onboarding modals without css reset- Updated dependencies
  [603413f530](https://bitbucket.org/atlassian/atlassian-frontend/commits/603413f530):

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
  - @atlaskit/portal@3.1.7
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 9.1.4

### Patch Changes

- [patch][4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

  Upgraded react-scrolllock package-
  [patch][923c738553](https://bitbucket.org/atlassian/atlassian-frontend/commits/923c738553):

  Fixes a rendering bug where a spotlight would not be updated- Updated dependencies
  [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

- Updated dependencies
  [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 9.1.3

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
  - @atlaskit/button@13.3.9
  - @atlaskit/modal-dialog@10.5.4

## 9.1.2

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/modal-dialog@10.5.3

## 9.1.1

### Patch Changes

- [patch][728f19e563](https://bitbucket.org/atlassian/atlassian-frontend/commits/728f19e563):

  Fixes a rendering bug where a spotlight would not be updated

## 9.1.0

### Minor Changes

- [minor][aa70b257d3](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa70b257d3):

  Introduce new prop `experimental_shouldShowPrimaryButtonOnRight` which positions the primary
  button in a onboarding modal-dialog on the right (ADG approved).

## 9.0.10

### Patch Changes

- [patch][b0d1348c83](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0d1348c83):

  Change the type definition for interface to extend ButtonProps-
  [patch][62dc057049](https://bitbucket.org/atlassian/atlassian-frontend/commits/62dc057049):

  Allowing benefits modal buttons to stack vertically rather than overflow the modal when buttons
  contain lengthy text.- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):

  - @atlaskit/icon@20.0.2

## 9.0.9

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/popper@3.1.11
  - @atlaskit/portal@3.1.6
  - @atlaskit/progress-indicator@7.0.13
  - @atlaskit/theme@9.5.1

## 9.0.8

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 9.0.7

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes Action onClick return type to void- Updated dependencies
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
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/progress-indicator@7.0.12
  - @atlaskit/popper@3.1.8

## 9.0.6

### Patch Changes

- [patch][532f7c03fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/532f7c03fd):

  Fixes spotlight taking a while to animate into view.-
  [patch][864f4891dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/864f4891dc):

  Fixes spotlight target not updating its position when resizing the viewport.- Updated dependencies
  [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

  - @atlaskit/analytics-next@6.3.2

## 9.0.5

### Patch Changes

- [patch][1ed27f5f85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ed27f5f85):

  Adds prop types for Header / Footer render props.

## 9.0.4

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 9.0.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 9.0.1

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 9.0.0

### Major Changes

- [major][a75dfaad67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a75dfaad67):

  @atlaskit/onboarding has been converted to Typescript. Typescript consumers will now get static
  type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.17

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 8.0.16

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 8.0.15

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 8.0.14

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full
  typescript support so it is recommended that typescript consumers use it also.

## 8.0.13

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 8.0.12

- Updated dependencies
  [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/progress-indicator@7.0.3
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2
  - @atlaskit/modal-dialog@10.1.3

## 8.0.11

### Patch Changes

- [patch][678b2407a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/678b2407a1):

  Fix spotlight highlight issue when the offset parent has "fixed" position.

## 8.0.10

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Spotlight target highlight is out of position if the the target element or any of its parent has a
  "fixed" position. Fix the issue by checking for fixed position before setting the position values
  for target highlight. Adding a condition to check if the component are referenced in tests running
  in CI. It reduces the noise and help reading the CI log.

## 8.0.9

- BROKEN RELEASE. DO NOT USE.

### Patch Changes

- [patch][2e3d9d3e25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e3d9d3e25):

## 8.0.8

- Updated dependencies
  [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/popper@3.0.0

## 8.0.7

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.6

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/portal@3.0.7
  - @atlaskit/icon@19.0.0

## 8.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.4

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/portal@3.0.3
  - @atlaskit/icon@18.0.0

## 8.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 8.0.2

- [patch][c3ab82ed42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3ab82ed42):

  - Bump react-focus-lock to latest 1.19.1, it will fix a bug with document.activeElement

- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies
  [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/icon@17.1.2
  - @atlaskit/portal@3.0.0
  - @atlaskit/modal-dialog@10.0.0

## 8.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 7.0.5

- Updated dependencies
  [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
- Updated dependencies
  [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/modal-dialog@8.0.9
  - @atlaskit/portal@1.0.0
  - @atlaskit/popper@1.0.0

## 7.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/popper@0.4.3
  - @atlaskit/progress-indicator@6.0.4
  - @atlaskit/theme@8.1.7

## 7.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/popper@0.4.2
  - @atlaskit/portal@0.3.1
  - @atlaskit/progress-indicator@6.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 7.0.2

- Updated dependencies
  [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/modal-dialog@8.0.4
  - @atlaskit/portal@0.3.0

## 7.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/popper@0.4.1
  - @atlaskit/portal@0.2.1
  - @atlaskit/progress-indicator@6.0.1
  - @atlaskit/theme@8.0.1
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

## 6.2.0

- [minor][eb81a2de65](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb81a2de65):

  - Spotlight footer and header props will now only accept React components

## 6.1.17

- [patch][d669123bbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d669123bbd):

  - Enable auto focus by rendering components only after the portal has been attached to DOM.

- Updated dependencies
  [27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):
  - @atlaskit/modal-dialog@7.2.2
  - @atlaskit/portal@0.1.0

## 6.1.16

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/portal@0.0.18
  - @atlaskit/icon@16.0.0

## 6.1.15

- [patch][6855bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6855bec):

  - Updated internal use of ModalDialog to use new composition API

## 6.1.14

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/popper@0.3.6
  - @atlaskit/portal@0.0.17
  - @atlaskit/progress-indicator@5.0.11
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.1.13

- [patch][e59562a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e59562a):

  - Fix for visual bug in SpotlightCard component

## 6.1.12

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and
    make theming simpler. Update all dependant components.

## 6.1.11

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/portal@0.0.16
  - @atlaskit/icon@15.0.0

## 6.1.10

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/popper@0.3.2
  - @atlaskit/portal@0.0.15
  - @atlaskit/progress-indicator@5.0.9
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 6.1.9

- [patch][e151c1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151c1a):

  - Removes dependency on @atlaskit/layer-manager

  As of component versions:

  - \`@atlaskit/modal-dialog@7.0.0\`
  - \`@atlaskit/tooltip@12.0.2\`
  - \`@atlaskit/flag@9.0.6\`
  - \`@atlaskit/onboarding@6.0.0\`

  No component requires \`LayerManager\` to layer correctly.

  You can safely remove this dependency and stop rendering \`LayerManager\` in your apps.

## 6.1.8

- Updated dependencies [1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - @atlaskit/modal-dialog@7.0.9
  - @atlaskit/portal@0.0.14

## 6.1.7

- Updated dependencies [3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):
  - @atlaskit/modal-dialog@7.0.8
  - @atlaskit/portal@0.0.13

## 6.1.6

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow
    to type check properly

## 6.1.5

- [patch][b332c91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b332c91):

  - upgrades verison of react-scrolllock to SSR safe version

## 6.1.4

- [patch][9f91ea0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f91ea0):

  - Adds visual regression test for ie11

## 6.1.3

- [patch][4872a19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4872a19):

  - actions prop officially accepts Node type for text. Adds optional key to action type.

  Previously if you were using the actions prop like:

  ```jsx
  <Spotlight
  	actions={[
  		{
  			text: <FormattedMessage defaultMessage="Next" />,
  		},
  		{
  			text: <FormattedMessage defaultMessage="Skip" />,
  		},
  	]}
  >
  	Look at this feature
  </Spotlight>
  ```

  React would complain about duplicate keys. Now you can pass in a key for the action like:

  ```jsx
  <Spotlight
  	actions={[
  		{
  			text: <FormattedMessage defaultMessage="Next" />,
  			key: 'next',
  		},
  		{
  			text: <FormattedMessage defaultMessage="Skip" />,
  			key: 'skip',
  		},
  	]}
  >
  	Look at this feature
  </Spotlight>
  ```

## 6.1.2

- [patch][2482922](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2482922" d):

  - Remove unecessary alt text for modal image to avoid redundancy for screenreaders

## 6.1.1

- [patch][0c7a57d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c7a57d" d):

  - Fixes layering of blanket and spotlight components in IE11 and Edge

## 6.1.0

- [minor] Creates new SpotlightCard component. Internal refactor of Spotlight components. Spotlight
  state managed through context rather than local variable.
  [f9ba552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9ba552)

## 6.0.4

- [patch] Updated dependencies
  [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/modal-dialog@7.0.4
  - @atlaskit/portal@0.0.12

## 6.0.3

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.2

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/layer-manager@5.0.13
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 6.0.1

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/layer-manager@5.0.12
  - @atlaskit/modal-dialog@7.0.0

## 6.0.0

- [major] Add SpotlightTransition and require it wraps Spotlight to get both transitions and
  conditional rendering with proper transitions on unmount.
  [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [patch] Upgrades Spotlight component to use @atlaskit/portal package
  [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
- [none] Updated dependencies
  [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8
  - @atlaskit/layer-manager@5.0.11

## 5.1.9

- [patch] Updated dependencies
  [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/layer-manager@5.0.10
  - @atlaskit/webdriver-runner@0.1.0

## 5.1.8

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 5.1.6

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 5.1.5

- [patch] Updated dependencies
  [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)
  - @atlaskit/layer@5.0.5

## 5.1.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/icon@13.2.4

## 5.1.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/modal-dialog@6.0.5

## 5.1.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/layer@5.0.2
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 5.1.1

- [patch] onboarding spotlight: fix margin affecting target position
  [0e33c70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e33c70)
- [none] Updated dependencies
  [0e33c70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e33c70)

## 5.1.0

- [minor] round corners for onboarding modal image
  [785e99a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/785e99a)
- [none] Updated dependencies
  [785e99a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/785e99a)

## 5.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/modal-dialog@6.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

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
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 4.1.7

- [patch] Remove or update \$FlowFixMe
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1
  - @atlaskit/modal-dialog@5.2.6

## 4.1.6

- [patch] Fixes positioning issue when target is relatively positioned
  [11e8465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11e8465)
- [none] Updated dependencies
  [11e8465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11e8465)

## 4.1.5

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 4.1.4

- [patch] Replaces implementation of ScrollLock with
  [react-scrolllock](https://github.com/jossmac/react-scrolllock). Deprecates ScrollLock export in
  @atlaskit/layer-manager. [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
- [none] Updated dependencies
  [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
  - @atlaskit/layer-manager@4.3.1
  - @atlaskit/layer@4.1.1
  - @atlaskit/modal-dialog@5.2.4

## 4.1.3

- [patch] Adds autoFocus prop to FocusLock. Fixes scrolling bug in onboarding.
  [c9d606b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9d606b)
- [none] Updated dependencies
  [c9d606b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9d606b)
  - @atlaskit/layer-manager@4.3.0
- Fixes scrolling problem when multiple spotlights are off-screen.

## 4.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 4.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/layer-manager@4.1.1
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/layer@4.0.2

## 4.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/layer@4.0.1
  - @atlaskit/button@8.1.0

## 4.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 3.1.3

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1

## 3.1.0

- [minor] support new property "targetNode" on spotlight component
  [48397b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48397b6)

## 3.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.4.2

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.4.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 2.3.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.3.2

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 2.3.0

- [minor] Replace scrollBy and add websdriver test
  [66e7a56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66e7a56)

## 2.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak
  mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 2.2.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 2.2.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.1.0

- [minor] add subtle-link button appearance theme to spotlight
  [24d1fa2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24d1fa2)

## 2.0.8

- [patch] Update dependencies
  [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 2.0.7

- [patch] more robust implementation of FocusLock
  [64dd1d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd1d8)

## 2.0.6

- [patch] Refactor autoscroll logic in withScrollMeasurement HOC
  [2e90a74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e90a74)

## 2.0.4

- [patch] Fix version ranges on button/layer-manager
  [7e7a211](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e7a211)
- [patch] update flow dep, fix flow errors
  [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)
- [patch] Update Onboarding's Button usage to implement theming method.
  [5e6da46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e6da46)

## 2.0.2

- [patch] Fix target regression from migration
  [fa6f973](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f973)
- [patch] Updated docs to reflect the addition of the blanketIsTinted prop to SpotLightManager
  [11bb25f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11bb25f)

## 1.0.0-beta (2017-09-19)

- feature; initial release
