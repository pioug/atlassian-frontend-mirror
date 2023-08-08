import React from 'react';

import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const NestedDropdown = () => {
  return (
    <DropdownMenu
      placement="right-start"
      trigger={({ triggerRef, ...triggerProps }) => (
        <ButtonItem
          {...triggerProps}
          ref={triggerRef}
          iconAfter={
            <ChevronRightIcon
              primaryColor={token('color.icon.subtle', '')}
              label=""
            />
          }
        >
          <span>Nested Menu</span>
        </ButtonItem>
      )}
    >
      <DropdownItemGroup>
        <NestedDropdown />
        <DropdownItem>One of many items</DropdownItem>
        <DropdownItem>One of many items</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};
const NestedDropdownMenuExample = () => {
  return (
    <DropdownMenu trigger="Nested">
      <DropdownItemGroup>
        <NestedDropdown />
        <DropdownItem>One of many items</DropdownItem>
        <DropdownItem>One of many items</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default NestedDropdownMenuExample;
