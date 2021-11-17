import React, { useState } from 'react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
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
      >
        <DropdownItemRadioGroup id="actions">
          <DropdownItemRadio id="edit">Edit</DropdownItemRadio>
          <DropdownItemRadio id="move">Move</DropdownItemRadio>
        </DropdownItemRadioGroup>
      </DropdownMenu>
    </div>
  );
};

export default DropdownOpenExample;
