import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../src';

const DropdownMenuCheckbox = () => (
  <div style={{ margin: '20px' }}>
    <DropdownMenu
      trigger="Choices"
      onOpenChange={() => {}}
      testId="lite-mode-ddm"
    >
      <DropdownItemCheckboxGroup id="cities" title="Some cities">
        <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>

        <DropdownItemCheckbox id="melbourne" defaultSelected>
          Melbourne
        </DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  </div>
);

export default DropdownMenuCheckbox;
