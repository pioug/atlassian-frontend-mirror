import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter } from '../src';

interface State {
  hasSubmitted: boolean;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<void, State> {
  state = {
    hasSubmitted: false,
  };

  handleSubmit = () => {
    this.setState({ hasSubmitted: true });
  };

  render() {
    const { hasSubmitted } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          width: '400px',
          margin: '0 auto',
          flexDirection: 'column',
        }}
      >
        {!hasSubmitted ? (
          <Form onSubmit={this.handleSubmit}>
            {({ formProps }) => (
              <form {...formProps} name="submit-form">
                <Field name="name" defaultValue="" label="Name" isRequired>
                  {({ fieldProps }) => <TextField {...fieldProps} />}
                </Field>

                <Field<string, HTMLTextAreaElement>
                  name="description"
                  defaultValue=""
                  label="Description"
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
        ) : (
          <div id="submitted" style={{ padding: '30px', fontSize: '20px' }}>
            You have successfully submitted!
          </div>
        )}
      </div>
    );
  }
}
