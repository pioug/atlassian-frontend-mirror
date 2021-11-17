import React from 'react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '../../src';

const DropDownItemRadioDefaultSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions">
      <DropdownItemRadioGroup id="actions">
        <DropdownItemRadio id="edit" defaultSelected>
          Edit
        </DropdownItemRadio>
        <DropdownItemRadio id="move">Move</DropdownItemRadio>
      </DropdownItemRadioGroup>
    </DropdownMenu>
  );
};

export default DropDownItemRadioDefaultSelectedExample;
