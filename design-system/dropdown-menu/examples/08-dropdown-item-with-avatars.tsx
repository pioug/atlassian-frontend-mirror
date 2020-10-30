import React from 'react';

import Avatar from '@atlaskit/avatar';

import Dropdown, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <Dropdown defaultOpen triggerType="button" trigger="Assign to">
    <DropdownItemGroup title="Teammates">
      <DropdownItem elemBefore={<Avatar size="small" />}>
        Some text
      </DropdownItem>
      <DropdownItem elemBefore={<Avatar size="small" />}>
        Some text also
      </DropdownItem>
    </DropdownItemGroup>
  </Dropdown>
);
