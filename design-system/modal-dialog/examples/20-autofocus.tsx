/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@emotion/core';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme/constants';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const containerStyles = css({
  padding: `${gridSize() * 2}px`,
});

const titleStyles = css({
  marginBottom: '0.66em',
});

export default function ModalDemo() {
  const focusRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState('');

  const openRoot = useCallback(() => setIsOpen('root'), []);
  const openAutoFocus = useCallback(() => setIsOpen('autoFocus'), []);

  const close = useCallback(() => setIsOpen(''), []);

  const modalProps = {
    onClose: close,
    testId: 'modal',
  };

  return (
    <div css={containerStyles}>
      <h4 css={titleStyles}>Variants</h4>
      <ButtonGroup>
        <Button testId="boolean-trigger" onClick={openRoot}>
          Boolean on dialog
        </Button>

        <Button testId="autofocus-trigger" onClick={openAutoFocus}>
          using autoFocus attribute
        </Button>
      </ButtonGroup>

      <p>
        When boolean applied to the dialog, we search inside for tabbable
        elements.
      </p>
      <p>
        The autoFocus property must be a function rather the node itself so its
        evaluated at the right time and ensures a node is returned.
      </p>

      <ModalTransition>
        {isOpen === 'root' && (
          <ModalDialog {...modalProps}>
            <ModalHeader>
              <ModalTitle>Boolean on dialog</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>The first {'"tabbable"'} element will be focused.</p>
              <button>I am focused!</button>
              <button>I am NOT focused</button>
            </ModalBody>
            <ModalFooter>
              <Button appearance="primary" onClick={close}>
                Close
              </Button>
              <Button appearance="subtle">Secondary Action</Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>

      <ModalTransition>
        {isOpen === 'autoFocus' && (
          <ModalDialog autoFocus={focusRef} {...modalProps}>
            <ModalHeader>
              <ModalTitle>input has autoFocus</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>The textbox should be focused</p>
              <input type="text" value="should not be focused" />
              <input ref={focusRef} type="text" value="should be focused" />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Secondary Action</Button>
              <Button onClick={close} appearance="primary">
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
