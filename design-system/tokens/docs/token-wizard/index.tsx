/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { B50 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import { token } from '../../src';

import TokenWizardModalBody from './components/modal-body';

const sectionWrapperStyles = css({
  display: 'flex',
  padding: gridSize() * 3,
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: token('color.background.information', B50),
  borderRadius: borderRadius(),

  h3: {
    marginBottom: gridSize() * 4,
  },
});

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
    <div css={sectionWrapperStyles}>
      <Heading level="h600">Need help finding a design token?</Heading>
      <Button appearance="primary" onClick={openModal}>
        Open token wizard
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
    </div>
  );
};

export default TokenWizardModal;
