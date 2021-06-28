import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuFixedExample = () => {
  return (
    <DropdownMenu
      trigger="Page actions"
      isMenuFixed
      boundariesElement="viewport"
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

export default DropdownMenuFixedExample;
