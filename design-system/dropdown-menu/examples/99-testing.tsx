import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <DropdownMenu
    trigger="Choices"
    onOpenChange={(e) => console.log('dropdown opened', e)}
    defaultOpen
    testId="dropdown-menu"
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
