import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button';

import Modal, {
  HeaderComponentProps,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

const CustomHeader = (props: HeaderComponentProps) => {
  return (
    <ModalHeader {...props}>
      <ModalTitle>Modal header</ModalTitle>
    </ModalHeader>
  );
};

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
              { text: 'Close', onClick: close },
              { text: 'Secondary Action' },
            ]}
            components={{
              Header: CustomHeader,
            }}
            onClose={close}
          >
            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
