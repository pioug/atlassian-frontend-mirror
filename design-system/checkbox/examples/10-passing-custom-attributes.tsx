import React from 'react';
import { Checkbox } from '../src';

export default () => {
  return (
    <>
      Press [tab] fam
      <Checkbox
        value="trivialities"
        label="Focused second!"
        overrides={{
          HiddenCheckbox: {
            attributesFn: () => ({
              tabIndex: 2,
            }),
          },
        }}
      />
      <Checkbox
        value="trivialities"
        label="Focused first!"
        overrides={{
          HiddenCheckbox: {
            attributesFn: () => ({
              tabIndex: 1,
              'data-testid': 'test-checkbox',
            }),
          },
        }}
      />
    </>
  );
};
