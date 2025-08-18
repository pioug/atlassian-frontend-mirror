# @atlaskit/editor-plugin-toolbar

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [`3145f278b1f7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3145f278b1f7a) -
  [ux] [ED-28473] minor UI updates for editor-toolbar

  - Use ADS ButtonGroup for ToolbarButtonGroup
  - Remove groupLocation prop and use CSS instead
  - Use DropdownItemGroup for ToolbarDropdownItemSection and expand props for section separator and
    title
  - Support ReactNode as content for ToolbarTooltip and add missing shortcuts in tooltips
  - Center Icons for split buttons and make chevron icon 24px wide
  - Align dropdown menu UI with current editor design

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`54098ba4cc83c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/54098ba4cc83c) -
  Add LinkSection and TextSection and add logic to hide them when toolbar is pinned. Add
  UserPreferencesPlugin and EditorViewModePlugin as a dependency to editor-plugin-toolbar.

### Patch Changes

- [#199353](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199353)
  [`22cab8325fc62`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22cab8325fc62) -
  [ux] [ED-28760] Fix editor lose focus and hence editing flow is interrupted. This is done for 2
  components

  - Dropdown
    - Create context ToolbarUIContext for toolbar consumers to access consumer specific state and
      callbacks
    - Define onDropdownOpenChanged callback for selection toolbars so that editor regains focus
      after dropdown is closed
  - Button
    - Call preventDefault on mouseDown to prevent button takes away focus

- Updated dependencies

## 0.1.0

### Minor Changes

- [#196043](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196043)
  [`c6cb0ed855827`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6cb0ed855827) -
  Add new ShowMoreHorizontal Icon, add new ranks to support overflow menu, add pin as a menu item

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [#197019](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197019)
  [`96717455eea97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96717455eea97) -
  Add background colour to Toolbar component in editor-toolbar, add EditorToolbarProvider to the
  selection Toolbar
- Updated dependencies

## 0.0.5

### Patch Changes

- [#195899](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195899)
  [`345c0b6478f73`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/345c0b6478f73) -
  [ED-28682] Register text-section toolbar component
- Updated dependencies

## 0.0.4

### Patch Changes

- [#195460](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195460)
  [`dd320dee34d9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd320dee34d9f) -
  [ux] ED-28684 register ai components to the new toolbar behind platform_editor_toolbar_aifc
  experiment
- Updated dependencies

## 0.0.3

### Patch Changes

- Updated dependencies

## 0.0.2

### Patch Changes

- Updated dependencies

## 0.0.1

### Patch Changes

- [#192090](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192090)
  [`d1a5fb90b8bfd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1a5fb90b8bfd) -
  Add editor-plugin-toolbar package, which stores toolbar components and provides an api to register
  them, using editor-toolbar-model libary as state manager. This plugin also renders a new selection
  toolbar based on the new components.
- Updated dependencies
