# @atlaskit/editor-toolbar

## 0.2.3

### Patch Changes

- [#201259](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/201259)
  [`1de5dd69e269d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1de5dd69e269d) -
  [ux] [EDITOR-1064] Added ai commands on the new selection toolbar platform

## 0.2.2

### Patch Changes

- [#198479](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198479)
  [`a427f04593fbd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a427f04593fbd) -
  [ux] ED-28685 register list and indentation menu to the new toolbar behind
  platform_editor_toolbar_aifc

## 0.2.1

### Patch Changes

- [`f22ce89845e1e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f22ce89845e1e) -
  [ED-28686] Register alignment toolbar component

## 0.2.0

### Minor Changes

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

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`54098ba4cc83c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/54098ba4cc83c) -
  Add new PrimaryToolbar export which removes box shadows, export toolbar types

## 0.1.1

### Patch Changes

- [`428e4e6ff8ac9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/428e4e6ff8ac9) -
  ED-28683 remove textStyle option from ToolbarDropdownItem, apply this style from the children
  instead
- [#197017](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197017)
  [`5ef01d09bada1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5ef01d09bada1) -
  [ux] ED-28687 [Register] Text colour + highlight

## 0.1.0

### Minor Changes

- [#196043](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196043)
  [`c6cb0ed855827`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6cb0ed855827) -
  Add new ShowMoreHorizontal Icon, add new ranks to support overflow menu, add pin as a menu item

## 0.0.10

### Patch Changes

- [#197019](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197019)
  [`96717455eea97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96717455eea97) -
  Add background colour to Toolbar component in editor-toolbar, add EditorToolbarProvider to the
  selection Toolbar

## 0.0.9

### Patch Changes

- [#195899](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195899)
  [`345c0b6478f73`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/345c0b6478f73) -
  [ED-28682]

  - Export more formatting icons
  - Add optional position props to ToolbarTooltip dictating tooltip position
  - Fix selected state for icon in ToolbarButton

## 0.0.8

### Patch Changes

- [#195460](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195460)
  [`dd320dee34d9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd320dee34d9f) -
  [ux] ED-28684 register ai components to the new toolbar behind platform_editor_toolbar_aifc
  experiment

## 0.0.7

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [#195270](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195270)
  [`749d634017afc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/749d634017afc) -
  [ux] [ED-28580] change toolbar and toolbar button height, icon size and text color icon, remove
  dividers and add comment button label

## 0.0.5

### Patch Changes

- [#192090](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192090)
  [`d1a5fb90b8bfd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1a5fb90b8bfd) -
  Add editor-plugin-toolbar package, which stores toolbar components and provides an api to register
  them, using editor-toolbar-model libary as state manager. This plugin also renders a new selection
  toolbar based on the new components.

## 0.0.4

### Patch Changes

- [#192343](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192343)
  [`9cb0878241016`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9cb0878241016) -
  ED-28736 more extensible selection extensions API

## 0.0.3

### Patch Changes

- [#192616](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192616)
  [`b97ca8e19b601`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b97ca8e19b601) -
  [ED-28595] add aria-attributes to toolbar button and toolbar dropdown item
- Updated dependencies

## 0.0.2

### Patch Changes

- [#189216](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189216)
  [`b4ba899b6cf55`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b4ba899b6cf55) -
  [ux] ED-28546 add nested flyouts to ui primitive library
- Updated dependencies

## 0.0.1

### Patch Changes

- [#187668](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187668)
  [`83251dd8644c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/83251dd8644c4) -
  [ux] [ED-28537] add support for tooltips, disabled states and hover states for new toolbar package
- Updated dependencies
