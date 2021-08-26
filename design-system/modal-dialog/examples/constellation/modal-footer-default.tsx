/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import InlineDialog from '@atlaskit/inline-dialog';
import { subtleText } from '@atlaskit/theme/colors';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

const wrapperStyles = css({
  display: 'flex',
  marginRight: 'auto',
  alignItems: 'center',
  color: subtleText(),
  cursor: 'help',
});

const marginLeftStyles = css({ marginLeft: '1em' });

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const openHint = useCallback(() => setIsHintOpen(true), []);
  const closeHint = useCallback(() => setIsHintOpen(false), []);

  return (
    <div>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>Custom modal footer</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count={2} />
            </ModalBody>
            <ModalFooter>
              <InlineDialog
                content="Some hint text?"
                isOpen={isHintOpen}
                placement="top-start"
              >
                <span
                  role="presentation"
                  css={wrapperStyles}
                  onMouseEnter={openHint}
                  onMouseLeave={closeHint}
                >
                  <Avatar size="small" />
                  <span css={marginLeftStyles}>Hover Me!</span>
                </span>
              </InlineDialog>
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
