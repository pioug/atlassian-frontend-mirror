import React from 'react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '../src';

const DropdownMenuRadio = () => {
  return (
    <div style={{ margin: '20px' }}>
      <DropdownMenu trigger="Filter cities" testId="lite-mode-ddm">
        <DropdownItemRadioGroup id="cities" title="Some cities">
          <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
          <DropdownItemRadio id="melbourne" defaultSelected>
            Melbourne
          </DropdownItemRadio>
        </DropdownItemRadioGroup>

        <DropdownItemRadioGroup id="other-cities" title="Some other cities">
          <DropdownItemRadio id="adelaide" defaultSelected>
            Adelaide
          </DropdownItemRadio>
          <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
          <DropdownItemRadio id="perth">Perth</DropdownItemRadio>
        </DropdownItemRadioGroup>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuRadio;
