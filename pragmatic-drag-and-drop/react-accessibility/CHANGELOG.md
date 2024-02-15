# @atlaskit/pragmatic-drag-and-drop-react-accessibility

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#59748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59748) [`70d293a2f8b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/70d293a2f8b8) - Removed the `DragHandleDropdownMenu` and `DragHandleDropdownMenuSmall` exports. Composition with `DropdownMenu` should be used instead.

  This decision was made to avoid the risk of mismatched versions of `@atlaskit/dropdown-menu`,
  which could occur when this package was bringing in a different version to the main one installed.
  It is also preferable to encourage composition,
  which allows for greater flexibility and control for consumers.

  **Before**

  ```tsx
  import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
  import { DragHandleDropdownMenu } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-dropdown-menu';

  function MyComponent() {
    const myRef = useRef<HTMLButtonElement>(null);
    return (
      <DragHandleDropdownMenu triggerRef={myRef} label="Reorder">
        <DropdownItemGroup>
          <DropdownItem>Move up</DropdownItem>
          <DropdownItem>Move down</DropdownItem>
        </DropdownItemGroup>
      </DragHandleDropdownMenu>
    );
  }
  ```

  **After**

  ```tsx
  import DropdownMenu, {
    DropdownItem,
    DropdownItemGroup,
  } from '@atlaskit/dropdown-menu';
  import mergeRefs from '@atlaskit/ds-lib/merge-refs';
  import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';

  function MyComponent() {
    const myRef = useRef<HTMLButtonElement>(null);
    return (
      <DropdownMenu
        trigger={({ triggerRef, ...triggerProps }) => (
          <DragHandleButton
            ref={mergeRefs([myRef, triggerRef])}
            {...triggerProps}
            label="Reorder"
          />
        )}
      >
        <DropdownItemGroup>
          <DropdownItem>Move up</DropdownItem>
          <DropdownItem>Move down</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    );
  }
  ```

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
