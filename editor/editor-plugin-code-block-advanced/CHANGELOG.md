# @atlaskit/editor-plugin-code-block-advanced

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
