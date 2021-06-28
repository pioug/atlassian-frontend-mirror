import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemMultilineExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroup>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem shouldAllowMultiline>
          Lorem ipsum: In quis ligula ut massa scelerisque cursus. Nulla et
          dolor felis. Mauris euismod neque at venenatis tempor.
        </DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemMultilineExample;
