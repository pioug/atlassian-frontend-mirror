import React from 'react';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerFormExample = () => (
  <Form
    onSubmit={(formState: unknown) => console.log('form submitted', formState)}
  >
    {({ formProps }) => (
      <form {...formProps}>
        <Field
          name="datetime-picker"
          label="Start date"
          isRequired={false}
          defaultValue=""
        >
          {({ fieldProps }) => (
            <>
              <DatePicker {...fieldProps} />
              <HelperMessage>Help or instruction text goes here</HelperMessage>
            </>
          )}
        </Field>
        <FormFooter>
          <Button type="submit" appearance="primary">
            Submit
          </Button>
        </FormFooter>
      </form>
    )}
  </Form>
);

export default DatePickerFormExample;
