import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

export default function DefaultModal() {
  const [isOpen, setIsOpen] = useState(true);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div>
      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} testId="modal" isBlanketHidden={true}>
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count={2} />
            </ModalBody>
            <ModalFooter>
              <Button
                autoFocus
                testId="primary"
                appearance="primary"
                onClick={close}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
