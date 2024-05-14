import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import TextField from '@atlaskit/textfield';

import Form, {
  CheckboxField,
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  HelperMessage,
  RequiredAsterisk,
  ValidMessage,
} from '../src';

export default () => {
  const simpleMemoize = <T, U>(fn: (arg: T) => U): (arg: T) => U => {
    let lastArg: T;
    let lastResult: U;
    return (arg: T): U => {
      if (arg !== lastArg) {
        lastArg = arg;
        lastResult = fn(arg);
      }
      return lastResult;
    };
  }

  const validateUsername = (value: string = '') => {
    if (value.length < 5) {
      return 'TOO_SHORT';
    }
    return undefined;
  };

  const validatePassword = simpleMemoize((value: string = '') => {
    if (value.length < 8) {
      return new Promise((resolve) => setTimeout(resolve, 300)).then(() => 'TOO_SHORT');
    }
    return undefined;
  })

  return (
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
        onSubmit={(data) => {
          console.log('form data', data);
          return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
            data.username === 'error' ? { username: 'IN_USE' } : undefined,
          );
        }}
      >
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <FormHeader title="Sign in">
              <p aria-hidden="true">
                Required fields are marked with an asterisk <RequiredAsterisk />
              </p>
            </FormHeader>
            <Field
              name="username"
              label="Username"
              isRequired
              defaultValue="hello"
              validate={validateUsername}
            >
              {({ fieldProps, error }) => (
                <Fragment>
                  <TextField autoComplete="username" {...fieldProps} />
                  {!error && (
                    <HelperMessage>
                      You can use letters, numbers, and periods.
                    </HelperMessage>
                  )}
                  {error === 'TOO_SHORT' && (
                    <ErrorMessage>
                      Please enter a username that's longer than 4 characters.
                    </ErrorMessage>
                  )}
                  {error === 'IN_USE' && (
                    <ErrorMessage>
                      This username is already in use, try another one.
                    </ErrorMessage>
                  )}
                </Fragment>
              )}
            </Field>
            <Field
              name="password"
              label="Password"
              defaultValue=""
              isRequired
              validate={validatePassword}
            >
              {({ fieldProps, error, valid, meta }) => (
                <Fragment>
                  <TextField type="password" {...fieldProps} />
                  {error === 'TOO_SHORT' && (
                    <ErrorMessage>
                      Please enter a password that's longer than 8 characters.
                    </ErrorMessage>
                  )}
                  {meta.validating && meta.dirty ? (
                    <HelperMessage>Checking......</HelperMessage>
                  ) : null}
                  {!meta.validating && valid && meta.dirty ? (
                    <ValidMessage>Awesome password!</ValidMessage>
                  ) : null}
                </Fragment>
              )}
            </Field>
            <CheckboxField name="remember" defaultIsChecked>
              {({ fieldProps }) => (
                <Checkbox {...fieldProps} label="Always sign in on this device" />
              )}
            </CheckboxField>
            <FormFooter>
              <ButtonGroup label="Form submit options">
                <Button appearance="subtle">Cancel</Button>
                <Button type="submit" appearance="primary" isLoading={submitting}>
                  Sign in
                </Button>
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  )
};
