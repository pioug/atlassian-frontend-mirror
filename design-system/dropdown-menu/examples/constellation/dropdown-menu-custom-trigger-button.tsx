import React from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuCustomTriggerButtonExample = () => {
  return (
    <DropdownMenu
      triggerButtonProps={{ iconBefore: <MoreIcon label="more" /> }}
      triggerType="button"
    >
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

export default DropdownMenuCustomTriggerButtonExample;
