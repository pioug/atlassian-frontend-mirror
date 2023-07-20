import React from 'react';

import { TextField } from '@atlaskit/link-create';

import { TextFieldProps } from './types';

const createExample = (
  props: Partial<TextFieldProps> = {},
): React.ComponentType => {
  return function Example() {
    return (
      <div>
        <TextField name={'exampleTextField'} {...props} />
      </div>
    );
  };
};

export const DefaultTextField = createExample();

export const TextFieldWithLabel = createExample({
  label: 'This is a label',
});

export const TextFieldWithValidationHelpText = createExample({
  validationHelpText: 'This is a validation help text',
});

export const TextFieldWithValue = createExample({
  value: 'hello, this is a value for the text field',
});

export const TextFieldWithMultiProps = createExample({
  label: 'This is a label',
  validationHelpText: 'This is a validation help text',
  value: 'hello, this is a value for the text field',
});
