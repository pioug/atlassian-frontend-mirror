import React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter } from '../src';

export default () => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      maxWidth: '100%',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form<{ username: string; password: string; remember: boolean }>
      onSubmit={data => {
        console.log('form data', data);
        return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
          data.username === 'error' ? { username: 'IN_USE' } : undefined,
        );
      }}
    >
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Field
            name="username.name"
            label="User name"
            isRequired
            defaultValue="Mike Cannon-Brookes"
          >
            {({ fieldProps }) => (
              <TextField autoComplete="off" {...fieldProps} />
            )}
          </Field>
          <Field
            name="username.email"
            label="email"
            isRequired
            defaultValue="mike@atlassian.com"
          >
            {({ fieldProps }) => (
              <TextField autoComplete="off" {...fieldProps} />
            )}
          </Field>
          <Field name="address[0]" label="Address 1" isRequired defaultValue="">
            {({ fieldProps }) => (
              <TextField autoComplete="off" {...fieldProps} />
            )}
          </Field>
          <Field name="address[1]" label="Address 2" isRequired defaultValue="">
            {({ fieldProps }) => (
              <TextField autoComplete="off" {...fieldProps} />
            )}
          </Field>
          <Field name="address[2]" label="Address 3" isRequired defaultValue="">
            {({ fieldProps }) => (
              <TextField autoComplete="off" {...fieldProps} />
            )}
          </Field>
          <FormFooter>
            <ButtonGroup>
              <Button appearance="subtle">Cancel</Button>
              <Button type="submit" appearance="primary" isLoading={submitting}>
                Sign up
              </Button>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);
