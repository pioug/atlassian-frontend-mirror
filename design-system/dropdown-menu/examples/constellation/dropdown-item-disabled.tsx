import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemDisabledExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem isDisabled>Sydney</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemDisabledExample;
