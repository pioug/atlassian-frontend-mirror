import React from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../../src';

const DropDownItemRadioDefaultSelectedExample = () => (
  <DropdownMenu trigger="Select a city" triggerType="button">
    <DropdownItemGroupRadio id="cities">
      <DropdownItemRadio id="adelaide" defaultSelected>
        Adelaide
      </DropdownItemRadio>
      <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
    </DropdownItemGroupRadio>
  </DropdownMenu>
);

export default DropDownItemRadioDefaultSelectedExample;
