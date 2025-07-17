# @atlaskit/editor-plugin-code-block-advanced

## 3.0.3

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#182587](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182587)
  [`ab1ee31f25e9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ab1ee31f25e9c) -
  Fixes issue where right click menu would select entire code block.
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

## 2.4.0

### Minor Changes

- [#175595](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175595)
  [`b041b53e6615d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b041b53e6615d) -
  ED-28347 bubble dragenter event from adv code block

### Patch Changes

- Updated dependencies

## 2.3.5

### Patch Changes

- Updated dependencies

## 2.3.4

### Patch Changes

- Updated dependencies

## 2.3.3

### Patch Changes

- [#172642](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172642)
  [`4742ad40d0dde`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4742ad40d0dde) -
  [ux] Fixes height of the new resize handle when a code block is the first node in the document.

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#166502](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166502)
  [`ea1ed63fc9615`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea1ed63fc9615) -
  ED-28032 add keyboard shortcuts for new resizing experience behind
  platform_editor_breakout_resizing

## 2.2.13

### Patch Changes

- Updated dependencies

## 2.2.12

### Patch Changes

- Updated dependencies

## 2.2.11

### Patch Changes

- [#158523](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158523)
  [`3fe5dff3f49a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fe5dff3f49a5) -
  Triple click should select entire code block.
- Updated dependencies

## 2.2.10

### Patch Changes

- [#156937](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156937)
  [`0a144ecb9fd2b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a144ecb9fd2b) -
  [ux] Improve the syntax highlighting for diff language.
- Updated dependencies

## 2.2.9

### Patch Changes

- [#156363](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156363)
  [`fa74bacdec758`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa74bacdec758) -
  Reduce number of codemirror transactions fired for performance.
- Updated dependencies

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- [#153048](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153048)
  [`3ed1cacec6ad5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ed1cacec6ad5) -
  [ux] Fix small gutter flicker on load

## 2.2.6

### Patch Changes

- [#152049](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152049)
  [`a2bdf059329e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2bdf059329e8) -
  Add support for Gherkin language to code

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- [#149738](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149738)
  [`3098e65159385`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3098e65159385) -
  Fix selection when the editor is disabled.

## 2.2.3

### Patch Changes

- [#142712](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142712)
  [`6eb10c572bdad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6eb10c572bdad) -
  [ux] Improve syntax highlighting for yaml.
- Updated dependencies

## 2.2.2

### Patch Changes

- [#139592](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139592)
  [`fe3dc07ed6ab8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe3dc07ed6ab8) -
  Fixes a selection bug on chrome if there are multiple code blocks at the start of a document

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#137683](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137683)
  [`c1020ef8cdf87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1020ef8cdf87) -
  Adds support for Handlebars syntax highlighting.

### Patch Changes

- [#137043](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137043)
  [`616c9cd4a2c60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/616c9cd4a2c60) -
  Fix line wrapping and decorations being lost on breakout in advanced codeblocks
- Updated dependencies

## 2.1.4

### Patch Changes

- [#136263](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136263)
  [`602e9a7824b0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/602e9a7824b0c) -
  Fix editor crashing with advanced code blocks due to infinite codemirror loop with decorations
  when changing breakout.
- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#122467](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122467)
  [`c8953846d7bc3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c8953846d7bc3) -
  Fix copying the code block on safari.

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

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
