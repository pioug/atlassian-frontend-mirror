import React, { Component, Fragment } from 'react';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Form, { Field, ErrorMessage, FormFooter, HelperMessage } from '../src';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createUser = async (data: { username: string; email: string }) => {
  await sleep(500);
  const errors = {
    username: ['jsmith', 'mchan'].includes(data.username)
      ? 'Username already taken, try another one'
      : undefined,
    email: !data.email.includes('@')
      ? 'Your email is not valid, please try again'
      : undefined,
  };
  if (!errors.username && !errors.email) {
    console.log(data);
  }
  return errors;
};

export default class extends Component<{}> {
  handleSubmit = (data: { username: string; email: string }) => {
    return createUser(data);
  };

  render() {
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
        <Form onSubmit={this.handleSubmit}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Field
                name="username"
                label="Username"
                defaultValue=""
                isRequired
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField {...fieldProps} />
                    {!error && (
                      <HelperMessage>Try 'jsmith' or 'mchan'</HelperMessage>
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
              <Field name="email" label="Email" defaultValue="" isRequired>
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField {...fieldProps} />
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
