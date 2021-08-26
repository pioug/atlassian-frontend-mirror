import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <>
      <button onClick={open}>open modal</button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close}>
            <ModalHeader>
              <ModalTitle>Modal title</ModalTitle>
            </ModalHeader>
            <ModalBody>A simple Modal</ModalBody>
            <ModalFooter>
              <Button testId="primary" appearance="primary" onClick={close}>
                Close
              </Button>
              <Button testId="secondary" appearance="subtle">
                Secondary Action
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
