import React, { useState } from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme/constants';

import ModalDialog, { ModalTransition } from '../src';
import { WIDTH_ENUM } from '../src/entry-points/constants';

const units = [420, '42%', '42em'];
const sizes: (string | number)[] = WIDTH_ENUM.values;
const allWidths = sizes.concat(units);
const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState<string | number>('');
  const open = (name: string | number) => setIsOpen(name);
  const close = () => setIsOpen('');

  const btn = (name: string | number) => (
    <Button key={name} onClick={() => open(name)}>
      {name}
    </Button>
  );
  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action' },
  ];

  return (
    <div style={{ padding: gridSize() }}>
      <H4>Sizes</H4>
      <ButtonGroup>{sizes.map(btn)}</ButtonGroup>
      <H4>Units</H4>
      <ButtonGroup>{units.map(btn)}</ButtonGroup>

      <ModalTransition>
        {allWidths
          .filter((w: string | number) => w === isOpen)
          .map((name: string | number) => (
            <ModalDialog
              actions={actions}
              key={name}
              onClose={close}
              heading={`Modal: ${String(name)}`}
              width={name}
            >
              <Lorem count="1" />
            </ModalDialog>
          ))}
      </ModalTransition>
    </div>
  );
}
