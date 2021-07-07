import React, { forwardRef, useCallback, useState } from 'react';

import { ThemeProp } from '@atlaskit/theme/components';

import { Input } from './styled';
import { Theme, ThemeTokens } from './theme';

export type OwnProps = {
  /** Sets the default value if range is not set. */
  defaultValue?: number;
  /** Sets whether the field range is disabled. */
  isDisabled?: boolean;
  /** Sets the maximum value of the range. */
  max?: number;
  /** Sets the minimum value of the range.*/
  min?: number;
  /** Hook to be invoked on change of the range. */
  onChange?: (value: number) => void;
  /** Sets the step value for the range.  */
  step?: number;
  /** A `testId` prop is provided for specific elements. This is a unique string that appears as a data attribute `data-testid` in the rendered code and serves as a hook for automated tests. */
  testId?: string;
  /** The theme object to be passed down. See
  [@atlaskit/theme](https://atlaskit.atlassian.com/packages/design-system/theme) for more details on theming.
  */
  theme?: ThemeProp<any, any>;
  /** Sets the value of the range. */
  value?: number;
};

// Combine omits the keys of the second from the first so in case of overlap the props of the second are used.
type Combine<First, Second> = Omit<First, keyof Second> & Second;

// OwnProps is used for external documentation, but does not list every property supported by Range.
// So we combine (a reduced list of) HTMLInputElement attributes with OwnProps to get the full type.
export type RangeProps = Combine<
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'disabled' | 'required' | 'checked'
  >,
  OwnProps
>;

const snapToStep = (value: number, min: number, step: number): number => {
  // Normalise the value to allow for division properly with different min values
  const adjustedValue = value - min;
  // Find the number of steps the value covers
  const numSteps = Math.round(adjustedValue / step);
  // Convert numSteps back into original range
  return numSteps * step + min;
};

const getRoundedPercentValue = (
  value: number,
  min: number,
  max: number,
  step: number,
): string => {
  let percent = '0';
  if (min < max && value > min) {
    const snappedValue = snapToStep(value, min, step);
    percent = (((snappedValue - min) / (max - min)) * 100).toFixed(2);
  }
  return percent;
};

const noop = () => {};

export default forwardRef(function Range(
  props: RangeProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    isDisabled = false,
    defaultValue = 50,
    max = 100,
    min = 0,
    onChange = noop,
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
  const valuePercent = getRoundedPercentValue(renderValue, min, max, step);

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
