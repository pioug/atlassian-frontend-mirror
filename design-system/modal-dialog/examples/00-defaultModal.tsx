import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../src';

export default function DefaultModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const secondaryAction = () => alert('Secondary button has been clicked!');

  const actions = [
    { text: 'Close', onClick: close, testId: 'primary' },
    {
      text: 'Secondary Action',
      onClick: secondaryAction,
      testId: 'secondary',
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
