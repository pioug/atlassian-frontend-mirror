import React from 'react';

import Toggle from '@atlaskit/toggle';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

import NestedDropdownMenuExample from './12-nested-dropdown';

export default () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      margin: '25px',
    }}
  >
    <div style={{ display: 'flex', gap: '25px' }}>
      <Toggle id="toggle-default-1" />
      <span>Non-interactive element</span>
      <DropdownMenu
        trigger="Page actions"
        testId="dropdown"
        shouldRenderToParent
      >
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
      <span>Non-interactive element</span>
      <Toggle id="toggle-default-2" />
    </div>
    <div>
      <span>Nested dropdown Example</span>
      <NestedDropdownMenuExample />
    </div>
  </div>
);
