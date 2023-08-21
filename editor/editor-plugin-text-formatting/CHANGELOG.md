# @atlaskit/editor-plugin-text-formatting

## 0.2.4

### Patch Changes

- [`967f4819f58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/967f4819f58) - Introduce core plugin that is always injected into the pluginInjectionApi. This has a new action `execute` that replaces the existing `executeCommand` that was called from the `pluginInjectionApi`.
- Updated dependencies

## 0.2.3

### Patch Changes

- [`f12aff135b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f12aff135b6) - Extract Composition Plugin

## 0.2.2

### Patch Changes

- [`24fc3925d73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24fc3925d73) - Add a new hook called `usePreset` accesed via `@atlaskit/editor-core/use-preset`. This hook can be used to safely access state and commands from outside the editor using `EditorContext`.
- Updated dependencies

## 0.2.1

### Patch Changes

- [`5365e42ef97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5365e42ef97) - cleaned up more of the \* as keymaps imports to enable better tree-shaking

## 0.2.0

### Minor Changes

- [`43c51e0a282`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43c51e0a282) - [ED-19431] Migrate all text-formatting plugin actions over to plugin commands

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`f3728ec49ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3728ec49ab) - NO-ISSUE Switched analytics plugin to prod dependency to avoid type issues in CI
