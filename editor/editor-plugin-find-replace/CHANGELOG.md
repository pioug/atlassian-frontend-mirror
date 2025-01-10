# @atlaskit/editor-plugin-find-replace

## 1.7.22

### Patch Changes

- Updated dependencies

## 1.7.21

### Patch Changes

- Updated dependencies

## 1.7.20

### Patch Changes

- Updated dependencies

## 1.7.19

### Patch Changes

- Updated dependencies

## 1.7.18

### Patch Changes

- Updated dependencies

## 1.7.17

### Patch Changes

- Updated dependencies

## 1.7.16

### Patch Changes

- Updated dependencies

## 1.7.15

### Patch Changes

- [#169604](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169604)
  [`11e14d646fe74`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/11e14d646fe74) -
  ED-25811: refactors plugins to meet folder standards
- Updated dependencies

## 1.7.14

### Patch Changes

- Updated dependencies

## 1.7.13

### Patch Changes

- Updated dependencies

## 1.7.12

### Patch Changes

- Updated dependencies

## 1.7.11

### Patch Changes

- Updated dependencies

## 1.7.10

### Patch Changes

- Updated dependencies

## 1.7.9

### Patch Changes

- Updated dependencies

## 1.7.8

### Patch Changes

- Updated dependencies

## 1.7.7

### Patch Changes

- Updated dependencies

## 1.7.6

### Patch Changes

- [#143665](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143665)
  [`4a6a4168461a8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a6a4168461a8) -
  remove find replace toolbar button on smaller screens

## 1.7.5

### Patch Changes

- Updated dependencies

## 1.7.4

### Patch Changes

- Updated dependencies

## 1.7.3

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

## 1.6.4

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- Updated dependencies

## 1.6.2

### Patch Changes

- [`46b889c01d03e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46b889c01d03e) -
  [ux] Clean up Reaact 18 Feature Flags

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#124134](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124134)
  [`80147d04d87b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80147d04d87b6) -
  Fix bug in React 18 concurrent mode where find input swallows characters
- Updated dependencies

## 1.5.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- [#121978](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121978)
  [`740b45d7d559f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/740b45d7d559f) -
  [ux] Removing the `id` from the editor toolbar button as it does not meet accessibility
  compliance. Updating cases where it was used. These buttons can be referenced better via their
  role or data test id.

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#120426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120426)
  [`1cb3869ab1a96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cb3869ab1a96) -
  [ED-23436] Use editor primary toolbar plugin to structure the primary toolbar

### Patch Changes

- Updated dependencies

## 1.3.10

### Patch Changes

- Updated dependencies

## 1.3.9

### Patch Changes

- [#119140](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119140)
  [`dbda45aec4c30`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dbda45aec4c30) -
  Migrated usages of deprecated button `UNSAFE` icon size props to new render prop.
- Updated dependencies

## 1.3.8

### Patch Changes

- Updated dependencies

## 1.3.7

### Patch Changes

- Updated dependencies

## 1.3.6

### Patch Changes

- Updated dependencies

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#113632](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113632)
  [`20724f0cd35f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20724f0cd35f3) -
  Fix missing 'Replace with' translation
- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#106001](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106001)
  [`2a3e33b1e7727`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a3e33b1e7727) -
  [ux] ECA11Y-75: Remove feature flag and fix tests

### Patch Changes

- Updated dependencies

## 1.2.10

### Patch Changes

- Updated dependencies

## 1.2.9

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- [#104260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104260)
  [`2050e35bc9d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2050e35bc9d5) -
  Removing feature flag `platform.design-system.editor-new-button_jjjdo` in
  `@atlaskit/editor-plugin-find-replace` so the affected Buttons are using new Atlaskit Buttons by
  default.

## 1.2.7

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5
- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component
- Updated dependencies

## 1.2.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [#81374](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81374)
  [`3e7990b6d1a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e7990b6d1a3) -
  React 18 types for editor-plugin-find-replace

## 1.1.4

### Patch Changes

- [#78913](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78913)
  [`b244d468a298`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b244d468a298) -
  fix incorrect usage of a platform ff in find and replace plugin

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#73177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73177)
  [`22452599ed8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22452599ed8f) -
  Move styling for certain packages to tokens.

## 1.1.0

### Minor Changes

- [#72122](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72122)
  [`c3186450404a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3186450404a) -
  Breaking change:

  ## WHAT?:

  Removing feature flags:

  - singleLayout
  - newInsertionBehaviour
  - interactiveExpand
  - findReplace
  - findReplaceMatchCase
  - extendFloatingToolbar

  ## WHY?:

  Because the flags and props are unused/by default active. Removing them will reduce our
  maintenance burden

  ## HOW to update your code:

  - If you were using the feature flag - the behaviour is now default and you can remove the flags
  - If you were not using the feature flag - the behaviour is now default.
  - If you have opted out of using the feature flag - we have been careful to ensure no-one has
    opted out of the behaviours. If you do have an issue please reach out to #help-editor.

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#72125](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72125)
  [`9b19a14df053`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9b19a14df053) -
  Migrated buttons in find and replace popup to new atlaskit buttons with a feature flag
  `platform.design-system-team.editor-new-button_jjjdo`.

## 1.0.1

### Patch Changes

- [#72710](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72710)
  [`3a884530c4d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a884530c4d2) -
  Move translation strings for find-replace to ICU format.

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.1

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.3.0

### Minor Changes

- [#67595](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67595)
  [`3bb66071a333`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3bb66071a333) -
  [ux] ECA11Y-75: Updated UX/UI for "Find and Replace" modal window, added Focus trap to Find and
  Replace popup, added return focus to the search button when pressing ESC, update selected match
  and all matches highlighted colors, added Screan Reader announcements for repeated button clicks (
  subtickets: ECA11Y-144, ECA11Y-145, ECA11Y-146, ECA11Y-147, ECA11Y-148, ECA11Y-149 )

## 0.2.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.0

### Minor Changes

- [#66388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66388)
  [`1698d83da05f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1698d83da05f) -
  ED-21743: Extract find replace plugin from editor-core

### Patch Changes

- Updated dependencies
