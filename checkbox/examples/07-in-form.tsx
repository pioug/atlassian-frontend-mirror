import React from 'react';
import Button from '@atlaskit/button';
import Form, { CheckboxField, FormFooter } from '@atlaskit/form';
import { Checkbox } from '../src';

export default () => (
  <Form<{ remember: boolean }> onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps}>
        <CheckboxField name="remember" isRequired>
          {({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
        </CheckboxField>
        <FormFooter>
          <Button type="submit">Next</Button>
        </FormFooter>
      </form>
    )}
  </Form>
);
