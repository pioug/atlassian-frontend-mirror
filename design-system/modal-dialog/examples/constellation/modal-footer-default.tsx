import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button';

import Modal, {
  FooterComponentProps,
  ModalFooter,
  ModalTransition,
} from '../../src';

const CustomFooter = (props: FooterComponentProps) => {
  return (
    <ModalFooter {...props}>
      <span />
      <Button appearance={props.appearance} onClick={props.onClose}>
        Close
      </Button>
    </ModalFooter>
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
            components={{
              Footer: CustomFooter,
            }}
            onClose={close}
            heading="Modal title"
          >
            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
