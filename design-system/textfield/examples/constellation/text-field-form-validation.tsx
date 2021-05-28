import React, { Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  ValidMessage,
} from '@atlaskit/form';

import Textfield from '../../src';

function validate(value: unknown) {
  if (value !== 'open sesame') {
    return 'INCORRECT_PHRASE';
  }
  return undefined;
}

export default function TextFieldFormValidationExample() {
  const handleSubmit = (formState: { command: string }) => {
    console.log('form state', formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ formProps }) => (
        <form {...formProps} name="validation-example">
          <Field
            label="Only validates on input = open sesame"
            name="command"
            validate={validate}
            defaultValue=""
          >
            {({ fieldProps, error, meta: { valid } }: any) => (
              <Fragment>
                <Textfield {...fieldProps} />
                {valid && <ValidMessage>Your wish granted</ValidMessage>}
                {error === 'INCORRECT_PHRASE' && (
                  <ErrorMessage>
                    Incorrect, try &lsquo;open sesame&rsquo;
                  </ErrorMessage>
                )}
              </Fragment>
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
}
