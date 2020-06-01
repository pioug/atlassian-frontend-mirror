import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button';
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

export default class extends Component<{}> {
  handleSubmit = (formState: { command: string }) => {
    // you can now do stuff with the form.
    console.log('form state', formState);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="validation-example">
            <Field
              label="Only validates on input = open sesame"
              isRequired
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
}
