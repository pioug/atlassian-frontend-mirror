import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../../src';

const DropdownItemCheckboxSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions">
      <DropdownItemCheckboxGroup id="actions">
        <DropdownItemCheckbox id="edit">Edit</DropdownItemCheckbox>
        <DropdownItemCheckbox id="move" isSelected>
          Move
        </DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};

export default DropdownItemCheckboxSelectedExample;
