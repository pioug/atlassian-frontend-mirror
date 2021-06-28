import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemCompactExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroup>
        <DropdownItem isCompact>Edit</DropdownItem>
        <DropdownItem isCompact>Move</DropdownItem>
        <DropdownItem isCompact>Clone</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemCompactExample;
