import React from 'react';

import Select from './Select';
import { SelectProps, OptionType, SelectComponentsConfig } from './types';
import { CheckboxOption } from './components/input-options';

const CheckboxSelect = ({
  components,
  ...props
}: SelectProps<OptionType, true>) => {
  const temp: SelectComponentsConfig<OptionType, true> = {
    ...components,
    Option: CheckboxOption,
  };

  return (
    <Select<OptionType, true>
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isMulti
      components={temp}
      {...props}
    />
  );
};

export default CheckboxSelect;
