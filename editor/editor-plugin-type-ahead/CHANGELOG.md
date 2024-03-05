# @atlaskit/editor-plugin-type-ahead

## 1.0.4

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224) [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) - ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.0.3

### Patch Changes

- [#75482](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75482) [`18b5a6fb910a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18b5a6fb910a) - # MAJOR CHANGE to `@atlaskit/prosemirror-input-rules` package.

  ## WHY?

  Removing editor-common dependencies from prosemirror-input-rules package.

  This makes it easier for editor updates because it simplifies our dependency graph.

  ## WHAT and HOW?

  These are no longer available via `@atlaskit/prosemirror-input-rules` but are available from `@atlaskit/editor-common/types`:

  - InputRuleWrapper
  - InputRuleHandler
  - OnHandlerApply
  - createRule

  These have changed from a `SafePlugin` to a `SafePluginSpec`. In order to update your code you need to instantiate a `SafePlugin` (ie. `new SafePlugin(createPlugin( ... ))`).

  `SafePlugin` exists in `@atlaskit/editor-common/safe-plugin`.

  - createPlugin
  - createInputRulePlugin

- Updated dependencies

## 1.0.2

### Patch Changes

- [#73177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73177) [`22452599ed8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22452599ed8f) - Move styling for certain packages to tokens.

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.9.6

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency

## 0.9.5

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136) [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) - Move all plugin translations to editor-common
- Updated dependencies

## 0.9.4

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#67189](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67189) [`93cbf53ca0e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93cbf53ca0e0) - Removing instances of WithPluginState from mentions and type-ahead plugins.

## 0.9.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031) [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) - ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.9.0

### Minor Changes

- [#64335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64335) [`efc8826c907f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/efc8826c907f) - [ux] [ED-16509] Restart numbered list inserting nodes via QUICK INSERT, nodes including : panels, expands, decisions, tables, layout, quotes, actions, dividers, headings. Changes are being guarded behind feature flag platform.editor.ordered-list-inserting-nodes_bh0vo

### Patch Changes

- Updated dependencies

## 0.8.6

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165) [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) - [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.8.5

### Patch Changes

- [#61655](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61655) [`6fec14da1838`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fec14da1838) - ED-21403 Fixed accessiblity issue with TypeAheadItems read by VoiceOver

## 0.8.4

### Patch Changes

- [#61465](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61465) [`fc0f13b8bc95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc0f13b8bc95) - Prefix `componentWillMount`, `componentWillUnmount` and `componentWillReceiveProps` with `UNSAFE_` in the `AssistiveText` component

## 0.8.3

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808) [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) - ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.8.2

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246) [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) - ED-21371 Update adf-schema to 35.1.0

## 0.8.1

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [#59258](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59258) [`8776707df7cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8776707df7cd) - ECA11Y-48 Updated assistive text

## 0.7.8

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.7.7

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763) [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) - update ADF schema

## 0.7.6

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790) [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) - ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.7.5

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 0.7.4

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.7.3

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995) [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in missing dependencies for imported types

## 0.7.2

### Patch Changes

- Updated dependencies

## 0.7.1

### Patch Changes

- [#41802](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41802) [`d20ecc5a9db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d20ecc5a9db) - Apply improved linting to type-ahead plugin.

## 0.7.0

### Minor Changes

- [#41047](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41047) [`8f0b00d165f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0b00d165f) - [ED-20003] Extract TypeAhead from editor-core to its own package @atlaskit/editor-plugin-type-ahead

## 0.6.0

### Minor Changes

- [#41459](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41459) [`9874d0f70b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9874d0f70b0) - [ED-20003] TypeAhead extraction: Replace the mobile view-subscription with proper API

## 0.5.0

### Minor Changes

- [#41143](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41143) [`7d6dfe2befa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d6dfe2befa) - [ED-20003] Replace TyepAhead API for Editor Plugin Injection API

## 0.4.0

### Minor Changes

- [#40955](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40955) [`30dc2b1e6c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30dc2b1e6c9) - [ED-19746] Decoupling mentions plugin from Editor-core libraries

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#39575](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39575) [`ef0c2a89c72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef0c2a89c72) - Add isTypeAheadOpen action to type-ahead plugin. Decouple placeholder plugin from editor-core.

## 0.2.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325) [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

## 0.1.1

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177) [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.
