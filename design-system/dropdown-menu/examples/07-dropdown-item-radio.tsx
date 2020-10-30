import React from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../src';

export default () => (
  <DropdownMenu trigger="Filter cities" triggerType="button">
    <DropdownItemGroupRadio id="cities">
      <DropdownItemRadio id="adelaide">Adelaide</DropdownItemRadio>
      <DropdownItemRadio id="sydney">
        Sydney, capital of New South Wales and one of Australia's largest
        cities, is best known for its harbourfront Sydney Opera House, with a
        distinctive sail-like design. Massive Darling Harbour and the smaller
        Circular Quay port are hubs of waterside life, with the arched Harbour
        Bridge and esteemed Royal Botanic Garden nearby. Sydney Tower’s outdoor
        platform, the Skywalk, offers 360-degree views of the city and suburbs.
      </DropdownItemRadio>
      <DropdownItemRadio id="newcastle" isSelected>
        Newcastle
      </DropdownItemRadio>
    </DropdownItemGroupRadio>
  </DropdownMenu>
);
