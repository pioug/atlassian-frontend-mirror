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
      trigger="Page actions"
      triggerType="button"
      isMenuFixed
      onOpenChange={(attrs: OnOpenChangeArgs) => {
        setIsOpen(attrs.isOpen);
      }}
    >
      <DropdownItemGroupRadio id="actions">
        <DropdownItemRadio id="edit">Edit</DropdownItemRadio>
        <DropdownItemRadio id="move">Move</DropdownItemRadio>
      </DropdownItemGroupRadio>
    </DropdownMenuStateless>
  );
};

export default StatelessMenuFixedExample;
