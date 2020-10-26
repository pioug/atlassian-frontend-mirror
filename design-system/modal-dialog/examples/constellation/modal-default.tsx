import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <>
      <Button appearance="primary" onClick={open}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={[
              { text: 'Try it now', onClick: close },
              { text: 'Learn more' },
            ]}
            onClose={close}
            heading="Test drive your new search"
          >
            We’ve turbocharged your search results so you can get back to doing
            what you do best.
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
