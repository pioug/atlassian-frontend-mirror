# @atlaskit/editor-plugin-custom-autoformat

## 1.4.9

### Patch Changes

- Updated dependencies

## 1.4.8

### Patch Changes

- [#170234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170234)
  [`7a27ccddccc3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a27ccddccc3a) -
  [ux] [ED-25446] Fix issue where after Shift+Enter autoformat does not occur. This is because an
  Object Replacement Character is added after the first word of a soft line break. Thus a match was
  never found. We now look for this case which should allow for autoformatting after a Replacement
  Object Character.
- Updated dependencies

## 1.4.7

### Patch Changes

- [#168970](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168970)
  [`97db2d026001d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/97db2d026001d) -
  ED-25808: refactors plugins to meet folder standards
- Updated dependencies

## 1.4.6

### Patch Changes

- Updated dependencies

## 1.4.5

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.4.4

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- [`656886f933139`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/656886f933139) -
  Cleanup FF platform_editor_af_provider_from_plugin_config
- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#142414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142414)
  [`4d4914bf56307`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d4914bf56307) -
  Remove card provider feature flag and rename autoformatting provider feature flag, Improve
  performance of setting card provider, Feature Gate the autoformatting Provider being passed to
  ComposableEditor in Confluence

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#139831](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139831)
  [`181c907365d7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/181c907365d7d) -
  Pass autoformat provider via preset

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

## 0.1.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.1.1

### Patch Changes

- Updated dependencies
