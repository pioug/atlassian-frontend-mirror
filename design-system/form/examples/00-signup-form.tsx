import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import LoadingButton from '@atlaskit/button/loading-button';
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
          >
            {({ fieldProps, error }) => (
              <Fragment>
                <TextField autoComplete="username" {...fieldProps} />
                {!error && (
                  <HelperMessage>
                    You can use letters, numbers & periods.
                  </HelperMessage>
                )}
                {error && (
                  <ErrorMessage>
                    This username is already in use, please enter a different
                    username.
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
            validate={(value) =>
              value && value.length < 8 ? 'TOO_SHORT' : undefined
            }
          >
            {({ fieldProps, error, valid, meta }) => {
              return (
                <Fragment>
                  <TextField type="password" {...fieldProps} />
                  {error && !valid && (
                    <HelperMessage>
                      Use 8 or more characters with a mix of letters, numbers &
                      symbols.
                    </HelperMessage>
                  )}
                  {error && (
                    <ErrorMessage>
                      Enter a password that's longer than 8 characters.
                    </ErrorMessage>
                  )}
                  {valid && meta.dirty ? (
                    <ValidMessage>Awesome password!</ValidMessage>
                  ) : null}
                </Fragment>
              );
            }}
          </Field>
          <CheckboxField name="remember" defaultIsChecked>
            {({ fieldProps }) => (
              <Checkbox label="Remember me" {...fieldProps} />
            )}
          </CheckboxField>
          <FormFooter>
            <ButtonGroup label="Form submit options">
              <Button appearance="subtle">Cancel</Button>
              <LoadingButton
                type="submit"
                appearance="primary"
                isLoading={submitting}
              >
                Sign up
              </LoadingButton>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);
