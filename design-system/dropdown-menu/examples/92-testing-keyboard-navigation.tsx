import React from 'react';

import Toggle from '@atlaskit/toggle';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

import NestedDropdownMenuExample from './12-nested-dropdown';

export default () => (
  <>
    <DropdownMenu trigger="New behavior" testId="dropdown" shouldRenderToParent>
      <DropdownItemGroup>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
    <Toggle id="toggle-1" />
    <NestedDropdownMenuExample />
    <Toggle id="toggle-2" />
  </>
);
