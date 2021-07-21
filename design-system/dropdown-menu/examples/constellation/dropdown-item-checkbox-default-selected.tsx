import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
} from '../../src';

const DropdownItemCheckboxDefaultSelectedExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroupCheckbox id="actions">
        <DropdownItemCheckbox id="delete" defaultSelected>
          Delete
        </DropdownItemCheckbox>
        <DropdownItemCheckbox id="copy">Copy</DropdownItemCheckbox>
      </DropdownItemGroupCheckbox>
    </DropdownMenu>
  );
};

export default DropdownItemCheckboxDefaultSelectedExample;
