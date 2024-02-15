import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  RequiredAsterisk,
} from '../src';

interface FormData {
  [key: string]: string;
  DOB: string;
  preference: string;
}

const validateOnSubmit = (data: FormData) => {
  let errors;
  errors = requiredValidator(data, 'DOB', errors);
  errors = requiredValidator(data, 'preference', errors);
  return errors;
};

const requiredValidator = (
  data: FormData,
  key: string,
  errors?: Record<string, string>,
) => {
  if (!data[key]) {
    return {
      ...errors,
      [key]: `Please select a date to continue.`,
    };
  }

  return errors;
};

export default () => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form<FormData>
      onSubmit={(data) => {
        console.log('form data', data);
        return Promise.resolve(validateOnSubmit(data));
      }}
    >
      {({ formProps }) => (
        <form {...formProps}>
          <FormHeader title="Book an appointment">
            <p aria-hidden="true">
              Required fields are marked with an asterisk <RequiredAsterisk />
            </p>
          </FormHeader>
          <Field name="DOB" label="Date of birth" defaultValue="" isRequired>
            {({ fieldProps: { id, ...rest }, error }) => (
              <Fragment>
                <DatePicker selectProps={{ inputId: id }} {...rest} />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </Fragment>
            )}
          </Field>
          <Field
            name="preference"
            label="Preferred appointment date & time"
            defaultValue=""
            isRequired
          >
            {({ fieldProps: { id, ...rest }, error }) => {
              const validationState = error ? 'error' : 'none';
              return (
                <Fragment>
                  <DateTimePicker
                    datePickerSelectProps={{ validationState, inputId: id }}
                    timePickerSelectProps={{
                      validationState,
                      'aria-labelledby': `${id}-label`,
                    }}
                    {...rest}
                  />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              );
            }}
          </Field>
          <FormFooter>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);
