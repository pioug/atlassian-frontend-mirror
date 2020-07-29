import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
} from '../../src';

const DropdownItemCheckboxDefaultSelectedExample = () => (
  <DropdownMenu trigger="Select a city" triggerType="button">
    <DropdownItemGroupCheckbox id="cities">
      <DropdownItemCheckbox id="adelaide" defaultSelected>
        Adelaide
      </DropdownItemCheckbox>
      <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
  </DropdownMenu>
);

export default DropdownItemCheckboxDefaultSelectedExample;
