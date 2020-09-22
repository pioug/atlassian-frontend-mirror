import React, { useState } from 'react';

import Button from '@atlaskit/button/custom-theme-button';

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
            actions={[{ text: 'Delete', onClick: close }, { text: 'Cancel' }]}
            onClose={close}
            heading="Delete the Newtown Repository"
            appearance="warning"
          >
            Bamboo will permanently delete all related configuration settings,
            artifacts, logos, and results. This can’t be undone.
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
