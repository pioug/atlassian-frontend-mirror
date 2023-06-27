import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export const testId = 'test';

const DropdownMenuKeyboard = () => (
  <DropdownMenu trigger="trigger" testId={testId}>
    <DropdownItemGroup>
      <DropdownItem isDisabled>First</DropdownItem>
      <DropdownItem>Second</DropdownItem>
      <DropdownItem isDisabled>Skip this</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
      <DropdownItem>Second Last</DropdownItem>
      <DropdownItem isDisabled>Last</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuKeyboard;
