import React from 'react';

import Select from './Select';
import { SelectProps, OptionType } from './types';
import { RadioOption } from './components/input-options';

const RadioSelect = ({ components, ...props }: SelectProps<OptionType>) => (
  <Select
    {...props}
    isMulti={false}
    components={{ ...components, Option: RadioOption }}
  />
);

export default RadioSelect;
