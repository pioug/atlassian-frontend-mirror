import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuPositionExample = () => (
  <DropdownMenu position="bottom right" triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuPositionExample;
