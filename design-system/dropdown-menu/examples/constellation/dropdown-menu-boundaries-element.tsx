import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuBoundariesExample = () => {
  return (
    <DropdownMenu
      boundariesElement="viewport"
      appearance="tall"
      trigger="Page actions"
      triggerType="button"
    >
      <DropdownItemGroup>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuBoundariesExample;
