import React, { useState } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

const StatelessMenuLoadingExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenuStateless
      isOpen={isOpen}
      trigger="Filter city"
      triggerType="button"
      isLoading
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

export default StatelessMenuLoadingExample;
