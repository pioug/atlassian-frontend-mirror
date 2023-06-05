import React from 'react';

import { token } from '@atlaskit/tokens';

import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemGroup,
  DropdownItemRadio,
} from '../src';

export default () => (
  <div style={{ padding: token('space.150', '12px') }}>
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
