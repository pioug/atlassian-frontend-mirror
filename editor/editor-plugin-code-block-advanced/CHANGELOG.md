# @atlaskit/editor-plugin-code-block-advanced

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

## 1.1.2

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 1.1.1

### Patch Changes

- [#113094](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113094)
  [`b7cb7ca6cd1e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7cb7ca6cd1e0) -
  Stop auto-scrolling on large code blocks from prosemirror.

## 1.1.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#107185](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107185)
  [`f0dd5f5bd4d4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f0dd5f5bd4d4e) -
  [ux] Sync all prosemirror decorations with codemirror decorations.
- Updated dependencies

## 1.0.2

### Patch Changes

- [#105726](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105726)
  [`2eb0f22c4b065`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2eb0f22c4b065) -
  [ux] Fix toDOM implementation whitespace with 100+ lines of code
- [#103918](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103918)
  [`29844093c6ab4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/29844093c6ab4) -
  Expose new shared state for code block plugin which indicates the current node that the copy text
  button is hovered for. Display highlight decorations for the copy text button in the advanced code
  block plugin.
- Updated dependencies

## 1.0.1

### Patch Changes

- [#102828](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102828)
  [`e9e0bd7d3c706`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9e0bd7d3c706) -
  [ux] Ensure lazy node view matches code block advanced snippet so there is no layout shift.

## 1.0.0

### Major Changes

- [#100411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100411)
  [`14499ab145534`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14499ab145534) -
  [ux] Introduces advanced code block as per:
  https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4632293323/Editor+RFC+063+Advanced+code+blocks.
  This can be added to an existing editor preset to enrich the code block experience with syntax
  highlighting and can be extended for other features via CodeMirror extensions (ie. autocompletion,
  code folding etc.).
