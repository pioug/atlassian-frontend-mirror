import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import TextField from '@atlaskit/textfield';

import Form, {
  CheckboxField,
  ErrorMessage,
  Field,
  FormFooter,
  HelperMessage,
  ValidMessage,
} from '../../src';

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
          <Field name="username" label="Username" isRequired defaultValue="">
            {({ fieldProps, error }) => (
              <Fragment>
                <TextField autoComplete="off" {...fieldProps} />
                {!error && (
                  <HelperMessage>
                    You can use letters, numbers, and periods.
                  </HelperMessage>
                )}
                {error && (
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
            validate={async (value) => {
              if (value && value.length >= 8) {
                return undefined;
              }

              return new Promise((resolve) => setTimeout(resolve, 300)).then(
                () => 'error',
              );
            }}
          >
            {({ fieldProps, error, valid, meta }) => {
              return (
                <Fragment>
                  <TextField type="password" {...fieldProps} />
                  {error && (
                    <ErrorMessage>
                      Password needs to be more than 8 characters.
                    </ErrorMessage>
                  )}
                  {meta.validating && meta.dirty ? (
                    <HelperMessage>Checking......</HelperMessage>
                  ) : null}
                  {!meta.validating && valid && meta.dirty ? (
                    <ValidMessage>Awesome password!</ValidMessage>
                  ) : null}
                </Fragment>
              );
            }}
          </Field>
          <CheckboxField name="remember" label="Remember me" defaultIsChecked>
            {({ fieldProps }) => (
              <Checkbox {...fieldProps} label="Always sign in on this device" />
            )}
          </CheckboxField>
          <FormFooter>
            <ButtonGroup>
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
