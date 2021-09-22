import React, { Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select, { ValueType as Value } from '@atlaskit/select';

import Form, { ErrorMessage, Field, FormFooter } from '../../src';

interface Option {
  label: string;
  value: string;
}
interface Category {
  colors?: Value<Option>;
  icecream?: Value<Option[]>;
  suit?: Value<Option[]>;
}

const colors = [
  { label: 'Blue', value: 'blue' },
  { label: 'Red', value: 'red' },
  { label: 'Purple', value: 'purple' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Gray', value: 'gray' },
  { label: 'Yellow', value: 'yellow' },
];

const flavors = [
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Chocolate', value: 'chocolate' },
  { label: 'Mango', value: 'mango' },
  { label: 'Passionfruit', value: 'passionfruit' },
  { label: 'Hazelnut', value: 'hazelnut' },
  { label: 'Durian', value: 'durian' },
];

const suits = [
  { label: 'Diamonds', value: 'diamonds' },
  { label: 'Clubs', value: 'clubs' },
  { label: 'Hearts', value: 'hearts' },
  { label: 'Spades', value: 'spades' },
];

const validateOnSubmit = (data: Category) => {
  let errors;
  errors = colorsValidation(data, errors);
  errors = flavorValidation(data, errors);
  return errors;
};

const colorsValidation = (data: Category, errors?: Record<string, string>) => {
  if (data.colors && !(data.colors instanceof Array)) {
    return (data.colors as Option).value === 'dog'
      ? {
          ...errors,
          colors: `${(data.colors as Option).value} is not a color`,
        }
      : errors;
  }
  return errors;
};

const flavorValidation = (data: Category, errors?: Record<string, string>) => {
  if (data.icecream && data.icecream.length >= 3) {
    return {
      ...errors,
      icecream: `${data.icecream.length} is too many flavors, don't be greedy, you get to pick 2.`,
    };
  }

  return errors;
};

const FormSelectExample = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Form<Category>
        onSubmit={(data) => {
          console.log('form data', data);
          return Promise.resolve(validateOnSubmit(data));
        }}
      >
        {({ formProps }) => (
          <form {...formProps}>
            <Field<Value<Option>>
              name="colors"
              label="Select a color"
              defaultValue={null}
            >
              {({ fieldProps: { id, ...rest }, error }) => (
                <Fragment>
                  <Select<Option>
                    validationState={error ? 'error' : 'default'}
                    inputId={id}
                    {...rest}
                    options={colors}
                    isClearable
                  />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              )}
            </Field>
            <Field<Value<Option, true>>
              name="icecream"
              label="Select a flavor"
              defaultValue={[]}
            >
              {({ fieldProps: { id, ...rest }, error }) => (
                <Fragment>
                  <Select
                    validationState={error ? 'error' : 'default'}
                    inputId={id}
                    {...rest}
                    options={flavors}
                    isMulti
                  />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              )}
            </Field>
            <Field<Value<Option, true>>
              name="suits"
              label="Select suits"
              defaultValue={suits.slice(2)}
            >
              {({ fieldProps: { id, ...rest }, error }) => (
                <Fragment>
                  <Select inputId={id} {...rest} options={suits} isMulti />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              )}
            </Field>
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
};

export default FormSelectExample;
