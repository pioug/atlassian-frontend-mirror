import React, { forwardRef, useCallback, useState } from 'react';

import { ThemeProp } from '@atlaskit/theme/components';

import { Input } from './styled';
import { Theme, ThemeTokens } from './theme';

export interface RangeProps {
  /** if the field range needs to be disabled */
  isDisabled?: boolean;
  /** Maximum value of the range */
  max?: number;
  /** Minimum value of the range */
  min?: number;
  /** Hook to be invoked on change of the range */
  onChange?: (value: number) => any;
  /** Step value for the range */
  step?: number;
  /** Value of the range */
  value?: number;
  /** The default value */
  defaultValue?: number;
  /** The theme object to be passed down. See
  [@atlaskit/theme](https://atlaskit.atlassian.com/packages/design-system/theme) for more details on themeing.
  */
  theme?: ThemeProp<any, any>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

const getPercentValue = (value: number, min: number, max: number): string => {
  let percent = '0';
  if (min < max && value > min) {
    percent = (((value - min) / (max - min)) * 100).toFixed(2);
  }
  return percent;
};

export default forwardRef(function Range(
  props: RangeProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    isDisabled = false,
    defaultValue = 50,
    max = 100,
    min = 0,
    onChange = () => {},
    step = 1,
    value: propsValue,
    theme,
    testId,
    ...rest
  } = props;

  const spreadProps = { max, min, step, ref, ...rest };

  const [value, setValue] = useState(
    propsValue !== undefined ? propsValue : defaultValue,
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = Number(e.target.value);
      setValue(newValue);
      // Note use of newValue to ensure up=to-date value is used
      onChange(newValue);
    },
    [onChange],
  );

  const renderValue = propsValue !== undefined ? propsValue : value;
  const valuePercent = getPercentValue(renderValue, min, max);

  return (
    <Theme.Provider value={theme}>
      <Theme.Consumer>
        {(computedTheme: ThemeTokens) => (
          <Input
            type="range"
            disabled={isDisabled}
            onChange={handleChange}
            value={renderValue}
            valuePercent={valuePercent}
            data-testid={testId}
            {...computedTheme}
            {...spreadProps}
          />
        )}
      </Theme.Consumer>
    </Theme.Provider>
  );
});
