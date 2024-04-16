import React from 'react';

import Inline from '@atlaskit/primitives/inline';

import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemGroup,
} from '../src';

export default () => (
  <Inline space="space.600">
    <DropdownMenu
      isOpen
      trigger="Page actions"
      testId="dropdown"
      spacing="compact"
      shouldRenderToParent
    >
      <DropdownItemGroup>
        <DropdownItem>Copy issue link</DropdownItem>
        <DropdownItem>Add flag</DropdownItem>
        <DropdownItem>Add label</DropdownItem>
        <DropdownItem>Add parent</DropdownItem>
        <DropdownItem>Print</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItem>Remove from sprint</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItemCheckbox id="action">Action</DropdownItemCheckbox>
        <DropdownItemCheckbox id="filter">Filter</DropdownItemCheckbox>
      </DropdownItemGroup>
    </DropdownMenu>
    <DropdownMenu
      isOpen
      trigger="Page actions"
      testId="dropdown"
      shouldRenderToParent
    >
      <DropdownItemGroup>
        <DropdownItem>Copy issue link</DropdownItem>
        <DropdownItem>Add flag</DropdownItem>
        <DropdownItem>Add label</DropdownItem>
        <DropdownItem>Add parent</DropdownItem>
        <DropdownItem>Print</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItem>Remove from sprint</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItemCheckbox id="action-2">Action</DropdownItemCheckbox>
        <DropdownItemCheckbox id="filter-2">Filter</DropdownItemCheckbox>
      </DropdownItemGroup>
    </DropdownMenu>
  </Inline>
);
