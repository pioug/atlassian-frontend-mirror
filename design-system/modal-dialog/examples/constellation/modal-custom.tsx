/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Modal, { ModalTransition, useModal } from '../../src';
import welcomeImage from '../images/this-is-new-jira.png';

const containerStyles = css({
  padding: token('space.500', '40px'),
  textAlign: 'center',
});

const imageStyles = css({
  borderRadius: `${token('border.radius', '3px')} ${token(
    'border.radius',
    '3px',
  )} 0 0`,
});

const headerStyles = css({
  font: token('font.heading.medium'),
  marginBlockEnd: token('space.100', '8px'),
});

const marginBottomStyles = css({
  marginBlockEnd: token('space.500', '40px'),
});

const CustomModalContent = () => {
  const { onClose, titleId } = useModal();

  return (
    <Fragment>
      <img
        alt="Graphic showing users working on a project"
        src={welcomeImage}
        css={imageStyles}
      />
      <div css={containerStyles}>
        <h1 css={headerStyles} id={titleId}>
          Experience your new Jira
        </h1>
        <p>
          Switch context, jump between projects, and get back to work quickly
          with our new look and feel.
        </p>
        <p css={marginBottomStyles}>
          Take it for a spin and let us know what you think.
        </p>
        <ButtonGroup label="Switch options">
          <Button appearance="subtle">Remind me later</Button>
          <Button onClick={onClose} appearance="primary">
            Switch to the new Jira
          </Button>
        </ButtonGroup>
      </div>
    </Fragment>
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
            <CustomModalContent />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
