import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuShouldFlipExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button" shouldFlip>
      <DropdownItemGroup>
        <DropdownItem id="edit">Edit</DropdownItem>
        <DropdownItem id="copy">Move</DropdownItem>
        <DropdownItem id="clone">Clone</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuShouldFlipExample;
