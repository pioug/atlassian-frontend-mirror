# @atlaskit/pragmatic-drag-and-drop-react-accessibility

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [#41296](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41296) [`3e479ba1a4a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e479ba1a4a) - [ux] The drag handle icon now uses the `color.icon.subtle` token.
- [#41296](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41296) [`ac64412c674`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac64412c674) - Introduced small variants of the drag handle button and drag handle dropdown menu.

  These are intended for existing experiences with little space available to
  introduce a drag handle. They are not recommended for general use.

  These small variants can be accessed through the `/drag-handle-button-small` and
  `/drag-handle-dropdown-menu-small` entrypoints.

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#38144](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38144) [`ee9aa9b7300`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee9aa9b7300) - [ux] The button now has `display: flex`

## 0.2.0

### Minor Changes

- [#38115](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38115) [`ffb3e727aaf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffb3e727aaf) - The `type` of the `DragHandleButton` now defaults to `'button'` (instead of `'submit'`)
- [`9f5b56f5677`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f5b56f5677) - The `DragHandleButton` props now extend `ButtonHTMLAttributes` (instead of just `HTMLAttributes`)
