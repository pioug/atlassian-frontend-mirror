import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemHiddenExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem isHidden>Brisbane</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemHiddenExample;
