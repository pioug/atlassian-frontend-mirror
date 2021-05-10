import React, { useRef, useState } from 'react';

import styled from '@emotion/styled';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import ModalDialog, { ModalTransition } from '../src';

const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

export default function ModalDemo() {
  const focusRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState('');
  const modalProps = {
    onClose: close,
    testId: 'modal',
    actions: [{ text: 'Close', onClick: close }, { text: 'Secondary Action' }],
  };

  return (
    <div style={{ padding: 16 }}>
      <H4>Variants</H4>
      <ButtonGroup>
        <Button testId="boolean-trigger" onClick={() => setIsOpen('root')}>
          Boolean on dialog
        </Button>

        <Button
          testId="autofocus-trigger"
          onClick={() => setIsOpen('autoFocus')}
        >
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
          <ModalDialog heading="Boolean on dialog" {...modalProps}>
            <p>The first {'"tabbable"'} element will be focused.</p>
            <button>I am focused!</button>
            <button>I am NOT focused</button>
          </ModalDialog>
        )}
      </ModalTransition>

      <ModalTransition>
        {isOpen === 'autoFocus' && (
          <ModalDialog
            autoFocus={focusRef}
            heading="input has autoFocus"
            {...modalProps}
          >
            <p>The textbox should be focused</p>
            <input type="text" value="should not be focused" />
            <input ref={focusRef} type="text" value="should be focused" />
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
