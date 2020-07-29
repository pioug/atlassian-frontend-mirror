import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemDescriptionExample = () => (
  <DropdownMenu triggerType="button">
    <DropdownItemGroup>
      <DropdownItem description="Sydney is awesome">Sydney</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemDescriptionExample;
