# @atlaskit/editor-ssr-renderer

## 5.0.0

### Major Changes

- [`901c87a57486e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/901c87a57486e) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.3.3

### Patch Changes

- Updated dependencies

## 3.3.2

### Patch Changes

- Updated dependencies

## 3.3.1

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [`3f28038f8be0f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f28038f8be0f) -
  Add support SSR streaming for SSREditorRenderer

### Patch Changes

- Updated dependencies

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [`e9ef7c6fc5370`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9ef7c6fc5370) -
  EDITOR-6179: Enable SSR Streaming for Edit Page and Live Doc routes.
  - Add `platform_editor_editor_ssr_streaming` experiment to `tmp-editor-statsig` experiments
    config.
  - `EditorSSRRenderer`: replace `useLayoutEffect`+`containerRef` DOM mutation with
    `dangerouslySetInnerHTML` for rendering serialized editor HTML, enabling correct rendering in
    `renderToPipeableStream` SSR streaming context.

### Patch Changes

- Updated dependencies

## 3.1.12

### Patch Changes

- Updated dependencies

## 3.1.11

### Patch Changes

- Updated dependencies

## 3.1.10

### Patch Changes

- Updated dependencies

## 3.1.9

### Patch Changes

- Updated dependencies

## 3.1.8

### Patch Changes

- Updated dependencies

## 3.1.7

### Patch Changes

- Updated dependencies

## 3.1.6

### Patch Changes

- Updated dependencies

## 3.1.5

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [`5b4851e88ab36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5b4851e88ab36) -
  [EDITOR-5797](https://hello.jira.atlassian.cloud/browse/EDITOR-5797) - clean up
  platform_editor_better_editor_ssr_spans feature flag

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- Updated dependencies

## 2.2.9

### Patch Changes

- Updated dependencies

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- Updated dependencies

## 2.2.6

### Patch Changes

- Updated dependencies

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`cbc1403b3cae1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cbc1403b3cae1) -
  [EDITOR-5094](https://hello.jira.atlassian.cloud/browse/EDITOR-5094) - add PerfPortal segments for
  editor SSR logic

### Patch Changes

- Updated dependencies

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- Updated dependencies

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- [`3242cbd5e88b9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3242cbd5e88b9) -
  Update packages to match prosemirror library updates
- Updated dependencies

## 2.1.0

### Minor Changes

- [`04b96fcb2ac43`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/04b96fcb2ac43) -
  Use existing function to check if SSR

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`45129df3fb3bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45129df3fb3bb) -
  [EDITOR-4211] Fix missing <br /> in empty paragraphs in SSR renderer
- [`4741ef2efc866`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4741ef2efc866) -
  [EDITOR-4212] Fix macros in SSR renderer
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [`595b07a99bd65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/595b07a99bd65) -
  [https://hello.jira.atlassian.cloud/browse/EDITOR-3995](EDITOR-3995) - add toolbar supporting to
  `EditorSSRRenderer`

## 1.5.0

### Minor Changes

- [`cbf58f8500db4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cbf58f8500db4) -
  [https://hello.jira.atlassian.cloud/browse/EDITOR-3893](EDITOR-3893) - fix mussing <br /> in empty
  textblocks in the `EditorSSRRenderer`

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [`e4f9d3c00a126`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4f9d3c00a126) -
  [EDITOR-3919](https://hello.jira.atlassian.cloud/browse/EDITOR-3919) - use the real `getPos`
  function as `nodeViweFactory` prop in `EditorSSRRenderer`

## 1.3.0

### Minor Changes

- [`c7acfc11f076a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7acfc11f076a) -
  [https://hello.jira.atlassian.cloud/browse/EDITOR-3745](EDITOR-3745) - adopt EditorSSRRenderer to
  ReactEditorView

## 1.2.0

### Minor Changes

- [`92ad90cd1d2e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92ad90cd1d2e8) -
  [https://hello.jira.atlassian.cloud/browse/EDITOR-3332] - created EditorSSRRenderer component

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`97dde7dada35d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/97dde7dada35d) -
  [https://hello.jira.atlassian.cloud/browse/EDITOR-3696](EDITOR-3696) - created a new
  `@atlaskit/editor-ssr-renderer` package for the Editor SSR renderer implementation.
