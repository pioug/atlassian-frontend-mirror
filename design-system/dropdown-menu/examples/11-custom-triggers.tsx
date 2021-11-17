import React from 'react';

import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const DropdownMenuCustomTrigger = () => {
  return (
    <DropdownMenu
      placement="bottom-end"
      testId="lite-mode-ddm"
      trigger={({ triggerRef, ...triggerProps }) => (
        <Button
          ref={triggerRef}
          {...triggerProps}
          iconBefore={<MoreIcon label="more" />}
        >
          Click to open
        </Button>
      )}
    >
      <DropdownItemGroup>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuCustomTrigger;
