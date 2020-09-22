import React, { useState } from 'react';

import Modal, { ModalBody, ModalTransition } from '../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <>
      <button onClick={open}>open modal</button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={[
              { text: 'Close', onClick: close },
              { text: 'Secondary Action' },
            ]}
            components={{
              Body: ModalBody,
            }}
            onClose={close}
            heading="Modal title"
          >
            A simple Modal
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
