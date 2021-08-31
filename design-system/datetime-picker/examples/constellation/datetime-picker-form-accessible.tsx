import React from 'react';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter } from '@atlaskit/form';

import { DateTimePicker } from '../../src';

const DateTimePickerFormAccessibleExample = () => (
  <Form
    onSubmit={(formState: unknown) => console.log('form submitted', formState)}
  >
    {({ formProps }) => (
      <form {...formProps}>
        <Field
          name="datetime-picker-accessible"
          label="Scheduled run time"
          isRequired
        >
          {({ fieldProps }) => (
            <DateTimePicker
              {...fieldProps}
              datePickerSelectProps={{ 'aria-label': 'Select date' }}
              timePickerSelectProps={{ 'aria-label': 'Select time' }}
            />
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

export default DateTimePickerFormAccessibleExample;
