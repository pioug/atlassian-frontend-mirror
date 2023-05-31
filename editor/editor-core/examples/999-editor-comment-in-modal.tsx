/** @jsx jsx */
import { useState, useCallback } from 'react';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import { Editor } from '../src';

import { css, jsx } from '@emotion/react';

const bodyStyles = css`
  margin-top: 2rem;
  display: center;
  justify-content: center;
  align-items: center;
`;

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <div css={bodyStyles}>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal} width="large">
            <ModalHeader>
              <ModalTitle>Editor inside Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Editor appearance="comment" />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={closeModal}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={closeModal} autoFocus>
                Duplicate
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
};
