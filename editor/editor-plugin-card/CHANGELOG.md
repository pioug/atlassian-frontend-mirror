# @atlaskit/editor-plugin-card

## 1.1.1

### Patch Changes

- [#76864](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76864) [`7ef524e422c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ef524e422c3) - Fixes switching card view from inline to Datasources
- Updated dependencies

## 1.1.0

### Minor Changes

- [#76379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76379) [`1550bb6f5bde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1550bb6f5bde) - Updating links for link-preferences to be dependent on staging environment

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [#75568](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75568) [`cf557c64b311`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf557c64b311) - Updated DatasourceErrorBoundary to pass error, datasourceId and datasourceModalType to LazyLoadedDatasourceRenderFailedAnalyticsWrapper

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [#75549](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75549) [`cdb2d5721cce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cdb2d5721cce) - Fix an issue where view switching from toolbar was causing js error.
- Updated dependencies

## 1.0.3

### Patch Changes

- [#72875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72875) [`0d1e8b03af0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d1e8b03af0b) - Adding datasource stash to save datasource views when switching to inline/block and then back to datasource view

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#71504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71504) [`8beedb8b48db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8beedb8b48db) - [ux] Enable switch view from Datasource to back smart links behind ff platform.linking-platform.enable-datasource-appearance-toolbar
- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.16.11

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency
- Updated dependencies

## 0.16.10

### Patch Changes

- [#71056](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71056) [`eb723312de15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb723312de15) - Remove `platform.linking-platform.datasource-jira_issues` feature flag from editor.

## 0.16.9

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1
- Updated dependencies

## 0.16.8

### Patch Changes

- [#70612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70612) [`87457cd97d6b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87457cd97d6b) - Added a "datasource appearance" button to the toolbar and renamed an internal export.
- Updated dependencies

## 0.16.7

### Patch Changes

- Updated dependencies

## 0.16.6

### Patch Changes

- [#68535](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68535) [`9d9c89e4ff0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9d9c89e4ff0c) - Implement smart-card actionOptions prop within editor and expose prop to editor and renderer
- Updated dependencies

## 0.16.5

### Patch Changes

- Updated dependencies

## 0.16.4

### Patch Changes

- [#67576](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67576) [`c03238aac8d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c03238aac8d2) - Export some plugin types to allow fix the build type
- Updated dependencies

## 0.16.3

### Patch Changes

- [#66961](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66961) [`2e4913393f85`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e4913393f85) - Add logic to prevent showing datasource edit button in toolbar if datasource does not support editing.
- Updated dependencies

## 0.16.2

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238) [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) - [ED-21835] Change EditorAPI type to always union with undefined

## 0.16.1

### Patch Changes

- [#66364](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66364) [`212c782cb7a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/212c782cb7a6) - No longer require `cardOptions` to be passed to the hyperlink plugin configuration, it exposes a new optional way to skip analytics via the prependToolbarButtons action.
- Updated dependencies

## 0.16.0

### Minor Changes

- [#65019](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65019) [`7290a6f8d435`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7290a6f8d435) - Adding lpLinkPicker param to card and hyperlink plugins instead of using feature flag

### Patch Changes

- Updated dependencies

## 0.15.3

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031) [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) - ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.15.2

### Patch Changes

- [#65152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65152) [`7b55d001d263`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7b55d001d263) - remove unused css and small refactor

## 0.15.1

### Patch Changes

- [#64861](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64861) [`87c2c502ea93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87c2c502ea93) - [UX] scale icon size based on font size in discoverability overlay
- [#64817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64817) [`afa680b9f6bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/afa680b9f6bb) - change background color for active state of discoverability overlay to match color of smart link active state
- Updated dependencies

## 0.15.0

### Minor Changes

- [#64107](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64107) [`0372daafc639`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0372daafc639) - [ux] Refresh the inline card discoverability overlay design:

  - changed color, text size, font, padding, overlay behaviour

### Patch Changes

- Updated dependencies

## 0.14.25

### Patch Changes

- [#63612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63612) [`30f0f85d5af6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30f0f85d5af6) - Disable datasource table resize button when the component is nested inside another component.
- Updated dependencies

## 0.14.24

### Patch Changes

- [#63549](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63549) [`c2147cd56a94`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c2147cd56a94) - Fix inconsistency of discoverability pulse
- Updated dependencies

## 0.14.23

### Patch Changes

- [#63354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63354) [`0b49755d1170`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0b49755d1170) - [ux] Include embed card frame as part of its width when frameStyle is set to "show" and show embed frame by default in renderer

## 0.14.22

### Patch Changes

- [#61458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61458) [`f69cbc65f2ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f69cbc65f2ea) - Avoid mutating state directly

## 0.14.21

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165) [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) - [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update
- [#62149](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62149) [`f1c2b0309389`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f1c2b0309389) - Fix to bump up Jira Issues priority in the quick action menu list.
- Updated dependencies

## 0.14.20

### Patch Changes

- [#61628](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61628) [`c1b054119172`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1b054119172) - Fixed an issue where link deleteMethod attribute was set as unknown when changing a link to datasource table.

## 0.14.19

### Patch Changes

- [#60660](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60660) [`102ad9375609`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/102ad9375609) - Fixed an issue where link creationMethod attribute was set as unknown when inserting via datasource config modal.

## 0.14.18

### Patch Changes

- [#60441](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60441) [`13892b95e918`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13892b95e918) - [ux] Refactoring of the inline card with awareness solution (behind a FF)

## 0.14.17

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808) [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) - ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE
- Updated dependencies

## 0.14.16

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246) [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) - ED-21371 Update adf-schema to 35.1.0
- Updated dependencies

## 0.14.15

### Patch Changes

- [#58798](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58798) [`8e489065dff2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e489065dff2) - Workaround for inline overlay showing incorrectly on undo.

## 0.14.14

### Patch Changes

- Updated dependencies

## 0.14.13

### Patch Changes

- [#57192](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57192) [`cb7776f514cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb7776f514cb) - Fix issue like table and assets editor plugin card not translated issue

## 0.14.12

### Patch Changes

- [#58979](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58979) [`e1db19a2208c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1db19a2208c) - [ux] Passing isHovering prop to the SmartCard when user hovers on the "Change view" overlay
- Updated dependencies

## 0.14.11

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).
- [#58969](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58969) [`297598de20d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/297598de20d6) - ED-20809: removes web driver project reference
- Updated dependencies

## 0.14.10

### Patch Changes

- [#58193](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58193) [`4bf69e3255f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4bf69e3255f8) - NO-ISSUE Added the capability to override the default card type of inline when inserting links, so we can have Loom links convert to embed cards
- Updated dependencies

## 0.14.9

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763) [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) - update ADF schema
- Updated dependencies

## 0.14.8

### Patch Changes

- [#58076](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58076) [`e22c68b4b316`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e22c68b4b316) - Fix an overlay causing wrapped inline card to jump

## 0.14.7

### Patch Changes

- [#56898](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56898) [`32d7fcd969d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32d7fcd969d5) - Analytics even 'pulse viewed' is added to inline card with awareness (behind a FF)

## 0.14.6

### Patch Changes

- [#57368](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57368) [`d69503f13a52`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d69503f13a52) - [ux] Changed the datasource layout resize button will show only when editor is in "full-page" mode
- Updated dependencies

## 0.14.5

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790) [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) - ED-21266: Updated @atlaskit/adf-schema to 34.0.1
- Updated dependencies

## 0.14.4

### Patch Changes

- [#56625](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56625) [`1df300977e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1df300977e9a) - [ux] Always show link icon when showing 'change view' overlay in editor. Do not show if the overlay will cover the whole link including the icon.

## 0.14.3

### Patch Changes

- [#43494](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43494) [`7c59a134595`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c59a134595) - [ux] Show inline card upgrade discoverability overlay on insertion. The functionality behind the inline switcher feature flag

## 0.14.2

### Patch Changes

- [#42839](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42839) [`7324375d4fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7324375d4fa) - [ux] Cleansup feature flag `prevent-popup-overflow` so that it is permanently enabled when `lp-link-picker` flag is enabled, improving the positioning of the link picker.

## 0.14.1

### Patch Changes

- [#43646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43646) [`d43f8e9402f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43f8e9402f) - Make feature flags plugin optional in all plugins including:

  - analytics
  - base
  - card
  - code-block
  - expand
  - extension
  - floating-toolbar
  - hyperlink
  - insert-block
  - layout
  - layout
  - list
  - media
  - paste
  - rule
  - table
  - tasks-and-decisions

  We already treat it as optional in the plugins, so this is just ensuring that the plugin is not mandatory to be added to the preset.

- Updated dependencies

## 0.14.0

### Minor Changes

- [#43139](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43139) [`633ac70ce16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/633ac70ce16) - Removed floatingToolbarLinkSettingsButton feature flag

### Patch Changes

- Updated dependencies

## 0.13.6

### Patch Changes

- [#43035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43035) [`705854f13b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/705854f13b3) - [ux] Show inline card overlay on selected (behind feature flag)
- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0
- [#43496](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43496) [`290e75ca7f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/290e75ca7f2) - Fixes uncaught error when using arrow keys to move selection into inline card.
- Updated dependencies

## 0.13.5

### Patch Changes

- Updated dependencies

## 0.13.4

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- [#43352](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43352) [`087515ab3ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/087515ab3ea) - [ux] Added on selection behaviour for inline link
- Updated dependencies

## 0.13.3

### Patch Changes

- [#43175](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43175) [`a72cac2bc28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a72cac2bc28) - [ux] Added a check for showLinkOverlay for hover/unhover scenarios

## 0.13.2

### Patch Changes

- [#42933](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42933) [`6a7848b6400`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a7848b6400) - Cleansup feature flag. Floating toolbar now always fires a viewed event when activated for links when the card plugin is enabled.
- Updated dependencies

## 0.13.1

### Patch Changes

- [#43078](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43078) [`088d6edebd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/088d6edebd4) - [ux] Passing the value of showUpgradeDiscoverability prop to toolbar component

## 0.13.0

### Minor Changes

- [#42692](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42692) [`755bedc2db1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/755bedc2db1) - [ux] Added functionality for Inline Card pulse that should surface only on the first inserted link of the day.

### Patch Changes

- Updated dependencies

## 0.12.2

### Patch Changes

- [#43004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43004) [`534feb3059b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/534feb3059b) - [ux] Update text for /assets slash command to add "(Beta)" suffix, and change Assets slash command icon slightly

## 0.12.1

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995) [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in missing dependencies for imported types

## 0.12.0

### Minor Changes

- [#42821](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42821) [`9ae7cc56578`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ae7cc56578) - [ux] Adds datasource edit button to blue links that can resolve into datasources

## 0.11.1

### Patch Changes

- [#42248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42248) [`c3ce5d9263f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ce5d9263f) - Add inline card overlay component
- [#42848](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42848) [`f2f8428f703`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2f8428f703) - Abandons feature flag lp-link-picker-focus-trap as it was not successfully rolled out. Will re-introduce as platform feature flag as/when necessary.
- Updated dependencies

## 0.11.0

### Minor Changes

- [#42755](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42755) [`97f9fcba5a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97f9fcba5a5) - [ux] Add a discovery pulse to smart link view switcher under certain conditions and behind a feature flag

### Patch Changes

- Updated dependencies

## 0.10.10

### Patch Changes

- [#42151](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42151) [`192b62f6d36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192b62f6d36) - Cleans up editor feature flag 'lp-analytics-events-next'. Card plugin will now always dispatch link tracking events.

## 0.10.9

### Patch Changes

- [#42607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42607) [`87e6390f290`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87e6390f290) - [ux] Added a DiscoveryPulse component that can be used for feature discovery based on local storage keys
- Updated dependencies

## 0.10.8

### Patch Changes

- [#42586](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42586) [`ed2a549e705`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed2a549e705) - ED-20177 Use updated transaction when closing modal

## 0.10.7

### Patch Changes

- [#38725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38725) [`0f145c04dbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f145c04dbf) - [ux] Datasource columns now can be resizied
- [#38725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38725) [`0f145c04dbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f145c04dbf) - [ux] Datasource columns now can be resizied
- Updated dependencies

## 0.10.6

### Patch Changes

- [#42350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42350) [`5c905e458da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c905e458da) - [ux] Fixed an issue where a blinking cursor would appear before a selected datasource node.

## 0.10.5

### Patch Changes

- [#42367](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42367) [`4f70009532a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70009532a) - [ux] Refactored the inline card to be a functional component behind a FF

## 0.10.4

### Patch Changes

- Updated dependencies

## 0.10.3

### Patch Changes

- [#41985](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41985) [`75de7b64b6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75de7b64b6d) - DatasourceEvents getDisplayedColumnCount now returns null instead of 0 if no properties exist
- Updated dependencies

## 0.10.2

### Patch Changes

- Updated dependencies

## 0.10.1

### Patch Changes

- [#41921](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41921) [`12d685a4b30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12d685a4b30) - Removed chromeCursorHandlerFixedVersion feature flag

## 0.10.0

### Minor Changes

- [#41407](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41407) [`10708446bd2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10708446bd2) - [ux] Added support for passing of new optional url prop to JiraConfigModal

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#41405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41405) [`6619f042a24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6619f042a24) - [ux] Fix issue where any inline/block/embeds don't open up datasource modal with proper info

## 0.9.1

### Patch Changes

- [#40745](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40745) [`bba067a4049`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bba067a4049) - Datasource modal dialog now wrapped with datasource render failed analytics component
- Updated dependencies

## 0.9.0

### Minor Changes

- [#40876](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40876) [`c43a6a9cbd2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c43a6a9cbd2) - [ux] Adds copy button to datasource toolbar

## 0.8.7

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema
- Updated dependencies

## 0.8.6

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [#40786](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40786) [`898ac16a850`](https://bitbucket.org/atlassian/atlassian-frontend/commits/898ac16a850) - Add platform.linking-platform.datasource.show-jlol-basic-filters feature flag reference for usage in editor examples

## 0.8.4

### Patch Changes

- Updated dependencies

## 0.8.3

### Patch Changes

- Updated dependencies

## 0.8.2

### Patch Changes

- [#40614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40614) [`4e7058a65f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e7058a65f4) - Add eslint rule to ban React.FC and React.FunctionalComponent in editor. In most packages this is still a warning.
- [#40478](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40478) [`08c899663fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08c899663fa) - Add datasource failed analytic events to datasourceErrorBoundary
- Updated dependencies

## 0.8.1

### Patch Changes

- [#40539](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40539) [`ae7c1132c88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae7c1132c88) - Added analytics fix for undo/redo scenarious of link upgrade to a datasource
- [#40199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40199) [`553b34b5fd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/553b34b5fd4) - Small analytics bug fixes relating to auto-linking on enter, legacy link picker, and unresolvable links.

## 0.8.0

### Minor Changes

- [#40408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40408) [`e4721cc5a3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4721cc5a3f) - Make issue count clickable

### Patch Changes

- Updated dependencies

## 0.7.3

### Patch Changes

- Updated dependencies

## 0.7.2

### Patch Changes

- Updated dependencies

## 0.7.1

### Patch Changes

- [#40187](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40187) [`bab3ac9e64e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bab3ac9e64e) - Passing analytic events with attributes from link-datasource modal to editor.
- Updated dependencies

## 0.7.0

### Minor Changes

- [#39171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39171) [`50b3bf73ed3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b3bf73ed3) - [ux] Add edit datasource button to toolbar for cards which can resolve into datasources

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265) [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added datasource analytic CRUD events

### Patch Changes

- Updated dependencies

## 0.5.11

### Patch Changes

- [#39984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39984) [`37c62369dae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37c62369dae) - NO-ISSUE Import doc builder types from editor-common

## 0.5.10

### Patch Changes

- Updated dependencies

## 0.5.9

### Patch Changes

- [#39481](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39481) [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete adf-schema, use published version

## 0.5.8

### Patch Changes

- [#39781](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39781) [`94ae084e345`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ae084e345) - Add `EditorAnalyticsContext` for editor datasource component

## 0.5.7

### Patch Changes

- [#39797](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39797) [`43bb8818f18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43bb8818f18) - Pasting a datasource now only requires a single undo to revert
- Updated dependencies

## 0.5.6

### Patch Changes

- [#39614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39614) [`d5c28c4c0df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5c28c4c0df) - Updated jira issues quick insert menu description.
- Updated dependencies

## 0.5.5

### Patch Changes

- [#39647](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39647) [`7ff427bb457`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ff427bb457) - Add datasources to macro menu categories

## 0.5.4

### Patch Changes

- [#39612](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39612) [`dfb663969a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb663969a0) - ED-19820: Fix for table scroll when insert media node when extended-resize-experience is off

## 0.5.3

### Patch Changes

- [#39460](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39460) [`882e4e88358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/882e4e88358) - Add playwright tests and add test ids to find elements

## 0.5.2

### Patch Changes

- [#39327](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39327) [`386b8378aeb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/386b8378aeb) - Datasource ADF no longer included when feature flag call from canRenderDatasource returns false

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325) [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 0.4.9

### Patch Changes

- [#39010](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39010) [`8467bdcdf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8467bdcdf4f) - Removing `dependencies` prop from PluginInjectionAPI and changing
  signature of `NextEditorPlugin`.

  Previously a `NextEditorPlugin` would be consumed as so:

  ```ts
  const plugin: NextEditorPlugin< ... > = (config, api) => {
    // Can use api like so:
    api.dependencies.core.actions.execute( ... )
    return { ... }
  }
  ```

  Now these have become named parameters like so and the `pluginInjectionAPI` is used
  without the `dependencies` prop:

  ```ts
  const plugin: NextEditorPlugin< ... > = ({ config, api }) => {
    // Can use api like so:
    api.core.actions.execute( ... )
    return { ... }
  }
  ```

- Updated dependencies

## 0.4.8

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177) [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 0.4.7

### Patch Changes

- [#39036](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39036) [`9c86163d326`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c86163d326) - [ux] Adds ability to edit Assets datasource modal from inserted table

## 0.4.6

### Patch Changes

- [#38976](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38976) [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change adf-schema to fixed versioning

## 0.4.5

### Patch Changes

- Updated dependencies

## 0.4.4

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [#37887](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37887) [`bdb69158e0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb69158e0a) - [ED-13910] Bump ProseMirror libraries to match prosemirror-view@1.31.6 dependencies
- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [#37644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37644) [`b9a083dc04d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9a083dc04d) - [ux] Adds error boundaries specific to datasource in editor and renderer. Fallback to unsupported block if no url or inline if url

## 0.3.9

### Patch Changes

- Updated dependencies

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- [#37702](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37702) [`31405891e32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31405891e32) - Extract editor disabled plugin as separate package.
- Updated dependencies

## 0.3.6

### Patch Changes

- [#37984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37984) [`fd24b65bb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd24b65bb62) - Fix table width bug when layout is undefined for datasource.

## 0.3.5

### Patch Changes

- [#37027](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37027) [`f9cdc991f20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cdc991f20) - Updates analytics to better support datasources
- Updated dependencies

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [#37505](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37505) [`02d1ab1d57d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02d1ab1d57d) - Improve DnD Experience in Datasource Table view

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785) [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.3.0

### Minor Changes

- [#36823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36823) [`632edbf1930`](https://bitbucket.org/atlassian/atlassian-frontend/commits/632edbf1930) - Updates card plugin floating toolbar to fire an analytic event when viewed.

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [#37357](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37357) [`6255c2ad1c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6255c2ad1c9) - [ux] Adds ability to open Assets datasource dialog using the slash command in the editor, behind a feature flag

## 0.2.3

### Patch Changes

- [#36875](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36875) [`e86c43db633`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e86c43db633) - Updates card plugin to skip finding changed links for analytics for transactions with TableSortStep

## 0.2.2

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340) [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out of peer dependency enforcement

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#36750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36750) [`6bacee18c2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bacee18c2d) - [ux] Add new allowDatasource prop for enabling datasource in editor and add inlineCard fallback render for blockCard with datasource

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757) [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add postinstall check to enforce internal peer dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
