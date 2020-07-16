import React from 'react';

import styled from '@emotion/styled';
// eslint-disable-next-line no-restricted-imports
import { format, isValid, parse } from 'date-fns';
import pick from 'lodash.pick';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { mergeStyles, SelectProps, StylesConfig } from '@atlaskit/select';
import * as colors from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import { defaultTimes, formatDateTimeZoneIntoIso } from '../internal';
import { Appearance, Spacing } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import DatePicker, { Props as DatePickerProps } from './DatePicker';
import TimePicker, { Props as TimePickerProps } from './TimePicker';

/* eslint-disable react/no-unused-prop-types */
export interface Props extends WithAnalyticsEventsProps {
  /** Defines the appearance which can be default or subtle - no borders or background. */
  appearance?: Appearance;
  /** Whether or not to auto-focus the field. */
  autoFocus?: boolean;
  /** Default for `value`. */
  defaultValue?: string;
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id?: string;
  /** Props to apply to the container. **/
  innerProps?: React.AllHTMLAttributes<HTMLElement>;
  /** Whether or not the field is disabled. */
  isDisabled?: boolean;
  /** The name of the field. */
  name?: string;
  /** Called when the field is blurred. */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Called when the value changes and the date / time is a complete value, or empty. The only value is an ISO string or empty string. */
  onChange?: (value: string) => void;
  /** Called when the field is focused. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** The ISO time that should be used as the input value. */
  value?: string;
  /** Allow users to edit the input and add a time. */
  timeIsEditable?: boolean;
  /** Indicates current value is invalid & changes border color. */
  isInvalid?: boolean;
  /** DEPRECATED - This is here only for backwards compatibility and doesn't do anything. It will be removed in the next MAJOR. */
  hideIcon?: boolean;
  /** DEPRECATED - Use locale instead. Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat?: string;
  datePickerProps?: DatePickerProps;
  timePickerProps?: TimePickerProps;
  /** Function to parse passed in dateTimePicker value into the requisite sub values date, time and zone. **/
  parseValue?: (
    dateTimeValue: string,
    date: string,
    time: string,
    timezone: string,
  ) => { dateValue: string; timeValue: string; zoneValue: string };
  /** [Select props](/packages/design-system/select) to pass onto the DatePicker component. This can be used to set options such as placeholder text. */
  datePickerSelectProps?: SelectProps<any>;
  /** [Select props](/packages/design-system/select) to pass onto the TimePicker component. This can be used to set options such as placeholder text. */
  timePickerSelectProps?: SelectProps<any>;
  /** The times to show in the times dropdown. */
  times?: Array<string>;
  /** DEPRECATED - Use locale instead. Time format that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format)*/
  timeFormat?: string;
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: Spacing;
  locale?: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--datepicker--container` wrapping element of date-picker
   *  - `{testId}--timepicker--container` wrapping element of time-picker
   **/
  testId?: string;
}

type DateTimePickerProps = typeof DateTimePicker.defaultProps & Props;

interface State {
  active: 0 | 1 | 2;
  dateValue: string;
  isFocused: boolean;
  timeValue: string;
  value: string;
  zoneValue: string;
}

type StyleProps = {
  appearance: Appearance;
  isFocused: boolean;
  isInvalid: boolean;
  isDisabled: boolean;
};

const getBorder = ({ appearance, isFocused, isInvalid }: StyleProps) => {
  let color = colors.N20;
  if (appearance === 'subtle') {
    color = 'transparent';
  }
  if (isFocused) {
    color = colors.B100;
  }
  if (isInvalid) {
    color = colors.R400;
  }

  return `border: 2px solid ${color};`;
};

const getBorderColorHover = ({
  isFocused,
  isInvalid,
  isDisabled,
}: StyleProps) => {
  let color = colors.N30;
  if (isFocused || isDisabled) {
    return ``;
  }
  if (isInvalid) {
    color = colors.R400;
  }
  return `border-color: ${color};`;
};

const getBackgroundColor = ({ appearance, isFocused }: StyleProps) => {
  let color = colors.N20;
  if (isFocused) {
    color = colors.N0;
  }
  if (appearance === 'subtle') {
    color = 'transparent';
  }
  return `background-color: ${color};`;
};

const getBackgroundColorHover = ({
  isFocused,
  isInvalid,
  isDisabled,
}: StyleProps) => {
  let color = colors.N30;
  if (isFocused || isDisabled) {
    return ``;
  }
  if (isInvalid) {
    color = colors.N0;
  }
  return `background-color: ${color};`;
};

const Flex = styled.div<StyleProps>`
  ${getBackgroundColor}
  ${getBorder}
  border-radius: ${borderRadius()}px;
  display: flex;
  transition: background-color 200ms ease-in-out, border-color 200ms ease-in-out;
  &:hover {
    cursor: ${props => (props.isDisabled ? 'default' : 'pointer')};
    ${getBackgroundColorHover}
    ${getBorderColorHover}
  }
`;

// Make DatePicker 50% the width of DateTimePicker
// If rendering an icon container, shrink the TimePicker
const DatePickerContainer = styled.div`
  flex-basis: 50%;
  flex-grow: 1;
  flex-shrink: 0;
`;

const TimePickerContainer = styled.div`
  flex-basis: 50%;
  flex-grow: 1;
`;

const ICON_PADDING = 2;

const IconContainer = styled.div`
  flex-basis: inherit;
  padding-left: ${ICON_PADDING * 2}px;
  padding-right: ${gridSize()}px;
  padding-top: 6px;
  padding-bottom: 6px;
  display: flex;
  align-items: center;
  color: ${colors.N70};
  transition: color 150ms;
  &:hover {
    color: ${colors.N500};
  }
`;

// react-select overrides (via @atlaskit/select).
const styles: StylesConfig = {
  control: style => ({
    ...style,
    backgroundColor: 'transparent',
    border: 2,
    borderRadius: 0,
    paddingLeft: 0,
    ':hover': {
      backgroundColor: 'transparent',
      cursor: 'inherit',
    },
  }),
};

class DateTimePicker extends React.Component<DateTimePickerProps, State> {
  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    isDisabled: false,
    name: '',
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {},
    onChange: (value: string) => {},
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => {},
    innerProps: {},
    id: '',
    defaultValue: '',
    timeIsEditable: false,
    isInvalid: false,
    datePickerProps: {},
    timePickerProps: {},
    datePickerSelectProps: {},
    timePickerSelectProps: {},
    times: defaultTimes,
    spacing: 'default',
    locale: 'en-US',
    // Not including a default prop for value as it will
    // Make the component a controlled component
  };

  state: State = {
    active: 0,
    dateValue: '',
    isFocused: false,
    timeValue: '',
    value: this.props.defaultValue,
    zoneValue: '',
  };

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getSafeState = () => {
    const mappedState = {
      ...this.state,
      ...pick(this.props, ['value']),
    };

    return {
      ...mappedState,
      ...this.parseValue(
        mappedState.value,
        mappedState.dateValue,
        mappedState.timeValue,
        mappedState.zoneValue,
      ),
    };
  };

  parseValue(
    value: string,
    dateValue: string,
    timeValue: string,
    zoneValue: string,
  ) {
    if (this.props.parseValue) {
      return this.props.parseValue(value, dateValue, timeValue, zoneValue);
    }

    const parsed = parse(value);
    const valid = isValid(parsed);

    return valid
      ? {
          dateValue: format(parsed, 'YYYY-MM-DD'),
          timeValue: format(parsed, 'HH:mm'),
          zoneValue: format(parsed, 'ZZ'),
        }
      : {
          dateValue,
          timeValue,
          zoneValue,
        };
  }

  onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ isFocused: false });
    this.props.onBlur(event);
  };

  onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ isFocused: true });
    this.props.onFocus(event);
  };

  onDateChange = (dateValue: string) => {
    this.onValueChange({ ...this.getSafeState(), dateValue });
  };

  onTimeChange = (timeValue: string) => {
    this.onValueChange({ ...this.getSafeState(), timeValue });
  };

  onClear = () => {
    this.onValueChange({
      ...this.getSafeState(),
      timeValue: '',
      dateValue: '',
    });
  };

  onValueChange({
    dateValue,
    timeValue,
    zoneValue,
  }: {
    dateValue: string;
    timeValue: string;
    zoneValue: string;
  }) {
    this.setState({ dateValue, timeValue, zoneValue });
    if (dateValue && timeValue) {
      const value = formatDateTimeZoneIntoIso(dateValue, timeValue, zoneValue);
      const { zoneValue: parsedZone } = this.parseValue(
        value,
        dateValue,
        timeValue,
        zoneValue,
      );
      const valueWithValidZone = formatDateTimeZoneIntoIso(
        dateValue,
        timeValue,
        parsedZone,
      );
      this.setState({ value: valueWithValidZone });
      this.props.onChange(valueWithValidZone);
      // If the date or time value was cleared when there is an existing datetime value, then clear the value.
    } else if (this.getSafeState().value) {
      this.setState({ value: '' });
      this.props.onChange('');
    }
  }

  render() {
    const {
      autoFocus,
      id,
      innerProps,
      isDisabled,
      name,
      timeIsEditable,
      dateFormat,
      datePickerProps,
      datePickerSelectProps,
      timePickerProps,
      timePickerSelectProps,
      times,
      timeFormat,
      locale,
      testId,
    } = this.props;
    const { isFocused, value, dateValue, timeValue } = this.getSafeState();
    const bothProps = {
      isDisabled,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      isInvalid: this.props.isInvalid,
      appearance: this.props.appearance,
      spacing: this.props.spacing,
    };

    const { styles: datePickerStyles = {} } = datePickerSelectProps;
    const { styles: timePickerStyles = {} } = timePickerSelectProps;

    const mergedDatePickerSelectProps = {
      ...datePickerSelectProps,
      styles: mergeStyles(styles, datePickerStyles),
    };

    const mergedTimePickerSelectProps = {
      ...timePickerSelectProps,
      styles: mergeStyles(styles, timePickerStyles),
    };

    // Render DateTimePicker's IconContainer when a value has been filled
    // Don't use Date or TimePicker's because they can't be customised
    const isClearable = Boolean(dateValue || timeValue);

    return (
      <Flex
        {...innerProps}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isInvalid={this.props.isInvalid!}
        appearance={this.props.appearance!}
      >
        <input name={name} type="hidden" value={value} />
        <DatePickerContainer>
          <DatePicker
            {...bothProps}
            autoFocus={autoFocus}
            dateFormat={dateFormat}
            hideIcon
            id={id}
            onChange={this.onDateChange}
            selectProps={mergedDatePickerSelectProps}
            value={dateValue}
            locale={locale}
            testId={testId && `${testId}--datepicker`}
            {...datePickerProps}
          />
        </DatePickerContainer>
        <TimePickerContainer>
          <TimePicker
            {...bothProps}
            hideIcon
            onChange={this.onTimeChange}
            selectProps={mergedTimePickerSelectProps}
            value={timeValue}
            timeIsEditable={timeIsEditable}
            times={times}
            timeFormat={timeFormat}
            locale={locale}
            testId={testId && `${testId}--timepicker`}
            {...timePickerProps}
          />
        </TimePickerContainer>
        {isClearable ? (
          <IconContainer
            onClick={this.onClear}
            data-testid={testId && `${testId}--icon--container`}
          >
            <SelectClearIcon
              size="small"
              primaryColor="inherit"
              label="clear"
            />
          </IconContainer>
        ) : null}
      </Flex>
    );
  }
}

export { DateTimePicker as DateTimePickerWithoutAnalytics };

export default withAnalyticsContext({
  componentName: 'dateTimePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEvent('atlaskit')({
      action: 'changed',
      actionSubject: 'dateTimePicker',

      attributes: {
        componentName: 'dateTimePicker',
        packageName,
        packageVersion,
      },
    }),
  })(DateTimePicker),
);
