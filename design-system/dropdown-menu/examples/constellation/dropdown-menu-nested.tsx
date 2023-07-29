import React from 'react';

import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const NestedDropdownMenuExample = () => {
  return (
    <DropdownMenu trigger="Nested Menu">
      <DropdownItemGroup>
        <NestedDropdownItem />
        <DropdownItem>One of many items</DropdownItem>
        <DropdownItem>One of many items</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

const NestedDropdownItem = () => {
  return (
    <DropdownItem
      component={({ children }) => {
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
            {children}
          </DropdownMenu>
        );
      }}
    >
      <DropdownItemGroup>
        <NestedDropdownItem />
        <DropdownItem>One of many items</DropdownItem>
        <DropdownItem>One of many items</DropdownItem>
      </DropdownItemGroup>
    </DropdownItem>
  );
};

export default NestedDropdownMenuExample;
