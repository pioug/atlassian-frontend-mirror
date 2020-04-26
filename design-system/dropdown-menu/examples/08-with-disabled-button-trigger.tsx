import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <DropdownMenu
    trigger="Disabled trigger"
    triggerType="button"
    triggerButtonProps={{ isDisabled: true }}
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
