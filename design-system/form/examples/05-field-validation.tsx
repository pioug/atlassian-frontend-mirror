import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select from '@atlaskit/select';
import type { ValueType } from '@atlaskit/select/types';
import TextField from '@atlaskit/textfield';

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  HelperMessage,
  ValidMessage,
} from '../src';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
interface Option {
  label: string;
  value: string;
}

const colors = [
  { label: 'blue', value: 'blue' },
  { label: 'red', value: 'red' },
  { label: 'purple', value: 'purple' },
  { label: 'black', value: 'black' },
  { label: 'white', value: 'white' },
  { label: 'gray', value: 'gray' },
  { label: 'yellow', value: 'yellow' },
  { label: 'orange', value: 'orange' },
  { label: 'teal', value: 'teal' },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<{}> {
  getUser = async (value: string) => {
    await sleep(300);
    if (['jsmith', 'mchan'].includes(value)) {
      return 'IN_USE';
    }
    return undefined;
  };

  validate = (value?: string) => {
    if (!value) {
      return;
    }

    if (value.length < 5) {
      return 'TOO_SHORT';
    }

    return this.getUser(value);
  };

  handleSubmit = (data: { password: string }) => {
    console.log(data);
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
          {({ formProps }) => (
            <form {...formProps}>
              <Field
                name="username"
                label="Username"
                defaultValue=""
                isRequired
                validate={this.validate}
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
                        Username already taken, try another one
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <Field<ValueType<Option>>
                name="colors"
                label="Select a color"
                defaultValue={null}
                isRequired
                validate={async (value) => {
                  if (value) {
                    return undefined;
                  }

                  return new Promise((resolve) =>
                    setTimeout(resolve, 300),
                  ).then(() => 'Please select a color');
                }}
              >
                {({ fieldProps: { id, ...rest }, error }) => (
                  <Fragment>
                    <Select<Option>
                      validationState={error ? 'error' : 'default'}
                      inputId={id}
                      {...rest}
                      options={colors}
                      isClearable
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
              <FormFooter>
                <Button type="submit">Next</Button>
              </FormFooter>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
