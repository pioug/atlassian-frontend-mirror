import React, { Fragment } from 'react';

import Button from '@atlaskit/button';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';

import TextArea from '../src';

interface FormData {
  [key: string]: string;
  'textarea-validation': string;
}

const validateOnSubmit = (data: FormData) => {
  let errors;
  errors = requiredValidator(data, 'textarea-validation');
  return errors;
};

const requiredValidator = (data: FormData, key: string) => {
  if (data[key] !== 'open sesame') {
    return {
      [key]: 'INCORRECT_PHRASE',
    };
  }
};

export default () => {
  return (
    <Form
      onSubmit={(formData: { 'textarea-validation': string }) => {
        console.log('form data', formData);
        return Promise.resolve(validateOnSubmit(formData));
      }}
    >
      {({ formProps }) => (
        <form {...formProps}>
          <Field
            label="Only validates on submit = open sesame"
            isRequired
            name="textarea-validation"
            defaultValue=""
          >
            {({ fieldProps, error }: any) => (
              <Fragment>
                <TextArea {...fieldProps} />
                {error === 'INCORRECT_PHRASE' && (
                  <ErrorMessage>
                    Incorrect, try &lsquo;open sesame&rsquo;
                  </ErrorMessage>
                )}
              </Fragment>
            )}
          </Field>
          <FormFooter>
            <Button type="submit">Submit</Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};
