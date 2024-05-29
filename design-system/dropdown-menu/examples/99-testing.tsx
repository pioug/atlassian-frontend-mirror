import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

import NestedDropdownMenuExample from './12-nested-dropdown';

export default () => (
  <div
    style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      flexDirection: 'column',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      gap: '25px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      margin: '25px',
    }}
  >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
    <div style={{ display: 'flex', gap: '25px' }}>
      <Stack>
        <Label htmlFor="toggle-1">Allow pull requests</Label>
        <Toggle id="toggle-1" />
      </Stack>
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
      <Stack>
        <Label htmlFor="toggle-2">Allow pull requests</Label>
        <Toggle id="toggle-2" />
      </Stack>
    </div>
    <div>
      <span>Nested dropdown Example</span>
      <NestedDropdownMenuExample />
    </div>
  </div>
);
