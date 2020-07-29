import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemCompactExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem isCompact>Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemCompactExample;
