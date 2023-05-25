import React, { useMemo } from 'react';

import Select from './Select';
import { SelectProps, OptionType, SelectComponentsConfig } from './types';
import { CheckboxOption } from './components/input-options';

const CheckboxSelect = React.memo(
  ({ components, ...props }: SelectProps<OptionType, true>) => {
    const mergedComponents: SelectComponentsConfig<OptionType, true> = useMemo(
      () => ({
        ...components,
        Option: CheckboxOption,
      }),
      [components],
    );

    return (
      <Select<OptionType, true>
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isMulti
        {...props}
        components={mergedComponents}
      />
    );
  },
);

export default CheckboxSelect;
