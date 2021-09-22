/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';
import Select, { OptionType, ValueType } from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';

import Form, { Field, FormFooter, FormHeader, FormSection } from '../../src';

const FormLayoutExample = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        margin: '0 auto',
        minHeight: '60vh',
        flexDirection: 'column',
      }}
    >
      <Form onSubmit={console.log}>
        {({ formProps }) => (
          <form
            {...formProps}
            action="//httpbin.org/get"
            method="GET"
            target="submitFrame"
            name="create-repo"
          >
            <FormHeader
              title="Create a new repository"
              description="* indicates a required field."
            />

            <FormSection>
              <Field<ValueType<OptionType>>
                label="Owner"
                name="owner"
                id="owner"
                defaultValue={{
                  label: 'Atlassian',
                  value: 'atlassian',
                }}
              >
                {({ fieldProps: { id, ...rest } }) => (
                  <Select
                    id={`${id}-select`}
                    isSearchable={false}
                    options={[
                      { label: 'Atlassian', value: 'atlassian' },
                      { label: 'Sean Curtis', value: 'scurtis' },
                      { label: 'Mike Gardiner', value: 'mg' },
                      { label: 'Charles Lee', value: 'clee' },
                    ]}
                    {...rest}
                  />
                )}
              </Field>

              <Field<ValueType<OptionType>>
                aria-required={true}
                name="project"
                id="project"
                label="Project"
                isRequired
              >
                {({ fieldProps: { id, ...rest } }) => (
                  <Select
                    id={`${id}-select`}
                    options={[
                      { label: 'Atlaskit', value: 'atlaskit' },
                      { label: 'Bitbucket', value: 'bitbucket' },
                      { label: 'Confluence', value: 'confluence' },
                      { label: 'Jira', value: 'jira' },
                    ]}
                    placeholder="Choose a project&hellip;"
                    {...rest}
                  />
                )}
              </Field>

              <Field name="repo-name" label="Repository name" defaultValue="">
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>

              <Field name="access-level" label="Access level">
                {({ fieldProps: { value, ...others } }) => (
                  <Checkbox
                    label="This is a private repository"
                    isChecked={!!value}
                    {...others}
                  />
                )}
              </Field>
              <Field name="color" label="Pick a color">
                {({ fieldProps: { value, ...others } }) => (
                  <RadioGroup
                    options={[
                      { name: 'color', value: 'red', label: 'Red' },
                      {
                        name: 'color',
                        value: 'blue',
                        label: 'Blue',
                      },
                      { name: 'color', value: 'yellow', label: 'Yellow' },
                      { name: 'color', value: 'green', label: 'Green' },
                    ]}
                    value={value}
                    {...others}
                  />
                )}
              </Field>
              <Field<ValueType<OptionType>>
                name="include-readme"
                id="include-readme"
                label="Include a README?"
                defaultValue={{ label: 'No', value: 'no' }}
              >
                {({ fieldProps: { id, ...rest } }) => (
                  <Select
                    id={`${id}-select`}
                    isSearchable={false}
                    options={[
                      { label: 'No', value: 'no' },
                      {
                        label: 'Yes, with a template',
                        value: 'yes-with-template',
                      },
                      {
                        label: 'Yes, with a tutorial (for beginners)',
                        value: 'yes-with-tutorial',
                      },
                    ]}
                    {...rest}
                  />
                )}
              </Field>
            </FormSection>
            <FormFooter>
              <ButtonGroup>
                <Button appearance="subtle" id="create-repo-cancel">
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  id="create-repo-button"
                  type="submit"
                >
                  Create repository
                </Button>
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default FormLayoutExample;
