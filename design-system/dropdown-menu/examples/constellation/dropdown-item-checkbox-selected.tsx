import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
} from '../../src';

const DropdownItemCheckboxSelectedExample = () => (
  <DropdownMenu trigger="Filter cities" triggerType="button">
    <DropdownItemGroupCheckbox id="cities">
      <DropdownItemCheckbox id="adelaide">Adelaide</DropdownItemCheckbox>
      <DropdownItemCheckbox id="sydney" isSelected>
        Sydney
      </DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
  </DropdownMenu>
);

export default DropdownItemCheckboxSelectedExample;
