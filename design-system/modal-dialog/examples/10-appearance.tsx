import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../src';
import { AppearanceType } from '../src/internal/types';

const appearances: AppearanceType[] = ['warning', 'danger'];

export default function ExampleAppearance() {
  const [isOpen, setIsOpen] = useState<number | string>('');
  const open = (name: string) => setIsOpen(name);
  const close = () => setIsOpen('');

  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action' },
  ];

  return (
    <div>
      <ButtonGroup>
        {appearances.map(name => (
          <Button
            key={`${name}-trigger`}
            testId={name}
            onClick={() => open(name)}
          >
            Open: {name}
          </Button>
        ))}
      </ButtonGroup>

      <ModalTransition>
        {appearances
          .filter(a => a === isOpen)
          .map(name => (
            <Modal
              key="active-modal"
              actions={actions}
              appearance={name}
              onClose={close}
              heading={`Modal: ${name}`}
              testId="modal"
            >
              <Lorem count={2} />
            </Modal>
          ))}
      </ModalTransition>
    </div>
  );
}
