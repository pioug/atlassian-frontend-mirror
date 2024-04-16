import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/glyph/more';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuCustomTriggerButtonExample = () => {
  return (
    <DropdownMenu<HTMLButtonElement>
      trigger={({ triggerRef, ...props }) => (
        <IconButton {...props} icon={MoreIcon} label="more" ref={triggerRef} />
      )}
      shouldRenderToParent
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
