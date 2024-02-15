import React, { Component, Fragment } from 'react';

import LoadingButton from '@atlaskit/button/loading-button';
import TextField from '@atlaskit/textfield';

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  HelperMessage,
  RequiredAsterisk,
  ValidMessage,
} from '../src';

interface FormData {
  username: string;
  email: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (data: FormData) => {
  await sleep(500);
  const errors = {
    username: ['jsmith', 'mchan'].includes(data.username)
      ? 'IN_USE'
      : undefined,
    email: ['jsmith@atlassian.com', 'mchan@atlassian.com'].includes(data.email)
      ? 'IN_USE'
      : undefined,
  };
  if (!errors.username && !errors.email) {
    console.log(data);
  }
  return errors;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<{}> {
  handleSubmit = (data: FormData) => {
    return createUser(data);
  };

  validateUsername = (value: string = '') => {
    if (value.length < 5) {
      return 'TOO_SHORT';
    }
    return undefined;
  };

  validateEmail = (value: string = '') => {
    if (!value.includes('@')) {
      return 'INVALID_EMAIL';
    }
    return undefined;
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: '400px',
          margin: '0 auto',
          flexDirection: 'column',
        }}
      >
        <Form<FormData> onSubmit={this.handleSubmit}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormHeader title="Create an account">
                <p aria-hidden="true">
                  Required fields are marked with an asterisk{' '}
                  <RequiredAsterisk />
                </p>
              </FormHeader>
              <Field
                name="username"
                label="Username"
                defaultValue=""
                isRequired
                validate={this.validateUsername}
              >
                {({ fieldProps, error, valid }) => (
                  <Fragment>
                    <TextField autoComplete="username" {...fieldProps} />
                    {!error && !valid && (
                      <HelperMessage>
                        Should be more than 4 characters
                      </HelperMessage>
                    )}
                    {!error && valid && (
                      <ValidMessage>
                        Nice one, this username is available
                      </ValidMessage>
                    )}
                    {error === 'TOO_SHORT' && (
                      <ErrorMessage>
                        Please enter a username that's longer than 4 characters.
                      </ErrorMessage>
                    )}
                    {error === 'IN_USE' && (
                      <ErrorMessage>
                        This username is already in use, please enter a
                        different username.
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <Field
                name="email"
                label="Email"
                defaultValue=""
                isRequired
                validate={this.validateEmail}
              >
                {({ fieldProps, error, valid }) => (
                  <Fragment>
                    <TextField autoComplete="email" {...fieldProps} />
                    {!error && !valid && (
                      <HelperMessage>Must contain @ symbol</HelperMessage>
                    )}
                    {!error && valid && (
                      <ValidMessage>Nice email!</ValidMessage>
                    )}
                    {error === 'INVALID_EMAIL' && (
                      <ErrorMessage>
                        Please enter your email in a valid format, like:
                        name@example.com.
                      </ErrorMessage>
                    )}
                    {error === 'IN_USE' && (
                      <ErrorMessage>
                        This email is already in use, please enter a different
                        email.
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <FormFooter>
                <LoadingButton
                  appearance="primary"
                  type="submit"
                  isLoading={submitting}
                >
                  Create account
                </LoadingButton>
              </FormFooter>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
