import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../src';

export default function ExampleBasic() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const actions = [
    { text: 'Delete', onClick: close },
    {
      text: 'Cancel',
      autoFocus: true,
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
            appearance="danger"
            onClose={close}
            heading="Delete Repository"
            testId="modal"
          >
            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
