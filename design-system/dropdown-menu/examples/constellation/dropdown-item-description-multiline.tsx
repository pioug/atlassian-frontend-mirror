import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemMultilineExample = () => {
  return (
    <DropdownMenu trigger="Page actions">
      <DropdownItemGroup>
        <DropdownItem
          description="Lorem ipsum: In quis ligula ut massa scelerisque cursus. Nulla et
          dolor felis. Mauris euismod neque at venenatis tempor. Lorem ipsum: In quis ligula ut massa scelerisque cursus. Nulla et
          dolor felis. Mauris euismod neque at venenatis tempor."
        >
          Edit
        </DropdownItem>
        <DropdownItem
          description="Lorem ipsum: In quis ligula ut massa scelerisque cursus. Nulla et
          dolor felis. Mauris euismod neque at venenatis tempor. Lorem ipsum: In quis ligula ut massa scelerisque cursus. Nulla et
          dolor felis. Mauris euismod neque at venenatis tempor."
          shouldDescriptionWrap={false}
        >
          Move
        </DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemMultilineExample;
