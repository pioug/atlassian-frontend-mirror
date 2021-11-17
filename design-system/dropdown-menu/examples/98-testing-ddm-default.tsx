import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const DropdownMenuDefault = () => {
  return (
    <DropdownMenu
      placement="bottom-start"
      testId="lite-mode-ddm"
      trigger="Click to open"
    >
      <DropdownItemGroup title="bleh">
        <DropdownItem>Move</DropdownItem>

        <DropdownItem>Clone</DropdownItem>

        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuDefault;
