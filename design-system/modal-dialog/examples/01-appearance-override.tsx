import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, { ActionProps, ModalTransition } from '../src';

export default function DefaultModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const actions: ActionProps[] = [
    {
      appearance: 'default',
      text: 'Close',
      onClick: close,
    },
    {
      appearance: 'primary',
      text: 'Secondary Action',
    },
  ];

  return (
    <div>
      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={actions}
            onClose={close}
            heading="Modal Title"
            testId="modal"
          >
            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
