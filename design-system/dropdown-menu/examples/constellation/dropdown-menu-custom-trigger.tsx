import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuCustomTriggerExample = () => {
  return (
    <DropdownMenu trigger={<button> &lt;button/&gt; trigger </button>}>
      <DropdownItemGroup>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Share</DropdownItem>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
        <DropdownItem>Report</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuCustomTriggerExample;
