import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';

import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '../src';

const BASE_SLUG = 'slug';

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
    <Form<{ username: string; slug: string }>
      onSubmit={(data) => {
        console.log('form data', data);
      }}
    >
      {({ formProps, submitting, setFieldValue }) => (
        <form {...formProps}>
          <FormHeader title="Create an account">
            <p aria-hidden="true">
              Required fields are marked with an asterisk <RequiredAsterisk />
            </p>
          </FormHeader>
          <Field name="username" label="Username" isRequired defaultValue="">
            {({ fieldProps }) => (
              <TextField
                autoComplete="username"
                {...fieldProps}
                onChange={(e) => {
                  // Generate a value for the slug
                  const nextValue = e.currentTarget.value
                    .toLowerCase()
                    .replace(/ /g, '-');

                  // Update the value of slug
                  setFieldValue('slug', `${BASE_SLUG}-${nextValue}`);

                  // Trigger username onchange
                  fieldProps.onChange(e);
                }}
              />
            )}
          </Field>
          <Field name="slug" label="Slug" isDisabled defaultValue={BASE_SLUG}>
            {({ fieldProps }) => <TextField {...fieldProps} />}
          </Field>
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
