import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../src';

const DropdownMenuMultipleCheckboxGroup = () => (
  <div style={{ margin: '20px' }}>
    <DropdownMenu trigger="Choices" testId="lite-mode-ddm">
      <DropdownItemCheckboxGroup id="cities" title="Some cities">
        <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
        <DropdownItemCheckbox id="melbourne" defaultSelected>
          Melbourne
        </DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>

      <DropdownItemCheckboxGroup id="other-cities" title="Some other cities">
        <DropdownItemCheckbox id="adelaide" defaultSelected>
          Adelaide
        </DropdownItemCheckbox>
        <DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  </div>
);

export default DropdownMenuMultipleCheckboxGroup;
