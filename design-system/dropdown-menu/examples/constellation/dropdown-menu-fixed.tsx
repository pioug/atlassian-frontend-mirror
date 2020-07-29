import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuFixedExample = () => (
  <DropdownMenu isMenuFixed boundariesElement="viewport" triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuFixedExample;
