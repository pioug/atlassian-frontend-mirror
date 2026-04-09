# @atlaskit/editor-plugin-content-format

## 2.0.2

### Patch Changes

- [`82c0224977f47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/82c0224977f47) -
  Update README.md and 0-intro.tsx
- Updated dependencies

## 2.0.1

### Patch Changes

- [`5892e575833a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5892e575833a1) -
  Internal changes to remove unnecessary token fallbacks and imports from `@atlaskit/theme`
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`77341edf4fd78`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77341edf4fd78) -
  [EDITOR-3786] Added a new plugin `@atlaskit/editor-plugin-content-format`, and made
  `@atlaskit/editor-plugin-code-block-advanced` have a dependancy on it. Removed the ResizeObserver
  from `@atlaskit/editor-plugin-code-block-advanced` and replaced it with a way to observe changes
  to the `contentMode`. Updated examples to update the state of the new plugin so that examples work
  with the new behaviour.
