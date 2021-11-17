import React from 'react';

import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuCustomTriggerButtonExample = () => {
  return (
    <DropdownMenu
      trigger={({ triggerRef, ...props }) => (
        <Button
          {...props}
          iconBefore={<MoreIcon label="more" />}
          ref={triggerRef}
        />
      )}
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
