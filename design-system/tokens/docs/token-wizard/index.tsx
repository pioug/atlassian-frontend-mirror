/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import DecisionIcon from '@atlaskit/icon/glyph/decision';
import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import TokenWizardModalBody from './components/modal-body';

const ModalHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

/**
 * __Token wizard modal__
 *
 * A token wizard modal on the tokens reference list page.
 *
 */
const TokenWizardModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <Fragment>
      <Button onClick={openModal} iconBefore={<DecisionIcon label="" />}>
        Token picker
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            autoFocus={false}
            onClose={closeModal}
            width="x-large"
            height={640}
          >
            <ModalHeader css={ModalHeaderStyles}>
              <ModalTitle>Token wizard</ModalTitle>
              <Button
                appearance="subtle"
                iconBefore={<CrossIcon label="Close modal" size="medium" />}
                onClick={closeModal}
              />
            </ModalHeader>
            <ModalBody>
              <TokenWizardModalBody />
            </ModalBody>
          </Modal>
        )}
      </ModalTransition>
    </Fragment>
  );
};

export default TokenWizardModal;
