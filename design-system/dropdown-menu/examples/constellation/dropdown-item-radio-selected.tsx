import React from 'react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '../../src';

const DropdownItemRadioSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions">
      <DropdownItemRadioGroup id="actions">
        <DropdownItemRadio id="edit">Edit</DropdownItemRadio>
        <DropdownItemRadio id="move" isSelected>
          Move
        </DropdownItemRadio>
      </DropdownItemRadioGroup>
    </DropdownMenu>
  );
};

export default DropdownItemRadioSelectedExample;
