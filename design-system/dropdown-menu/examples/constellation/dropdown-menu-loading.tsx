import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuLoadingExample = () => {
  return (
    <DropdownMenu isLoading trigger="Page actions" triggerType="button">
      <DropdownItemGroup>
        <DropdownItem>Loaded action</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuLoadingExample;
