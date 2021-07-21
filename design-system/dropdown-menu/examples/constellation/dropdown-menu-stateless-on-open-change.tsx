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
        trigger="Page actions"
        triggerType="button"
      >
        <DropdownItemGroupRadio id="actions">
          <DropdownItemRadio id="edit">Edit</DropdownItemRadio>
          <DropdownItemRadio id="move">Move</DropdownItemRadio>
        </DropdownItemGroupRadio>
      </DropdownMenuStateless>
    </div>
  );
};

export default StatelessMenuOnOpenChangeExample;
