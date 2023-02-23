/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

import Modal, { ModalTransition } from '../../src';
import welcomeImage from '../images/this-is-new-jira.png';

const containerStyles = css({
  padding: token('space.500', '40px'),
  textAlign: 'center',
});

const headerStyles = css({
  marginBottom: token('space.100', '8px'),
  color: 'inherit',
  fontSize: 20,
  fontStyle: 'inherit',
  fontWeight: 500,
  letterSpacing: '-0.008em',
  lineHeight: 1.2,
});

const marginBottomStyles = css({
  marginBottom: token('space.500', '40px'),
});

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
            <img
              alt="Graphic showing users working on a project"
              src={welcomeImage}
            />
            <div css={containerStyles}>
              <h4 css={headerStyles}>Experience your new Jira</h4>
              <p>
                Switch context, jump between projects, and get back to work
                quickly with our new look and feel.
              </p>
              <p css={marginBottomStyles}>
                Take it for a spin and let us know what you think.
              </p>
              <ButtonGroup>
                <Button appearance="subtle-link">Remind me later</Button>
                <Button onClick={closeModal} appearance="primary" autoFocus>
                  Switch to the new Jira
                </Button>
              </ButtonGroup>
            </div>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
