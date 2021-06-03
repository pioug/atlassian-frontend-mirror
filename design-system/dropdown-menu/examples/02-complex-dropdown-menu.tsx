import React from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../src';

export default () => (
  <DropdownMenu
    trigger="Filter cities"
    triggerType="button"
    onOpenChange={(e) => console.log('dropdown opened', e)}
  >
    <DropdownItemGroupRadio id="cities-aus" title="Australia">
      <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
    </DropdownItemGroupRadio>
    <DropdownItemGroupRadio id="cities-usa" title="United States">
      <DropdownItemRadio id="san-francisco">San Francisco</DropdownItemRadio>
      <DropdownItemRadio id="austin">Austin</DropdownItemRadio>
    </DropdownItemGroupRadio>
    <DropdownItemGroupRadio id="cities-elsewhere" title="Elsewhere">
      <DropdownItemRadio id="amsterdam">Amsterdam</DropdownItemRadio>
      <DropdownItemRadio id="yokohama">Yokohama</DropdownItemRadio>
      <DropdownItemRadio id="manila">Manila</DropdownItemRadio>
    </DropdownItemGroupRadio>
  </DropdownMenu>
);
