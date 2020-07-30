import React, { forwardRef, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button';
import { N30 } from '@atlaskit/theme/colors';

import Modal, { BodyComponentProps, ModalTransition } from '../../src';

const CustomBody = forwardRef((props: BodyComponentProps, ref: any) => {
  return (
    <div
      {...props}
      style={{
        backgroundColor: N30,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      ref={ref}
    />
  );
});

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
              Body: CustomBody,
            }}
            onClose={close}
            heading="Modal title"
          >
            <Lorem count={20} />
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
