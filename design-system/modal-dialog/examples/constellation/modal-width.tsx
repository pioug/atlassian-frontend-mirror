import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import ModalDialog, { ModalTransition } from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const [width, setWidth] = useState('medium');
  const setWidthAndOpen = (newWidth: string) => {
    setWidth(newWidth);
    requestAnimationFrame(() => setIsOpen(true));
  };

  return (
    <>
      <ButtonGroup appearance="primary">
        <Button onClick={() => setWidthAndOpen('small')}>small</Button>
        <Button onClick={() => setWidthAndOpen('medium')}>medium</Button>
        <Button onClick={() => setWidthAndOpen('large')}>large</Button>
        <Button onClick={() => setWidthAndOpen('x-large')}>x-large</Button>
      </ButtonGroup>

      <ModalTransition>
        {isOpen && (
          <ModalDialog
            actions={[
              { text: 'Get started', onClick: close },
              { text: 'Skip' },
            ]}
            onClose={close}
            heading="Easily set up your own projects"
            width={width}
          >
            We simplified the way you set up issue types, workflows, fields, and
            screens. Check out the new, independent project experience to see it
            in action.
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
}
