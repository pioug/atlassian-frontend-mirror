# @atlaskit/editor-plugin-toolbar

## 1.1.0

### Minor Changes

- [`50976babce55d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/50976babce55d) -
  Add new 'onClick' to dropdown menu, hook up new toolbar api to regsiter components on selection
  change, add new safeRegistry method to replace existing objects

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`cb63aae8c8554`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb63aae8c8554) -
  Add a check to ensure selection toolbar renders when all doc is selected

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.4.6

### Patch Changes

- [`51f3f2db61f6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51f3f2db61f6e) -
  Update toolbar config across plugins
- Updated dependencies

## 0.4.5

### Patch Changes

- [`4ef462fecb522`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ef462fecb522) -
  [ux] [ED-29003] Register loom component as a dropdown menu item in overflow menu
- Updated dependencies

## 0.4.4

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [`463f3da1f7822`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/463f3da1f7822) -
  [ux] ED-29040 add new option to disable selection toolbar when the toolbar is pinned
- Updated dependencies

## 0.4.2

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 0.4.1

### Patch Changes

- [`187540cdffa74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/187540cdffa74) -
  [ux] ED-29035 show text formatting option in comment toolbar regardless of pinning settings
- Updated dependencies

## 0.4.0

### Minor Changes

- [`e73faa5a52300`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e73faa5a52300) -
  [ux] ED-28735 Fix selection toolbar opening and closing state

### Patch Changes

- [`b27824f2875be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b27824f2875be) -
  [ux] [ED-28821] Add pin button to full page primary toolbar
- Updated dependencies

## 0.3.1

### Patch Changes

- [`286abb4d35eba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/286abb4d35eba) -
  [ux] [ED-28960] Finish full page primary toolbar migration

  - Align with design update (separator, gap, height, icon size)
  - Add keyboard shortcut to focus toolbar and arrow key navigation
  - Address accessibility

- Updated dependencies

## 0.3.0

### Minor Changes

- [`44b183a57537a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/44b183a57537a) -
  Introduce a new plugin config option for editor-plugin-toolbar to disable the selection toolbar

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [`03b0204b5eb82`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03b0204b5eb82) -
  ED=28738 Disable toolbar when editor is offline
- Updated dependencies

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
