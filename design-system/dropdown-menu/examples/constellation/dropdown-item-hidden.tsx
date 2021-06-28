import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemHiddenExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroup>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem isHidden>Publish</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemHiddenExample;
