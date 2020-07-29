import React, { useState } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

const StatelessMenuFixedExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenuStateless
      isOpen={isOpen}
      trigger="Filter City"
      triggerType="button"
      isMenuFixed
      onOpenChange={(attrs: OnOpenChangeArgs) => {
        setIsOpen(attrs.isOpen);
      }}
    >
      <DropdownItemGroupRadio id="cities">
        <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
        <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
      </DropdownItemGroupRadio>
    </DropdownMenuStateless>
  );
};

export default StatelessMenuFixedExample;
