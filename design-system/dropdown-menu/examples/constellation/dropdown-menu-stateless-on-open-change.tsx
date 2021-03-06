import React, { useState } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

const StatelessMenuOnOpenChangeExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
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
    </div>
  );
};

export default StatelessMenuOnOpenChangeExample;
