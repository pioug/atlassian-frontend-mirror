import React from 'react';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Form, { Field, FormFooter } from '../src';

export default () => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form onSubmit={data => console.log(data)}>
      {({ formProps }) => (
        <form {...formProps} name="text-fields">
          <Field name="firstname" defaultValue="" label="First name" isRequired>
            {({ fieldProps }) => <TextField {...fieldProps} />}
          </Field>
          <FormFooter align="start">
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);
