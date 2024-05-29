import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import { RadioGroup } from '@atlaskit/radio';
import Range from '@atlaskit/range';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import Toggle from '@atlaskit/toggle';

import Form, {
  CheckboxField,
  Field,
  Fieldset,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  Label,
  RangeField,
  RequiredAsterisk,
} from '../../src';

const FormAllOptionsExample = () => (
  <div
    style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      width: '800px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      maxWidth: '100%',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      margin: '0 auto',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      flexDirection: 'column',
    }}
  >
    <Form<{ username: string; password: string; remember: boolean }>
      onSubmit={(data) => {
        console.log('form data', data);
        return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
          data.username === 'error' ? { username: 'IN_USE' } : undefined,
        );
      }}
    >
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <FormHeader title="Form header">
            <p aria-hidden="true">
              Required fields are marked with an asterisk <RequiredAsterisk />
            </p>
          </FormHeader>

          <FormSection>
            <Field
              aria-required={true}
              name="textfield-name"
              label="Textfield label"
              isRequired
              defaultValue="default value"
            >
              {({ fieldProps }) => (
                <Fragment>
                  <TextField autoComplete="off" {...fieldProps} />
                  <HelperMessage>This is a helper message</HelperMessage>
                </Fragment>
              )}
            </Field>

            <Field
              label="Textarea field label"
              isRequired
              name="textarea-field-name"
            >
              {({ fieldProps }: any) => (
                <Fragment>
                  <TextArea {...fieldProps} />
                </Fragment>
              )}
            </Field>

            <Fieldset legend="Checkbox fieldset legend">
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

            <Fieldset legend="Datetime picker legend">
              {/* This label uses a legend because datetime picker has two fields in it. */}
              <Field name="datetime-picker-accessible" isRequired>
                {({ fieldProps: { id, ...rest } }) => (
                  <DateTimePicker
                    {...rest}
                    datePickerSelectProps={{
                      inputId: id,
                      'aria-label': 'Select date',
                    }}
                    timePickerSelectProps={{
                      'aria-label': 'Select time',
                    }}
                  />
                )}
              </Field>
            </Fieldset>

            <RangeField
              name="rangefield-name"
              defaultValue={50}
              label="Range field label"
            >
              {({ fieldProps }) => <Range {...fieldProps} min={0} max={100} />}
            </RangeField>

            <Field<ValueType<OptionType>>
              label="Select field label"
              name="select-field-name"
              id="owner"
              defaultValue={{
                label: 'Atlassian',
                value: 'atlassian',
              }}
            >
              {({ fieldProps }) => (
                <Select
                  isSearchable={false}
                  inputId={fieldProps.id}
                  options={[
                    { label: 'Atlassian', value: 'atlassian' },
                    { label: 'Sean Curtis', value: 'scurtis' },
                    { label: 'Mike Gardiner', value: 'mg' },
                    { label: 'Charles Lee', value: 'clee' },
                  ]}
                  {...fieldProps}
                />
              )}
            </Field>

            <Fieldset legend="Radio group legend">
              <Field name="color-selection">
                {({ fieldProps: { value, ...rest } }) => (
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
                    {...rest}
                  />
                )}
              </Field>
            </Fieldset>

            <Label htmlFor="toggle-default">Toggle label</Label>
            <Toggle id="toggle-default" />
          </FormSection>

          <FormFooter>
            <ButtonGroup label="Form submit options">
              <Button appearance="subtle">Cancel</Button>
              <Button type="submit" appearance="primary" isLoading={submitting}>
                Submit
              </Button>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
);

export default FormAllOptionsExample;
