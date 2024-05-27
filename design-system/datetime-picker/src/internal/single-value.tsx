import React from 'react';

import { components, type OptionType, type SingleValueProps } from '@atlaskit/select';

/**
 * This creates a functional component that `react-select` will use to make the
 * SingleValue part of the different pickers.
 */
export const makeSingleValue =
  ({ lang }: { lang: string }) =>
  ({ children, ...props }: SingleValueProps<OptionType, false>) => {
    return (
      <components.SingleValue
        // This must be left this way because of how `react-select` expects
        // components to be used.
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...props}
        innerProps={{ lang }}
      >
        {children}
      </components.SingleValue>
    );
  };
