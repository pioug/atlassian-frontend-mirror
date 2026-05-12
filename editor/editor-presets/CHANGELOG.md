# @atlaskit/editor-presets

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [`136d15a32935f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/136d15a32935f) -
  [ux] Adding initial scaffolding (non-functional) for agent-managed blocks as an editor
  extension/plugin and use in Confluence

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`34d7b445ae298`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/34d7b445ae298) -
  [ux] EDITOR-6294 Removing tableDragAndDrop from plugin presets and cleaning up unused table code
  for menus

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`c939283d6f41a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c939283d6f41a) -
  [EDITOR-6181](https://hello.jira.atlassian.cloud/browse/EDITOR-6181) - fix inline smart cards in
  SSR streaming

### Patch Changes

- Updated dependencies

## 2.0.13

### Patch Changes

- Updated dependencies

## 2.0.12

### Patch Changes

- Updated dependencies

## 2.0.11

### Patch Changes

- Updated dependencies

## 2.0.10

### Patch Changes

- Updated dependencies

## 2.0.9

### Patch Changes

- Updated dependencies

## 2.0.8

### Patch Changes

- Updated dependencies

## 2.0.7

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [`acce33a5519e2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acce33a5519e2) -
  Clean up stale experiment `platform_editor_ai_quickstart_command` - enable the quickstart command
  behaviour by default.
- Updated dependencies

## 2.0.1

### Patch Changes

- [`b47ee185c5ac4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b47ee185c5ac4) -
  Remove deprecated dragAndDropEnabled plugin option Drag and drop table rows/ columns and advanced
  table controls used to be toggled with dragAndDropEnabled table plugin option however we're
  deprecating this prop to make this the default behaviour.

  ```
  // Before - to turn on drag and drop:

  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} })
      .add([tablePlugin, {tableOptions: {}, dragAndDropEnabled: true}])

  const { preset } = usePreset(createPreset);

  // Now - drag and drop enabled even without prop
  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} })
      .add([tablePlugin, {tableOptions: {}}])

  const { preset } = usePreset(createPreset);
  ```

  The `dragAndDropEnabled` property has also been removed from the `TablePluginOptions` TypeScript
  interface.

  **Note:** If you previously set `dragAndDropEnabled: false` to explicitly disable drag and drop,
  this is no longer supported — drag and drop is now always enabled and cannot be turned off via
  this option.

  If issues occur when bumping editor package, please check if dragAndDropEnabled is still present
  in editor integration.

- Updated dependencies

## 2.0.0

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

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- [`2df767cd2e0e9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2df767cd2e0e9) -
  Remove deprecated dragAndDropEnabled plugin option - table drag and drop is now always
  enabled(EDITOR-6287)
- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`375155c440374`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/375155c440374) -
  Add FullPagePresetNext

### Patch Changes

- Updated dependencies

## 0.1.6

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- [`aad55446552cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aad55446552cd) -
  Cleaned up `platform_editor_ai_aifc_adf_placeholder` feature gate. The ADF placeholder is now
  always used when applicable, without requiring a feature gate check. Removed unused imports and
  dead code paths.
- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`ecfa369efa682`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ecfa369efa682) -
  Create @atlaskit/editor-presets
