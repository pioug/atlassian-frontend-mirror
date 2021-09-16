import React from 'react';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter } from '@atlaskit/form';

import { RadioGroup } from '../../src';
import { OptionsPropType } from '../../src/types';

const colorItems: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];

export default function RadioRequired() {
  return (
    <Form<FormData> onSubmit={(formData) => console.log('form data', formData)}>
      {({ formProps }) => (
        <form {...formProps}>
          <Field
            label="Required radio group"
            name="color"
            defaultValue=""
            isRequired
          >
            {({ fieldProps }) => (
              <RadioGroup {...fieldProps} options={colorItems} />
            )}
          </Field>
          <FormFooter>
            <Button type="submit">Submit</Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
}
