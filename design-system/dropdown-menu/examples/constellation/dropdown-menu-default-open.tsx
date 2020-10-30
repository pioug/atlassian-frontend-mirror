import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuDefaultOpenExample = () => (
  <DropdownMenu defaultOpen trigger="Page actions" triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Edit</DropdownItem>
      <DropdownItem>Move</DropdownItem>
      <DropdownItem>Clone</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuDefaultOpenExample;
