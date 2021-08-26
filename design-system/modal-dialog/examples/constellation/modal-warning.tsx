import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle appearance="warning">
                Delete the Newtown Repository
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              Bamboo will permanently delete all related configuration settings,
              artifacts, logos, and results. This can’t be undone.
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Cancel</Button>
              <Button appearance="warning" onClick={closeModal} autoFocus>
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
