/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button, { ButtonGroup } from '@atlaskit/button';

import Modal, { ModalTransition } from '../../src';

import welcomeImage from './assets/this-is-new-jira.png';

const containerStyles = css({
  padding: '40px 44px 36px',
  textAlign: 'center',
});

const headerStyles = css({
  marginBottom: 8,
  color: 'inherit',
  fontSize: 20,
  fontStyle: 'inherit',
  fontWeight: 500,
  letterSpacing: '-0.008em',
  lineHeight: 1.2,
});

const marginBottomStyles = css({ marginBottom: 40 });

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
