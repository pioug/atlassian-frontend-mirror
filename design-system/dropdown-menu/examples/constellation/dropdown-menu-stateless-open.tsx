import React, { useState } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

const StatelessMenuOpenExample = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <DropdownMenuStateless
      isOpen={isOpen}
      onOpenChange={(attrs: OnOpenChangeArgs) => {
        setIsOpen(attrs.isOpen);
      }}
      trigger="Filter city"
      triggerType="button"
    >
      <DropdownItemGroupRadio id="cities">
        <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
        <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
      </DropdownItemGroupRadio>
    </DropdownMenuStateless>
  );
};

export default StatelessMenuOpenExample;
