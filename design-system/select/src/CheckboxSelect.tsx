import React from 'react';

import Select from './Select';
import { SelectProps, OptionType, SelectComponentsConfig } from './types';
import { CheckboxOption } from './components/input-options';

const CheckboxSelect = ({ components, ...props }: SelectProps<OptionType>) => {
  const temp: SelectComponentsConfig<OptionType> = {
    ...components,
    Option: CheckboxOption,
  };

  return (
    <Select
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isMulti
      components={temp}
      {...props}
    />
  );
};

export default CheckboxSelect;
