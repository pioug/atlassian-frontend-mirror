import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Field, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import Modal, { ContainerComponentProps, ModalTransition } from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const [name, setName] = useState('');

  const CustomContainer = useCallback((props: ContainerComponentProps) => {
    return (
      <form
        {...props}
        onSubmit={e => {
          e.preventDefault();
          const data = new FormData(e.target as HTMLFormElement);
          const obj: any = {};
          data.forEach((val, key) => {
            obj[key] = val;
          });

          setName(obj.name);
        }}
      >
        {props.children}
      </form>
    );
  }, []);

  return (
    <>
      <Button appearance="primary" onClick={open}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={[
              { text: 'Create', type: 'submit' },
              { text: 'Close', onClick: close },
            ]}
            components={{
              Container: CustomContainer,
            }}
            onClose={close}
            heading="Create a user"
          >
            <Field id="name" name="name" label="Type your name to continue">
              {({ fieldProps }) => (
                <Fragment>
                  <Textfield
                    {...fieldProps}
                    defaultValue="Atlassy"
                    value={undefined}
                  />
                  <HelperMessage>{name ? `Hello, ${name}` : ''}</HelperMessage>
                </Fragment>
              )}
            </Field>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
