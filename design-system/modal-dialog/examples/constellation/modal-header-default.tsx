import React, { useCallback, useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';

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
    <div>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>Custom modal header</ModalTitle>
              <IconButton
                appearance="subtle"
                onClick={closeModal}
                label="Close Modal"
                icon={CrossIcon}
              />
            </ModalHeader>
            <ModalBody>
              <p>
                If you wish to customise a modal dialog, it accepts any valid
                React element as children.
              </p>

              <p>
                Modal header accepts any valid React element as children, so you
                can use modal title in conjunction with other elements like an
                exit button in the top right.
              </p>

              <p>
                Modal footer accepts any valid React element as children. For
                example, you can add an avatar in the footer. For very custom
                use cases, you can achieve the same thing without modal footer.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">About modals</Button>
              <Button appearance="primary" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
