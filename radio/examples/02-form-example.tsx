import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Form, { CheckboxField, Field, FormFooter } from '@atlaskit/form';
import { Radio, RadioGroup } from '../src';
import { OptionsPropType } from '../src/types';

const colorItems: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];
const fruitItems: OptionsPropType = [
  { name: 'fruit', value: 'apple', label: 'Apple' },
  { name: 'fruit', value: 'orange', label: 'Orange' },
  { name: 'fruit', value: 'peach', label: 'Peach' },
  { name: 'fruit', value: 'pair', label: 'Pair' },
];

export default class FormExample extends Component<{}, { isChecked: boolean }> {
  render() {
    return (
      <div>
        <Form onSubmit={(data: object) => console.log('form data', data)}>
          {({ formProps }: { formProps: object }) => {
            return (
              <form {...formProps} name="form-example">
                <CheckboxField name="standalone" value="single-radio">
                  {({ fieldProps }: { fieldProps: object }) => (
                    <Radio
                      {...fieldProps}
                      onChange={() => {}}
                      label="standalone radio"
                    />
                  )}
                </CheckboxField>
                <Field
                  label="required radio group"
                  name="color"
                  defaultValue="blue"
                  isRequired
                >
                  {({ fieldProps }: { fieldProps: object }) => (
                    <RadioGroup {...fieldProps} options={colorItems} />
                  )}
                </Field>
                <Field
                  label="regular radio group"
                  name="fruit"
                  defaultValue="peach"
                >
                  {({ fieldProps }: { fieldProps: object }) => (
                    <RadioGroup {...fieldProps} options={fruitItems} />
                  )}
                </Field>
                <FormFooter>
                  <Button type="submit" appearance="primary">
                    Submit
                  </Button>
                </FormFooter>
              </form>
            );
          }}
        </Form>
      </div>
    );
  }
}
