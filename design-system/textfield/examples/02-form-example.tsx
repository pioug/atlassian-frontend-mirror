import React, { Fragment } from 'react';
import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';
import Textfield from '../src';

export default function() {
  return (
    <Form
      onSubmit={(formState: unknown) =>
        console.log('form submitted', formState)
      }
    >
      {({ formProps }: any) => (
        <form {...formProps}>
          <Field name="example-text" defaultValue="a default value">
            {({ fieldProps }: any) => (
              <Fragment>
                <Textfield {...fieldProps} />
                <HelperMessage>
                  Check the console to see the submitted data
                </HelperMessage>
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
