import React from 'react';

import { Checkbox } from '../../src';

const CheckboxCustomAttributes = () => {
  return (
    <>
      custom aria-label attribute added to first icon. Turn on voiceover and
      focus the first checkbox:
      <Checkbox
        value="trivialities"
        label="custom"
        overrides={{
          HiddenCheckbox: {
            attributesFn: () => ({
              'aria-label': 'Checkbox with custom attributes',
              tabIndex: 0,
            }),
          },
        }}
      />
      <Checkbox value="trivialities" label="normal" />
    </>
  );
};

export default CheckboxCustomAttributes;
