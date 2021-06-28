import React, { Fragment } from 'react';

import Button from '@atlaskit/button';
import Form, { CheckboxField, ErrorMessage, FormFooter } from '@atlaskit/form';

import { Checkbox } from '../../src';

interface FormData {
  [key: string]: string;
  'checkbox-invalid': string;
}

const validateOnSubmit = (data: FormData) => {
  let errors;
  errors = requiredValidator(data, 'checkbox-invalid');
  return errors;
};

const requiredValidator = (data: FormData, key: string) => {
  if (!data[key]) {
    return {
      [key]: `This field is required.`,
    };
  }
};

const CheckboxInvalidExample = () => {
  return (
    <Form<FormData>
      onSubmit={(data) => {
        console.log('form data', data);
        return Promise.resolve(validateOnSubmit(data));
      }}
    >
      {({ formProps }) => (
        <form {...formProps}>
          <CheckboxField name="checkbox-invalid">
            {({ fieldProps, error }) => (
              <Fragment>
                <Checkbox
                  {...fieldProps}
                  label="By checking this box you agree to the terms and conditions"
                  value="By checking this box you agree to the terms and conditions"
                  name="checkbox-invalid"
                  testId="cb-invalid"
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </Fragment>
            )}
          </CheckboxField>
          <FormFooter>
            <Button type="submit">Submit</Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};

export default CheckboxInvalidExample;
