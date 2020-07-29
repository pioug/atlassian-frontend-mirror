import React, { useState } from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

export default function StatelessMenuExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <DropdownMenu
        isOpen={isOpen}
        onOpenChange={(attrs: OnOpenChangeArgs) => {
          setIsOpen(attrs.isOpen);
        }}
        trigger="Filter City"
        triggerType="button"
      >
        <DropdownItemGroupRadio id="cities">
          <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
          <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
        </DropdownItemGroupRadio>
      </DropdownMenu>
    </div>
  );
}
