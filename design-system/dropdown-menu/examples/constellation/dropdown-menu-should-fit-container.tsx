import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuShouldFitContainerExample = () => {
  return (
    <DropdownMenu
      shouldFitContainer
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

export default DropdownMenuShouldFitContainerExample;
