import React from 'react';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '../src';

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
