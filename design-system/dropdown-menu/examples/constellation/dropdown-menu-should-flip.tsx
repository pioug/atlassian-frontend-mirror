import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuShouldFlipExample = () => (
  <DropdownMenu triggerType="button" shouldFlip>
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuShouldFlipExample;
