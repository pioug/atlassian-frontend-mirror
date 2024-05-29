import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  HelperMessage,
  RequiredAsterisk,
} from '../src';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (data: { username: string; email: string }) => {
  await sleep(500);
  const errors = {
    username: ['jsmith', 'mchan'].includes(data.username)
      ? 'This username is already taken, please enter a different username.'
      : undefined,
    email: !data.email.includes('@')
      ? 'Please enter your email in a valid format, like: name@example.com.'
      : undefined,
  };
  if (!errors.username && !errors.email) {
    console.log(data);
  }
  return errors;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<{}> {
  handleSubmit = (data: { username: string; email: string }) => {
    return createUser(data);
  };

  render() {
    return (
      <div
        style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          width: '400px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          maxWidth: '100%',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          margin: '0 auto',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          flexDirection: 'column',
        }}
      >
        <Form onSubmit={this.handleSubmit}>
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
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField autoComplete="username" {...fieldProps} />
                    {!error && (
                      <HelperMessage>Try 'jsmith' or 'mchan'</HelperMessage>
                    )}
                    {error && (
                      <ErrorMessage testId="userSubmissionError">
                        {error}
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <Field name="email" label="Email" defaultValue="" isRequired>
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField autoComplete="email" {...fieldProps} />
                    {!error && (
                      <HelperMessage>Must contain @ symbol</HelperMessage>
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
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
