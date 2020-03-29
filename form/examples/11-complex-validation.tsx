import React, { Component, Fragment } from 'react';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Form, {
  Field,
  ErrorMessage,
  HelperMessage,
  ValidMessage,
  FormFooter,
} from '../src';

interface FormData {
  username: string;
  email: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
              <Field
                name="username"
                label="Username"
                defaultValue=""
                isRequired
                validate={this.validateUsername}
              >
                {({ fieldProps, error, valid }) => (
                  <Fragment>
                    <TextField {...fieldProps} />
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
                        Invalid username, needs to be more than 4 characters
                      </ErrorMessage>
                    )}
                    {error === 'IN_USE' && (
                      <ErrorMessage>
                        Username is already taken, try another one
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
                    <TextField {...fieldProps} />
                    {!error && !valid && (
                      <HelperMessage>Must contain @ symbol</HelperMessage>
                    )}
                    {!error && valid && (
                      <ValidMessage>Nice email!</ValidMessage>
                    )}
                    {error === 'INVALID_EMAIL' && (
                      <ErrorMessage>
                        This email is invalid, please try again
                      </ErrorMessage>
                    )}
                    {error === 'IN_USE' && (
                      <ErrorMessage>
                        This email is already in use, try another one
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <FormFooter>
                <Button
                  appearance="primary"
                  type="submit"
                  isLoading={submitting}
                >
                  Create account
                </Button>
              </FormFooter>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
