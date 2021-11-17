import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../../src';

const DropdownItemCheckboxDefaultSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions">
      <DropdownItemCheckboxGroup id="actions">
        <DropdownItemCheckbox id="delete" defaultSelected>
          Delete
        </DropdownItemCheckbox>
        <DropdownItemCheckbox id="copy">Copy</DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};

export default DropdownItemCheckboxDefaultSelectedExample;
