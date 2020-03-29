import React from 'react';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';
import Form, { Field, CheckboxField, FormFooter, Fieldset } from '../src';

export default () => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form onSubmit={data => console.log(data)}>
      {({ formProps }) => (
        <form {...formProps}>
          <Fieldset legend="Products">
            <CheckboxField name="product" value="jira">
              {({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}
            </CheckboxField>
            <CheckboxField name="product" value="confluence">
              {({ fieldProps }) => (
                <Checkbox {...fieldProps} label="Confluence" />
              )}
            </CheckboxField>
            <CheckboxField name="product" value="bitbucket">
              {({ fieldProps }) => (
                <Checkbox {...fieldProps} label="Bitbucket" />
              )}
            </CheckboxField>
          </Fieldset>

          <Field name="permission" defaultValue="" label="Permissions">
            {({ fieldProps }) => (
              <RadioGroup
                options={[
                  { name: 'permission', value: 'user', label: 'End user' },
                  {
                    name: 'permission',
                    value: 'project-admin',
                    label: 'Project admin',
                  },
                  {
                    name: 'permission',
                    value: 'admin',
                    label: 'Admin',
                  },
                ]}
                {...fieldProps}
              />
            )}
          </Field>

          <CheckboxField name="remember" defaultIsChecked>
            {({ fieldProps }) => (
              <Checkbox {...fieldProps} label="Remember me" />
            )}
          </CheckboxField>

          <FormFooter>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);
