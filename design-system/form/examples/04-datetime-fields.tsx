import React, { Fragment, useRef, useState } from 'react';

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

export default () => {
  const [DOBfieldError, setDOBfieldError] = useState(false);
  const [preferenceFieldError, setPreferenceFieldError] = useState(false);

  const DOBfieldRef = useRef<HTMLInputElement>(null);
  const preferenceFieldRef = useRef<HTMLInputElement>(null);

  const setFocusOnFirstInvalidField = () => {
    if (DOBfieldError) {
      DOBfieldRef.current?.focus();
    }
    if (preferenceFieldError && !DOBfieldError) {
      preferenceFieldRef.current?.focus();
    }
  };

  return (
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
        }}
      >
        {({ formProps }) => (
          <form {...formProps}>
            <FormHeader title="Book an appointment">
              <p aria-hidden="true">
                Required fields are marked with an asterisk
                <RequiredAsterisk />
              </p>
            </FormHeader>
            <Field
              name="DOB"
              label="Date of birth"
              defaultValue={''}
              isRequired
              validate={(value) => {
                if (value) {
                  setDOBfieldError(false);
                  return undefined;
                }
                if (!value) {
                  setDOBfieldError(true);
                }

                return 'Please select a date to continue';
              }}
            >
              {({
                fieldProps: {
                  id,
                  ['aria-invalid']: ariaInvalid,
                  ['aria-describedby']: ariaDescribedby,
                  ...rest
                },
                error,
              }) => {
                return (
                  <Fragment>
                    <DatePicker
                      selectProps={{
                        ref: DOBfieldRef,
                        inputId: id,
                        'aria-invalid': ariaInvalid,
                        'aria-describedby': ariaDescribedby,
                      }}
                      {...rest}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </Fragment>
                );
              }}
            </Field>
            <Field
              name="preference"
              label="Preferred appointment date & time"
              defaultValue=""
              isRequired
              validate={(value) => {
                if (value) {
                  setPreferenceFieldError(false);
                  return undefined;
                }
                if (!value) {
                  setPreferenceFieldError(true);
                }

                return 'Please select a date to continue';
              }}
            >
              {({
                fieldProps: {
                  id,
                  ['aria-invalid']: ariaInvalid,
                  ['aria-describedby']: ariaDescribedby,
                  ...rest
                },
                error,
              }) => {
                return (
                  <Fragment>
                    <DateTimePicker
                      datePickerSelectProps={{
                        'aria-invalid': ariaInvalid,
                        'aria-describedby': `${id}-label ${
                          error ? ariaDescribedby : ''
                        }`,
                        ref: preferenceFieldRef,
                      }}
                      timePickerSelectProps={{
                        'aria-invalid': ariaInvalid,
                        'aria-describedby': `${id}-label ${
                          error ? ariaDescribedby : ''
                        }`,
                      }}
                      {...rest}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </Fragment>
                );
              }}
            </Field>
            <FormFooter>
              <Button
                type="submit"
                appearance="primary"
                onClick={setFocusOnFirstInvalidField}
              >
                Submit
              </Button>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
};
