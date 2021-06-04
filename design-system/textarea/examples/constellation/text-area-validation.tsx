import React, { Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  ValidMessage,
} from '@atlaskit/form';

import TextArea from '../../src';

function validate(value: unknown) {
  if (value !== 'open sesame') {
    return 'INCORRECT_PHRASE';
  }
  return undefined;
}

export default function TextAreaFormValidationExample() {
  const handleSubmit = (formState: { command: string }) => {
    console.log('form state', formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ formProps }) => (
        <form {...formProps} name="validation-example">
          <Field
            label="Description"
            isRequired
            name="command"
            validate={validate}
            defaultValue=""
          >
            {({ fieldProps, error, meta: { valid } }: any) => (
              <Fragment>
                <TextArea {...fieldProps} />
                {valid && (
                  <ValidMessage>
                    Your description will be added to the board.
                  </ValidMessage>
                )}
                {error === 'INCORRECT_PHRASE' && (
                  <ErrorMessage>
                    This field is required. Try entering text in this field.
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
