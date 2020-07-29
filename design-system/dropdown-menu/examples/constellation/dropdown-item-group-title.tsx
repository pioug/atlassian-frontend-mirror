import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemGroupTitleExample = () => (
  <DropdownMenu trigger="Filter cities" triggerType="button">
    <DropdownItemGroup title="Australian cities">
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Canadian cities">
      <DropdownItem>Toronto</DropdownItem>
      <DropdownItem>Vancouver</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemGroupTitleExample;
