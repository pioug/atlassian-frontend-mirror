import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  ValidMessage,
} from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import Textfield from '../../src';

export default function FormValidationExample() {
  const [fieldValue, setFieldValue] = useState<string | undefined>('');
  const [fieldHasError, setFieldHasError] = useState(false);
  const [isFieldNotFocused, setIsFieldNotFocused] = useState(false);

  function validate(value: string | undefined) {
    setFieldValue(value);
    if (value === 'regular user') {
      setFieldHasError(false);
    } else {
      return 'INCORRECT_PHRASE';
    }
    return undefined;
  }

  const handleSubmit = (formState: { command: string }) => {
    console.log('form state', formState);
  };

  const handleBlurEvent = () => {
    setIsFieldNotFocused(true);
    if (fieldValue !== 'regular user') {
      setFieldHasError(true);
    }
  };

  const handleFocusEvent = () => {
    setIsFieldNotFocused(false);
  };

  type Obj = { [key: string]: string };
  const errorAttributes: Obj = {};

  if (isFieldNotFocused) {
    errorAttributes['aria-relevant'] = 'all';
    errorAttributes['aria-atomic'] = 'false';
  }

  const generateErrorMessage = () => {
    if (isFieldNotFocused) {
      return <Box as="span">Incorrect, try &lsquo;regular user&rsquo;</Box>;
    } else if (!isFieldNotFocused) {
      return <p>Incorrect, try &lsquo;regular user&rsquo;</p>;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ formProps }) => (
        <form {...formProps} name="validation-example">
          <Field
            label="Validates entering existing role"
            isRequired
            name="command"
            validate={validate}
            defaultValue=""
          >
            {({ fieldProps, meta: { valid } }: any) => (
              <Fragment>
                <Textfield
                  testId="formValidationTest"
                  {...fieldProps}
                  onBlur={handleBlurEvent}
                  onFocus={handleFocusEvent}
                />
                {valid && <ValidMessage>Your role is valid</ValidMessage>}
                {fieldHasError && (
                  <ErrorMessage>
                    <Box aria-live="polite" {...errorAttributes}>
                      {generateErrorMessage()}
                    </Box>
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
