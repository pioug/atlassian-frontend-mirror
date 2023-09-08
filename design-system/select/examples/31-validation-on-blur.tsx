import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select, { ValueType } from '@atlaskit/select';

import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';

interface Option {
  label: string;
  value: string;
}

const colors = [
  { label: 'blue', value: 'blue' },
  { label: 'red', value: 'red' },
  { label: 'purple', value: 'purple' },
  { label: 'black', value: 'black' },
  { label: 'white', value: 'white' },
  { label: 'gray', value: 'gray' },
  { label: 'yellow', value: 'yellow' },
  { label: 'orange', value: 'orange' },
  { label: 'teal', value: 'teal' },
];

export default function OnBlurValidationExample() {
  const [selectHasError, setSelectHasError] = useState(false);
  const [selectValue, setSelectValue] = useState<ValueType<Option>>();

  const handleSubmit = (formState: { command: string }) => {
    console.log('form state', formState);
  };

  const handleSelectBlurEvent = () => {
    selectValue ? setSelectHasError(false) : setSelectHasError(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        maxWidth: '100%',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field<ValueType<Option>>
              name="colors"
              label="Select a color"
              defaultValue={null}
              isRequired
              validate={(value) => {
                setSelectValue(value);
              }}
            >
              {({ fieldProps: { id, ...rest } }) => {
                return (
                  <Fragment>
                    <Select<Option>
                      inputId={id}
                      {...rest}
                      options={colors}
                      isClearable
                      aria-invalid={selectHasError}
                      aria-describedby={selectHasError && `${id}-error`}
                      onBlur={handleSelectBlurEvent}
                    />
                    {selectHasError && (
                      <div id={`${id}-error`}>
                        <ErrorMessage>Please select a color</ErrorMessage>
                      </div>
                    )}
                  </Fragment>
                );
              }}
            </Field>
            <FormFooter>
              <Button type="submit">Next</Button>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
}
