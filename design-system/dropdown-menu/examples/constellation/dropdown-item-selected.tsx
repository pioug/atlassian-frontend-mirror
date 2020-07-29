import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemSelectedExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem isSelected>Sydney</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemSelectedExample;
