import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Form, { Field, FormFooter } from '../src';

interface ColorButtonProps {
  color: string;
  changeHandler: Function;
  setSelectedColor: Function;
}

interface ColorButtonsProps {
  colors: Array<string>;
  setSelectedColor: Function;
  changeHandler: Function;
}

const ColorButton = ({
  color,
  changeHandler,
  setSelectedColor,
}: ColorButtonProps) => {
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
        setSelectedColor(color);
        /*
         * For custom non-form-field fields, the relevant detail of this event handler
         * is that it ends up calling the onChange method that is passed in to the render prop's
         * fieldProps (i.e. fieldProps.onChange). It is called with the new value of the field
         * and that will propagate the value up to the Form and back to the Field.
         */
        changeHandler(color);
      }}
    >
      {color}
    </button>
  );
};

const ColorButtons = ({
  colors,
  changeHandler,
  setSelectedColor,
}: ColorButtonsProps) => (
  <React.Fragment>
    {colors.map((color) => (
      <ColorButton
        color={color}
        changeHandler={changeHandler}
        key={color}
        setSelectedColor={setSelectedColor}
      />
    ))}
  </React.Fragment>
);

export default () => {
  const [selectedColor, setSelectedColor] = useState('none');
  const [isSubmit, setIsSubmit] = useState(false);
  const resetFormValue = () => {
    setTimeout(() => {
      setIsSubmit(false);
      setSelectedColor('none');
    }, 3000);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Form
        onSubmit={async (data) => {
          setIsSubmit(true);
          console.log(data);

          resetFormValue();
        }}
      >
        {({ formProps }) => {
          return (
            <form {...formProps}>
              <Field
                name="favourite-color"
                defaultValue=""
                label="Favourite color"
              >
                {({ fieldProps }) => {
                  return (
                    <div
                      data-name={fieldProps.id}
                      data-value={fieldProps.value}
                    >
                      <p
                        style={{ margin: '10px 0' }}
                        role={isSubmit ? 'status' : undefined}
                      >
                        Selected color:{' '}
                        {selectedColor !== 'none' ? (
                          <span style={{ color: fieldProps.value }}>
                            {selectedColor}
                          </span>
                        ) : (
                          selectedColor
                        )}
                      </p>
                      <ColorButtons
                        colors={['red', 'green', 'orange', 'blue']}
                        changeHandler={fieldProps.onChange}
                        setSelectedColor={setSelectedColor}
                      />
                    </div>
                  );
                }}
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
};
