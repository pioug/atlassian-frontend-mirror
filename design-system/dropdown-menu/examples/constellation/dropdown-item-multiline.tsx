import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemMultilineExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem shouldAllowMultiline>
        Sydney is capital of New South Wales and one of Australia's largest
        cities.
      </DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemMultilineExample;
