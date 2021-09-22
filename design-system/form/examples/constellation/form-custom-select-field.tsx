import React, { Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select, { components } from '@atlaskit/select';
import type {
  OptionProps,
  SingleValueProps,
  ValueType,
} from '@atlaskit/select/types';

import Form, { ErrorMessage, Field, FormFooter } from '../../src';

interface Option {
  label: string;
  value: string;
}
interface Category {
  colors?: ValueType<Option>;
  icecream?: ValueType<Option[]>;
  suit?: ValueType<Option[]>;
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

const ColorBox = ({ color }: { color: string }) => (
  <span
    style={{
      width: '10px',
      height: '10px',
      backgroundColor: color,
      display: 'inline-block',
      marginRight: 8,
      marginBottom: 4,
      verticalAlign: 'middle',
    }}
  />
);

type ColorOption = typeof colors[number];

/**
 * NOTE: this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomColorOption: React.FC<OptionProps<ColorOption>> = ({
  children,
  ...props
}) => (
  <components.Option {...props}>
    <ColorBox color={children as string} /> {children}
  </components.Option>
);

/**
 * NOT: this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomValueOption: React.FC<SingleValueProps<ColorOption>> = ({
  children,
  ...props
}) => (
  <components.SingleValue {...props}>
    <ColorBox color={children as string} /> {children}
  </components.SingleValue>
);

const FormCustomSelectFieldExample = () => {
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
            <Field<ValueType<Option>> name="colors" label="Select a color">
              {({ fieldProps: { id, ...rest }, error }) => (
                <Fragment>
                  <Select<Option>
                    validationState={error ? 'error' : 'default'}
                    inputId={id}
                    components={{
                      Option: CustomColorOption,
                      SingleValue: CustomValueOption,
                    }}
                    {...rest}
                    options={colors}
                    isClearable
                  />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              )}
            </Field>
            <Field<ValueType<Option, true>>
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

export default FormCustomSelectFieldExample;
