import React, { SyntheticEvent, useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { Field, FieldProps, FormFooter } from '@atlaskit/form';

import { RadioGroup } from '../../src';
import { OptionsPropType } from '../../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green', isDisabled: true },
];

export default function FormExample() {
  const [isDisabledChecked, setIsDisabled] = useState<boolean>(false);
  const toggleCheckbox = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      setIsDisabled(event.currentTarget.checked);
    },
    [],
  );
  return (
    <div>
      <Form onSubmit={(data: object) => console.log('form data', data)}>
        {({ formProps }: { formProps: object }) => {
          return (
            <form {...formProps} name="form-example">
              <Field
                label="radio group which can be dynamically disabled, with a single radio item disabled"
                name="weather"
                defaultValue="windy"
                isDisabled={isDisabledChecked}
              >
                {({
                  fieldProps: { isDisabled, ...fieldProps },
                }: {
                  fieldProps: FieldProps<string>;
                }) => (
                  <RadioGroup
                    {...fieldProps}
                    isDisabled={isDisabled || undefined}
                    options={options}
                  />
                )}
              </Field>
              <Checkbox
                value="isDisabledChecked"
                label="is disabled"
                onChange={toggleCheckbox}
              />
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
