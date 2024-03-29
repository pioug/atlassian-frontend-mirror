/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { token } from '@atlaskit/tokens';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalTransition,
  useModal,
} from '../../src';

const headerStyles = css({
  display: 'flex',
  padding: token('space.300', '24px'),
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
      <IconButton
        appearance="subtle"
        icon={CrossIcon}
        label="Close Modal"
        onClick={onClose}
      />
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
