import React from 'react';

import CheckIcon from '@atlaskit/icon/glyph/check';

import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemGroup,
  DropdownItemGroupCheckbox,
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../src';

export default () => (
  <DropdownMenu trigger="Filter cities" triggerType="button">
    <DropdownItemGroupRadio
      title="Aussie cities"
      elemAfter={<CheckIcon label="" />}
      id="au"
    >
      <DropdownItemRadio id="adelaide">Adelaide</DropdownItemRadio>
      <DropdownItemRadio id="newcastle">Newcastle</DropdownItemRadio>
    </DropdownItemGroupRadio>
    <DropdownItemGroupCheckbox title="American cities" id="usa">
      <DropdownItemCheckbox id="adelaide">San Francisco</DropdownItemCheckbox>
      <DropdownItemCheckbox id="sydney">California</DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
    <DropdownItemGroup title="Canadian cities">
      <DropdownItem>Toronto</DropdownItem>
      <DropdownItem>Vancouver</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
