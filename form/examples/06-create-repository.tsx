import React, { PureComponent } from 'react';
import Select, { OptionType, ValueType } from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';
import Button, { ButtonGroup } from '@atlaskit/button';
import { RadioGroup } from '@atlaskit/radio';
import { Checkbox } from '@atlaskit/checkbox';

import Form, { Field, FormHeader, FormSection, FormFooter } from '../src';

interface State {
  eventResult: string;
}

export default class LayoutExample extends PureComponent<void, State> {
  state = {
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
  };

  formRef: any;

  // Form Event Handlers
  onSubmitHandler = () => {
    console.log('onSubmitHandler');
  };

  onValidateHandler = () => {
    console.log('onValidateHandler');
  };

  onResetHandler = () => {
    console.log('onResetHandler');
  };

  onChangeHandler = () => {
    console.log('onChangeHandler');
  };

  onBlurHandler = () => {
    console.log('onBlurHandler');
  };

  onFocusHandler = () => {
    console.log('onFocusHandler');
  };

  // Footer Button Handlers
  submitClickHandler = () => {
    this.formRef.submit();
  };

  render() {
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
              <FormHeader title="Create a new repository" />

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
                  name="project"
                  id="project"
                  label="Project"
                  isRequired
                >
                  {({ fieldProps: { id, ...rest } }) => (
                    <Select
                      id={`${id}-select`}
                      options={[
                        { label: 'Atlaskit', value: 'brisbane' },
                        { label: 'Bitbucket', value: 'bb' },
                        { label: 'Confluence', value: 'conf' },
                        { label: 'Jira', value: 'jra' },
                        { label: 'Stride', value: 'stride' },
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
                      checkedValue={value}
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
  }
}
