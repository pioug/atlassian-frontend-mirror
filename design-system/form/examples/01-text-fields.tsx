import React from 'react';

import Button from '@atlaskit/button/new';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '../src';

export default () => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form onSubmit={(data) => console.log(data)}>
      {({ formProps }) => (
        <form {...formProps} name="text-fields">
          <FormHeader title="Leave feedback">
            <p aria-hidden="true">
              Required fields are marked with an asterisk <RequiredAsterisk />
            </p>
          </FormHeader>
          <Field name="firstname" defaultValue="" label="First name" isRequired>
            {({ fieldProps }) => (
              <TextField autoComplete="given-name" {...fieldProps} />
            )}
          </Field>

          <Field name="lastname" defaultValue="" label="Last name" isRequired>
            {({ fieldProps: { isRequired, isDisabled, ...others } }) => (
              <TextField
                isDisabled={isDisabled}
                isRequired={isRequired}
                autoComplete="family-name"
                {...others}
              />
            )}
          </Field>

          <Field<string, HTMLTextAreaElement>
            name="description"
            defaultValue=""
            label="Description"
          >
            {({ fieldProps }) => <TextArea {...fieldProps} />}
          </Field>

          <Field<string, HTMLTextAreaElement>
            name="comments"
            defaultValue=""
            label="Additional comments"
          >
            {({ fieldProps }) => <TextArea {...fieldProps} />}
          </Field>

          <FormFooter>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);
