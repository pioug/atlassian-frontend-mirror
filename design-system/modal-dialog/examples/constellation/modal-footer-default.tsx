/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import InlineDialog from '@atlaskit/inline-dialog';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

const wrapperStyles = css({
  display: 'flex',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  marginRight: 'auto',
  alignItems: 'center',
  color: token('color.text.subtlest', N200),
  cursor: 'help',
});

const marginLeftStyles = css({ marginLeft: token('space.200', '16px') });

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
