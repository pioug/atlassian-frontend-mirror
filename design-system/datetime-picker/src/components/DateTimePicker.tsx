import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { mergeStyles, StylesConfig, SelectProps } from '@atlaskit/select';
import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import styled from '@emotion/styled';
import pick from 'lodash.pick';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { parse, format, isValid } from 'date-fns';
import { Appearance, Spacing } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import DatePicker, { Props as DatePickerProps } from './DatePicker';
import TimePicker, { Props as TimePickerProps } from './TimePicker';
import { defaultTimes, formatDateTimeZoneIntoIso } from '../internal';

/* eslint-disable react/no-unused-prop-types */
export interface Props extends WithAnalyticsEventsProps {
  /** Defines the appearance which can be default or subtle - no borders, background or icon. */
  appearance?: Appearance;
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean;
  /** Default for `value`. */
  defaultValue: string;
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string;
  /** Props to apply to the container. **/
  innerProps: React.AllHTMLAttributes<HTMLElement>;
  /** Whether or not the field is disabled. */
  isDisabled: boolean;
  /** The name of the field. */
  name: string;
  /** Called when the field is blurred. */
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  /** Called when the value changes and the date / time is a complete value, or empty. The only value is an ISO string or empty string. */
  onChange: (value: string) => void;
  /** Called when the field is focused. */
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  /** The ISO time that should be used as the input value. */
  value?: string;
  /** Allow users to edit the input and add a time. */
  timeIsEditable?: boolean;
  /** Indicates current value is invalid & changes border color. */
  isInvalid?: boolean;
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean;
  /** DEPRECATED - Use locale instead. Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat?: string;
  datePickerProps: DatePickerProps;
  timePickerProps: TimePickerProps;
  /** Function to parse passed in dateTimePicker value into the requisite sub values date, time and zone. **/
  parseValue?: (
    dateTimeValue: string,
    date: string,
    time: string,
    timezone: string,
  ) => { dateValue: string; timeValue: string; zoneValue: string };
  /** [Select props](/packages/core/select) to pass onto the DatePicker component. This can be used to set options such as placeholder text. */
  datePickerSelectProps: SelectProps<any>;
  /** [Select props](/packages/core/select) to pass onto the TimePicker component. This can be used to set options such as placeholder text. */
  timePickerSelectProps: SelectProps<any>;
  /** The times to show in the times dropdown. */
  times?: Array<string>;
  /** DEPRECATED - Use locale instead. Time format that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format)*/
  timeFormat?: string;
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: Spacing;
  locale: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--datepicker--container` wrapping element of date-picker
   *  - `{testId}--timepicker--container` wrapping element of time-picker
   **/
  testId?: string;
}

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
  if (appearance === 'subtle') color = 'transparent';
  if (isFocused) color = colors.B100;
  if (isInvalid) color = colors.R400;

  return `border: 2px solid ${color};`;
};

const getBorderColorHover = ({
  isFocused,
  isInvalid,
  isDisabled,
}: StyleProps) => {
  let color = colors.N30;
  if (isFocused || isDisabled) return ``;
  if (isInvalid) color = colors.R400;
  return `border-color: ${color};`;
};

const getBackgroundColor = ({ appearance, isFocused }: StyleProps) => {
  let color = colors.N20;
  if (isFocused) color = colors.N0;
  if (appearance === 'subtle') color = 'transparent';
  return `background-color: ${color};`;
};

const getBackgroundColorHover = ({
  isFocused,
  isInvalid,
  isDisabled,
}: StyleProps) => {
  let color = colors.N30;
  if (isFocused || isDisabled) return ``;
  if (isInvalid) color = colors.N0;
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

const FlexItem = styled.div`
  flex-basis: 0;
  flex-grow: 1;
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

function noop() {}

class DateTimePicker extends React.Component<Props, State> {
  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    isDisabled: false,
    name: '',
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    innerProps: {},
    id: '',
    defaultValue: '',
    timeIsEditable: false,
    isInvalid: false,
    hideIcon: false,
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

      this.setState({ value });
      this.props.onChange(value);
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
    const icon: React.ReactNode =
      this.props.appearance === 'subtle' || this.props.hideIcon
        ? null
        : CalendarIcon;
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

    return (
      <Flex
        {...innerProps}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isInvalid={this.props.isInvalid!}
        appearance={this.props.appearance!}
      >
        <input name={name} type="hidden" value={value} />
        <FlexItem>
          <DatePicker
            {...bothProps}
            autoFocus={autoFocus}
            dateFormat={dateFormat}
            icon={null}
            id={id}
            onChange={this.onDateChange}
            selectProps={mergedDatePickerSelectProps}
            value={dateValue}
            locale={locale}
            testId={testId && `${testId}--datepicker`}
            {...datePickerProps}
          />
        </FlexItem>
        <FlexItem>
          <TimePicker
            {...bothProps}
            icon={icon}
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
        </FlexItem>
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
