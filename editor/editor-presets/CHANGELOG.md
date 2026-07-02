# @atlaskit/editor-presets

## 5.0.19

### Patch Changes

- [`d129b4a5b7e21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d129b4a5b7e21) -
  Clean up feature gate `platform_editor_ai_aifc_space_shortcut`

## 5.0.18

### Patch Changes

- Updated dependencies

## 5.0.17

### Patch Changes

- Updated dependencies

## 5.0.16

### Patch Changes

- [`46ee61dd53e91`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/46ee61dd53e91) -
  Remove stale experiment confluence_compact_text_format (FFCLEANUP-85812): inline final values
  (flag enabled), simplify conditions, remove experiment config entries.
- Updated dependencies

## 5.0.15

### Patch Changes

- Updated dependencies

## 5.0.14

### Patch Changes

- Updated dependencies

## 5.0.13

### Patch Changes

- Updated dependencies

## 5.0.12

### Patch Changes

- [`346f91cfe1997`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/346f91cfe1997) -
  Clean up prefer static regex violations
- Updated dependencies

## 5.0.11

### Patch Changes

- [`a8c135d0b7bfb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8c135d0b7bfb) -
  Cleanup experiment `confluence_load_editor_title_on_transition`. The placeholder loading spinner
  and the collab-not-ready placeholder skip during transitions are now always enabled, and the
  experiment definition has been removed from the editor statsig config.
- Updated dependencies

## 5.0.10

### Patch Changes

- Updated dependencies

## 5.0.9

### Patch Changes

- Updated dependencies

## 5.0.8

### Patch Changes

- Updated dependencies

## 5.0.7

### Patch Changes

- Updated dependencies

## 5.0.6

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [`137ce6a6d525e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/137ce6a6d525e) -
  Prevent automatic table fit-to-content conversion from rewriting resized tables
- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- [`81545f4d0e189`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81545f4d0e189) -
  Add code block format provider plumbing for Confluence editor presets and align code block
  formatting state with the shared provider result type.
- Updated dependencies

## 4.0.16

### Patch Changes

- Updated dependencies

## 4.0.15

### Patch Changes

- Updated dependencies

## 4.0.14

### Patch Changes

- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- Updated dependencies

## 4.0.10

### Patch Changes

- Updated dependencies

## 4.0.9

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.2.9

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- Updated dependencies

## 3.2.7

### Patch Changes

- Updated dependencies

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

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

- [`6403e27aa3327`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6403e27aa3327) -
  Add the experimental table row menu structure, keyboard shortcut hints, and shared table menu
  items. Expose table row menu icons through editor-toolbar. Ensure the UI control registry is
  available before table row menu items are registered.
- Updated dependencies

## 3.2.0

### Minor Changes

- [`edd5d6d4c23ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/edd5d6d4c23ec) -
  Add SSR streaming supporting to Editor starmt cards and extensions

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
