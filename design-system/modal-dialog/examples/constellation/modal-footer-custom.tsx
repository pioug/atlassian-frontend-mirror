import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/custom-theme-button';
import { N30, N50 } from '@atlaskit/theme/colors';

import Modal, {
  FooterComponentProps,
  ModalFooter,
  ModalTransition,
} from '../../src';

const CustomFooter = (props: FooterComponentProps) => {
  return (
    <ModalFooter
      style={{
        padding: 24,
        backgroundColor: N30,
        boxShadow: props.showKeyline ? `0 -2px 0 0 ${N50}` : 'none',
      }}
    >
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
            <Lorem count={10} />
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
