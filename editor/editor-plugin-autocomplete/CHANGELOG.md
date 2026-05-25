# @atlaskit/editor-plugin-autocomplete

## 2.5.2

### Patch Changes

- [`a87ba03d22d27`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a87ba03d22d27) -
  Fix typecheck
- Updated dependencies

## 2.5.1

### Patch Changes

- [`80694949c0036`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/80694949c0036) -
  Fixing typecheck errors
- Updated dependencies

## 2.5.0

### Minor Changes

- [`09fd1de566937`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/09fd1de566937) -
  Add UFO experience tracking to `@atlaskit/editor-plugin-autocomplete` for the asynchronous
  operations that have meaningful latency and success/failure outcomes — slow-lane fetch, vocabulary
  load, and vectors load. Experiences surface downstream as
  `platform.fe.operation.editor-plugin-autocomplete.<name>`.

  Per-keystroke suggestion lifecycle counters (view, insert, dismiss) are tracked exclusively via
  analytics-next instead of UFO, to avoid emitting zero-duration events on every word boundary. A
  new `suggestionDismissed` contextual-typeahead analytics event is added
  (`@atlaskit/editor-common`) alongside the existing `suggestionViewed` / `suggestionInserted`
  events, with a `reason: 'escape' | 'blur'` attribute.

### Patch Changes

- [`60d4bf83adcbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60d4bf83adcbc) -
  Wrap risky imperative paths (PM tree mutations, debounced prediction timer, async
  vocabulary/vectors/context loads) with try/catch + logException so failures surface in Sentry and
  the editor never silently dies on a malformed prediction or stale state. Follows the convention
  used by editor-plugin-block-controls, editor-plugin-paste-options-toolbar, editor-plugin-emoji,
  etc.
- [`43e460948b5c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43e460948b5c6) -
  Fix LocalSlowLaneClient: remove dead `void engineUnloadPromise` no-op, add WebGPU pre-flight check
  before model load, prevent infinite init retries with a permanent-failure flag, call `onUpdate` on
  inference error to maintain consistent notification contract, and add `.catch` handler to suppress
  unhandled promise rejections in `doUpdateContext`.
- Updated dependencies

## 2.4.0

### Minor Changes

- [`ce30a31e6369d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce30a31e6369d) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [`975a31aae73f4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/975a31aae73f4) -
  Add KSS attributes to contextual typeahead acceptance analytics

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`6eb5747f5ba37`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6eb5747f5ba37) -
  Add SAR analytics for autocomplete plugin

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`6b36a63af0057`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b36a63af0057) -
  Updated scoring math for contextual typeahead autocomplete

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`603cd44e7b8c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/603cd44e7b8c3) -
  Fetch vectors through media client

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`87965237565b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87965237565b6) -
  [ux] Add autocomplete plugin to inline comment editor behind
  `platform_editor_ai_autocomplete_conf_comments` experiment

## 0.2.0

### Minor Changes

- [`d214555fc7540`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d214555fc7540) -
  Add editor plugin for AI-powered inline autocomplete
