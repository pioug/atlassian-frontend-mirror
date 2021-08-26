/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N500 } from '@atlaskit/theme/colors';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalTransition,
  useModal,
} from '../../src';

const headerStyles = css({
  display: 'flex',
  padding: 24,
  alignItems: 'center',
  justifyContent: 'space-between',
});

const headingStyles = css({ fontSize: 20, fontWeight: 500 });

const CustomHeader = () => {
  const { onClose, titleId } = useModal();
  return (
    <div css={headerStyles}>
      <h1 css={headingStyles} id={titleId}>
        Custom modal header
      </h1>
      <Button appearance="link" onClick={onClose}>
        <CrossIcon label="Close Modal" primaryColor={N500} />
      </Button>
    </div>
  );
};

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
            <CustomHeader />
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
