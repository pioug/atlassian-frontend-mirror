import React from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';

import Form, { Field, FormFooter } from '../../src';

interface ColorButtonProps {
  color: string;
  changeHandler: Function;
}

interface ColorButtonsProps {
  colors: Array<string>;
  changeHandler: Function;
}

const ColorButton = ({ color, changeHandler }: ColorButtonProps) => {
  return (
    <button
      type="submit"
      style={{
        backgroundColor: color,
        color: 'transparent',
        display: 'inline-block',
        height: '40px',
        width: '40px',
        margin: '0 5px',
        overflow: 'hidden',
      }}
      onClick={(e) => {
        e.preventDefault();
        /*
         *
         * For custom non-form-field fields, this event handler calls the onChange method that is passed to the render prop's fieldProps (i.e. fieldProps.onChange).
         * It is called with the new value of the field, which will propagate the value up to the Form and back to the Field.
         */
        changeHandler(color);
      }}
    >
      {color}
    </button>
  );
};

const ColorButtons = ({ colors, changeHandler }: ColorButtonsProps) => (
  <React.Fragment>
    {colors.map((color) => (
      <ColorButton color={color} changeHandler={changeHandler} key={color} />
    ))}
  </React.Fragment>
);

const FormCustomFieldExample = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Form onSubmit={(data) => console.log(data)}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field name="favorite-color" defaultValue="" label="Favorite color">
              {({ fieldProps }) => (
                <Box data-name={fieldProps.id} data-value={fieldProps.value}>
                  <p style={{ margin: '10px 0' }}>
                    Selected color:{' '}
                    {fieldProps.value ? (
                      <span style={{ color: fieldProps.value }}>
                        {fieldProps.value}
                      </span>
                    ) : (
                      'none'
                    )}
                  </p>
                  <ColorButtons
                    colors={['Red', 'Green', 'Orange', 'Blue']}
                    changeHandler={fieldProps.onChange}
                  />
                </Box>
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

export default FormCustomFieldExample;
