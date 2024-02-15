/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import { format, isValid, parseISO } from 'date-fns';
import pick from 'lodash/pick';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { mergeStyles, SelectProps, StylesConfig } from '@atlaskit/select';
import {
  B100,
  N0,
  N100,
  N20,
  N30,
  N500,
  N70,
  R400,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultTimes, formatDateTimeZoneIntoIso } from '../internal';
import { Appearance, Spacing } from '../types';

import DatePicker, {
  DatePickerBaseProps as DatePickerProps,
} from './date-picker';
import TimePicker, {
  TimePickerBaseProps as TimePickerProps,
} from './time-picker';
import { convertTokens } from './utils';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface DateTimePickerBaseProps extends WithAnalyticsEventsProps {
  /**
   * Set the appearance of the picker.
   *
   * `subtle` will remove the borders and background.
   */
  appearance?: Appearance;
  /**
   * Set the picker to autofocus on mount.
   */
  autoFocus?: boolean;
  /**
   * The default for `value`.
   */
  defaultValue?: string;
  /**
   * Set the id of the field.
   */
  id?: string;
  /**
   * Props to apply to the container. *
   */
  innerProps?: React.AllHTMLAttributes<HTMLElement>;
  /**
   * Set if the field is disabled.
   */
  isDisabled?: boolean;
  /**
   * The name of the field.
   */
  name?: string;
  /**
   * Called when the field is blurred.
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /**
   * Called when the value changes and the date / time is a complete value, or empty. The only value is an ISO string or empty string.
   */
  onChange?: (value: string) => void;
  /**
   * Called when the field is focused.
   */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /**
   * The ISO time that should be used as the input value.
   */
  value?: string;
  /**
   * Set if users can edit the input, allowing them to add custom times.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  timeIsEditable?: boolean;
  /**
   * Set if the picker has an invalid value.
   */
  isInvalid?: boolean;
  /**
   * Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format).
   */
  dateFormat?: string;
  /**
   * Props applied to the `DatePicker`.
   */
  datePickerProps?: DatePickerProps;
  /**
   * Props applied to the `TimePicker`.
   */
  timePickerProps?: TimePickerProps;
  /**
   * Function used to parse datetime values into their date, time and timezone sub-values. *
   */
  parseValue?: (
    dateTimeValue: string,
    date: string,
    time: string,
    timezone: string,
  ) => { dateValue: string; timeValue: string; zoneValue: string };
  /**
   * [Select props](/components/select) to pass onto the `DatePicker` component's `Select`. This can be used to set options such as placeholder text.
   */
  datePickerSelectProps?: SelectProps<any>;
  /**
   * [Select props](/components/select) to pass onto the `TimePicker` component's `Select`. This can be used to set options such as placeholder text.
   */
  timePickerSelectProps?: SelectProps<any>;
  /**
   * The times shown by the `TimePicker`.
   */
  times?: Array<string>;
  /**
   * The format that times are displayed in. Values should be those accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format).
   */
  timeFormat?: string;
  /**
   * The spacing for the select control.
   *
   * Compact is `gridSize() * 4`, default is `gridSize() * 5`.
   */
  spacing?: Spacing;
  /**
   * Locale used for formatting dates and times. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
   */
  locale?: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--datepicker--container` wrapping element of date-picker
   *  - `{testId}--timepicker--container` wrapping element of time-picker
   */
  testId?: string;
}

type DateTimePickerProps = typeof dateTimePickerDefaultProps &
  DateTimePickerBaseProps;

interface State {
  dateValue: string;
  isFocused: boolean;
  timeValue: string;
  value: string;
  zoneValue: string;
}

const isInvalidBorderStyles = css({
  borderColor: token('color.border.danger', R400),
});
const isFocusedBorderStyles = css({
  borderColor: token('color.border.focused', B100),
});

const isFocusedStyles = css({
  backgroundColor: token('color.background.input.pressed', N0),
});

const subtleBgStyles = css({
  backgroundColor: 'transparent',
  borderColor: 'transparent',
});

const subtleFocusedBgStyles = css({
  backgroundColor: token('color.background.input.pressed', 'transparent'),
  borderColor: 'transparent',
});

const noBgStyles = css({
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

const hoverStyles = css({
  '&:hover': {
    backgroundColor: token('color.background.input.hovered', N30),
    borderColor: token(
      'color.border.input',
      getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')
        ? N100
        : N30,
    ),
  },
});

const isInvalidHoverStyles = css({
  '&:hover': {
    backgroundColor: token('color.background.input.hovered', N0),
    borderColor: token('color.border.danger', R400),
  },
});

const isDisabledStyles = css({
  '&:hover': {
    cursor: 'default',
  },
});

const baseContainerStyles = css({
  display: 'flex',
  backgroundColor: token('color.background.input', N20),
  border: getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')
    ? `${token('border.width', '1px')} solid ${token(
        'color.border.input',
        N100,
      )}`
    : `2px solid ${token('color.border.input', N20)}`,
  borderRadius: token('border.radius', '3px'),
  transition:
    'background-color 200ms ease-in-out, border-color 200ms ease-in-out',
  '&:hover': {
    cursor: 'pointer',
  },
});

// Make DatePicker 50% the width of DateTimePicker
// If rendering an icon container, shrink the TimePicker
const datePickerContainerStyles = css({
  flexBasis: '50%',
  flexGrow: 1,
  flexShrink: 0,
});

const timePickerContainerStyles = css({
  flexBasis: '50%',
  flexGrow: 1,
});

const iconContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexBasis: 'inherit',
  backgroundColor: 'inherit',
  border: 'none',
  color: token('color.text.subtlest', N70),
  paddingBlockEnd: token('space.075', '6px'),
  paddingBlockStart: token('space.075', '6px'),
  paddingInlineEnd: token('space.100', '8px'),
  paddingInlineStart: token('space.050', '4px'),
  transition: `color 150ms`,
  '&:hover': {
    color: token('color.text.subtle', N500),
  },
});

// react-select overrides (via @atlaskit/select).
const styles: StylesConfig = {
  control: (style) => ({
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

const dateTimePickerDefaultProps = {
  appearance: 'default',
  autoFocus: false,
  isDisabled: false,
  name: '',
  // These disables are here for proper typing when used as defaults. They
  // should *not* use the `noop` function.
  /* eslint-disable @repo/internal/react/use-noop */
  onBlur: (_event: React.FocusEvent<HTMLInputElement>) => {},
  onChange: (_value: string) => {},
  onFocus: (_event: React.FocusEvent<HTMLInputElement>) => {},
  /* eslint-enable @repo/internal/react/use-noop */
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

export const datePickerDefaultAriaLabel = 'Date';
export const timePickerDefaultAriaLabel = 'Time';

class DateTimePicker extends React.Component<DateTimePickerProps, State> {
  static defaultProps = dateTimePickerDefaultProps;

  state: State = {
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

    const parsed = parseISO(value);

    return isValid(parsed)
      ? {
          dateValue: format(parsed, convertTokens('YYYY-MM-DD')),
          timeValue: format(parsed, convertTokens('HH:mm')),
          zoneValue: format(parsed, convertTokens('ZZ')),
        }
      : { dateValue, timeValue, zoneValue };
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
      'aria-label':
        datePickerSelectProps['aria-label'] || datePickerDefaultAriaLabel,
      styles: mergeStyles(styles, datePickerStyles),
    };

    const mergedTimePickerSelectProps = {
      ...timePickerSelectProps,
      'aria-label':
        timePickerSelectProps['aria-label'] || timePickerDefaultAriaLabel,
      styles: mergeStyles(styles, timePickerStyles),
    };

    // Render DateTimePicker's IconContainer when a value has been filled
    // Don't use Date or TimePicker's because they can't be customised
    const isClearable = Boolean(dateValue || timeValue);
    const notFocusedOrIsDisabled = !(isFocused || isDisabled);

    return (
      <div
        css={[
          baseContainerStyles,
          isDisabled && isDisabledStyles,
          isFocused && isFocusedStyles,
          bothProps.appearance === 'subtle' &&
            (isFocused ? subtleFocusedBgStyles : subtleBgStyles),
          isFocused && isFocusedBorderStyles,
          bothProps.isInvalid && isInvalidBorderStyles,
          notFocusedOrIsDisabled &&
            (bothProps.isInvalid ? isInvalidHoverStyles : hoverStyles),
          bothProps.appearance === 'none' && noBgStyles,
        ]}
        {...innerProps}
        data-testid={testId}
      >
        <input
          name={name}
          type="hidden"
          value={value}
          data-testid={testId && `${testId}--input`}
        />
        <div css={datePickerContainerStyles}>
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
        </div>
        <div css={timePickerContainerStyles}>
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
        </div>
        {isClearable && !isDisabled ? (
          <button
            css={iconContainerStyles}
            onClick={this.onClear}
            data-testid={testId && `${testId}--icon--container`}
            tabIndex={-1}
            type="button"
          >
            <SelectClearIcon
              size="small"
              primaryColor="inherit"
              label="clear"
            />
          </button>
        ) : null}
      </div>
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
