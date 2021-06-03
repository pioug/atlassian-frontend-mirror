import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <div style={{ margin: '20px' }}>
    <DropdownMenu
      trigger="Choices"
      triggerType="button"
      onOpenChange={(e) => console.log('dropdown opened', e)}
      testId="dropdown-menu"
    >
      <DropdownItemGroup>
        <DropdownItem>Sydney</DropdownItem>
        <DropdownItem>Melbourne</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  </div>
);
