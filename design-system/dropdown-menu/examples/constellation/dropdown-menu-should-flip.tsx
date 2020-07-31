import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuShouldFlipExample = () => (
  <DropdownMenu triggerType="button" shouldFlip>
    <DropdownItemGroup>
      <DropdownItem id="sydney">Sydney</DropdownItem>
      <DropdownItem id="melbourne">Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuShouldFlipExample;
