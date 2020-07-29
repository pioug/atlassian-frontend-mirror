import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuBoundariesExample = () => (
  <DropdownMenu
    boundariesElement="viewport"
    appearance="tall"
    triggerType="button"
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuBoundariesExample;
