import React from 'react';

import Avatar from '@atlaskit/avatar';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemElemBeforeExample = () => {
  return (
    <DropdownMenu triggerType="button">
      <DropdownItemGroup>
        <DropdownItem elemBefore={<Avatar size="small" />}>Kelly</DropdownItem>
        <DropdownItem elemBefore={<Avatar size="small" />}>Matt</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemElemBeforeExample;
