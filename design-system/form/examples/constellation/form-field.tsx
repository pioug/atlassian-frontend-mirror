import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter } from '../../src';

const UsernameField = () => (
  <Field
    aria-required={true}
    name="username"
    defaultValue=""
    label="Username"
    isRequired
  >
    {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
  </Field>
);

const FormFieldExample = () => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      maxWidth: '100%',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form<{ username: string }>
      onSubmit={(data) => {
        console.log('form data', data);
        return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
          data.username === 'error' ? { username: 'IN_USE' } : undefined,
        );
      }}
    >
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <UsernameField />
          <FormFooter>
            <ButtonGroup>
              <Button appearance="subtle">Cancel</Button>
              <LoadingButton
                type="submit"
                appearance="primary"
                isLoading={submitting}
              >
                Submit
              </LoadingButton>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);

export default FormFieldExample;
