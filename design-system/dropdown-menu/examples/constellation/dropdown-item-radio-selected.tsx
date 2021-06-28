import React from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../../src';

const DropdownItemRadioSelectedExample = () => {
  return (
    <DropdownMenu trigger="Filter city" triggerType="button">
      <DropdownItemGroupRadio id="cities">
        <DropdownItemRadio id="adelaide">Adelaide</DropdownItemRadio>
        <DropdownItemRadio id="sydney" isSelected>
          Sydney
        </DropdownItemRadio>
      </DropdownItemGroupRadio>
    </DropdownMenu>
  );
};

export default DropdownItemRadioSelectedExample;
