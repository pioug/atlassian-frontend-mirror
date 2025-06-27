# @atlaskit/reactions

## 33.1.2

### Patch Changes

- Updated dependencies

## 33.1.1

### Patch Changes

- Updated dependencies

## 33.1.0

### Minor Changes

- [#170825](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170825)
  [`944add6db1310`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/944add6db1310) -
  Adding an option to optimistically load the emoji using the reaction imagePath.

## 33.0.2

### Patch Changes

- Updated dependencies

## 33.0.1

### Patch Changes

- [#168917](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168917)
  [`06e3a9a376da3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06e3a9a376da3) -
  [ux] Bug fix for wrong animation being rendered on the byline for page reactions

## 33.0.0

### Major Changes

- [#167562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167562)
  [`7716ba2e99acf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7716ba2e99acf) -
  [ux] Removing prevent overflow options from the reactions picker component since it is no longer
  being used

## 32.0.1

### Patch Changes

- [#166885](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166885)
  [`51bd4b21a4845`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51bd4b21a4845) -
  Adding vr tests for the summary view icon after prop

## 32.0.0

### Major Changes

- [#166079](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166079)
  [`938072fa984ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/938072fa984ec) -
  [ux] Removes showRoundTrigger prop and related styling since it is no longer used

## 31.20.0

### Minor Changes

- [#165300](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165300)
  [`14a650aa14dfb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14a650aa14dfb) -
  [ux] add new optional xcss prop on EmojiPlaceholder to allow custom background colors on the
  loading skeletons for emojis. Changes the ReactionSummaryButton to use a lighter shade of grey.

### Patch Changes

- Updated dependencies

## 31.19.1

### Patch Changes

- Updated dependencies

## 31.19.0

### Minor Changes

- [#162088](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162088)
  [`0734bf6d32ef7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0734bf6d32ef7) -
  [ux] Adds the reaction particle effect to the summary view button

## 31.18.0

### Minor Changes

- [#157154](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157154)
  [`d78707903f424`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d78707903f424) -
  change reactionPicker popup content to use "offset" instead of "margin" for spacing

### Patch Changes

- Updated dependencies

## 31.17.0

### Minor Changes

- [#157885](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157885)
  [`8c821941d9bda`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c821941d9bda) -
  [ux] Modify reactions hoverclick behavior for old reactions picker

## 31.16.0

### Minor Changes

- [#158089](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158089)
  [`8bd7992c5148d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8bd7992c5148d) -
  force recalculate the reactionSummaryView popup when going from summary view to emoji picker.
  Should stop the emoji picker from rendering off screen.

## 31.15.0

### Minor Changes

- [#157074](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157074)
  [`0c1f766dcb979`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c1f766dcb979) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

## 31.14.0

### Minor Changes

- [#152437](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152437)
  [`94e3e53ca794c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94e3e53ca794c) -
  Adds a passthrough prop to enable optimistic emoji rendering for the reactions summary in SSR

## 31.13.0

### Minor Changes

- [#156164](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156164)
  [`f0d8ffc2480b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0d8ffc2480b7) -
  [ux] Changes the behavior for the hoverable summary button and empty reactions trigger

### Patch Changes

- Updated dependencies

## 31.12.0

### Minor Changes

- [#152199](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152199)
  [`08298b62373b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08298b62373b8) -
  Updating scripts to explicitly use yarn start:webpack since yarn start doesn't currently support
  the --proxy flag when rspack is used as a bundler

### Patch Changes

- Updated dependencies

## 31.11.0

### Minor Changes

- [#153904](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153904)
  [`881d29f1df066`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/881d29f1df066) -
  [ux] Updates the vertical positioning of the reactions counter for updated byline page reactions
  styles

## 31.10.0

### Minor Changes

- [#152755](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152755)
  [`a19a563a40597`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a19a563a40597) -
  make reactions picker popup opened in portal, and revert popper strategy to fix from absolute

### Patch Changes

- Updated dependencies

## 31.9.0

### Minor Changes

- [#153222](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153222)
  [`a88a4a1473714`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a88a4a1473714) -
  refactor how the "add new emoji" button in the reactions summary dropdown is rendered. it now
  shares a popup component instead of having its own that is offset to look like the same one

### Patch Changes

- [#153159](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153159)
  [`4a248e83c7f9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4a248e83c7f9f) -
  Refactoring reposition on update to remove redundant isOpen prop

## 31.8.1

### Patch Changes

- Updated dependencies

## 31.8.0

### Minor Changes

- [#152134](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152134)
  [`9d7c343ded23e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d7c343ded23e) -
  [ux] Adds an optional side picker emoji icon to the reaction summary button

## 31.7.0

### Minor Changes

- [#150353](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150353)
  [`fb0f2127ccd01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb0f2127ccd01) -
  [ux] Removes reactions trigger tooltip when the reaction trigger already has text
- [#152335](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152335)
  [`e863365b1e932`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e863365b1e932) -
  Pass reactionPickerPlacement prop into Reactions component to allow for differing aligment of
  reaction picker popup

## 31.6.3

### Patch Changes

- [#151050](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151050)
  [`bed009e6ccbf2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bed009e6ccbf2) -
  A11y fix to allow screenreaders to read out the current emoji counts

## 31.6.2

### Patch Changes

- Updated dependencies

## 31.6.1

### Patch Changes

- [#149379](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149379)
  [`5a2aafb7bc8ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a2aafb7bc8ce) -
  Fixes a bug when triggering a reaction where the mix of float and fade keyframe animations weren't
  working in CJS and ESM distribution targets for packages from a bug in Compiled CSS-in-JS.

## 31.6.0

### Minor Changes

- [#147980](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147980)
  [`ee0f8520e320c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee0f8520e320c) -
  [ux] Adds a hoverable reaction picker mode for empty reactions state as part of byline reactions
  changes

## 31.5.2

### Patch Changes

- [#148201](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148201)
  [`8e811f1840de7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e811f1840de7) -
  Either actively or pre-emptively fixes a bug with keyframe animations in CJS and ESM distribution
  targets for packages using Compiled CSS-in-JS. This may not affect this package, but the change
  was made so a future migration does not accidentally break it.
- Updated dependencies

## 31.5.1

### Patch Changes

- [#145524](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145524)
  [`c667c355bfcf6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c667c355bfcf6) -
  Adding property to wrap button in list item when true

## 31.5.0

### Minor Changes

- [#145160](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145160)
  [`cab4c531afd63`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cab4c531afd63) -
  [ux] Modifies the clicking behavior for the hoverable summary view feature

## 31.4.0

### Minor Changes

- [#144510](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144510)
  [`9d23464afe923`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d23464afe923) -
  [ux] adding delay to opening/closing the summary view tray when hovering is enabled via the
  hoverableSummaryView prop

### Patch Changes

- Updated dependencies

## 31.3.1

### Patch Changes

- [#142842](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142842)
  [`63265d6000c11`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63265d6000c11) -
  Internal change to migrate to Compiled CSS-in-JS styling.
- Updated dependencies

## 31.3.0

### Minor Changes

- [#143861](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143861)
  [`54b42c1ffa021`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/54b42c1ffa021) -
  [ux] Updating the UI for the summary tray that includes the reaction picker

## 31.2.0

### Minor Changes

- [#143535](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143535)
  [`a39ad7cdc2c99`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a39ad7cdc2c99) -
  [ux] Adds hoverable reactions summary functionality behind a prop as part of byline reactions
  changes

## 31.1.0

### Minor Changes

- [#142643](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142643)
  [`ec49a2c4909a4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec49a2c4909a4) -
  [ux] Updates the emoji picker positioning when opened from the summary view reaction picker
  trigger

### Patch Changes

- Updated dependencies

## 31.0.1

### Patch Changes

- [#141388](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141388)
  [`daff9675d1417`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/daff9675d1417) -
  Adding a comment to reactions component to explain previous functionality for development

## 31.0.0

### Major Changes

- [#140004](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140004)
  [`45db426b36675`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45db426b36675) -
  [ux] Updated summary view tray to include reactions picker with new design as part of byline
  reactions changes. Also cleaned up compact styles as it was no longer being used, as well as fixed
  a prop not being spelled correctly.

## 30.0.8

### Patch Changes

- [#138792](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138792)
  [`aec039377f39e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aec039377f39e) -
  tidy up feature flag of compiled css migration

## 30.0.7

### Patch Changes

- Updated dependencies

## 30.0.6

### Patch Changes

- [#137066](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137066)
  [`9090c9149afb4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9090c9149afb4) -
  correctly import compiled css version of reaction picker

## 30.0.5

### Patch Changes

- Updated dependencies

## 30.0.4

### Patch Changes

- Updated dependencies

## 30.0.3

### Patch Changes

- Updated dependencies

## 30.0.2

### Patch Changes

- [#130224](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130224)
  [`d075c99b9abd7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d075c99b9abd7) -
  migrate to compiled css for reaction picker and reaction summary view

## 30.0.1

### Patch Changes

- [#131283](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131283)
  [`8ee415b479d07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ee415b479d07) -
  Migrates reactions dialog to compiled css

## 30.0.0

### Major Changes

- [#131299](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131299)
  [`0875459adf75f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0875459adf75f) -
  [ux] removing reactionPickerAdditionalStyle

## 29.1.1

### Patch Changes

- Updated dependencies

## 29.1.0

### Minor Changes

- [#129898](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129898)
  [`81e708666c01b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81e708666c01b) -
  [ux] Fix reactions button alignment styling

## 29.0.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 29.0.0

### Major Changes

- [#129339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129339)
  [`fbade126d118d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fbade126d118d) -
  [ux] Removes the showRoundTrigger prop since it is not being used after an implementation change.

## 28.0.0

### Major Changes

- [#128076](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128076)
  [`d93c6aab425f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d93c6aab425f1) -
  migrate reactions styles to compiled css

### Patch Changes

- Updated dependencies

## 27.2.1

### Patch Changes

- Updated dependencies

## 27.2.0

### Minor Changes

- [#127089](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127089)
  [`ec78c2756240e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec78c2756240e) -
  Adding an optional placement and overflow control for reactions popper

### Patch Changes

- Updated dependencies

## 27.1.5

### Patch Changes

- [#126792](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126792)
  [`ac38e3b73e5ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ac38e3b73e5ab) -
  add interactionName to Spinner
- Updated dependencies

## 27.1.4

### Patch Changes

- [#126476](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126476)
  [`7f1dfd438c788`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f1dfd438c788) -
  [ux] Add new prop to control updated summary view styling to achieve byline alignment in product
- Updated dependencies

## 27.1.3

### Patch Changes

- Updated dependencies

## 27.1.2

### Patch Changes

- [#125203](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125203)
  [`8b6c24cf0f169`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b6c24cf0f169) -
  [ux] Update emoji and button styling to smaller for compact style. Also update font color to match
  other byline items.
- Updated dependencies

## 27.1.1

### Patch Changes

- Updated dependencies

## 27.1.0

### Minor Changes

- [#123407](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123407)
  [`efdf36c53ac41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/efdf36c53ac41) -
  [ux] Updates Reactions API to include a allowSelectFromSummaryView prop which controls if we add
  an emoji pickerto the summary view. Also creates a new emoji picker component to use in this view.

## 27.0.0

### Major Changes

- [#122626](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122626)
  [`28c2e5656229f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28c2e5656229f) -
  Updates the API by removing the optional boolean prop showMoreEmojiTriggerUI and instead adds two
  new props reactionPickerTriggerIcon and reactionPickerTriggerTooltipContent to have more control
  for displaying changes in the Trigger. Currently only Confluence was using this prop so the change
  should be non-breaking but still marking as major since it's an API update.

### Patch Changes

- Updated dependencies

## 26.5.1

### Patch Changes

- Updated dependencies

## 26.5.0

### Minor Changes

- [#119713](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119713)
  [`d0beb32e29ba5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0beb32e29ba5) -
  [ux] Adds two new optional props to Reactions package to control subtle styling for default
  reactions and update the Trigger UI/tooltip for the ... UI. Also exports the closeManager.

## 26.4.2

### Patch Changes

- Updated dependencies

## 26.4.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 26.4.0

### Minor Changes

- [#117805](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117805)
  [`1eed800de1541`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1eed800de1541) -
  added conditional styles for container wrap and positioning

## 26.3.2

### Patch Changes

- [#118247](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118247)
  [`e1a483946dc0d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1a483946dc0d) -
  [ux] Passing additional prop named reactionPickerAdditionalStyle to enable selected state on the
  reaction picker

## 26.3.1

### Patch Changes

- Updated dependencies

## 26.3.0

### Minor Changes

- [#118041](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118041)
  [`a003b1b7d2126`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a003b1b7d2126) -
  [ux] Updates the border radius of StaticReaction component to match ReactionButton border shape

## 26.2.0

### Minor Changes

- [#118541](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118541)
  [`40add733890e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40add733890e6) -
  [ux] Uses showRoundTrigger to determine if Popper will be placed with 'left' positioning

## 26.1.1

### Patch Changes

- Updated dependencies

## 26.1.0

### Minor Changes

- [#116526](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/116526)
  [`a8ce8f4cbde31`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8ce8f4cbde31) -
  Track Reactions and Reactions Dialog using react-ufo and add source to open dialog handler

### Patch Changes

- Updated dependencies

## 26.0.1

### Patch Changes

- Updated dependencies

## 26.0.0

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

## 25.6.1

### Patch Changes

- [#117334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117334)
  [`e8ff97d0f197f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e8ff97d0f197f) -
  [ux] Fix test and remove unused prop after a previous clean up of reactions selector delay

## 25.6.0

### Minor Changes

- [#115993](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115993)
  [`b41f57ae81daf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b41f57ae81daf) -
  [ux] Makes reactions behind the isViewOnly prop view-only in the tray, not allowing further
  reactions and applies view only styles
- [#116057](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116057)
  [`4eaacc70b49dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4eaacc70b49dd) -
  [ux] Close tooltip after Reaction Dialog is opened and fix outdated tests

## 25.5.1

### Patch Changes

- Updated dependencies

## 25.5.0

### Minor Changes

- [#113818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113818)
  [`ae63179ab3076`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae63179ab3076) -
  [ux] Reactions Dialog changed after leadership review to remove border from meatball menu. Also
  misc fixes like fixing button accessibility for the meatball, and removing left navigation button
  from tablist

## 25.4.1

### Patch Changes

- Updated dependencies

## 25.4.0

### Minor Changes

- [#115405](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115405)
  [`8f77c2c8c5307`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f77c2c8c5307) -
  [ux] Adds the isViewOnly prop to the reactions component, making the picker disabled and
  preventing addition of new reactions

## 25.3.0

### Minor Changes

- [#114320](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114320)
  [`5ab40880ad189`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ab40880ad189) -
  [ux] Adds a new showRoundTrigger prop to the ReactionPicker component which is used in Trigger
  component to display a round hover border around the trigger button.

## 25.2.1

### Patch Changes

- Updated dependencies

## 25.2.0

### Minor Changes

- [#113141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113141)
  [`2b9b00172281b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2b9b00172281b) -
  Added new 'onlyRenderPicker' property to hide user reactions and only render picker

## 25.1.0

### Minor Changes

- [#112754](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112754)
  [`281e77ddc6053`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/281e77ddc6053) -
  [ux] Reactions Dialog updates - move navigation buttons next to tabs, move close handler from
  footer to header, add tooltips on reaction hover, change CTA into meatball menu, remove
  subheading, adjust modal body bottom padding

## 25.0.0

### Major Changes

- [#109511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109511)
  [`3b4db09205e2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3b4db09205e2f) -
  The `Counter` component no longer accepts an arbitrary duration in ms and instead only offers an
  enum of static durations: `small` = 100ms, `medium` = 350ms, `large` = 700ms and `none` = 0.

### Patch Changes

- Updated dependencies

## 24.10.1

### Patch Changes

- Updated dependencies

## 24.10.0

### Minor Changes

- [#111959](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111959)
  [`0411f7100eec8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0411f7100eec8) -
  [ux] Move "View all" button before the "Add reaction" button and make button non-subtle

## 24.9.0

### Minor Changes

- [#110049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110049)
  [`27aa41be2259d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/27aa41be2259d) -
  Create new UFO experience for page navigation in Reactions Dialog along with a new prop that
  accepts a page change handler. Also refactor code when opening dialog, and update tests

## 24.8.0

### Minor Changes

- [#111042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111042)
  [`6e5ef11d2a9e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e5ef11d2a9e6) -
  [ux] Refactor Reactions Dialog to have sticky header and change dialog rendering condition for
  ReactionSummaryView

## 24.7.0

### Minor Changes

- [#110663](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110663)
  [`ec41000e84d80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ec41000e84d80) -
  [ux] Update styling of Reactions Dialog entrypoint and the Dialog itself

### Patch Changes

- Updated dependencies

## 24.6.0

### Minor Changes

- [#108823](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108823)
  [`2789da849cf6c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2789da849cf6c) -
  [ux] Add reactions dialog entrypoint into ReactionSummaryView primarily for live pages

## 24.5.1

### Patch Changes

- Updated dependencies

## 24.5.0

### Minor Changes

- [#109300](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109300)
  [`e78402bbbad97`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e78402bbbad97) -
  [ux] Fixes a minor bug where Reactions Dialog was causing reactions to be sorted in place
  affecting the Reactions parent component. Dialog feature gate also has been updated

## 24.4.1

### Patch Changes

- [#108797](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108797)
  [`9a3f165bc940b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a3f165bc940b) -
  tidy up feature flag confluence_frontend_editor_custom_presets

## 24.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 24.3.0

### Minor Changes

- [#108357](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108357)
  [`dd0053af6d370`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd0053af6d370) -
  [ux] "And X others" entrypoint into Reactions Dialog removed. "More info" entrypoint removed and
  completely deleted from ReactionTooltip

## 24.2.0

### Minor Changes

- [#108078](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108078)
  [`d7e3f8c56ff08`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7e3f8c56ff08) -
  [ux] Adds the profileCardWrapper prop which adds an on-hover interaction to the Avatar picture and
  shows the user's profile card

## 24.1.0

### Minor Changes

- [#106745](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106745)
  [`d3fc0dc988c34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3fc0dc988c34) -
  [ux] UI updates to improve spacing and text appearance. Business logic updates on when to render
  dialog entrypoint

## 24.0.1

### Patch Changes

- Updated dependencies

## 24.0.0

### Major Changes

- [#105233](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105233)
  [`e66f08655d260`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e66f08655d260) -
  [ux] Update Reactions Dialog to use pagination instead of horizontal scroll

## 23.0.2

### Patch Changes

- Updated dependencies

## 23.0.1

### Patch Changes

- Updated dependencies

## 23.0.0

### Major Changes

- [#101694](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101694)
  [`948ffe9fc5518`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/948ffe9fc5518) -
  Update and add i18n translations for Reactions Dialog

## 22.16.14

### Patch Changes

- Updated dependencies

## 22.16.13

### Patch Changes

- [#99467](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99467)
  [`118e81bbb4659`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/118e81bbb4659) -
  Internal changes to typography.

## 22.16.12

### Patch Changes

- Updated dependencies

## 22.16.11

### Patch Changes

- Updated dependencies

## 22.16.10

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 22.16.9

### Patch Changes

- Updated dependencies

## 22.16.8

### Patch Changes

- Updated dependencies

## 22.16.7

### Patch Changes

- Updated dependencies

## 22.16.6

### Patch Changes

- Updated dependencies

## 22.16.5

### Patch Changes

- Updated dependencies

## 22.16.4

### Patch Changes

- Updated dependencies

## 22.16.3

### Patch Changes

- [#165681](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165681)
  [`57716f58fccef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57716f58fccef) -
  [ux] typography changes to text and heading
- Updated dependencies

## 22.16.2

### Patch Changes

- Updated dependencies

## 22.16.1

### Patch Changes

- Updated dependencies

## 22.16.0

### Minor Changes

- [#165604](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165604)
  [`ad82b7ebbed5f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad82b7ebbed5f) -
  Update font size to use tokens

### Patch Changes

- Updated dependencies

## 22.15.0

### Minor Changes

- [#161683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161683)
  [`f3f374290027a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3f374290027a) -
  Adding en-zz locale support to elements package

### Patch Changes

- Updated dependencies

## 22.14.14

### Patch Changes

- Updated dependencies

## 22.14.13

### Patch Changes

- Updated dependencies

## 22.14.12

### Patch Changes

- Updated dependencies

## 22.14.11

### Patch Changes

- Updated dependencies

## 22.14.10

### Patch Changes

- Updated dependencies

## 22.14.9

### Patch Changes

- Updated dependencies

## 22.14.8

### Patch Changes

- [#151016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151016)
  [`0068e5e95e9ee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0068e5e95e9ee) -
  Revert PR 149802 due to hot-112390

## 22.14.7

### Patch Changes

- [#149425](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149425)
  [`35d615fbf3bfa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35d615fbf3bfa) -
  change reactions popup from fixed to absolute strategy
- Updated dependencies

## 22.14.6

### Patch Changes

- Updated dependencies

## 22.14.5

### Patch Changes

- Updated dependencies

## 22.14.4

### Patch Changes

- Updated dependencies

## 22.14.3

### Patch Changes

- Updated dependencies

## 22.14.2

### Patch Changes

- [#145874](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145874)
  [`eff2c975a0993`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eff2c975a0993) -
  ESS-6182 upgrade react dep

## 22.14.1

### Patch Changes

- Updated dependencies

## 22.14.0

### Minor Changes

- [#144209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144209)
  [`8a016767c9e26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a016767c9e26) -
  [ux] Enable new icons behind a feature flag.

### Patch Changes

- Updated dependencies

## 22.13.3

### Patch Changes

- Updated dependencies

## 22.13.2

### Patch Changes

- Updated dependencies

## 22.13.1

### Patch Changes

- [#141784](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141784)
  [`4659618940d86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4659618940d86) -
  Pass reactions count into success callback

## 22.13.0

### Minor Changes

- [#138899](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138899)
  [`5d280e98cb44f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d280e98cb44f) -
  Add on reactions success callback to reactions component

## 22.12.1

### Patch Changes

- Updated dependencies

## 22.12.0

### Minor Changes

- [#137371](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137371)
  [`1eb8eea490922`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1eb8eea490922) -
  [ux] Added props for applying subtle styling to reactions summary and picker. Added prop for
  displaying the full "Add a reaction" text to the button UI for the reactions picker. Added prop
  for hiding default reactions displayed when there is no existing reaction on the page.

### Patch Changes

- Updated dependencies

## 22.11.2

### Patch Changes

- Updated dependencies

## 22.11.1

### Patch Changes

- Updated dependencies

## 22.11.0

### Minor Changes

- [#134822](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134822)
  [`10fb92b357895`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10fb92b357895) -
  [ux] Jira Visual Refresh changes for reactions

### Patch Changes

- Updated dependencies

## 22.10.16

### Patch Changes

- Updated dependencies

## 22.10.15

### Patch Changes

- Updated dependencies

## 22.10.14

### Patch Changes

- [#131670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131670)
  [`cf2674202fc67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf2674202fc67) -
  CCA11Y-1062 - Introduced aria-pressed in reaction button for a11y reasons

## 22.10.13

### Patch Changes

- Updated dependencies

## 22.10.12

### Patch Changes

- Updated dependencies

## 22.10.11

### Patch Changes

- Updated dependencies

## 22.10.10

### Patch Changes

- Updated dependencies

## 22.10.9

### Patch Changes

- Updated dependencies

## 22.10.8

### Patch Changes

- [#128413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128413)
  [`cc1157d1b37f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc1157d1b37f9) -
  [ux] Ensure that particle animations only appear once after adding reaction

## 22.10.7

### Patch Changes

- Updated dependencies

## 22.10.6

### Patch Changes

- Updated dependencies

## 22.10.5

### Patch Changes

- Updated dependencies

## 22.10.4

### Patch Changes

- [#126748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126748)
  [`17d07f73f9b89`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17d07f73f9b89) -
  [ux] Change the styling of the reactions summary popup
- Updated dependencies

## 22.10.3

### Patch Changes

- [#124009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124009)
  [`1b172cc669c8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b172cc669c8e) -
  [ux] add support for opaque backgrounds in pre-existing reaction buttons while in summary view
- Updated dependencies

## 22.10.2

### Patch Changes

- Updated dependencies

## 22.10.1

### Patch Changes

- [#119960](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119960)
  [`77542b34dfee2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77542b34dfee2) -
  Exposed particleEffectByEmoji prop in ConnectedReactionsView to support particle effect
- Updated dependencies

## 22.10.0

### Minor Changes

- [#120418](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120418)
  [`a0121db0d5a1c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a0121db0d5a1c) -
  [ux] Add support for quick reactions to summary view

## 22.9.0

### Minor Changes

- [#120256](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120256)
  [`2cbfadca64339`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2cbfadca64339) -
  Added ability to adjust placement of Summarized Reactions Pop-up. Made the Summarized Reactions
  button toggleable

### Patch Changes

- Updated dependencies

## 22.8.5

### Patch Changes

- [#118651](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118651)
  [`cd0076681b737`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd0076681b737) -
  hide floating reactions effect when user opts for reduced motion

## 22.8.4

### Patch Changes

- Updated dependencies

## 22.8.3

### Patch Changes

- Updated dependencies

## 22.8.2

### Patch Changes

- Updated dependencies

## 22.8.1

### Patch Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`f0dec2710f268`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f0dec2710f268) -
  [ux] Removes selected reaction animation. The previous version 22.7.4 unintentionally
  re-introduced an animation of selected reactions which already existed but was previously broken.
  It was decided to remove this animation instead. The delay between selecting a reaction and
  closing the selection popup was removed as this was only delayed to accomodate the animation.

## 22.8.0

### Minor Changes

- [`f67c5ff12702a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f67c5ff12702a) -
  [ux] Added a new summary feature to reactions

## 22.7.5

### Patch Changes

- Updated dependencies

## 22.7.4

### Patch Changes

- [#113286](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113286)
  [`3099017035f37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3099017035f37) -
  Migrate native HTML buttons to Pressable primitive.
- Updated dependencies

## 22.7.3

### Patch Changes

- Updated dependencies

## 22.7.2

### Patch Changes

- [#112164](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112164)
  [`9483ff476c29c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9483ff476c29c) -
  [ux] Migrated native HTML buttons to Pressable from `@atlaskit/primitives`.

## 22.7.1

### Patch Changes

- Updated dependencies

## 22.7.0

### Minor Changes

- [#93855](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93855)
  [`2c1bba58469b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c1bba58469b) -
  [ux] Added Particle effect to reactions

## 22.6.3

### Patch Changes

- [#92860](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92860)
  [`7af6143adb5c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7af6143adb5c) -
  Update owning team

## 22.6.2

### Patch Changes

- Updated dependencies

## 22.6.1

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 22.6.0

### Minor Changes

- [#91586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91586)
  [`b3135ab49e16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3135ab49e16) -
  Updated `@atlaskit/tabs` dependency which removed baked-in horizontal padding. There may be some
  very slight difference in padding after this change.

### Patch Changes

- Updated dependencies

## 22.5.13

### Patch Changes

- [#91862](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91862)
  [`02c06e61c6f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/02c06e61c6f9) -
  [ux] Update spacing styles to use tokens

## 22.5.12

### Patch Changes

- [#83297](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83297)
  [`6b1707c169e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b1707c169e0) -
  The internal composition of this component has changed. There is no expected change in behaviour.

## 22.5.11

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 22.5.10

### Patch Changes

- [#81006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81006)
  [`d91d334a84c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d91d334a84c0) -
  React 18 types for @atlaskit/reactions

## 22.5.9

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 22.5.8

### Patch Changes

- Updated dependencies

## 22.5.7

### Patch Changes

- Updated dependencies

## 22.5.6

### Patch Changes

- Updated dependencies

## 22.5.5

### Patch Changes

- Updated dependencies

## 22.5.4

### Patch Changes

- [#42502](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42502)
  [`d1298d300a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1298d300a5) - Remove
  export all declarations and import namespace specifiers

## 22.5.3

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 22.5.2

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 22.5.1

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 22.5.0

### Minor Changes

- [#34797](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34797)
  [`3920dcfd848`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3920dcfd848) - This
  removes the feature flag made for upgrading the `focus-trap` dependency and keeps `focus-trap` at
  it's original version.

## 22.4.0

### Minor Changes

- [`ac5a05f5929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac5a05f5929) - We are
  testing an upgrade to the `focus-trap` dependency behind a feature flag. If this fix is successful
  it will be available in a later release.

## 22.3.3

### Patch Changes

- [#33870](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33870)
  [`82f7f9600a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82f7f9600a9) - Migrated
  to declarative entry points internally for emoji and reactions. Public API is unchanged.

## 22.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 22.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 22.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 22.2.9

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`50e0e3c23bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50e0e3c23bd) - fix
  error handling for get reactions

## 22.2.8

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 22.2.7

### Patch Changes

- [#31891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31891)
  [`419eaff2c03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/419eaff2c03) - fix
  focus trap not deactivated issue in reaction picker
- Updated dependencies

## 22.2.6

### Patch Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299)
  [`6b5bf5505b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b5bf5505b6) - revert
  atlaskit popup refactor in reaction picker
- [`db658265a45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db658265a45) - add
  sampling for reaction view analytics
- [`c84afc8fbd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c84afc8fbd8) - [ux] add
  focus trap to reaction picker
- [`ed219dee1bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed219dee1bd) - refactor
  reactions picker with @atlaskit/popup
- Updated dependencies

## 22.2.5

### Patch Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248)
  [`dfbecb4aa7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfbecb4aa7c) - [ux]
  [COLLAB-2263] allow `Enter` to open Show more to show emoji picker, allow `ESC` to close emoji
  picker / reaction selector.
- Updated dependencies

## 22.2.4

### Patch Changes

- [#29990](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29990)
  [`c78b97a8b2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c78b97a8b2b) - Remove
  explicit width from reaction counter container

## 22.2.3

### Patch Changes

- [#29470](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29470)
  [`3592739fb5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3592739fb5b) - [ux]
  hide tooltip of add reaction when reaction picker is opened
- Updated dependencies

## 22.2.2

### Patch Changes

- [#29667](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29667)
  [`d16c7d57428`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d16c7d57428) - Update
  teams.json to reflect current team

## 22.2.1

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`718d5ad3044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/718d5ad3044) - Updates
  to support the new `@atlaskit/tokens` theming API.
- Updated dependencies

## 22.2.0

### Minor Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932)
  [`c3868fc0d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3868fc0d7a) - [ux]
  remove extra spacing around reactions

### Patch Changes

- [`545e6461ac1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/545e6461ac1) - Fixed
  incorrect trigger click behaviour

## 22.1.0

### Minor Changes

- [#28374](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28374)
  [`14258b03842`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14258b03842) - make
  reaction buttons more compact, and introduce miniMode for add reaction button

## 22.0.4

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 22.0.3

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`16aa7646472`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16aa7646472) - update
  ufo sampling rate due to change of sampling algorithm
- Updated dependencies

## 22.0.2

### Patch Changes

- Updated dependencies

## 22.0.1

### Patch Changes

- Updated dependencies

## 22.0.0

### Major Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`0617b7ef2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0617b7ef2aa) - [ux]
  Created a new prop, allowUserDialog, that enables an actionable tooltip link to see a detailed
  breakdown of reacted users. The reactions dialog shows the complete user list for the currently
  selected reaction, as well as, the user list for all other reactions. Can tab or click through the
  reactions list to see all reactions and user lists.

  Allow handling of numbers up to 999M and truncate them accordingly. 1000 => 1K, 1,500 => 1.5K,
  1,000,000 => 1M

### Minor Changes

- [`cf558ddee28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf558ddee28) - [ux] add
  see who reacted button to view all reacted users in a modal, and make reactions more friendly to
  keyboard users
- [`4f5ecac139f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f5ecac139f) - [ux]
  Provide `emojiPickerSize` option for reaction picker, including `small`, `medium`, and `large`.
  Emoji picker will be `medium` size by default, which will show more emojis.

### Patch Changes

- [`7cfd0383741`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cfd0383741) - Add UFO
  metrics for the Reactions Dialog
- [`ac2824857ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac2824857ec) -
  Reactionspicker - fix onClose event gets triggered on each click inside document
- [`f84d560bdbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f84d560bdbd) - make
  onReactionHover depreacted so it's backwards compatible
- [`99b7758e403`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99b7758e403) - support
  pluralization for reactions count message in reactions dialog
- [`b1e9279b174`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1e9279b174) - Fixing
  the closing animation for Reactions dialog window
- Updated dependencies

## 21.8.1

### Patch Changes

- Updated dependencies

## 21.8.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`cb37ece1f9e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb37ece1f9e) - Add aria
  expanded and aria cotrols to reaction picker toggle

### Patch Changes

- [`d74d5065a25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d74d5065a25) - minor
  analytics update
- [`2d0d8c066d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d0d8c066d4) - Upgrade
  emotion library inside Reactions to use version 11
- [`ee2a087d647`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee2a087d647) - Reducing
  Enzyme dependencies across reactions unit tests and move the testint-library
- Updated dependencies

## 21.7.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`e2635f36d53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2635f36d53) - Adds new
  optional prop to <ReactionPicker /> component to setup the content for the tooltip on the add new
  reaction element [ux] This adds a border around the Add reaction button according with new design
  requirements
- [`ce1ceee9114`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce1ceee9114) - Refactor
  props of <Reactions /> component to better infer types from quickReactionEmojiIds to
  quickReactionEmojis

### Patch Changes

- [`4b6f775e6c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b6f775e6c0) - update
  reaction picker position at the edge of window
- [`b2be1d1c8d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2be1d1c8d2) - removing
  title of reaction buttons
- [`458aabb9add`](https://bitbucket.org/atlassian/atlassian-frontend/commits/458aabb9add) - Remove
  tooltip when reactions are disabled
- [`a62cf3c2b49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a62cf3c2b49) - fix
  emoji upload in reaction picker
- Updated dependencies

## 21.6.2

### Patch Changes

- Updated dependencies

## 21.6.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 21.6.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`41d75524c76`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41d75524c76) - Upgrade
  @atlaskit/reactions to use functional components, add comments and cleanup outdated legacy code
- [`d840e9e5c90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d840e9e5c90) - show
  proper error message in tooltip if failed to get reactions

### Patch Changes

- Updated dependencies

## 21.5.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 21.5.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`e3192fc9dc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3192fc9dc2) - Fix add
  own emoji in reaction picker

### Patch Changes

- [`ac51581fc14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac51581fc14) - Update
  the examples, docs descriptions and added tsdoc comments to relevant components and objects
- Updated dependencies

## 21.4.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`34155ee7563`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34155ee7563) - add
  sampling for 2 ufo experiences to reduce volume of analytics

### Patch Changes

- Updated dependencies

## 21.3.4

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`c3f9e9bce1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3f9e9bce1c) - Add
  custom information to failure and abort events for UFO experiences
- Updated dependencies

## 21.3.3

### Patch Changes

- [#22299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22299)
  [`7f1dd280229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f1dd280229) - Fix
  styling issue in the reaction emoji while hovering on it for the first time

## 21.3.2

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`1940b04de7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1940b04de7d) - Adding
  new UFO experience for contents list of reacted users should be able to be fetched reliably
- Updated dependencies

## 21.3.1

### Patch Changes

- Updated dependencies

## 21.3.0

### Minor Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`8db47b60a8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db47b60a8f) - [ux]
  Updated reactions count color to be accessible, pluralize the more emojis tooltip, and stopped the
  reactions button click event from propagating into the reactions tooltip.

### Patch Changes

- Updated dependencies

## 21.2.5

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes
  to support Node 16 Typescript definitions from `@types/node`.

## 21.2.4

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 21.2.3

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`d64aafec153`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d64aafec153) - Fixed
  bug where clicking on tooltip triggered a reaction
- Updated dependencies

## 21.2.2

### Patch Changes

- [#20484](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20484)
  [`58a563ece8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58a563ece8f) - Add
  ComponentName as part of the exported enum collection for easier consumption inside products

## 21.2.1

### Patch Changes

- [#20447](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20447)
  [`783c8c02335`](https://bitbucket.org/atlassian/atlassian-frontend/commits/783c8c02335) - Update
  the reactions rendered UFO type

## 21.2.0

### Minor Changes

- [#20002](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20002)
  [`ed9ab4d82a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed9ab4d82a3) - Adds
  "reactions-rendered", "reactions-picker-opened", "reaction-added" and "reaction-removed" to UFO
  experiences

## 21.1.0

### Minor Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`f0c986fe03a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0c986fe03a) - Migrated
  styles to emotion and removed typestyle dependency from atlassian-frontend dependencies.

### Patch Changes

- [`876cae9c606`](https://bitbucket.org/atlassian/atlassian-frontend/commits/876cae9c606) - Changed
  selector first-child to first-of-type to better support SSR
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 21.0.5

### Patch Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`63f11b8ade4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63f11b8ade4) - support
  proxy via webpack config cli
- Updated dependencies

## 21.0.4

### Patch Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`62a37c2a5c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62a37c2a5c8) - replace
  `react-transition-group` with `@atlaskit/motion` and improve Counter component
- [`696ba6c465d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/696ba6c465d) - The
  Reaction component now fires only one request to the service when being hovered.
- [`95015909035`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95015909035) - Fixed
  issue where some of the examples where crashing.
- Updated dependencies

## 21.0.3

### Patch Changes

- Updated dependencies

## 21.0.2

### Patch Changes

- Updated dependencies

## 21.0.1

### Patch Changes

- [#17798](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17798)
  [`b44aa6749c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b44aa6749c0) - [ux]
  Changed the token usage for emoji name to make it visible in the reaction tooltip.

## 21.0.0

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

### Patch Changes

- Updated dependencies

## 20.1.0

### Minor Changes

- [#16668](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16668)
  [`e82f9588eff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e82f9588eff) -
  Instrumented `@atlaskit/reactions` with the new theming package, `@atlaskit/tokens`. New tokens
  will be visible only in applications configured to use the new Tokens API (currently in
  alpha).These changes are intended to be interoperable with the legacy theme implementation. Legacy
  dark mode users should expect no visual or breaking changes.

## 20.0.0

### Major Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`814356508d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/814356508d3) - [ux]
  Design changes to help distinguish reactions and users. User list tooltip now shows the emoji name
  in grey and the additional users past the first five users in grey.Reactions that you have reacted
  to now have a blue border and slightly blue transparent background.Updated the heart emoji in the
  default emoji set.

### Minor Changes

- [`ef61c4df3e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef61c4df3e5) - Add
  metadata when creating reaction store and pass it down to client

## 19.1.5

### Patch Changes

- Updated dependencies

## 19.1.4

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update
  package.jsons to remove unused dependencies.
- Updated dependencies

## 19.1.3

### Patch Changes

- Updated dependencies

## 19.1.2

### Patch Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`4adcd7f3f2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4adcd7f3f2b) - Fixing
  small bug related to 19.0.0 change
- Updated dependencies

## 19.1.1

### Patch Changes

- [#12295](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12295)
  [`b15d1cda72e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b15d1cda72e) - Fixing
  small bug related to 19.0.0 change

## 19.1.0

### Minor Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`7de0b9572f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7de0b9572f0) - [ux]
  Updated reactions so that if there is a reaction with count 0, it will now render as just the
  emoji with no counter (now an empty string). Previously in this scenario it would show the emoji
  with the number 0 next to it. This should only affect direct usages of the standalone Reactions
  components, anyone using ConnectedReactionsView (the standard use case) should see no difference
  as this component already filters out any reactions with a count of 0.

### Patch Changes

- Updated dependencies

## 19.0.0

### Major Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`2f55d66e464`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f55d66e464) - [ux]
  Updated the default emoji set that pops up when adding a new reaction and created a pill shaped
  outline around the reaction.

  Default emoji set: replaced thumsdown with clap, heart_eyes with hearts, joy with astonished, and
  cry with thinking.

  Pill shape outline: reactions outlined with a pill shape, there is a smaller gap between the emoji
  and the emoji count, a smaller set width, and the emoji and emoji count are centered.

### Patch Changes

- Updated dependencies

## 18.2.2

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`87d5fffa13c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87d5fffa13c) - [ux]
  Fixed an issue where the Reaction trigger resizes and causes flickering
- Updated dependencies

## 18.2.1

### Patch Changes

- Updated dependencies

## 18.2.0

### Minor Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux]
  Updated and added new translations

### Patch Changes

- Updated dependencies

## 18.1.9

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 18.1.8

### Patch Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516)
  [`99abe1f917`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99abe1f917) - Fix SLO of
  get reactions
- Updated dependencies

## 18.1.7

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 18.1.6

### Patch Changes

- Updated dependencies

## 18.1.5

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`c0533f4b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0533f4b35) - Upgrade
  analytics-next to prevent event loss
  (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)
- Updated dependencies

## 18.1.4

### Patch Changes

- [#4932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4932)
  [`bee2157c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bee2157c1b) - Remove
  usage of @atlaskit/util-common-test package

## 18.1.3

### Patch Changes

- Updated dependencies

## 18.1.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 18.1.1

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 18.1.0

### Minor Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`940cde5773`](https://bitbucket.org/atlassian/atlassian-frontend/commits/940cde5773) - - The
  Reactions popup menu has been moved from the now-deprecated `@atlaskit/layer` to
  `@atlaskit/popper`.
  - (bugfix) The full emoji picker now repositions to stay in the window boundaries.

### Patch Changes

- Updated dependencies

## 18.0.1

### Patch Changes

- [#3369](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3369)
  [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated
  translations

## 18.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 17.3.4

### Patch Changes

- [#2576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2576)
  [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update
  translation files via Traduki build

## 17.3.3

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 17.3.2

### Patch Changes

- [patch][778b27a380](https://bitbucket.org/atlassian/atlassian-frontend/commits/778b27a380):

  Fix tooltip bug- Updated dependencies
  [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/editor-test-helpers@11.1.1

## 17.3.1

### Patch Changes

- Updated dependencies
  [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies
  [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies
  [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies
  [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies
  [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies
  [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies
  [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/layer@8.0.2
  - @atlaskit/emoji@62.7.1
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/docs@8.5.0

## 17.3.0

### Minor Changes

- [minor][a7d82e32f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7d82e32f9):

  added SLI analytics when a reaction is added to an object to measure success/failure of service
  requests-
  [minor][000cba629f](https://bitbucket.org/atlassian/atlassian-frontend/commits/000cba629f):

  added SLI analytics when reactions are fetched for a container to measure success/failure of
  service requests

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/button@13.3.9
  - @atlaskit/tooltip@15.2.5

## 17.2.8

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/layer@8.0.1
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/analytics-viewer@0.3.9
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/emoji@62.6.3
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1

## 17.2.7

### Patch Changes

- Updated dependencies
  [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies
  [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/layer@8.0.0
  - @atlaskit/emoji@62.6.2
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 17.2.6

### Patch Changes

- [patch][ce21161796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce21161796):

  Fix some types that were being transpiled to 'any'

## 17.2.5

- Updated dependencies
  [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/emoji@62.5.5
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/util-service-support@5.0.0

## 17.2.4

- Updated dependencies
  [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies
  [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/emoji@62.5.4
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0
  - @atlaskit/util-service-support@4.1.0
  - @atlaskit/editor-test-helpers@10.1.2
  - @atlaskit/analytics-namespaced-context@4.1.10

## 17.2.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 17.2.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 17.2.1

- Updated dependencies
  [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/emoji@62.5.1
  - @atlaskit/editor-test-helpers@10.0.0

## 17.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 17.1.10

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 17.1.9

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 17.1.8

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

## 17.1.7

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 17.1.6

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 17.1.5

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

## 17.1.4

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

## 17.1.3

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/emoji@62.2.1
  - @atlaskit/icon@19.0.0

## 17.1.2

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/emoji@62.1.7
  - @atlaskit/tooltip@15.0.0

## 17.1.1

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/emoji@62.1.6
  - @atlaskit/icon@18.0.0

## 17.1.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 17.0.1

- [patch][5e00c40c32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e00c40c32):

  - Remove the Reactions component's white background

## 17.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 16.1.10

- Updated dependencies
  [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/emoji@61.0.0
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/util-data-test@11.1.9

## 16.1.9

- Updated dependencies
  [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/emoji@60.0.0
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/util-data-test@11.1.8

## 16.1.8

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 16.1.7

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/emoji@59.2.3
  - @atlaskit/theme@8.1.7

## 16.1.6

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next
    supplied from itself.

## 16.1.5

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/emoji@59.2.1
  - @atlaskit/button@12.0.0

## 16.1.4

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 16.1.3

- Updated dependencies
  [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/emoji@59.0.0
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/util-data-test@11.1.5

## 16.1.2

- Updated dependencies
  [b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):
  - @atlaskit/elements-test-helpers@0.5.0
  - @atlaskit/emoji@58.2.0

## 16.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 16.1.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 16.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 15.6.3

- Updated dependencies
  [7261577953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7261577953):
  - @atlaskit/emoji@57.0.1
  - @atlaskit/elements-test-helpers@0.3.0

## 15.6.2

- Updated dependencies
  [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/emoji@57.0.0
  - @atlaskit/util-data-test@10.2.5

## 15.6.1

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/emoji@56.2.1
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/analytics-viewer@0.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/layer@6.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 15.6.0

- [minor][aa6176aad1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa6176aad1):

  - added SSR tests to reactions

## 15.5.1

- Updated dependencies
  [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/emoji@56.0.0
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/util-data-test@10.2.2

## 15.5.0

- [minor][9ab9e467d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ab9e467d2):

  - Bump version of typestyle for ssr compatibility

## 15.4.2

- Updated dependencies
  [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/emoji@55.0.1
  - @atlaskit/editor-test-helpers@7.0.0

## 15.4.1

- Updated dependencies
  [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/emoji@55.0.0
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/util-data-test@10.2.1

## 15.4.0

- [minor][68ef17af8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68ef17af8b):

  - Enable noImplicitAny for reactions, fix type issues.

## 15.3.4

- Updated dependencies
  [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/emoji@54.0.0
  - @atlaskit/util-data-test@10.0.36

## 15.3.3

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/editor-test-helpers@6.3.13
  - @atlaskit/emoji@53.0.1
  - @atlaskit/icon@16.0.0

## 15.3.2

- Updated dependencies
  [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/emoji@53.0.0
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/util-data-test@10.0.34

## 15.3.1

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/emoji@52.0.0
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/util-data-test@10.0.33

## 15.3.0

- [minor][e60d7aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e60d7aa):

  - updated i18n translations

## 15.2.2

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/emoji@51.0.0
  - @atlaskit/util-data-test@10.0.31

## 15.2.1

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/emoji@50.0.0
  - @atlaskit/util-data-test@10.0.30

## 15.2.0

- [minor][277edda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/277edda):

  - replaced enzyme-react-intl with @atlaskit/editor-test-helpers

## 15.1.0

- [minor][1296324](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1296324):

  - added i18n support to reactions

- [minor][ccf385a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ccf385a):

  - added i18n translations

## 15.0.11

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/emoji@49.0.0
  - @atlaskit/util-data-test@10.0.28

## 15.0.10

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/emoji@48.0.0
  - @atlaskit/util-data-test@10.0.26

## 15.0.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/layer@5.0.10
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/analytics-namespaced-context@2.1.5
  - @atlaskit/emoji@47.0.7
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/docs@6.0.0

## 15.0.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/emoji@47.0.6
  - @atlaskit/theme@7.0.0

## 15.0.7

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 15.0.6

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/emoji@47.0.2
  - @atlaskit/icon@15.0.0

## 15.0.5

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/emoji@47.0.1
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 15.0.4

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/emoji@47.0.0
  - @atlaskit/util-data-test@10.0.21

## 15.0.3

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/emoji@46.0.0
  - @atlaskit/util-data-test@10.0.20

## 15.0.2

- [patch][36c362f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c362f):

  - FS-3174 - Fix usage of gridSize() and borderRadius()

## 15.0.1

- [patch] Updated dependencies
  [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/emoji@45.0.0
  - @atlaskit/util-data-test@10.0.16

## 15.0.0

- [major] Fix reactions. Remove context and receive store as a prop.
  [b1de9c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1de9c8)

## 14.0.5

- [patch] Updated dependencies
  [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/emoji@44.0.0
  - @atlaskit/util-data-test@10.0.14

## 14.0.4

- [patch] Fix malformed operational analytics event
  [306cf0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/306cf0a)

## 14.0.3

- [patch] Updated dependencies
  [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies
  [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/emoji@43.0.0
  - @atlaskit/util-data-test@10.0.12

## 14.0.2

- [patch] Fix letter case 'actionSubjectID' => 'actionSubjectId'
  [3757992](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3757992)

## 14.0.1

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/emoji@42.0.1
  - @atlaskit/icon@14.0.0

## 14.0.0

- [major] Reactions state management revisited
  [7e8d079](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8d079)

## 13.1.3

- [patch] Updated dependencies
  [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/emoji@42.0.0

## 13.1.2

- [patch] use new tsconfig for typechecking
  [09df171](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09df171)

## 13.1.1

- [patch] Updated dependencies
  [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/emoji@41.0.0
  - @atlaskit/util-data-test@10.0.9

## 13.1.0

- [minor] FS-2830 add new analytics to @atlaskit/reactions
  [e432c15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e432c15)

## 13.0.11

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock
  [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 13.0.10

- [patch] Change tsconfig of reactions
  [ecca4b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4b6)

## 13.0.9

- [patch] Updated dependencies
  [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/emoji@40.0.0
  - @atlaskit/util-data-test@10.0.8

## 13.0.8

- [patch] Updated dependencies
  [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/emoji@39.1.1

## 13.0.7

- [patch] Updated dependencies
  [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)
  - @atlaskit/emoji@39.1.0

## 13.0.6

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/emoji@39.0.4
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 13.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/emoji@39.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/icon@13.2.4

## 13.0.4

- [patch] Bumping to latest version of emoji (major bump)
  [a95ee92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a95ee92)

* [none] Updated dependencies
  [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies
  [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies
  [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies
  [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies
  [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/emoji@39.0.0
  - @atlaskit/util-data-test@10.0.3

## 13.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/emoji@38.0.5
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3

## 13.0.2

- [patch] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/emoji@38.0.1
  - @atlaskit/icon@13.1.1

## 13.0.1

- [patch] Ensure reactions wrap if insufficient horizontal space
  [bb7129d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb7129d)

## 13.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0

## 12.2.2

- [patch] Move the tests under src and club the tests under unit, integration and visual regression
  [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies
  [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-data-test@9.1.18
  - @atlaskit/emoji@37.0.1

## 12.2.1

- [patch] Updated dependencies
  [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
  - @atlaskit/util-data-test@9.1.17
  - @atlaskit/emoji@37.0.0
- [none] Updated dependencies
  [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
  - @atlaskit/emoji@37.0.0
  - @atlaskit/util-data-test@9.1.17

## 12.2.0

- [minor] FS-1907 adding reaction sends itemCreationDate of object to service
  [ddcc42f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ddcc42f)

## 12.1.5

- [patch] Updated dependencies
  [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/emoji@36.0.1
  - @atlaskit/util-data-test@9.1.15

## 12.1.4

- [patch] Updated dependencies
  [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/emoji@36.0.0
  - @atlaskit/util-data-test@9.1.14

## 12.1.3

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/emoji@35.1.1
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/icon@12.1.2

## 12.1.2

- [patch] FS-1993 fix reactions flaky test
  [54c5a7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54c5a7a)

## 12.1.1

- [patch] FS-1889 make reactions resource immutable
  [deba783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deba783)

## 12.1.0

- [none] Updated dependencies
  [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/emoji@35.1.0

## 12.0.12

- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/emoji@35.0.7
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 12.0.11

- [patch] Updated dependencies
  [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/emoji@35.0.6
  - @atlaskit/util-data-test@9.1.9

## 12.0.10

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies
  [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 12.0.9

- [patch] FS-1959 use @atlaskit/tooltip for reactions tooltip
  [ec12b0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec12b0e)

## 12.0.8

- [patch] FS-1975 place picker after reactions
  [4a6e1c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a6e1c5)

## 12.0.7

- [none] Updated dependencies
  [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/emoji@35.0.0
- [none] Updated dependencies
  [714ab32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714ab32)
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/emoji@35.0.0
- [patch] Updated dependencies
  [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/emoji@35.0.0
  - @atlaskit/util-data-test@9.1.4
- [patch] Updated dependencies
  [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/emoji@35.0.0
  - @atlaskit/util-data-test@9.1.4

## 12.0.6

- [patch] FS-1921 Don't refresh reactions when getting detailed response if requests
  [1764815](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1764815)

## 12.0.5

- [none] Updated dependencies
  [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [none] Updated dependencies
  [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [none] Updated dependencies
  [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [none] Updated dependencies
  [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/emoji@34.2.0
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1
- [patch] Updated dependencies
  [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
  - @atlaskit/emoji@34.2.0
  - @atlaskit/util-data-test@9.1.3

## 12.0.4

- [patch] FS-1890 Remove sinon dependency from reactions
  [b6ee84e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b6ee84e)
- [patch] FS-1890 Migrate Reactions to Jest
  [8e0e31e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e0e31e)

## 12.0.0

- [major] FS-1023 Error handling for reactions
  [2202edc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2202edc)
- [minor] FS-1023 - Handle error and show tooltip in case of error
  [f9f1040](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9f1040)

## 11.0.9

- [patch] FS-1645 update reaction animations
  [c01d36d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c01d36d)

## 11.0.7

- [patch] FS-1882 update reaction button to match mobile
  [acc8118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acc8118)

## 11.0.6

- [patch] FS-1876 update default reactions emoji
  [114cee6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/114cee6)

## 11.0.4

- [patch] FS-1644 reactions ui changes
  [70ccf94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70ccf94)

## 11.0.3

- [patch] FS-1868 always add new reactions to the end of the list
  [70fdbeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70fdbeb)

## 11.0.1

- [patch] Added missing dependencies and added lint rule to catch them all
  [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 11.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 10.8.15

- [patch] Remove import from es6 promise at src level
  [e27f2ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e27f2ac)

## 10.8.0

- [minor] Moved Reactions to MK2 repo
  [d0cecbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0cecbf)

## 10.7.1 (2017-12-14)

- bug fix; fix TS errors in reactions
  ([21c92b6](https://bitbucket.org/atlassian/atlaskit/commits/21c92b6))

## 10.7.0 (2017-11-28)

- bug fix; fS-1521 Remove util-data-test
  ([eb88f40](https://bitbucket.org/atlassian/atlaskit/commits/eb88f40))
- feature; fS-1521 Compatibility with react 16
  ([4bd5c13](https://bitbucket.org/atlassian/atlaskit/commits/4bd5c13))
- bug fix; fS-1521 Bring back border radius
  ([f73ae4a](https://bitbucket.org/atlassian/atlaskit/commits/f73ae4a))
- bug fix; aK-3962 Remove react-transition-group from reactions
  ([da2b92d](https://bitbucket.org/atlassian/atlaskit/commits/da2b92d))
- feature; fS-994 Change reactions tooltips to be the chunky black ADG3 tooltips
  ([b574b07](https://bitbucket.org/atlassian/atlaskit/commits/b574b07))
- bug fix; fS-1521 Upgrade reaction component's dependencies to latest versions
  ([cae82c6](https://bitbucket.org/atlassian/atlaskit/commits/cae82c6))
- bug fix; fS-1521 Update emoji dependency
  ([405ab1a](https://bitbucket.org/atlassian/atlaskit/commits/405ab1a))

## 10.6.3 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 10.6.2 (2017-06-01)

- fix; fS-1015 Reactions randomly reorder themselves + other bugfixes
  ([f50a254](https://bitbucket.org/atlassian/atlaskit/commits/f50a254))

## 10.6.1 (2017-05-30)

- fix; fS-957 Make reactions wrap to newline
  ([2ad5cfd](https://bitbucket.org/atlassian/atlaskit/commits/2ad5cfd))

## 10.6.0 (2017-05-26)

- fix; fS-992 Emoji picker is too big for issue detail modal
  ([fb9ca62](https://bitbucket.org/atlassian/atlaskit/commits/fb9ca62))
- fix; fS-992 Remove popup component
  ([6aa5ee2](https://bitbucket.org/atlassian/atlaskit/commits/6aa5ee2))
- feature; fS-985 expose analyticService
  ([fbe4f67](https://bitbucket.org/atlassian/atlaskit/commits/fbe4f67))

## 10.5.1 (2017-05-22)

- fix; fS-963 Bump emoji version and fix css
  ([d168d44](https://bitbucket.org/atlassian/atlaskit/commits/d168d44))

## 10.3.0 (2017-05-19)

- fix; fS-963 Fix css ([f9f634a](https://bitbucket.org/atlassian/atlaskit/commits/f9f634a))
- fix; fS-963 Fix optimistic add/delete
  ([9ebe60b](https://bitbucket.org/atlassian/atlaskit/commits/9ebe60b))
- fix; fS-963 Fix PR feedbacks ([88199b4](https://bitbucket.org/atlassian/atlaskit/commits/88199b4))
- fix; fS-963 Fix reactions reappearing after deletion because of detailledreaction call
  ([85776d8](https://bitbucket.org/atlassian/atlaskit/commits/85776d8))
- fix; fS-963 fix test ([13232c4](https://bitbucket.org/atlassian/atlaskit/commits/13232c4))
- fix; fS-963 fix test & bump emoji
  ([443d8ff](https://bitbucket.org/atlassian/atlaskit/commits/443d8ff))
- fix; fS-963 Fix tests ([f10c4c6](https://bitbucket.org/atlassian/atlaskit/commits/f10c4c6))
- feature; fS-965 Update reactions design
  ([0451638](https://bitbucket.org/atlassian/atlaskit/commits/0451638))

## 10.2.2 (2017-05-11)

- fix; add containerAri where needed to match service contract
  ([bb2adca](https://bitbucket.org/atlassian/atlaskit/commits/bb2adca))
- fix; fix typescript error ([81249fb](https://bitbucket.org/atlassian/atlaskit/commits/81249fb))

## 10.2.1 (2017-05-03)

- fix; harden code to run in NodeJS environment.
  ([cc78477](https://bitbucket.org/atlassian/atlaskit/commits/cc78477))

## 10.2.0 (2017-05-02)

- fix; fixes a bug where long names where not being truncated
  ([e1ec953](https://bitbucket.org/atlassian/atlaskit/commits/e1ec953))
- feature; adding support to optionally set the text of the trigger-button
  ([6b5dc09](https://bitbucket.org/atlassian/atlaskit/commits/6b5dc09))

## 10.1.0 (2017-05-01)

- feature; adding support for detailed reactions
  ([81c6873](https://bitbucket.org/atlassian/atlaskit/commits/81c6873))
- feature; fS-767 Add analytics to reaction component
  ([1b5208f](https://bitbucket.org/atlassian/atlaskit/commits/1b5208f))

## 10.0.0 (2017-04-28)

- feature; adds the ablity to enable/disable all emojis
  ([ccacd6f](https://bitbucket.org/atlassian/atlaskit/commits/ccacd6f))
- breaking; By default the reaction picker will only allow a predefined set of emojis.

## 9.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 9.0.0 (2017-04-26)

- fix; fixes emoji-size in reactions and using string rather than emojiid
  ([87a6af9](https://bitbucket.org/atlassian/atlaskit/commits/87a6af9))
- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- feature; adding containerAri ([e88190a](https://bitbucket.org/atlassian/atlaskit/commits/e88190a))
- breaking; containerAri is now a required prop for ResourcedReactionPicker and ResourcedReactions.
  It's also required as first argument in toggleReaction, addReaction and deleteReaction

## 5.0.0 (2017-04-19)

- feature; upgrade to latest emoji component and emoji id spec
  ([ae59982](https://bitbucket.org/atlassian/atlaskit/commits/ae59982))
- breaking; Emoji representation has changes due to upgrading of emoji component. ISSUES CLOSED:
  FS-887

## 4.0.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 4.0.0 (2017-03-09)

- feature; bump emoji dependency to ensure getting all needed exports.
  ([62f2487](https://bitbucket.org/atlassian/atlaskit/commits/62f2487))
- feature; upgrade to latest asynchronous Emoji
  ([78ce481](https://bitbucket.org/atlassian/atlaskit/commits/78ce481))
- breaking; Latest Emoji upgrade and some events are breaking changes.

## 3.0.0 (2017-03-09)

- feature; adding resourced components that takes a ReactionProvivder-promise
  ([b503bd9](https://bitbucket.org/atlassian/atlaskit/commits/b503bd9))
- breaking; Renamed ReactionsService to ReactionsResource, The Reactions-component now takes a
  "reactionsProvider" instead of "reactionsService"

## 2.0.1 (2017-02-27)

- empty commit to make components release themselves
  ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.0.0 (2017-02-17)

- Fix the build and the readme story
  ([1915b49](https://bitbucket.org/atlassian/atlaskit/commits/1915b49))
- Fix type error in reactions-service
  ([09080e3](https://bitbucket.org/atlassian/atlaskit/commits/09080e3))
- Trying to fix failing CI ([2fc74cc](https://bitbucket.org/atlassian/atlaskit/commits/2fc74cc))
- Added autopoll support and logic for ignorning outdated updates
  ([bc7724f](https://bitbucket.org/atlassian/atlaskit/commits/bc7724f))
- Reactions Picker ([70e015a](https://bitbucket.org/atlassian/atlaskit/commits/70e015a))
