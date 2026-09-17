# @atlaskit/editor-plugin-node-context

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`656801b9e097c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/656801b9e097c) -
  VOLTC-331 - Migrate updated package usage in platform/editor: rewrite barrel imports of
  voltCompliant provider packages to deep/subpath imports (consumer-side debarrel). No public API
  changes.
- Updated dependencies

## 0.1.0

### Minor Changes

- [`94fb3e7b224eb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94fb3e7b224eb) -
  Add an opt-in editor plugin that resolves viewport points and regions to ADF node context:

  ```ts
  const preset = new Preset().add(nodeContextPlugin);

  const pointTarget = editorApi.nodeContext.actions.getNodeContextAtCoords({ x: 120, y: 240 });
  const regionTargets = editorApi.nodeContext.actions.getNodeContextsInViewportRect({
  	x: 100,
  	y: 200,
  	width: 300,
  	height: 180,
  });
  ```
