/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../src';

const containerStyles = css({
  padding: token('space.200', '16px'),
});

const buttonStyles = css({
  margin: token('space.200', '16px'),
});

export default function ReturnFocusToElement() {
  const [isOpen, setIsOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <div data-testid="return-focus-container" css={containerStyles}>
      <Button
        appearance="primary"
        onClick={open}
        testId="open-modal"
        css={buttonStyles}
      >
        Open trigger
      </Button>
      <Button
        appearance="primary"
        ref={returnFocusRef}
        testId="return-focus-element"
      >
        Focused on modal close
      </Button>
      {isOpen && (
        <ModalDialog shouldReturnFocus={returnFocusRef}>
          <ModalHeader>
            <ModalTitle>Returning focus to custom element</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Modal content</p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="primary" onClick={close} testId="close-modal">
              Close
            </Button>
          </ModalFooter>
        </ModalDialog>
      )}
    </div>
  );
}
