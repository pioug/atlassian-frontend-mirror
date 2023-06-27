import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export const testId = 'test';

const DropdownMenuKeyboard = () => (
  <DropdownMenu trigger="trigger" testId={testId}>
    <DropdownItemGroup>
      <DropdownItem>Move</DropdownItem>
      <DropdownItem>Clone</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownMenuKeyboard;
