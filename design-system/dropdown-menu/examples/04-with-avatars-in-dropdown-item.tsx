import React from 'react';

import Avatar from '@atlaskit/avatar';

import Dropdown, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <Dropdown defaultOpen triggerType="button" trigger="Drop menu">
    <DropdownItemGroup title="Friends">
      <DropdownItem elemBefore={<Avatar size="small" />}>
        Some text
      </DropdownItem>
      <DropdownItem elemBefore={<Avatar size="small" />}>
        Some text also
      </DropdownItem>
    </DropdownItemGroup>
  </Dropdown>
);
