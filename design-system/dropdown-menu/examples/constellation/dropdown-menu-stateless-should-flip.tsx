import React, { useState } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

const StatelessMenuShouldFlipExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenuStateless
      trigger="Filter city"
      triggerType="button"
      shouldFlip
      isOpen={isOpen}
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

export default StatelessMenuShouldFlipExample;
