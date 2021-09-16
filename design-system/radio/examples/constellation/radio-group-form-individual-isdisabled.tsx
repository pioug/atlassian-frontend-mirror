import React from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, { Field, FieldProps, FormFooter } from '@atlaskit/form';

import { RadioGroup } from '../../src';
import { OptionsPropType } from '../../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
  { name: 'color', value: 'black', label: 'Black', isDisabled: true },
];

export default function FormExampleSingleDisabled() {
  return (
    <div>
      <Form onSubmit={(data: object) => console.log('form data', data)}>
        {({ formProps }: { formProps: object }) => {
          return (
            <form {...formProps} name="form-example">
              <Field
                label="radio group with single radio item disabled"
                name="city"
                defaultValue="sydney"
              >
                {({ fieldProps }: { fieldProps: FieldProps<string> }) => (
                  <RadioGroup
                    {...fieldProps}
                    isDisabled={undefined}
                    options={options}
                  />
                )}
              </Field>
              <FormFooter>
                <Button type="submit" appearance="primary">
                  Submit
                </Button>
              </FormFooter>
            </form>
          );
        }}
      </Form>
    </div>
  );
}
