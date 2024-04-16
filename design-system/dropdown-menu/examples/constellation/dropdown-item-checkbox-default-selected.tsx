import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../../src';

const DropdownItemCheckboxExample = () => {
  return (
    <DropdownMenu trigger="Status" shouldRenderToParent>
      <DropdownItemCheckboxGroup title="Categories" id="actions">
        <DropdownItemCheckbox id="todo" defaultSelected>
          To do
        </DropdownItemCheckbox>
        <DropdownItemCheckbox id="inprogress">In progress</DropdownItemCheckbox>
        <DropdownItemCheckbox id="done">Done</DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};

export default DropdownItemCheckboxExample;
