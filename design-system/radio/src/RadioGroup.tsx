import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useState,
} from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Radio from './Radio';
import { OptionPropType, OptionsPropType, RadioValue } from './types';

export interface RadioGroupProps {
  /** Once set, controls the selected value on the `RadioGroup` */
  value?: RadioValue | null;
  /** Sets the initial selected value on the `RadioGroup` */
  defaultValue?: RadioValue | null;
  /** Sets the disabled state of all `Radio` elements in the group. Overrides the `isDisabled` setting of all child `Radio` items. */
  isDisabled?: boolean;
  /** Sets the required state of all `Radio` elements in the group */
  isRequired?: boolean;
  /** Sets the invalid state of all `Radio` elements in the group */
  isInvalid?: boolean;
  /** An array of objects, each object is mapped onto a `Radio` element within the group. Name must be unique to the group. */
  options: OptionsPropType;
  /** Function that gets fired after each invalid event */
  onInvalid?: (event: SyntheticEvent<any>) => void;
  /** Function that gets after each change event */
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /** Sets the `name` prop on each of the `Radio` elements in the group */
  name?: string;
  /** Additional information to be included in the `context` of analytics events that come from radio */
  analyticsContext?: Record<string, any>;
  /** The id of the element that links to this radiogroup. */
  'aria-labelledby'?: string;
}

const noop = () => {};
const noOptions: OptionsPropType = [];

export default function RadioGroup(props: RadioGroupProps) {
  const {
    onChange,
    options = noOptions,
    value: propValue,
    defaultValue,
    isDisabled,
    isRequired,
    isInvalid,
    onInvalid = noop,
    name,
    analyticsContext,
    ['aria-labelledby']: ariaLabelledBy,
  } = props;

  const [selectedValue, setSelectedValue] = useState<
    RadioValue | undefined | null
  >(propValue !== undefined ? propValue : defaultValue);

  const onRadioChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
      setSelectedValue(e.currentTarget.value);
      if (onChange) {
        onChange(e, analyticsEvent);
      }
    },
    [onChange],
  );

  // If propValue is provided than act as a controlled component
  // If not then act as an uncontrolled component using the value from state
  const value = typeof propValue !== 'undefined' ? propValue : selectedValue;
  return (
    <div role="radiogroup" aria-labelledby={ariaLabelledBy}>
      {options.map(({ ...optionProps }: OptionPropType, index: number) => {
        if (typeof isDisabled !== 'undefined') {
          optionProps.isDisabled = isDisabled;
        }
        const isChecked = value != null && optionProps.value === value;
        return (
          <Radio
            {...optionProps}
            name={name || optionProps.name}
            key={index}
            onChange={onRadioChange}
            onInvalid={onInvalid}
            isInvalid={isChecked && isInvalid}
            isChecked={isChecked}
            isRequired={isRequired}
            analyticsContext={analyticsContext}
          />
        );
      })}
    </div>
  );
}
