import React, { useState } from 'react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '../../src';

const DropdownItemRadioExample = () => {
  const [selected, setSelected] = useState<string>('detail');

  return (
    <DropdownMenu trigger="Views" shouldRenderToParent>
      <DropdownItemRadioGroup title="Views" id="actions">
        <DropdownItemRadio
          id="detail"
          onClick={() => setSelected('detail')}
          isSelected={selected === 'detail'}
        >
          Detail view
        </DropdownItemRadio>
        <DropdownItemRadio
          id="list"
          onClick={() => setSelected('list')}
          isSelected={selected === 'list'}
        >
          List view
        </DropdownItemRadio>
      </DropdownItemRadioGroup>
    </DropdownMenu>
  );
};

export default DropdownItemRadioExample;
