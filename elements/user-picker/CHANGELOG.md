# @atlaskit/user-picker

## 11.4.0

### Minor Changes

- [#185784](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185784)
  [`7b6c046532f88`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b6c046532f88) -
  remove fg support_group_by_type_for_user_picker

### Patch Changes

- Updated dependencies

## 11.3.3

### Patch Changes

- Updated dependencies

## 11.3.2

### Patch Changes

- [#178290](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178290)
  [`24b46e59f20ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24b46e59f20ba) -
  Clean up feature gate user-picker-show-clear-indicator
- Updated dependencies

## 11.3.1

### Patch Changes

- Updated dependencies

## 11.3.0

### Minor Changes

- [#175242](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175242)
  [`f01b0e8dbc8ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f01b0e8dbc8ba) -
  [ux] add a new props: groupByTypeOrder to allow group the options by type

### Patch Changes

- Updated dependencies

## 11.2.3

### Patch Changes

- Updated dependencies

## 11.2.2

### Patch Changes

- Updated dependencies

## 11.2.1

### Patch Changes

- Updated dependencies

## 11.2.0

### Minor Changes

- [#157545](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157545)
  [`77c40a08f071f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77c40a08f071f) -
  [ux] give keyboard focus to invalid selects in the invite people form

### Patch Changes

- Updated dependencies

## 11.1.2

### Patch Changes

- [#154600](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154600)
  [`0b06dde976fe0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b06dde976fe0) -
  Internal updates to logo component usage
- Updated dependencies

## 11.1.1

### Patch Changes

- [#158576](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158576)
  [`2cc60c8e1d9c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2cc60c8e1d9c9) -
  NO-ISSUE Clean up FG pass-aria-describedby-to-baseuserpicker

## 11.1.0

### Minor Changes

- [#157101](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157101)
  [`22968df0284f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22968df0284f0) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

## 11.0.14

### Patch Changes

- [#155339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155339)
  [`4e0fe53072701`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e0fe53072701) -
  Clean up verified-team-in-user-picker

## 11.0.13

### Patch Changes

- Updated dependencies

## 11.0.12

### Patch Changes

- Updated dependencies

## 11.0.11

### Patch Changes

- Updated dependencies

## 11.0.10

### Patch Changes

- [#142842](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142842)
  [`63265d6000c11`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63265d6000c11) -
  Internal change to migrate to Compiled CSS-in-JS styling.

## 11.0.9

### Patch Changes

- [#137751](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137751)
  [`bffaf88f6c035`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bffaf88f6c035) -
  Add support for a clear indicator

## 11.0.8

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 11.0.7

### Patch Changes

- Updated dependencies

## 11.0.6

### Patch Changes

- Updated dependencies

## 11.0.5

### Patch Changes

- [#121751](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121751)
  [`fa503e3c2f7af`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa503e3c2f7af) -
  [ux] Update avatar size on user picker
- Updated dependencies

## 11.0.4

### Patch Changes

- [#119746](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119746)
  [`e669148287cf3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e669148287cf3) -
  Internal refactor for compatibility with the latest version of @atlaskit/avatar. The UI remains
  consistent.
- Updated dependencies

## 11.0.3

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 11.0.2

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- Updated dependencies

## 11.0.0

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

## 10.31.4

### Patch Changes

- Updated dependencies

## 10.31.3

### Patch Changes

- [#114038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114038)
  [`e279ab8b8f44d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e279ab8b8f44d) -
  A11Y-7985 Pass aria-describedby to fix instruction not associated with form field issue

## 10.31.2

### Patch Changes

- Updated dependencies

## 10.31.1

### Patch Changes

- Updated dependencies

## 10.31.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 10.30.1

### Patch Changes

- Updated dependencies

## 10.30.0

### Minor Changes

- [#101739](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101739)
  [`b9f6cdeb8cfcb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9f6cdeb8cfcb) -
  Add support for React 18

## 10.29.2

### Patch Changes

- Updated dependencies

## 10.29.1

### Patch Changes

- [#181817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181817)
  [`c75a0ced77056`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c75a0ced77056) -
  Internal changes to typography.

## 10.29.0

### Minor Changes

- [#179984](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179984)
  [`e232332e5f674`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e232332e5f674) -
  [ux] Remove verified icon size

### Patch Changes

- Updated dependencies

## 10.28.1

### Patch Changes

- [#178696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178696)
  [`268232b3ae8c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/268232b3ae8c6) -
  added rendering verified team icon to default-result-renderer if search result includes isVerified

## 10.28.0

### Minor Changes

- [#178473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178473)
  [`5aa723c66cf92`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5aa723c66cf92) -
  [ux] Typography uplift, use Atlassian Design System font for secondary text in Avatar dropdown
  options

## 10.27.8

### Patch Changes

- [#177875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177875)
  [`d0c3d27216b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0c3d27216b7c) -
  Clean up props for select new improvement on theme and customized components
- Updated dependencies

## 10.27.7

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 10.27.6

### Patch Changes

- Updated dependencies

## 10.27.5

### Patch Changes

- [#175903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175903)
  [`2ca189c92ad1e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ca189c92ad1e) -
  Typography uplift, use ADS tokens

## 10.27.4

### Patch Changes

- Updated dependencies

## 10.27.3

### Patch Changes

- Updated dependencies

## 10.27.2

### Patch Changes

- [#168041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168041)
  [`87c8f13c37183`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87c8f13c37183) -
  Migrate text elements to DS components
- Updated dependencies

## 10.27.1

### Patch Changes

- [#166035](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166035)
  [`2c941c7061475`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c941c7061475) -
  Update documenation to point to the Search Experiences team

## 10.27.0

### Minor Changes

- [#161683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161683)
  [`f3f374290027a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3f374290027a) -
  Adding en-zz locale support to elements package

## 10.26.5

### Patch Changes

- [#163815](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163815)
  [`c4cc01fa62da2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c4cc01fa62da2) -
  Typography uplift work

## 10.26.4

### Patch Changes

- Updated dependencies

## 10.26.3

### Patch Changes

- [#156360](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156360)
  [`eef99f4bf497c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eef99f4bf497c) -
  A11Y-7739 Add aria-hidden true to decorative images

## 10.26.2

### Patch Changes

- [#156181](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156181)
  [`48acf4f55ef4a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48acf4f55ef4a) -
  Export isGroup & use it in share analytics

## 10.26.1

### Patch Changes

- Updated dependencies

## 10.26.0

### Minor Changes

- [#153007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153007)
  [`1c28c3db19101`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c28c3db19101) -
  Show verified icon for teams in user picker

### Patch Changes

- Updated dependencies

## 10.25.0

### Minor Changes

- [#148732](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148732)
  [`9391607579cb6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9391607579cb6) -
  UserPicker component updated to accept isInvalid prop, and display invalid state styles when the
  prop is set to true

### Patch Changes

- Updated dependencies

## 10.24.2

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select
- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select
- Updated dependencies

## 10.24.1

### Patch Changes

- Updated dependencies

## 10.24.0

### Minor Changes

- [#144209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144209)
  [`8a016767c9e26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a016767c9e26) -
  [ux] Enable new icons behind a feature flag.

## 10.23.0

### Minor Changes

- [#136484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136484)
  [`b41c0d44e7b21`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b41c0d44e7b21) -
  [ux] Allow supplying custom byline to Group items

## 10.22.6

### Patch Changes

- Updated dependencies

## 10.22.5

### Patch Changes

- Updated dependencies

## 10.22.4

### Patch Changes

- Updated dependencies

## 10.22.3

### Patch Changes

- Updated dependencies

## 10.22.2

### Patch Changes

- [#123925](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123925)
  [`d6234c59408c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d6234c59408c8) -
  Internal change to typography component APIs resulting in very minor letter spacing changes.

## 10.22.1

### Patch Changes

- Updated dependencies

## 10.22.0

### Minor Changes

- [`36527d29b1c80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36527d29b1c80) -
  [ux] Update UserPicker border colour to satisfy accessibility contrast standards

## 10.21.4

### Patch Changes

- Updated dependencies

## 10.21.3

### Patch Changes

- Updated dependencies

## 10.21.2

### Patch Changes

- [#114764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114764)
  [`ae20dac6e31c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae20dac6e31c4) -
  Bump packages to use react-beautiful-dnd@12.2.0

## 10.21.1

### Patch Changes

- Updated dependencies

## 10.21.0

### Minor Changes

- [#104824](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104824)
  [`10443be28cedb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10443be28cedb) -
  converting tagged template syntax to object syntax for remanining styles from DSP-17626

### Patch Changes

- Updated dependencies

## 10.20.4

### Patch Changes

- [#108084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108084)
  [`54cc1daf07c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/54cc1daf07c9) -
  Clean up unused feature of aria-activedescendant

## 10.20.3

### Patch Changes

- Updated dependencies

## 10.20.2

### Patch Changes

- [#101781](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101781)
  [`ea3386009a3f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea3386009a3f) -
  A bug has been fixed where aria-activedescendant on the input elemnt would be try to set to a menu
  list item before the menu was rendered.
- Updated dependencies

## 10.20.1

### Patch Changes

- Updated dependencies

## 10.20.0

### Minor Changes

- [#94675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94675)
  [`5d9e1dccacca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d9e1dccacca) -
  [ux] Update input border color token to meet 3:1 color contrast ratioLight theme:
  color.border.input: #091E4224 → #8590A2Dark mode: color.border.input: #A6C5E229 → #738496

### Patch Changes

- Updated dependencies

## 10.19.12

### Patch Changes

- [#95567](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95567)
  [`cae88cc191c5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cae88cc191c5) -
  Open userpicker on first click when UNSAFE_hasDraggableParentComponent is enabled

## 10.19.11

### Patch Changes

- [#91429](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91429)
  [`3de462db1b3f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3de462db1b3f) -
  Minor changes to Typescript types to improve compatibility with React 18

## 10.19.10

### Patch Changes

- [#85437](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85437)
  [`b3bed8af54a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3bed8af54a0) -
  Remove duplicate hidden name announcement in single-value picker
- Updated dependencies

## 10.19.9

### Patch Changes

- [#85640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85640)
  [`da6c4e34a2a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da6c4e34a2a0) -
  [ux] Removed name prop being passed to Avatar to fix an issue where VoiceOver users have the
  selected user name repeated twice.

## 10.19.8

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 10.19.7

### Patch Changes

- Updated dependencies

## 10.19.6

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 10.19.5

### Patch Changes

- [#80533](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80533)
  [`d34234ee0106`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d34234ee0106) -
  Fixed bug where user picker rendered infinitely when 2 pickers are selected consecutively
- Updated dependencies

## 10.19.4

### Patch Changes

- [#78018](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78018)
  [`036a9f353a72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/036a9f353a72) -
  onFocus event added when openMenuOnClick is true

## 10.19.3

### Patch Changes

- Updated dependencies

## 10.19.2

### Patch Changes

- Updated dependencies

## 10.19.1

### Patch Changes

- [#74482](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74482)
  [`b10803d85d88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b10803d85d88) -
  The internal composition of this component has changed. There is no expected change in behaviour.

## 10.19.0

### Minor Changes

- [#69996](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69996)
  [`1b320a82df61`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b320a82df61) -
  Add Team fallback avatar

### Patch Changes

- [#74949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74949)
  [`ba44973e5e90`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba44973e5e90) -
  openMenuOnClick prop added to support userpicker to work as select
- Updated dependencies

## 10.18.0

### Minor Changes

- [#71808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71808)
  [`eaf1018c6017`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaf1018c6017) -
  Displaying users title in Atlas search results and changing meta style to align to the right
  without fixed width

## 10.17.1

### Patch Changes

- [#72162](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72162)
  [`dadc682d36ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dadc682d36ba) -
  Replace hardcoded values with space tokens

## 10.17.0

### Minor Changes

- [#73914](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73914)
  [`ca85dd7a4109`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca85dd7a4109) -
  Added ExternalUserType and exported it in the public API

## 10.16.1

### Patch Changes

- [#70460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70460)
  [`2f37600156ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f37600156ae) -
  The internal composition of a component in this package has changed. There is no expected change
  in behaviour.

## 10.16.0

### Minor Changes

- [#69969](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69969)
  [`c9939127a605`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c9939127a605) -
  [ux] Render the custom byline instead of email for external users.
- [#70375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70375)
  [`723e4a0302b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/723e4a0302b6) -
  [ux] Adding tooltip to option shown on hover

## 10.15.0

### Minor Changes

- [#68878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68878)
  [`6c49996cd842`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c49996cd842) -
  update user recommendations api to return user's title

### Patch Changes

- [#69272](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69272)
  [`35f47019f443`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35f47019f443) -
  Migrate packages to use declarative entry points
- Updated dependencies

## 10.14.0

### Minor Changes

- [#67525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67525)
  [`835694a1696a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/835694a1696a) -
  Add third party sources to user invited and access requested event attributes

## 10.13.6

### Patch Changes

- [#66699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66699)
  [`1a2d36021791`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a2d36021791) -
  PTC-8552 avatar on selected users should be presentational, for screen readers

## 10.13.5

### Patch Changes

- [#63677](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63677)
  [`f320c8ce5039`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f320c8ce5039) -
  This package has been added to the Jira push model.

## 10.13.4

### Patch Changes

- [#64330](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64330)
  [`797c300a51d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/797c300a51d4) -
  Minor internal refactor to reduce bundle size

## 10.13.3

### Patch Changes

- [#61371](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61371)
  [`eae2cd4f6dc2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eae2cd4f6dc2) -
  Adds new prop, UNSAFE_hasDraggableParentComponent, as a workaround when using user pickers inside
  of a react-beautiful-dnd Draggable.

## 10.13.2

### Patch Changes

- [#60464](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60464)
  [`a30f9a5f3e0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a30f9a5f3e0d) -
  Removing unused dependencies

## 10.13.1

### Patch Changes

- [#60025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60025)
  [`5127b5ed9cdb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5127b5ed9cdb) -
  Added test for required attribute

## 10.13.0

### Minor Changes

- [#59712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59712)
  [`229363c1c1b3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/229363c1c1b3) -
  Add required attribute to the user-picker components and add its consumption in the share
  component.

## 10.12.7

### Patch Changes

- [#58511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58511)
  [`25cdcae132b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/25cdcae132b5) -
  Fix for user picker correctly rendering noOptionsMessage when provided a react node

## 10.12.6

### Patch Changes

- [#57137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57137)
  [`9b9900944973`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9b9900944973) -
  Remove legacy theming logic from @atlaskit/date, @atlaskit/mention, @atlaskit/task-decision and
  @atlaskit/user-picker.

## 10.12.5

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 10.12.4

### Patch Changes

- [#58426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58426)
  [`24ada9dfb10d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/24ada9dfb10d) -
  Add defensive code for MutationObserver in node to avoid ssr error

## 10.12.3

### Patch Changes

- Updated dependencies

## 10.12.2

### Patch Changes

- Updated dependencies

## 10.12.1

### Patch Changes

- Updated dependencies

## 10.12.0

### Minor Changes

- [#42184](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42184)
  [`f0685d50c55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0685d50c55) - This
  change adds `ariaLabel` prop to `UserPicker` that allows us to provide an accessible label for the
  input.

### Patch Changes

- [#42184](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42184)
  [`7f7cb1e8f0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f7cb1e8f0a) - This
  change adds `ariaLabel` prop to `UserPicker` that allows us to provide an accessible label for the
  input.

## 10.11.2

### Patch Changes

- [#41424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41424)
  [`3a85e7b6eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a85e7b6eb1) - [ux]
  Added z-index of 400 to menu for user picker as per design system popup guidelines

## 10.11.1

### Patch Changes

- [#41252](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41252)
  [`8aa48820027`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aa48820027) - Support
  aria-activedescendant on select input

## 10.11.0

### Minor Changes

- [#41027](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41027)
  [`5c316f5eee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c316f5eee6) - Added
  header for menu

## 10.10.2

### Patch Changes

- [#40328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40328)
  [`ea5e724623c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea5e724623c) - [ux]
  Fixed a minor bug where typing into the input for the user picker whilst it was in a closed state
  would result in the the loadOptions callback being called with undefined

## 10.10.1

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 10.10.0

### Minor Changes

- [#39589](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39589)
  [`faccaf9aac7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccaf9aac7) - Added
  baseUserPicker as an argument to the onSelection callback

### Patch Changes

- Updated dependencies

## 10.9.1

### Patch Changes

- [#39646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39646)
  [`fc67a1928e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc67a1928e7) - [ux]
  Added z-index of 400 to menu list for user picker as per design system popup guidelines

## 10.9.0

### Minor Changes

- [#39239](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39239)
  [`f78b73387c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f78b73387c6) - Add
  onKeyDown handler to props

## 10.8.0

### Minor Changes

- [#39115](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39115)
  [`38c3ed63070`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38c3ed63070) - Export
  sub-components of Option

## 10.7.0

### Minor Changes

- [#38945](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38945)
  [`406273e2aa8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/406273e2aa8) - Export
  Option component from /option entrypoint

## 10.6.0

### Minor Changes

- [#38819](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38819)
  [`7b8ae37bf88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b8ae37bf88) - Allow
  passing a component for noOptionsMessage prop

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 10.5.1

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 10.5.0

### Minor Changes

- [#37123](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37123)
  [`eaf4a174f64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaf4a174f64) - Added
  optional onOpen callback

## 10.4.0

### Minor Changes

- [#35452](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35452)
  [`6734af6576d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6734af6576d) - Improved
  the behaviour of the aria-labelledby prop on the Input component. It used to use aria-describedby
  and if it didn't exist, fall back to using aria-labelledby. This has now been swapped to give
  aria-labelledby precedence with aria-describedby now being the fallback.

## 10.3.0

### Minor Changes

- [#34944](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34944)
  [`413f440129c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/413f440129c) - [ux]
  Customised Menu component to allow users to include a footer in the dropdown list

## 10.2.5

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 10.2.4

### Patch Changes

- [#34290](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34290)
  [`17aec239f54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17aec239f54) - [ux]
  aria-describedby and aria-labelledby proper association in between input and placeholder

## 10.2.3

### Patch Changes

- [#33584](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33584)
  [`e8dbb0a281b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8dbb0a281b) - add a11y
  support for alert messages

## 10.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 10.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 10.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 10.1.1

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [#29759](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29759)
  [`6e27d7c6682`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e27d7c6682) - [ux]
  UserPicker now shows an error message when there has been a Promise failure for the provided
  loadOptions prop. You can customize the error message by providing a loadOptionsErrorMessage prop.

## 10.0.3

### Patch Changes

- [#30011](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30011)
  [`62e83249cb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62e83249cb2) - [ux]
  PopupUserPicker now supports user-defined styles prop for adding styling to PopupUserPicker.

## 10.0.2

### Patch Changes

- [#29607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29607)
  [`edc295b63a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc295b63a2) - [ux]
  Fixes bug where the user picker opens the menu on click, but doesn't reopen the menu on the second
  click.

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

### Major Changes

- [#28453](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28453)
  [`ed632fa5f70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed632fa5f70) - Changing
  the typing for noOptionsMessage to accept either functions/null. No strings accepted; previously,
  due to a downstream change, providing strings did not work. Also fixed onClose behavior,
  previously did not work. Converted some tests to react testing library.

## 9.7.4

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 9.7.3

### Patch Changes

- Updated dependencies

## 9.7.2

### Patch Changes

- Updated dependencies

## 9.7.1

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`cb8f8e76d25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb8f8e76d25) - Update
  types for react-select and @atlaskit/select upgrade Update commerce-ui entrypoints that caused a
  pipeline issue.
- Updated dependencies

## 9.7.0

### Minor Changes

- [#27883](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27883)
  [`f1bb023364d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1bb023364d) - Add
  optional field `hasProductAccess` to `ExternalUser`.

## 9.6.3

### Patch Changes

- [#27674](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27674)
  [`d4e917e03fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4e917e03fd) - Bump to
  @emotion v11

## 9.6.2

### Patch Changes

- Updated dependencies

## 9.6.1

### Patch Changes

- [#27136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27136)
  [`8ad846932fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ad846932fc) - [ux]
  Fixes incorrect border colour displayed when hovering a user picker with subtle appearance
  applied.

## 9.6.0

### Minor Changes

- [#26601](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26601)
  [`faf391ab64a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faf391ab64a) -
  Implementing new CustomOption which will allow for a custom avatar

## 9.5.1

### Patch Changes

- [#26318](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26318)
  [`c522aeea1da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c522aeea1da) - bumped
  up @atlaskit/tokens version to ^0.10.19

## 9.5.0

### Minor Changes

- [#25871](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25871)
  [`a4d4f93b480`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4d4f93b480) - [ux]
  UserPicker now supports disabling option items through a new optional `isDisabled` field on data
  passed to the `options` prop.

## 9.4.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 9.4.0

### Minor Changes

- [#25327](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25327)
  [`47c6607c914`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47c6607c914) - [ux]
  Adding ability for Options of type Team to allow for custom html in the lozenge prop. Added byline
  prop for type Team which will override the default byline generated from includesYou and
  memberCount props.

## 9.3.6

### Patch Changes

- [#24878](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24878)
  [`cb4c9cdd28b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb4c9cdd28b) - [ux]
  Update input component to use input tokens

## 9.3.5

### Patch Changes

- [#24786](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24786)
  [`45da4e093b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45da4e093b9) - [ux]
  User picker now shows the "X" clear indicator on mobile, which previously wasn't working because
  hover was required which doesn't work on mobile.

## 9.3.4

### Patch Changes

- [#24670](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24670)
  [`dbff164b600`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbff164b600) - [ux] Fix
  for appearance=compact not being applied correctly to user pickers

## 9.3.3

### Patch Changes

- [#24561](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24561)
  [`2c7609cef36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c7609cef36) -
  onSelection prop is now also called for user pickers where isMulti=true. Previously onSelection
  was only called for user picker where isMulti was false

## 9.3.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 9.3.1

### Patch Changes

- [#23743](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23743)
  [`fd025cbb820`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd025cbb820) - [ux] Fix
  input cursor position relative to the placeholder

## 9.3.0

### Minor Changes

- [#23577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23577)
  [`bc0b47732f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc0b47732f8) - [ux] Fix
  bug where user picker input is not being unfocused when disableInput is set. The new behavior will
  enable you to still focus on the input but not interact with it, unless it is to delete selected
  users.

## 9.2.2

### Patch Changes

- [#23405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23405)
  [`d27d65448a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d27d65448a2) - [ux] Add
  margin-left to addMoreText field

## 9.2.1

### Patch Changes

- [#23196](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23196)
  [`607b182bb8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/607b182bb8a) - Add
  typecasting to prevent type errors during multivaluecontainer placeholder translations. Also fix
  warnings for importing json attributes from version.json for analytics.

## 9.2.0

### Minor Changes

- [#22899](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22899)
  [`64dc40c32bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64dc40c32bc) - Add
  support for aria-labelledby and aria-live

## 9.1.1

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [#21796](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21796)
  [`cc40ab95bd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc40ab95bd4) - Adds a
  list of team members under OptionData for Teams

## 9.0.7

### Patch Changes

- Updated dependencies

## 9.0.6

### Patch Changes

- [#21465](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21465)
  [`1d0b82f07d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d0b82f07d6) - Added
  numberOfResults to clicked and pressed events.

## 9.0.5

### Patch Changes

- [#21393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21393)
  [`9b66179b615`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b66179b615) - Removed
  potential logging of PII in the external user hover analytics event.

## 9.0.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 9.0.3

### Patch Changes

- Updated dependencies

## 9.0.2

### Patch Changes

- [#20561](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20561)
  [`85c0dcfe911`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85c0dcfe911) - Added
  analytics event when the sources tooltip is displayed for an external user

## 9.0.1

### Patch Changes

- [#19959](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19959)
  [`6df37fef2c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6df37fef2c2) - Internal
  changes to migrate package from 'styled-components' to @emotion. There should be no change to the
  UX.

## 9.0.0

### Major Changes

- [#18988](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18988)
  [`973e01bba77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/973e01bba77) - The
  deprecated SmartUserPicker module is now removed from @atlaskit/user-picker. The module has now
  moved to its own dedicated package, @atlaskit/smart-user-picker.

  ### What this means for you as a @atlaskit/user-picker/smart-user-picker consumer

  - If you require an urgent change to SmartUserPicker, you will need to migrate and make changes to
    @atlaskit/smart-user-picker.

  - if you just want to keep your packages up-to-date, please try to hold off on the migration. The
    long-term strategy for Smart experiences is to also deprecate @atlaskit/smart-user-picker in
    favor of a React hook approach to recommending users.

## 8.8.6

### Patch Changes

- [#19987](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19987)
  [`c78ab0991dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c78ab0991dd) - [ux]
  fixed external user source tooltip heading in user-picker

## 8.8.5

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`ac9343c3ed4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac9343c3ed4) - Replaces
  usage of deprecated design tokens. No visual or functional changes
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 8.8.4

### Patch Changes

- [#19724](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19724)
  [`d9b9077397d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9b9077397d) - [ux]
  Updated the default copy for the byline when selecting email options in UserPicker.

## 8.8.3

### Patch Changes

- [#19308](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19308)
  [`3553b21ec20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3553b21ec20) - Render
  time of user picker list is now tracked with UFO

## 8.8.2

### Patch Changes

- [#19508](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19508)
  [`cc773aa7ecc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc773aa7ecc) - [ux]
  show error message in tooltip when there is no user source

## 8.8.1

### Patch Changes

- Updated dependencies

## 8.8.0

### Minor Changes

- [#19319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19319)
  [`091da1d5f88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/091da1d5f88) - [ux]
  Ensure items in the User Sources tooltip are unique and ordered correctly

## 8.7.4

### Patch Changes

- [#18946](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18946)
  [`35be12dee47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35be12dee47) - updated
  content copies for Org People Picker in user-picker and invite-people

## 8.7.3

### Patch Changes

- [#19373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19373)
  [`7f37f923832`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f37f923832) - updated
  analytics event for org people picker in core invites

## 8.7.2

### Patch Changes

- [#19298](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19298)
  [`4d4d565e8ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d4d565e8ad) - Skip
  sending UFO success if already failed

## 8.7.1

### Patch Changes

- [#19186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19186)
  [`dace9a85101`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dace9a85101) - Add new
  attribute to analytics events

## 8.7.0

### Minor Changes

- [#19180](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19180)
  [`90f5bb4745c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90f5bb4745c) - [ux]
  Sources tooltip: support 'Other Atlassian products', change heading

## 8.6.4

### Patch Changes

- [#19132](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19132)
  [`3899f24cdd6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3899f24cdd6) - track
  mount error for User Picker in UFO

## 8.6.3

### Patch Changes

- [#19060](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19060)
  [`6503f21cfc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6503f21cfc0) - [ux] Fix
  defaultValue behavior for user-picker and smart-user-picker. user-picker previously advertised
  hydrating default values if provided in unhydrated form. This was never the case; it is only
  hydrated from smart-user-picker. defaultValue would also be ignored if provided as a single
  OptionValue despite the typing being advertised as supporting it - this is now fixed.

## 8.6.2

### Patch Changes

- [#18930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18930)
  [`5df1ae17438`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5df1ae17438) -
  @atlassian/smart-user-picker will now be made public and renamed @atlaskit/smart-user-picker to
  provide a 1-1 replacement for @atlaskit/user-picker/smart-user-picker (UR-3417).

## 8.6.1

### Patch Changes

- [#18956](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18956)
  [`9cadd6e79ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cadd6e79ac) - Add in
  UFO events

## 8.6.0

### Minor Changes

- [#18908](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18908)
  [`d2a8de20d08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2a8de20d08) - Add
  support in SmartUserPicker for org id for team search

## 8.5.0

### Minor Changes

- [#18768](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18768)
  [`b74959620f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b74959620f2) - added
  hover state for info icon, and updated primary color correspondingly separated avatar item option
  for external users and applied different css settings

## 8.4.1

### Patch Changes

- [#18555](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18555)
  [`22928ac80d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22928ac80d0) - Fix:
  user sources would keep being fetched in a loop as long as the tooltip was displayed

## 8.4.0

### Minor Changes

- [#18273](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18273)
  [`29dd0cee8cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29dd0cee8cf) - [ux] Add
  support for Jira and Confluence user sources

## 8.3.5

### Patch Changes

- Updated dependencies

## 8.3.4

### Patch Changes

- [#18303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18303)
  [`7f48efc8487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f48efc8487) - Use
  baseUrl prop in default user value hydration query

## 8.3.3

### Patch Changes

- Updated dependencies

## 8.3.2

### Patch Changes

- [#17940](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17940)
  [`9fd6117d5e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd6117d5e4) - Fix
  behavior of base URL so that API calls use baseUrl as base url

## 8.3.1

### Patch Changes

- [#17994](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17994)
  [`e75137a9eff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e75137a9eff) - Adding
  ability to mark which external users need their sources hydrated

## 8.3.0

### Minor Changes

- [#16673](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16673)
  [`88551bad1ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88551bad1ec) - [ux] Add
  support for asychronously fetching the sources for an external user when a user hovers over the
  sources tooltip

## 8.2.1

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 8.2.0

### Minor Changes

- [#16998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16998)
  [`35b466f6fb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35b466f6fb5) -
  Asynchronously load user options in user-picker

## 8.1.0

### Minor Changes

- [#17163](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17163)
  [`c48834ce234`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c48834ce234) - [ux]
  Instrumented `@atlaskit/user-picker` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

## 8.0.0

### Major Changes

- [#14810](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14810)
  [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) -
  ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including
  breaking API changes, types and tests in atlassian-frontend packages

  What changed: Upgraded our react-intl support from ^2.6.0 to ^5.18.1. This means editor packages
  now rely on consumers installing ^5.18.1, otherwise editor usage of react-intl will mismatch with
  actual installed react-intl APIs. Why change was made: As part of a coordinated upgrade effort
  across AF packages, as react-intl v2 is quite dated. How consumer should update their code: Ensure
  react-intl ^5.18.1 is installed in consuming applications.

  Upgrade guide: To consume atlassian-frontend packages that use react-intl5 setup a second provider
  for the new version, using an npm alias

  ```js
  "react-intl": "^2.6.0",
  "react-intl-next": "npm:react-intl@^5.18.1",
  ```

  ```js
  import { IntlProvider } from 'react-intl';
  import { IntlProvider as IntlNextProvider } from 'react-intl-next';

  return (
  	<IntlProvider
  		key={locale}
  		data-test-language={locale}
  		locale={locale}
  		defaultLocale={DEFAULT_LOCALE}
  		messages={messages}
  	>
  		<IntlNextProvider
  			key={locale}
  			data-test-language={locale}
  			locale={locale}
  			defaultLocale={DEFAULT_LOCALE}
  			messages={messages}
  		>
  			{children}
  		</IntlNextProvider>
  	</IntlProvider>
  );
  ```

## 7.16.6

### Patch Changes

- [#16666](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16666)
  [`d194015e2a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d194015e2a9) - Remove
  bulk import for colors

## 7.16.5

### Patch Changes

- [#15950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15950)
  [`b3d1a103c04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3d1a103c04) - Remove
  field-base deprecated dependency

## 7.16.4

### Patch Changes

- [#15694](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15694)
  [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal
  upgrade of memoize-one to 6.0.0

## 7.16.3

### Patch Changes

- Updated dependencies

## 7.16.2

### Patch Changes

- [#14000](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14000)
  [`8ea7c48af73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ea7c48af73) - [ux]
  Email options now only show email icon

## 7.16.1

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`5fe6e21a9a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fe6e21a9a0) - [ux]
  Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary
  button in the footer of the modal to be on the right instead of the left.
- Updated dependencies

## 7.16.0

### Minor Changes

- [#13638](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13638)
  [`b6fa102efa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6fa102efa0) - [ux]
  Updated appearance of email options to use mail icon

## 7.15.2

### Patch Changes

- [#13609](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13609)
  [`5c34064da77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c34064da77) -
  Utilising useMemo hook to avoid re-merging i18n messages with parent provider on render

## 7.15.1

### Patch Changes

- [#13580](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13580)
  [`7cc3a4c74a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cc3a4c74a2) - Pass on
  parent IntlProvider messages so components passed as props from the parent (such as a placeholder)
  will have i18n

## 7.15.0

### Minor Changes

- [#13189](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13189)
  [`ccda387eede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccda387eede) -
  smart-user-picker extracted out from user-picker to smart-user-picker package. smart-user-picker
  in user-picker is now deprecated but still backwards compatible. Please use
  @atlassian/smart-user-picker for smart-user-picker.

## 7.14.3

### Patch Changes

- Updated dependencies

## 7.14.2

### Patch Changes

- [#13040](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13040)
  [`7ca4b74ff54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ca4b74ff54) - [ux]
  Bugfix for removing a weird box blip that extends outside of the avatar for user picker in Safari.

## 7.14.1

### Patch Changes

- [#12045](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12045)
  [`f8630220e88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8630220e88) - Fix
  typing in MultiValueContainer

## 7.14.0

### Minor Changes

- [#12490](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12490)
  [`de907e45ad1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de907e45ad1) - Removed
  the tag component to address accessibility isssues

## 7.13.1

### Patch Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`1648ac429ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1648ac429ee) - [ux]
  Updated to use the new `@atlaskit/select` design.
- Updated dependencies

## 7.13.0

### Minor Changes

- [#12373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12373)
  [`869e1fdef2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/869e1fdef2f) - [ux]
  Prioritize filterOptions prop over onEmpty. Now, filterOptions is called AFTER onEmpty is applied
  to URS suggestions. This means that SUP can show empty results if filterOptions filters out all
  results. This fixes a bug where updated filterOptions does not get applied to suggestions.

## 7.12.0

### Minor Changes

- [#12143](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12143)
  [`92f34fa25a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92f34fa25a7) -
  Switching compass over to using its own user search index instead of jira's

## 7.11.0

### Minor Changes

- [#11257](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11257)
  [`5dcf1001d62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5dcf1001d62) - [ux]
  Added tooltips for Confluence ExCo/Guest lozenges for Smart User Picker

## 7.10.7

### Patch Changes

- [#11368](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11368)
  [`bdf81a467fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf81a467fd) -
  Translation bugfix for text within user picker

## 7.10.6

### Patch Changes

- Updated dependencies

## 7.10.5

### Patch Changes

- [#10964](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10964)
  [`048fd26b847`](https://bitbucket.org/atlassian/atlassian-frontend/commits/048fd26b847) - Updating
  Smart User Picker atlaskit documentation

## 7.10.4

### Patch Changes

- [#11099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11099)
  [`f22daa70ff0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f22daa70ff0) - Unit
  test and some doco for defaultValue

## 7.10.3

### Patch Changes

- [#10234](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10234)
  [`ac30a1340a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac30a1340a2) - Groups
  with external collaborators will now have the Guest lozenge shown next to them on the smart user
  picker

## 7.10.2

### Patch Changes

- [#10330](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10330)
  [`f310ccbe522`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f310ccbe522) - Updated
  AK examples to use new jdog cloudid

## 7.10.1

### Patch Changes

- [#10325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10325)
  [`772e15b76d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/772e15b76d2) - UR-1409
  handle request races gracefully

## 7.10.0

### Minor Changes

- [#10082](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10082)
  [`659f69d349a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/659f69d349a) - [ux]
  Added closeMenuOnScroll and menuShouldBlockScroll Select props which allows easier integrations
  inside modals

## 7.9.3

### Patch Changes

- [#10293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10293)
  [`40dc90330e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40dc90330e4) - UR-2530
  accept empty placeholder values

## 7.9.2

### Patch Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`78c54a8761f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78c54a8761f) -
  Rewording some comments/types/descriptions to remove unnecessarily gendered phrasing
- Updated dependencies

## 7.9.1

### Patch Changes

- [#10056](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10056)
  [`2ed498a11d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ed498a11d4) - Export
  getUserRecommendations for external use and test mocking

## 7.9.0

### Minor Changes

- [#9493](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9493)
  [`83812c6e1a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83812c6e1a6) - Add
  productAttributes into SmartUserPicker usersRequest analytics event

## 7.8.0

### Minor Changes

- [#8895](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8895)
  [`3f551db7bed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f551db7bed) -
  filterOptions will include the query as an optional import

## 7.7.0

### Minor Changes

- [#8736](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8736)
  [`de8d3656da6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de8d3656da6) - Added
  user markes to user-picker/smart-user-picker. Confluence guests will now appear with a lozenge
  containing the text 'GUEST'. Updated tests to match this behaviour and updated the
  smart-user-picker example.

## 7.6.0

### Minor Changes

- [#8663](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8663)
  [`0076cad2d37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0076cad2d37) - Added
  the prop bootstrapOptions for Smart User Picker. This allows to override the bootstrap options.

## 7.5.5

### Patch Changes

- [#8820](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8820)
  [`12493bf342e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12493bf342e) - Add
  bugfix to make principalId actually optional. Backwards compatible.

## 7.5.4

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade
  `@types/react-select` to `v3.1.2` and fix type breaks
- Updated dependencies

## 7.5.3

### Patch Changes

- [#8536](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8536)
  [`5aa6e51ed2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5aa6e51ed2f) - [ux] Add
  GitHub as an external source for the user-picker

## 7.5.2

### Patch Changes

- [#8147](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8147)
  [`6bbba22c60b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bbba22c60b) - Prevent
  PII from being fired for UP analytics events

## 7.5.1

### Patch Changes

- [#7861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7861)
  [`e55c8004986`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e55c8004986) - [ux] Add
  Team prefix to team option bylines to increase clarity.

## 7.5.0

### Minor Changes

- [#8048](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8048)
  [`93adccb79a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93adccb79a4) - The
  Smart User Picker now has the ability to use menuPosition which can allow it to be displayed on
  top of a dialog box.

## 7.4.0

### Minor Changes

- [#7571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7571)
  [`4c7bc9847a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c7bc9847a4) - Added
  the Smart User Picker to Confluence quicksearch

## 7.3.3

### Patch Changes

- [#7745](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7745)
  [`224d0251bd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/224d0251bd1) - Update
  examples to function components for use in react storybook

## 7.3.2

### Patch Changes

- [#6792](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6792)
  [`9a206f99b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a206f99b1) - [ux] Added
  'MEMBER' lozenge to SUP is workspaceMember attribute exists (from bitbucket recommendations
  response)

## 7.3.1

### Patch Changes

- [#6830](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6830)
  [`8af040a491`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8af040a491) -
  Reformating suggested emails if user inputs a space in the picker, aligning email suggestion
  avatar size with other options in the picker

## 7.3.0

### Minor Changes

- [#6571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6571)
  [`39055f3ac5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39055f3ac5) - ED-10694:
  Fix FieldComponent defaultValue behaviour losing value due to mutation

## 7.2.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 7.2.0

### Minor Changes

- [#6323](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6323)
  [`70c3d3cab0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70c3d3cab0) - [ux] allow
  displaying a constant recommendation to invite users from a specific email domain, based on the
  users input value

## 7.1.0

### Minor Changes

- [#6175](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6175)
  [`c9327fc11e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9327fc11e) - [ux] Add
  ability to user picker to display the external users along with the sources they come from.

## 7.0.0

### Major Changes

- [#6050](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6050)
  [`2c148c9eb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c148c9eb9) - Update the
  on Error prop to allow fail-over search client implementation for products. Confluence fail-over
  client.

## 6.9.3

### Patch Changes

- [#6238](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6238)
  [`6e859f4e7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e859f4e7d) - Fix
  analytics to not expose email addresses as part of payload

## 6.9.2

### Patch Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860)
  [`677744c680`](https://bitbucket.org/atlassian/atlassian-frontend/commits/677744c680) - Add
  UserSelect field for ConfigPanel, and expose types in SmartUserPicker

## 6.9.1

### Patch Changes

- [#5932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5932)
  [`d46c67b902`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d46c67b902) - [ux] Added
  further props to the PopupUserPicker for enabling offsets/shouldFlip/boundary settings. This
  change is backwards compatible. PopperProps have been updated to conform with Popper2.0 change

## 6.9.0

### Minor Changes

- [#5901](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5901)
  [`c8061b65de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8061b65de) - Allow
  style passthrough to mergeStyles in atlaskit select

## 6.8.0

### Minor Changes

- [#5732](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5732)
  [`57ef50f4d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ef50f4d4) - Retain
  requested order for defaultValue hydration. Hydrate an "Unknown" user if no result from hydration.
  Converted example to a function component.

## 6.7.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 6.7.1

### Patch Changes

- Updated dependencies

## 6.7.0

### Minor Changes

- [#5357](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5357)
  [`fe292139a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe292139a7) - [ux] Added
  support for lozenge in the options dropdown

## 6.6.1

### Patch Changes

- [#5325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5325)
  [`8c68430770`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c68430770) - Added
  onValueError callback to handle hydration errors

## 6.6.0

### Minor Changes

- [#5141](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5141)
  [`defe93e5fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/defe93e5fe) - Added auto
  hydration for defaultValue user identifier types to SmartUserPicker

## 6.5.7

### Patch Changes

- Updated dependencies

## 6.5.6

### Patch Changes

- [#5061](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5061)
  [`38cc5d88da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38cc5d88da) - Update
  type of Target to match popup-select's

## 6.5.5

### Patch Changes

- [#4945](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4945)
  [`46bb7d498e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46bb7d498e) - [ux] Popup
  user picker styling bug fixed where the placeholder was placed in the wrong position

## 6.5.4

### Patch Changes

- [#4844](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4844)
  [`4111de09de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4111de09de) - Allow
  emailLabel to be an empty string

## 6.5.3

### Patch Changes

- [#4817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4817)
  [`0ea18048ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ea18048ed) - Fix
  emailLabel not being passed in pickerProps

## 6.5.2

### Patch Changes

- Updated dependencies

## 6.5.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 6.5.0

### Minor Changes

- [#4404](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4404)
  [`63715cc332`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63715cc332) - Add
  noBorder option to match confluence styling

### Patch Changes

- [#4410](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4410)
  [`1685d02525`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1685d02525) - Fix
  styling issue for noBorder

## 6.4.2

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 6.4.1

### Patch Changes

- Updated dependencies

## 6.4.0

### Minor Changes

- [#4167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4167)
  [`0d5890d800`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d5890d800) - Added
  props for bitbucket support - isPublicRepo, workspaceIds, emailDomain

## 6.3.0

### Minor Changes

- [#4009](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4009)
  [`d645e8d753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d645e8d753) - Added
  includeUsers prop to allow results for team or groups only

## 6.2.4

### Patch Changes

- [#3369](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3369)
  [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated
  translations

## 6.2.3

### Patch Changes

- [#3930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3930)
  [`9ef8a85f82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ef8a85f82) - Reenable
  subtle and compact style flags

## 6.2.2

### Patch Changes

- [#3908](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3908)
  [`37e5a70532`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37e5a70532) - Fix
  deselect bug when defaultValue props provided

## 6.2.1

### Patch Changes

- [#3883](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3883)
  [`cfbae59ca9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfbae59ca9) - Map groups
  through to picker results

## 6.2.0

### Minor Changes

- [#3770](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3770)
  [`51aca36965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aca36965) - Added
  includeGroups prop for the retrieval of confluence groups in smart user picker

## 6.1.0

### Minor Changes

- [#3749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3749)
  [`d8aec9a0f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8aec9a0f8) - Fixed
  visual regression with Select dropdown caussing scrollbars to appears inside the PopUp, now using
  a portal element. For @atlaskit/user-picker ability to pass down `portalElement` has been added.

## 6.0.2

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`cde426961a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cde426961a) - Bumps
  Avatar and AvatarGroup depenedencies
- Updated dependencies

## 6.0.1

### Patch Changes

- [#3226](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3226)
  [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages

## 6.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.1.4

### Patch Changes

- [#3143](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3143)
  [`7f61836218`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f61836218) - Re-fire
  userPicker searched event after an option has been selected (allows mapping between userPicker
  clicked/enetered with userPicker searched for multiple pick case).

## 5.1.3

### Patch Changes

- [#3230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3230)
  [`f4fb91cf47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4fb91cf47) - Fix blank
  space after deleting items in multi

## 5.1.2

### Patch Changes

- [#2488](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2488)
  [`b6a673bb27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6a673bb27) - Add smart
  user picker prop for share dialog. Only works if enableSmartUserPicker is true and product =
  'jira'.

  Fix maxPickerHeight prop in user-picker to work (previously was maxGrowHeight in styles but the
  prop was called maxPickerHeight).

  Fix alignment issues of tags inside user-picker.

  Enable deletion animation for user-picker.

## 5.1.1

### Patch Changes

- [#3057](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3057)
  [`50d6079274`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50d6079274) - Fix
  analytics bug exposing PII for usersRequest succeeded

## 5.1.0

### Minor Changes

- [#2903](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2903)
  [`4ee1ba1585`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee1ba1585) - Add
  maxPickerHeight to the user picker which sets the maximum height that the user picker can grow up
  to because of the picked items. Modified subtle prop version of user picker. When subtle, the user
  picker's border will be removed. The background color will remain the same (Grey N10). These
  changes were spurred by recent style changes in user picker, which impacted the style of the
  shares dialog. Consumers need to be aware of whether an infinitely growing number of users in the
  user picker can affect their styling. If it does, they will need to provide a suitable
  maxPickerHeight. Consumers who also wish for a borderless user picker must set the subtle prop to
  true.

  Change the background color from N10 to N20 to align with other select background colors.

  In share dialog, set the maxPickerHeight prop to 102 for the user picker.

## 5.0.0

### Major Changes

- [#2833](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2833)
  [`510b57c393`](https://bitbucket.org/atlassian/atlassian-frontend/commits/510b57c393) -
  SupportedProduct type changed from enum to a string union type of products. \n This change was a
  result of migration compatibility for smart-user-picker into ForgeUI. Enum types were forcing
  ForgeUI to eager load the whole package. Consumers should look to change their uses of
  SupportedProduct from enum to string identifiers. Possible values are listed in the package
  documentation.

## 4.6.4

### Patch Changes

- [#2540](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2540)
  [`cdb9e0c4de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdb9e0c4de) - UI bug
  fixes

## 4.6.3

### Patch Changes

- [#2694](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2694)
  [`ac965ef48d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac965ef48d) - Fix
  selected user alignment issue in single user picker

## 4.6.2

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to
  use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 4.6.1

### Patch Changes

- [#2430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2430)
  [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all
  packages that are used by confluence that have a broken es2019 dist

## 4.6.0

### Minor Changes

- [#2262](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2262)
  [`5e93392923`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e93392923) - filter out
  inactive users from suggestions

### Patch Changes

- [#2099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2099)
  [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add
  missing tslib dependency

## 4.5.1

### Patch Changes

- [#2233](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2233)
  [`d8df7262f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8df7262f9) - expose a
  method to change env so confluence local development is easier

## 4.5.0

### Minor Changes

- [#2213](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2213)
  [`a046c939c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a046c939c7) - Fix wrong
  url bug, add onEmpty property

## 4.4.0

### Minor Changes

- [#2071](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2071)
  [`a546558e20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a546558e20) - add
  prefetch prop to smart user picker

## 4.3.0

### Minor Changes

- [#1998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1998)
  [`650d5ece5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650d5ece5b) - add smart
  user picker

## 4.2.3

### Patch Changes

- [patch][845feddce2](https://bitbucket.org/atlassian/atlassian-frontend/commits/845feddce2):

  This fixes the multi user select bug in user picker- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 4.2.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/select@11.0.7
  - @atlaskit/tag@9.0.13
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/analytics-viewer@0.3.9
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/util-data-test@13.1.1

## 4.2.1

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies
  [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6
  - @atlaskit/tag@9.0.12
  - @atlaskit/tooltip@15.2.2

## 4.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix some broken CSS layout in IE 11

### Patch Changes

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
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/avatar@17.1.5
  - @atlaskit/field-base@13.0.16

## 4.1.5

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages-
  Updated dependencies
  [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2

## 4.1.4

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 4.1.3

- Updated dependencies
  [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies
  [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0

## 4.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 4.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 4.1.0

### Minor Changes

- [minor][c9fbef651f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9fbef651f):

  Add Group as a new Option

## 4.0.23

### Patch Changes

- [patch][8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):

  @atlaskit/avatar has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 4.0.22

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 4.0.21

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.20

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full
  typescript support so it is recommended that typescript consumers use it also.

## 4.0.19

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source
    code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match
    source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match
    source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 4.0.18

- Updated dependencies
  [1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):
  - @atlaskit/tag@9.0.0

## 4.0.17

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 4.0.16

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.0.15

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 4.0.14

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
  as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps
  of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 4.0.13

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/select@10.0.0

## 4.0.12

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/field-base@13.0.6
  - @atlaskit/select@9.1.8
  - @atlaskit/tag@8.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 4.0.11

### Patch Changes

- [patch][40e6908409](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40e6908409):

  pass session id to on selection

## 4.0.10

### Patch Changes

- [patch][06f5bbf5a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06f5bbf5a9):

  start session onfocus

## 4.0.9

### Patch Changes

- [patch][c91e37e5f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c91e37e5f1):

  pass session id to onFocus, onBlur, onClose and onInputChange

## 4.0.8

### Patch Changes

- [patch][77ef850a35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77ef850a35):

  Fix click and hover behaviours of disabled single user picker

## 4.0.7

### Patch Changes

- [patch][25b3ec24af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25b3ec24af):

  add optional session id to async loadoption

## 4.0.6

### Patch Changes

- [patch][b029d82e8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b029d82e8c):

  Handle scroll of box of user picker component

## 4.0.5

### Patch Changes

- [patch][9b0adb4ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0adb4ce7):

  Fix scrolling behaviour when picking a user in the multi user picker

## 4.0.4

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 4.0.3

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/tag@8.0.3
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 4.0.2

- Updated dependencies
  [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 4.0.1

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/tag@8.0.2
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 3.5.5

- [patch][87c47cd667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87c47cd667):

  - Getting updated styles from tag

## 3.5.4

- [patch][b8bc454675](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bc454675):

  - Add inputId prop to allow label to open the user picker

## 3.5.3

- [patch][171feaa473](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/171feaa473):

  - FS-3792 clear results after selection

## 3.5.2

- [patch][7cb36f2603](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cb36f2603):

  - Fixed User Picker showing the spinner forever in some async use cases.

## 3.5.1

- [patch][3fbfd9d7f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fbfd9d7f5):

  - updated byline message for EmailOption based on email validity in user-picker

## 3.5.0

- [minor][e1abf3f31a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1abf3f31a):

  - Prevent popup user picker from being dismissed on clear.

## 3.4.3

- [patch][2f8c041db5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f8c041db5):

  - Corrected asynchronous user picker behaviour

## 3.4.2

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/tag@7.0.2
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 3.4.1

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next
    supplied from itself.

## 3.4.0

- [minor][4a8effc046](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a8effc046):

  - FS-3741 expose boundariesElement for integrators to pass in custom boundary

## 3.3.5

- [patch][0f4109e919](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f4109e919):

  - FS-3743 remove loading message from user picker

## 3.3.4

- [patch][93464f09e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93464f09e8):

  - TEAMS-328 : Changing byline logic

## 3.3.3

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 3.3.2

- [patch][3718bdc361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3718bdc361):

  - Updated InviteAvatorIcon in UserPicker to be not transparent

## 3.3.1

- [patch][83ad0552d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83ad0552d4):

  - Workaround SSR avatar issue in user-picker ssr tests

## 3.3.0

- [minor][4526b178cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4526b178cb):

  - Fixed uncaptured Enter key press on Input

## 3.2.0

- [minor][b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):

  - reset jest modules before hydration

## 3.1.1

- [patch][3161a93cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3161a93cdb):

  - FS-3289 update share copy

## 3.1.0

- [minor][1da59f9d31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da59f9d31):

  - added ssr tests to user-picker

## 3.0.0

- [major][3ea3f5ea55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ea3f5ea55):

  - FS-3548 integrators must explicitly set the context prop in user-picker

## 2.0.3

- [patch][552843a739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/552843a739):

  - FS-3639 fix analytics when no item is removed

## 2.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 2.0.1

- [patch][de8123519a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de8123519a):

  - FS-3675 add ability for integrator to add title to popup picker

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.1.1

- [patch][64c306c904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64c306c904):

  - FS-3599 remove logic to hide add more placeholder

## 1.1.0

- [minor][14af4044ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14af4044ea):

  - FS-3354 introduce PopupUserPicker to package

## 1.0.25

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/analytics-viewer@0.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/select@8.0.0
  - @atlaskit/tag@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 1.0.24

- [patch][97307d9dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97307d9dd1):

  - FS-3618 add isValidEmail prop to UserPicker

## 1.0.23

- [patch][ad1bd2a92e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad1bd2a92e):

  - FS-3605 expose prop to disable input

## 1.0.22

- [patch][46ffd45f21](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46ffd45f21):

  - Added ability to toggle animations in atlaskit/select, updated UserPicker to disable animations
    using this new behaviour

## 1.0.21

- [patch][b38b2098e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b38b2098e3):

  - FS-3417 export utils functions

## 1.0.20

- Updated dependencies
  [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/select@7.0.0

## 1.0.19

- [patch][1050084e29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1050084e29):

  - TEAMS-242 : Change user picker placeholder

## 1.0.18

- [patch][0809a67d7b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0809a67d7b):

  - FS-3591 hide selected users from multi picker

## 1.0.17

- [patch][67f0d11134](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f0d11134):

  - FS-3577 show selected options by default

## 1.0.16

- [patch][c51d1e2e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c51d1e2e51):

  - FS-3573 show user avatar on focus

## 1.0.15

- [patch][1ce3a8812b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ce3a8812b):

  - FS-3458 call loadOptions if open prop is controlled
