/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import { Y50 } from '@atlaskit/theme/colors';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const customContainerStyles = css({
  display: 'flex',
  height: '700px',
  flex: '1 1 auto',
  flexDirection: 'column',
  background: Y50,
});

export default function DefaultModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const secondaryAction = useCallback(
    () => alert('Secondary button has been clicked!'),
    [],
  );

  return (
    <div>
      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} testId="modal">
            <div css={customContainerStyles} data-testid="custom-container">
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Lorem count={2} />
              </ModalBody>
              <ModalFooter>
                <Button
                  testId="secondary"
                  appearance="subtle"
                  onClick={secondaryAction}
                >
                  Secondary Action
                </Button>
                <Button
                  autoFocus
                  testId="primary"
                  appearance="primary"
                  onClick={close}
                >
                  Close
                </Button>
              </ModalFooter>
            </div>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
