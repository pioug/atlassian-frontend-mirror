import React, { useRef, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/standard-button';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import Modal, { ModalHeader, ModalTransition } from '../../src';

function Header() {
  return (
    <ModalHeader>
      <Breadcrumbs>
        <BreadcrumbsItem href="#" text="Projects" />
        <BreadcrumbsItem href="#" text="Design System Team" />
      </Breadcrumbs>
    </ModalHeader>
  );
}

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const focusRef = useRef<HTMLElement>();

  return (
    <>
      <Button appearance="primary" onClick={open}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            autoFocus={focusRef}
            actions={[
              { text: 'Try it now', onClick: close },
              { text: 'Learn more' },
            ]}
            onClose={close}
            components={{ Header }}
          >
            <Field label="Email" name="my-email" defaultValue="">
              {({ fieldProps }) => (
                <Textfield
                  ref={focusRef}
                  autoComplete="off"
                  placeholder="gbelson@hooli.com"
                  {...fieldProps}
                />
              )}
            </Field>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
