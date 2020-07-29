import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuShouldFitContainerExample = () => (
  <DropdownMenu shouldFitContainer triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuShouldFitContainerExample;
