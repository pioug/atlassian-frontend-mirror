import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Field } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

export default function ModalDialogForm() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const [data, setData]: [
    {
      name?: string;
      email?: string;
      checkbox?: boolean;
      radiogroup?: string;
    },
    Function,
  ] = useState({});
  const onFormSubmit = (data: Object) => {
    setData(data);
    close();
  };

  return (
    <div>
      <Button appearance="primary" onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog onClose={close} testId="modal">
            <ModalHeader>
              <ModalTitle>Form Demo</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={onFormSubmit}>
                {({ formProps }) => (
                  <form {...formProps} id="modal-form">
                    <p>
                      Enter some text then submit the form to see the response.
                    </p>

                    <Field
                      label="Name"
                      name="name"
                      defaultValue=""
                      isRequired={true}
                    >
                      {({ fieldProps }) => <Textfield {...fieldProps} />}
                    </Field>

                    <Field
                      label="Email"
                      name="email"
                      defaultValue=""
                      isRequired={true}
                    >
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
                  </form>
                )}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button appearance="primary" type="submit" form="modal-form">
                Submit
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
      <Stack>
        <Box as="span">{data.name && `Name: ${data.name}`}</Box>
        <Box as="span">{data.email && `Email: ${data.email}`}</Box>
        <Box as="span">{data.checkbox && `Checkbox: ${data.checkbox}`}</Box>
        <Box as="span">
          {data.radiogroup && `Radio Group: ${data.radiogroup}`}
        </Box>
      </Stack>
    </div>
  );
}
