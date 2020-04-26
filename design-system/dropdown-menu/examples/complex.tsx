import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../src';

export default () => (
  <DropdownMenu trigger="Favorite cities" triggerType="button">
    <DropdownItemGroupRadio id="cities-aus" title="Australia">
      <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
    </DropdownItemGroupRadio>
    <DropdownItemGroupCheckbox id="cities-us" title="United States">
      <DropdownItemCheckbox id="san-francisco">
        San Francisco
      </DropdownItemCheckbox>
      <DropdownItemCheckbox id="austin">Austin</DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
    <DropdownItemGroupRadio id="cities-elsewhere" title="Elsewhere">
      <DropdownItemRadio id="amsterdam">Amsterdam</DropdownItemRadio>
      <DropdownItemRadio id="yokohama">Yokohama</DropdownItemRadio>
      <DropdownItemRadio id="manila">Manila</DropdownItemRadio>
    </DropdownItemGroupRadio>
  </DropdownMenu>
);
