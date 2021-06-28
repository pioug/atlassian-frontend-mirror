import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemDisabledExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroup>
        <DropdownItem isDisabled>Edit</DropdownItem>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemDisabledExample;
