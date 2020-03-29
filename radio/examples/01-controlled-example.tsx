import React from 'react';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';
import { RadioGroup } from '../src';

const options = [
  { name: 'color2', value: 'red', label: 'Red' },
  { name: 'color2', value: 'blue', label: 'Blue' },
  { name: 'color2', value: 'yellow', label: 'Yellow' },
  { name: 'color2', value: 'green', label: 'Green' },
];

export default function ControlledExample() {
  // Form needs to be the source of truth for the form data.
  // When we need to know what the current field value is
  // we can intercept the onChange function and duplicate state
  // between Form and state in our own component.
  const [selectedOption, setSelectedOption] = React.useState();

  return (
    <div>
      <Form onSubmit={(data: object) => console.log('form data', data)}>
        {({ formProps }: { formProps: object }) => {
          return (
            <form {...formProps} name="form-example">
              <Field
                name="color2"
                label="Pick a color (Checked state is duplicated between Form and Component):"
                defaultValue={null}
              >
                {({ fieldProps: { onChange, ...rest } }) => (
                  <RadioGroup
                    {...rest}
                    onChange={e => {
                      // keep Form and our own state up-to-date
                      onChange(e);
                      setSelectedOption(e.target.value);
                    }}
                    options={options}
                  />
                )}
              </Field>
              <div
                style={{
                  borderStyle: 'dashed',
                  borderWidth: '1px',
                  borderColor: '#ccc',
                  padding: '0.5em',
                  color: '#ccc',
                  margin: '0.5em',
                }}
              >
                onChange called with value: {selectedOption}
              </div>
              <FormFooter>
                <Button type="submit">Submit</Button>
              </FormFooter>
            </form>
          );
        }}
      </Form>
    </div>
  );
}
