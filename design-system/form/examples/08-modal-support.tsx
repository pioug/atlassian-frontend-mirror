import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

import Form, { CheckboxField, Field } from '../src';

export default function ModalDialogForm() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog
            heading="Modal dialog with form"
            onClose={close}
            actions={[
              { text: 'Submit', type: 'submit', form: 'form-with-id' },
              { text: 'Cancel', onClick: close },
            ]}
          >
            <Form
              onSubmit={value =>
                window.alert(
                  `You submitted:\n${JSON.stringify(value, undefined, 2)}`,
                )
              }
            >
              {({ formProps }) => (
                <form id="form-with-id" {...formProps}>
                  <p>
                    Enter some text then submit the form to see the response.
                  </p>

                  <Field label="Name" name="my-name" defaultValue="">
                    {({ fieldProps }) => <Textfield {...fieldProps} />}
                  </Field>

                  <Field label="Email" name="my-email" defaultValue="">
                    {({ fieldProps }) => (
                      <Textfield
                        autoComplete="off"
                        placeholder="charlie@atlassian.com"
                        {...fieldProps}
                      />
                    )}
                  </Field>

                  <CheckboxField
                    label="A single checkbox"
                    name="checkbox"
                    defaultIsChecked
                  >
                    {({ fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        value="example"
                        label="Checkbox"
                      />
                    )}
                  </CheckboxField>

                  <Field name="radiogroup" label="Colors" defaultValue="">
                    {({ fieldProps: { value, ...others } }) => (
                      <RadioGroup
                        options={[
                          { name: 'color', value: 'red', label: 'Red' },
                          { name: 'color', value: 'blue', label: 'Blue' },
                          { name: 'color', value: 'yellow', label: 'Yellow' },
                        ]}
                        {...others}
                      />
                    )}
                  </Field>
                </form>
              )}
            </Form>
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
}
