import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <DropdownMenu
    trigger="Page actions"
    testId="dropdown"
    shouldRenderToParent
  >
		<DropdownItemGroup title="Actions">
      <DropdownItem>Move</DropdownItem>
      <DropdownItem>Clone</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </DropdownItemGroup>
	</DropdownMenu>
);
