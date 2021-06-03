import React, { useState } from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import ModalDialog, { ModalTransition } from '../src';

const units = [420, '42em', '100%'];
const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

export default function ModalDemo() {
  const [isOpen, setOpen] = useState<number | string>();

  const btn = (name?: string | number) => (
    <Button key={name} onClick={() => setOpen(name)}>
      {name}
    </Button>
  );

  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <H4>Units</H4>
      <ButtonGroup>{units.map(btn)}</ButtonGroup>

      <ModalTransition>
        {units
          .filter((w) => w === isOpen)
          .map((name) => (
            <ModalDialog
              actions={actions}
              key={name}
              onClose={close}
              heading={`Modal: ${name}`}
              height={name}
            >
              <Lorem count="1" />
            </ModalDialog>
          ))}
      </ModalTransition>
    </div>
  );
}
