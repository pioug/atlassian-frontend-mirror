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
            actions={[
              { text: 'Trash it', onClick: close },
              { text: 'No, keep it' },
            ]}
            onClose={close}
            heading="You’re about to delete this page"
            appearance="danger"
          >
            <p>
              Before you delete it permanently, there’s some things you should
              know:
            </p>
            <ul>
              <li>4 pages have links to this page that will break</li>
              <li>2 child pages will be left behind in the page tree</li>
            </ul>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
