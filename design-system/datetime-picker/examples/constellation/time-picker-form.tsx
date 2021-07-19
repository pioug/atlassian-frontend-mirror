import React from 'react';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

import { TimePicker } from '../../src';

const TimePickerFormExample = () => (
  <Form
    onSubmit={(formState: unknown) => console.log('form submitted', formState)}
  >
    {({ formProps }) => (
      <form {...formProps}>
        <Field name="time-picker" label="Scheduled run time" isRequired={false}>
          {({ fieldProps }) => (
            <>
              <TimePicker {...fieldProps} />
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

export default TimePickerFormExample;
