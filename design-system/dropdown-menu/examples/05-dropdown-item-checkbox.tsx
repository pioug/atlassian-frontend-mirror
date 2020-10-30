import React from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
} from '../src';

export default () => (
  <DropdownMenu trigger="Filter cities" triggerType="button">
    <DropdownItemGroupCheckbox id="cities">
      <DropdownItemCheckbox id="adelaide">Adelaide</DropdownItemCheckbox>
      <DropdownItemCheckbox id="sydney">
        Sydney, capital of New South Wales and one of Australia's largest
        cities, is best known for its harbourfront Sydney Opera House, with a
        distinctive sail-like design. Massive Darling Harbour and the smaller
        Circular Quay port are hubs of waterside life, with the arched Harbour
        Bridge and esteemed Royal Botanic Garden nearby. Sydney Tower’s outdoor
        platform, the Skywalk, offers 360-degree views of the city and suburbs.
      </DropdownItemCheckbox>
      <DropdownItemCheckbox id="newcastle" isSelected>
        Newcastle
      </DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
  </DropdownMenu>
);
