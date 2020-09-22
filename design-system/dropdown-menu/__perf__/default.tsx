import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const DropdownMenuDefaultExample = () => (
  <DropdownMenu trigger="Cities in Australia" triggerType="button">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
      <DropdownItem>Adelaide</DropdownItem>
      <DropdownItem>Perth</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
      <DropdownItem>Canberra</DropdownItem>
      <DropdownItem>Hobart</DropdownItem>
      <DropdownItem>Darwin</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuDefaultExample;
