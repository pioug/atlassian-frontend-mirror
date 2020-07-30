import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button';
import { N30, N50, R100 } from '@atlaskit/theme/colors';

import Modal, {
  HeaderComponentProps,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

const CustomHeader = (props: HeaderComponentProps) => {
  return (
    <ModalHeader
      {...props}
      style={{
        padding: 24,
        backgroundColor: N30,
        boxShadow: props.showKeyline ? `0 2px 0 0 ${N50}` : 'none',
      }}
    >
      <ModalTitle style={{ color: R100 }}>Modal header</ModalTitle>
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
            <Lorem count={10} />
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
