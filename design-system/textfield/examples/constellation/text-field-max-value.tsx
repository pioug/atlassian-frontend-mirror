import React, { Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

import Textfield from '../../src';

export default function TextFieldMaxValueExample() {
  return (
    <Form onSubmit={(formData) => console.log('form data', formData)}>
      {({ formProps }) => (
        <form {...formProps} name="max-length-example">
          <Field
            label="Example for using maxlength"
            name="max-length"
            defaultValue=""
          >
            {({ fieldProps }: any) => (
              <Fragment>
                <Textfield {...fieldProps} maxLength={5} />
                <HelperMessage>Max length of 5</HelperMessage>
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
