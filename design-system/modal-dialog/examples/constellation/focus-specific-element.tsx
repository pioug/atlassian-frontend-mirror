import React, { useCallback, useRef, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/standard-button';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTransition,
} from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const focusRef = useRef<HTMLElement>();

  return (
    <>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal autoFocus={focusRef} onClose={closeModal}>
            <ModalHeader>
              <Breadcrumbs>
                <BreadcrumbsItem href="#" text="Projects" />
                <BreadcrumbsItem href="#" text="Design System Team" />
              </Breadcrumbs>
            </ModalHeader>
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Learn more</Button>
              <Button appearance="primary" onClick={closeModal} autoFocus>
                Try it now
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
