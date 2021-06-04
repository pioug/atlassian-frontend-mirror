import React, { Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

import TextArea from '../../src';

export default function TextAreaFormExample() {
  return (
    <Form
      onSubmit={(formState: unknown) =>
        console.log('form submitted', formState)
      }
    >
      {({ formProps }: any) => (
        <form {...formProps}>
          <Field label="Field label" name="example-text">
            {({ fieldProps }: any) => (
              <Fragment>
                <TextArea
                  placeholder="Enter long form text here"
                  {...fieldProps}
                />
                <HelperMessage>
                  Help or instruction text goes here
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
