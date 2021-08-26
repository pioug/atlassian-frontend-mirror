import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N500 } from '@atlaskit/theme/colors';

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
              <Button appearance="link" onClick={closeModal}>
                <CrossIcon label="Close Modal" primaryColor={N500} />
              </Button>
            </ModalHeader>
            <ModalBody>
              <Lorem count={2} />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Secondary Action</Button>
              <Button appearance="primary" onClick={closeModal} autoFocus>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
