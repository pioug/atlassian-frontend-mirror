import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../src';

const DropdownMenuCheckbox = () => (
  <DropdownMenu
    trigger="Choices"
    onOpenChange={__noop}
    testId="lite-mode-ddm"
    shouldRenderToParent
  >
    <DropdownItemCheckboxGroup id="cities" title="Some cities">
      <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>

      <DropdownItemCheckbox id="melbourne" defaultSelected>
        Melbourne
      </DropdownItemCheckbox>
    </DropdownItemCheckboxGroup>
  </DropdownMenu>
);

export default DropdownMenuCheckbox;
