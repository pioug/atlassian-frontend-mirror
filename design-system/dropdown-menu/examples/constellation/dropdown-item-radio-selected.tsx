import React from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../../src';

const DropdownItemRadioSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroupRadio id="actions">
        <DropdownItemRadio id="edit">Edit</DropdownItemRadio>
        <DropdownItemRadio id="move" isSelected>
          Move
        </DropdownItemRadio>
      </DropdownItemGroupRadio>
    </DropdownMenu>
  );
};

export default DropdownItemRadioSelectedExample;
