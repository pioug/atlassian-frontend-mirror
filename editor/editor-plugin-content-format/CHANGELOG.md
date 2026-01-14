# @atlaskit/editor-plugin-content-format

## 1.0.0

### Major Changes

- [`77341edf4fd78`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77341edf4fd78) -
  [EDITOR-3786] Added a new plugin `@atlaskit/editor-plugin-content-format`, and made
  `@atlaskit/editor-plugin-code-block-advanced` have a dependancy on it. Removed the ResizeObserver
  from `@atlaskit/editor-plugin-code-block-advanced` and replaced it with a way to observe changes
  to the `contentMode`. Updated examples to update the state of the new plugin so that examples work
  with the new behaviour.
