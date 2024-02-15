import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

export default function DefaultModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div>
      <Button appearance="primary" onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} testId="modal" label="Modal Label">
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
            <ModalBody>
              This modal has an <code>aria-label</code> for users of assistive
              technology.
            </ModalBody>
            <ModalFooter>
              <Button testId="secondary" appearance="subtle" onClick={close}>
                Secondary Action
              </Button>
              <Button testId="primary" appearance="primary" onClick={close}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
