import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../src';

export default function ExampleDanger() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action' },
  ];

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={actions}
            onClose={close}
            heading="Modal Title"
            appearance="danger"
          >
            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
