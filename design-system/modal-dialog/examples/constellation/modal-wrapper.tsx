import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Field, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      const obj: any = {};
      data.forEach((val, key) => {
        obj[key] = val;
      });

      setName(obj.name);
    },
    [setName],
  );

  return (
    <>
      <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <form onSubmit={onSubmit}>
              <ModalHeader>
                <ModalTitle>Create a user</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Field id="name" name="name" label="Type your name to continue">
                  {({ fieldProps }) => (
                    <Fragment>
                      <Textfield
                        {...fieldProps}
                        defaultValue="Atlassy"
                        value={undefined}
                      />
                      <HelperMessage>
                        {name ? `Hello, ${name}` : ''}
                      </HelperMessage>
                    </Fragment>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button appearance="subtle" onClick={closeModal}>
                  Close
                </Button>
                <Button appearance="primary" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
