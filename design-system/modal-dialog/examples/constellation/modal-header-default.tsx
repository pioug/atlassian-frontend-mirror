import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
                <CrossIcon
                  label="Close Modal"
                  primaryColor={token('color.text.subtle', N500)}
                />
              </Button>
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
