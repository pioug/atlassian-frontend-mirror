import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

export default function FormAsContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const onFormSubmit = useCallback(
    (data: Object) => alert(JSON.stringify(data, null, 4)),
    [],
  );

  return (
    <div>
      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog onClose={close} testId="modal">
            <Form onSubmit={onFormSubmit}>
              {({ formProps }) => (
                <form {...formProps} id="modal-form">
                  <ModalHeader>
                    <ModalTitle>Form as Container Demo</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      This is an example where the form is wrapped around{' '}
                      <strong>all</strong> modal contents,{' '}
                      <strong>including</strong> the header and footer. Enter
                      some text then submit the form to see the response.
                    </p>

                    <Field label="Name" name="my-name" defaultValue="">
                      {({ fieldProps }) => <Textfield {...fieldProps} />}
                    </Field>

                    <Field label="Email" name="my-email" defaultValue="">
                      {({ fieldProps }) => (
                        <Textfield
                          autoComplete="off"
                          placeholder="gbelson@hooli.com"
                          {...fieldProps}
                        />
                      )}
                    </Field>

                    <CheckboxField name="checkbox" defaultIsChecked>
                      {({ fieldProps }) => (
                        <Checkbox
                          {...fieldProps}
                          value="example"
                          label="Checkbox"
                        />
                      )}
                    </CheckboxField>

                    <Field
                      name="radiogroup"
                      defaultValue=""
                      label="Basic Radio Group Example"
                    >
                      {({ fieldProps }) => (
                        <RadioGroup
                          options={[
                            { name: 'color', value: 'red', label: 'Red' },
                            { name: 'color', value: 'blue', label: 'Blue' },
                            { name: 'color', value: 'yellow', label: 'Yellow' },
                          ]}
                          {...fieldProps}
                        />
                      )}
                    </Field>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      appearance="primary"
                      type="submit"
                      form="modal-form"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Form>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
