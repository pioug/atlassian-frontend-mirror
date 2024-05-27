import React, { useMemo } from 'react';

import Select from './Select';
import { type SelectProps, type OptionType } from './types';
import { RadioOption } from './components/input-options';

const RadioSelect = React.memo(
  ({ components, ...props }: SelectProps<OptionType>) => {
    const mergedComponents = useMemo(
      () => ({
        ...components,
        Option: RadioOption,
      }),
      [components],
    );

    return <Select {...props} isMulti={false} components={mergedComponents} />;
  },
);

export default RadioSelect;
