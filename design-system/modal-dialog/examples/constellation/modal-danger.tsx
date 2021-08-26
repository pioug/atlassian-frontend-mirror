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
              <ModalTitle appearance="danger">
                You’re about to delete this page
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>
                Before you delete it permanently, there’s some things you should
                know:
              </p>
              <ul>
                <li>4 pages have links to this page that will break</li>
                <li>2 child pages will be left behind in the page tree</li>
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Cancel</Button>
              <Button appearance="danger" onClick={closeModal} autoFocus>
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
