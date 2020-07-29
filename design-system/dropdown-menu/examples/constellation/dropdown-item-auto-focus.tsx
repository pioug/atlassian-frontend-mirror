import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemAutoFocusExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem autoFocus>Sydney</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemAutoFocusExample;
