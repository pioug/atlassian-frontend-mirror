import React from 'react';

import { Box } from '@atlaskit/primitives';

import { Checkbox } from '../../src';

const CheckboxSizesExample = () => {
  return (
    <Box>
      <Checkbox
        value="Small checkbox"
        label="Small checkbox"
        name="checkbox-basic"
        size="small"
      />
      <Checkbox
        value="Medium checkbox"
        label="Medium checkbox"
        name="checkbox-basic"
        size="medium"
      />
      <Checkbox
        value="Large checkbox"
        label="Large checkbox"
        name="checkbox-basic"
        size="large"
        defaultChecked
      />
      <Checkbox
        value="Extra large checkbox"
        label="Extra large checkbox"
        name="checkbox-basic"
        size="xlarge"
      />
    </Box>
  );
};

export default CheckboxSizesExample;
