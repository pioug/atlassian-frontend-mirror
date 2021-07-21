import React from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../../src';

const DropDownItemRadioDefaultSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroupRadio id="actions">
        <DropdownItemRadio id="edit" defaultSelected>
          Edit
        </DropdownItemRadio>
        <DropdownItemRadio id="move">Move</DropdownItemRadio>
      </DropdownItemGroupRadio>
    </DropdownMenu>
  );
};

export default DropDownItemRadioDefaultSelectedExample;
