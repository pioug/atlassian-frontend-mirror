import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
} from '../../src';

const DropdownItemCheckboxSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroupCheckbox id="actions">
        <DropdownItemCheckbox id="edit">Edit</DropdownItemCheckbox>
        <DropdownItemCheckbox id="move" isSelected>
          Move
        </DropdownItemCheckbox>
      </DropdownItemGroupCheckbox>
    </DropdownMenu>
  );
};

export default DropdownItemCheckboxSelectedExample;
