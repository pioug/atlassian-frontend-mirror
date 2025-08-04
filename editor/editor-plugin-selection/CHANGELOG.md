# @atlaskit/editor-plugin-selection

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#184963](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184963)
  [`f6b81506eb05b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6b81506eb05b) -
  [ux][ED-25230] Bug fix: inability to navigate between layout columns using arrow keys
- Updated dependencies

## 3.0.2

### Patch Changes

- [#184967](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184967)
  [`c868ad3f120c0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c868ad3f120c0) -
  [ux] Fix bug: pressing right arrow from listItem in layout/extended/panel skips next listItem and
  selects container instead
- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#181024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181024)
  [`8e80c487ca307`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e80c487ca307) - ##
  Make `@atlaskit/editor-common` a peer dependency

  **WHAT:** `@atlaskit/editor-common` has been moved from `dependencies` to `peerDependencies` in
  all editor plugin packages.

  **WHY:** This change ensures that only a single version of `@atlaskit/editor-common` is used in
  consuming applications, preventing issues caused by multiple versions of singleton libraries (such
  as context mismatches or duplicated state). This is especially important for packages that rely on
  shared context or singletons.

  **HOW TO ADJUST:**

  - Consumers must now explicitly install `@atlaskit/editor-common` in their own project if they use
    any of these editor plugins.
  - Ensure the version you install matches the version required by the plugins.
  - You can use the
    [`check-peer-dependencies`](https://www.npmjs.com/package/check-peer-dependencies) package to
    verify that all required peer dependencies are installed and compatible.
  - Example install command:
    ```
    npm install @atlaskit/editor-common
    ```
    or
    ```
    yarn add @atlaskit/editor-common
    ```

  **Note:** This is a breaking change. If `@atlaskit/editor-common` is not installed at the
  application level, you may see errors or unexpected behavior.

### Patch Changes

- Updated dependencies

## 2.2.15

### Patch Changes

- [#180346](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180346)
  [`d00d1d362bd18`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d00d1d362bd18) -
  ED-28086 Clean up platform_editor_no_cursor_on_live_doc_init

## 2.2.14

### Patch Changes

- [#173895](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173895)
  [`6e123631d7c26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e123631d7c26) -
  Clean up platform_editor_interaction_api_refactor
- Updated dependencies

## 2.2.13

### Patch Changes

- Updated dependencies

## 2.2.12

### Patch Changes

- Updated dependencies

## 2.2.11

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- [#168742](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168742)
  [`43b55fe50be89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43b55fe50be89) -
  Add experiment to show no cursor on initial edit page
- Updated dependencies

## 2.2.9

### Patch Changes

- Updated dependencies

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- [#163309](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163309)
  [`23a8b88475991`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23a8b88475991) -
  Clean up of FG platform_editor_fix_drag_and_drop_lists

## 2.2.6

### Patch Changes

- Updated dependencies

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- [#157322](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157322)
  [`0e61040734cef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e61040734cef) -
  [ED-27842] Consolidate extraneous no_cursor flags into one flag for full rollout
- Updated dependencies

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#149285](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149285)
  [`d00629c3a33cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d00629c3a33cf) -
  Clean up feature gate platform_editor_lcm_inline_node_selection_fix

## 2.2.0

### Minor Changes

- [#147781](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147781)
  [`154676654d6ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/154676654d6ce) -
  [ED-27777] Remove selection decorator until interaction for live pages

## 2.1.9

### Patch Changes

- [#142352](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142352)
  [`05903fde6d94d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05903fde6d94d) -
  Internal change to use Compiled variant of `@atlaskit/primitives`.
- Updated dependencies

## 2.1.8

### Patch Changes

- [#133479](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133479)
  [`57fe747245f32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57fe747245f32) -
  Clean up experiment
- Updated dependencies

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- [#134378](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134378)
  [`210a48c778086`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/210a48c778086) -
  EDITOR-546 Cleaned up platform_editor_cmd_a_progressively_select_nodes to revert to control
  behaviour.
- Updated dependencies

## 2.1.5

### Patch Changes

- [#132699](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132699)
  [`eee4cd1d4f4d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eee4cd1d4f4d8) -
  remove feature gate
- Updated dependencies

## 2.1.4

### Patch Changes

- [#132086](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132086)
  [`0c61b5cc7a789`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c61b5cc7a789) -
  [ux] ED-27255 Fix bug which prevented the gap cursor from appearing sometimes when a table is
  nested in another table, layout or expand

## 2.1.3

### Patch Changes

- [#129221](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129221)
  [`aad9678b8d08a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aad9678b8d08a) -
  [ux] ED-25490 Fixes an issue where it was not possible to select block nodes at the top of the
  document if they contain content.
- Updated dependencies

## 2.1.2

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- [#124883](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124883)
  [`cdc857701ad32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cdc857701ad32) -
  [ux] EDF-2571 Updated `selectNodeWithModA` function to account for nested tables.
- Updated dependencies

## 2.1.0

### Minor Changes

- [#124688](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124688)
  [`9b1137bda6f87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b1137bda6f87) -
  [ux] ED-25486 Updates cmd+a behaviour to progressively select nodes behind
  platform_editor_cmd_a_progressively_select_nodes experiment.

### Patch Changes

- Updated dependencies

## 2.0.7

### Patch Changes

- [#123345](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123345)
  [`31b02e82858e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31b02e82858e5) -
  NO-ISSUE: Update usages of selection utils
- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#120517](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120517)
  [`cfcd496e4d6f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfcd496e4d6f2) -
  [ED-26790] Fix selecting an Emoji or Mention Selects All LCMs

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

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

## 1.8.4

### Patch Changes

- Updated dependencies

## 1.8.3

### Patch Changes

- Updated dependencies

## 1.8.2

### Patch Changes

- [#112743](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112743)
  [`7f0dcc0e66696`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f0dcc0e66696) -
  Refactor appendTransaction

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#111465](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111465)
  [`dd20af1fdd46f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd20af1fdd46f) -
  Add commands for manually setting/clearing selection decoration range

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.6.28

### Patch Changes

- Updated dependencies

## 1.6.27

### Patch Changes

- Updated dependencies

## 1.6.26

### Patch Changes

- Updated dependencies

## 1.6.25

### Patch Changes

- Updated dependencies

## 1.6.24

### Patch Changes

- Updated dependencies

## 1.6.23

### Patch Changes

- [#106320](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106320)
  [`38b6601dfeb85`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38b6601dfeb85) -
  Tidying platform_editor_mark_boundary_cursor
- Updated dependencies

## 1.6.22

### Patch Changes

- Updated dependencies

## 1.6.21

### Patch Changes

- Updated dependencies

## 1.6.20

### Patch Changes

- [#104540](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104540)
  [`ce84e9acae216`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce84e9acae216) -
  Cleanup platform_editor_mark_boundary_cursor

## 1.6.19

### Patch Changes

- Updated dependencies

## 1.6.18

### Patch Changes

- Updated dependencies

## 1.6.17

### Patch Changes

- Updated dependencies

## 1.6.16

### Patch Changes

- Updated dependencies

## 1.6.15

### Patch Changes

- Updated dependencies

## 1.6.14

### Patch Changes

- Updated dependencies

## 1.6.13

### Patch Changes

- Updated dependencies

## 1.6.12

### Patch Changes

- Updated dependencies

## 1.6.11

### Patch Changes

- Updated dependencies

## 1.6.10

### Patch Changes

- Updated dependencies

## 1.6.9

### Patch Changes

- Updated dependencies

## 1.6.8

### Patch Changes

- Updated dependencies

## 1.6.7

### Patch Changes

- Updated dependencies

## 1.6.6

### Patch Changes

- Updated dependencies

## 1.6.5

### Patch Changes

- Updated dependencies

## 1.6.4

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- Updated dependencies

## 1.6.2

### Patch Changes

- [#178297](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178297)
  [`a067ce11e9631`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a067ce11e9631) -
  NO-ISSUE-restrict-auto-selection-expand-on-textselection
- Updated dependencies

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#169428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169428)
  [`dc52eec1d2269`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc52eec1d2269) -
  [ux] ED-25865 Auto include inline node as a part of selection when selection ends on an inline
  node
- [#169428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169428)
  [`ded743b539788`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ded743b539788) -
  [ux] ED-25865 auto expand selection to include inline node

### Patch Changes

- Updated dependencies

## 1.5.6

### Patch Changes

- [#171440](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171440)
  [`835f7bbff3122`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/835f7bbff3122) -
  ED-25816: refactors plugins to meet folder standards
- Updated dependencies

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- [#159308](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159308)
  [`14ef6f05d711c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14ef6f05d711c) -
  [ED-24690] Replace LD FF with Statsig platform-editor-single-player-expand
- Updated dependencies

## 1.5.2

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`14108e8c08732`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14108e8c08732) -
  Stop firing `document selected` event
- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#152197](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152197)
  [`dddd3eca66a62`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dddd3eca66a62) -
  Expose SelectionPluginOptions type.

### Patch Changes

- Updated dependencies

## 1.4.10

### Patch Changes

- Updated dependencies

## 1.4.9

### Patch Changes

- Updated dependencies

## 1.4.8

### Patch Changes

- Updated dependencies

## 1.4.7

### Patch Changes

- Updated dependencies

## 1.4.6

### Patch Changes

- [#143799](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143799)
  [`854fc7c6e6522`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/854fc7c6e6522) -
  [ux] ED-24255 update mark boundary cursor on any doc change
- Updated dependencies

## 1.4.5

### Patch Changes

- Updated dependencies

## 1.4.4

### Patch Changes

- [#140867](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140867)
  [`17b58500a94e3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17b58500a94e3) -
  [ux] ED-24255 Adding a custom mark boundary cursor to fix the cursor position in inline code

## 1.4.3

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

## 1.3.2

### Patch Changes

- [#125367](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125367)
  [`40695df29bb9a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40695df29bb9a) -
  Removed FF cd platform.editor.change-navigation-for-atom-nodes

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.2.13

### Patch Changes

- Updated dependencies

## 1.2.12

### Patch Changes

- Updated dependencies

## 1.2.11

### Patch Changes

- [#117973](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117973)
  [`6e37bac62083f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e37bac62083f) -
  moved one const, added new entry point for other and deprecated
- Updated dependencies

## 1.2.10

### Patch Changes

- Updated dependencies

## 1.2.9

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- [#111382](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111382)
  [`5ce3f135c6211`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ce3f135c6211) -
  Cleanup feature flag to protect for explicit HTML element check in some places.

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#92552](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92552)
  [`7cd874b858c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7cd874b858c8) -
  Check target elements are actually HTMLElement rather than typecasting.

## 1.2.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- [#90897](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90897)
  [`f7d77187a439`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7d77187a439) -
  [ux] [ED-22841] Adjust isCollpasedExpand function to allow for the new singlePlayerExpand plugin
  which replaces the standard expand when livePage and the `platform.editor.single-player-expand`
  feature flag is enabled.

## 1.1.2

### Patch Changes

- [#89247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89247)
  [`a65b4a0870d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a65b4a0870d8) -
  The internal composition of this package has changed. There is no expected change in behavior.

## 1.1.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.1.0

### Minor Changes

- [#75042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75042)
  [`ce823f018248`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce823f018248) -
  [ux] ED-21987 Diverge expands in live pages so that they are not multiplayer, and are closed by
  default.

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#70261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70261)
  [`a92879d672c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a92879d672c6) -
  [ux] ED-21620: Corrected the selection functions for atom nodes that are triggered on pressing the
  right and left arrow keys.

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

## 0.2.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#65084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65084)
  [`609bca09a972`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/609bca09a972) -
  expose selection as part of the shared state

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- [#63289](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63289)
  [`f75faa16e84d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f75faa16e84d) -
  [ux] ED-20209: Fixed selection behaviour for Atomic and empty+selectable nodes and updated related
  tests.

## 0.1.2

### Patch Changes

- [#61696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61696)
  [`fcc2b35ad97b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcc2b35ad97b) -
  ED-21505: Added better selections and highlights for MBE nodes on Editor

## 0.1.1

### Patch Changes

- [#57079](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/57079)
  [`d15db1b00c5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d15db1b00c5a) -
  [ED-21267] Improve arrow navigation across MultiBodiedExtensions
