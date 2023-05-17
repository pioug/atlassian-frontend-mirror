import React from 'react';

import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemGroup,
  DropdownItemRadio,
} from '../src';

export default () => (
  <div style={{ padding: 12 }}>
    <DropdownMenu testId="dropdown" isOpen trigger="Filter cities">
      <DropdownItemGroup>
        <DropdownItemCheckbox id="checkbox" isSelected>
          Checkbox
        </DropdownItemCheckbox>
        <DropdownItemRadio id="radio" isSelected>
          Radio
        </DropdownItemRadio>
        <DropdownItem isSelected>Item</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  </div>
);
