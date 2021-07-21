import React, { useState } from 'react';

import DropdownMenu, {
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../../src';
import { OnOpenChangeArgs } from '../../src/types';

const DropdownOpenExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <DropdownMenu
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
      </DropdownMenu>
    </div>
  );
};

export default DropdownOpenExample;
