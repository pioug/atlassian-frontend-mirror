import React, { useState } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../src';
import { OnOpenChangeArgs } from '../src/types';

export default function StatelessMenuExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <DropdownMenuStateless
        isOpen={isOpen}
        onOpenChange={(attrs: OnOpenChangeArgs) => {
          setIsOpen(attrs.isOpen);
        }}
        trigger="Filter cities"
        triggerType="button"
      >
        <DropdownItemGroupRadio id="cities">
          <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
          <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
        </DropdownItemGroupRadio>
      </DropdownMenuStateless>
    </div>
  );
}
