/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { format, isValid, parseISO } from 'date-fns';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { mergeStyles, type StylesConfig } from '@atlaskit/select';
import { N500, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultTimes, formatDateTimeZoneIntoIso } from '../internal';
import { DateTimePickerContainer } from '../internal/date-time-picker-container';
import { convertTokens } from '../internal/parse-tokens';
import { type DateTimePickerBaseProps } from '../types';

import DatePicker from './date-picker';
import TimePicker from './time-picker';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

type DateTimePickerProps = typeof dateTimePickerDefaultProps & DateTimePickerBaseProps;

interface State {
	dateValue: string;
	isFocused: boolean;
	timeValue: string;
	value: string;
	zoneValue: string;
}

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
	margin: token('border.width', '1px'),
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
	appearance: 'default' as NonNullable<DateTimePickerBaseProps['appearance']>,
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
	times: defaultTimes,
	spacing: 'default' as NonNullable<DateTimePickerBaseProps['spacing']>,
	locale: 'en-US',
	// Not including a default prop for value as it will
	// Make the component a controlled component
};

export const datePickerDefaultAriaLabel = 'Date';
export const timePickerDefaultAriaLabel = 'Time';

class DateTimePickerComponent extends React.Component<DateTimePickerProps, State> {
	static defaultProps: DateTimePickerProps = dateTimePickerDefaultProps;

	state: State = {
		dateValue: '',
		isFocused: false,
		timeValue: '',
		value: this.props.defaultValue,
		zoneValue: '',
	};

	// All state needs to be accessed via this function so that the state is mapped from props
	// correctly to allow controlled/uncontrolled usage.
	getParsedValues = () =>
		this.parseValue(
			this.getValue(),
			this.state.dateValue,
			this.state.timeValue,
			this.state.zoneValue,
		);
	getValue = () => this.props.value ?? this.state.value;

	parseValue(
		value: string,
		dateValue: string,
		timeValue: string,
		zoneValue: string,
	): { dateValue: string; timeValue: string; zoneValue: string } {
		if (this.props.parseValue) {
			const parsedFromFn = this.props.parseValue(value, dateValue, timeValue, zoneValue);
			// This handles cases found in Jira where the parse function actually does
			// nothing and returns undefined. The previous `getSafeState` function
			// just spread the values over the state, but if it returned `undefined`,
			// it would just rely on the previous state values. Considering this is
			// what is input to this function anyway, this is a safe way to handle
			// this, colocate the behavior, and not rely on `getSafeState`.
			return (
				parsedFromFn || {
					dateValue,
					timeValue,
					zoneValue,
				}
			);
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
		const parsedValues = this.getParsedValues();
		this.onValueChange({
			dateValue,
			timeValue: parsedValues.timeValue,
			zoneValue: parsedValues.zoneValue,
		});
	};

	onTimeChange = (timeValue: string) => {
		const parsedValues = this.getParsedValues();
		this.onValueChange({
			dateValue: parsedValues.dateValue,
			timeValue,
			zoneValue: parsedValues.zoneValue,
		});
	};

	onClear = () => {
		const parsedValues = this.getParsedValues();
		this.onValueChange({
			dateValue: '',
			timeValue: '',
			zoneValue: parsedValues.zoneValue,
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
			const { zoneValue: parsedZone } = this.parseValue(value, dateValue, timeValue, zoneValue);
			const valueWithValidZone = formatDateTimeZoneIntoIso(dateValue, timeValue, parsedZone);
			this.setState({ value: valueWithValidZone });
			this.props.onChange(valueWithValidZone);
			// If the date or time value was cleared when there is an existing datetime value, then clear the value.
		} else if (this.getValue()) {
			this.setState({ value: '' });
			this.props.onChange('');
		}
	}

	render() {
		const {
			'aria-describedby': ariaDescribedBy,
			appearance,
			autoFocus,
			datePickerProps: datePickerPropsWithSelectProps,
			id,
			innerProps,
			isDisabled,
			isInvalid,
			locale,
			name,
			spacing,
			testId,
			timePickerProps: timePickerPropsWithSelectProps,
		} = this.props;
		const value = this.getValue();
		const { isFocused } = this.state;
		const parsedValues = this.getParsedValues();
		const dateValue = parsedValues?.dateValue;
		const timeValue = parsedValues?.timeValue;

		const { selectProps: datePickerSelectProps, ...datePickerProps } =
			datePickerPropsWithSelectProps;

		const datePickerAriaDescribedBy = datePickerProps['aria-describedby'] || ariaDescribedBy;
		const datePickerLabel = datePickerProps.label || datePickerDefaultAriaLabel;

		const mergedDatePickerSelectProps = {
			...datePickerSelectProps,
			styles: mergeStyles(styles, datePickerSelectProps?.styles),
		};

		const { selectProps: timePickerSelectProps, ...timePickerProps } =
			timePickerPropsWithSelectProps;

		const timePickerAriaDescribedBy = timePickerProps['aria-describedby'] || ariaDescribedBy;
		const timePickerLabel = timePickerProps.label || timePickerDefaultAriaLabel;

		const mergedTimePickerSelectProps = {
			...timePickerSelectProps,
			styles: mergeStyles(styles, timePickerSelectProps?.styles),
		};

		// Render DateTimePicker's IconContainer when a value has been filled
		// Don't use Date or TimePicker's because they can't be customised
		const isClearable = Boolean(dateValue || timeValue);

		return (
			<DateTimePickerContainer
				appearance={appearance}
				isDisabled={isDisabled}
				isFocused={isFocused}
				isInvalid={isInvalid}
				testId={testId}
				innerProps={innerProps}
			>
				<input name={name} type="hidden" value={value} data-testid={testId && `${testId}--input`} />
				<div css={datePickerContainerStyles}>
					<DatePicker
						appearance={appearance}
						aria-describedby={datePickerAriaDescribedBy}
						autoFocus={datePickerProps.autoFocus || autoFocus}
						dateFormat={datePickerProps.dateFormat}
						defaultIsOpen={datePickerProps.defaultIsOpen}
						defaultValue={datePickerProps.defaultValue}
						disabled={datePickerProps.disabled}
						disabledDateFilter={datePickerProps.disabledDateFilter}
						formatDisplayLabel={datePickerProps.formatDisplayLabel}
						hideIcon={datePickerProps.hideIcon || true}
						icon={datePickerProps.icon}
						id={datePickerProps.id || id}
						innerProps={datePickerProps.innerProps}
						isDisabled={datePickerProps.isDisabled || isDisabled}
						isInvalid={datePickerProps.isInvalid || isInvalid}
						isOpen={datePickerProps.isOpen}
						label={datePickerLabel}
						locale={datePickerProps.locale || locale}
						maxDate={datePickerProps.maxDate}
						minDate={datePickerProps.minDate}
						name={datePickerProps.name}
						nextMonthLabel={datePickerProps.nextMonthLabel}
						onBlur={datePickerProps.onBlur || this.onBlur}
						onChange={datePickerProps.onChange || this.onDateChange}
						onFocus={datePickerProps.onFocus || this.onFocus}
						parseInputValue={datePickerProps.parseInputValue}
						placeholder={datePickerProps.placeholder}
						previousMonthLabel={datePickerProps.previousMonthLabel}
						selectProps={mergedDatePickerSelectProps}
						spacing={datePickerProps.spacing || spacing}
						testId={(testId && `${testId}--datepicker`) || datePickerProps.testId}
						value={dateValue}
						weekStartDay={datePickerProps.weekStartDay}
					/>
				</div>
				<div css={timePickerContainerStyles}>
					<TimePicker
						appearance={timePickerProps.appearance || appearance}
						aria-describedby={timePickerAriaDescribedBy}
						autoFocus={timePickerProps.autoFocus}
						defaultIsOpen={timePickerProps.defaultIsOpen}
						defaultValue={timePickerProps.defaultValue}
						formatDisplayLabel={timePickerProps.formatDisplayLabel}
						hideIcon={timePickerProps.hideIcon || true}
						id={timePickerProps.id}
						innerProps={timePickerProps.innerProps}
						isDisabled={timePickerProps.isDisabled || isDisabled}
						isInvalid={timePickerProps.isInvalid || isInvalid}
						isOpen={timePickerProps.isOpen}
						label={timePickerLabel}
						locale={timePickerProps.locale || locale}
						name={timePickerProps.name}
						onBlur={timePickerProps.onBlur || this.onBlur}
						onChange={timePickerProps.onChange || this.onTimeChange}
						onFocus={timePickerProps.onFocus || this.onFocus}
						parseInputValue={timePickerProps.parseInputValue}
						placeholder={timePickerProps.placeholder}
						selectProps={mergedTimePickerSelectProps}
						spacing={timePickerProps.spacing || spacing}
						testId={timePickerProps.testId || (testId && `${testId}--timepicker`)}
						timeFormat={timePickerProps.timeFormat}
						timeIsEditable={timePickerProps.timeIsEditable}
						times={timePickerProps.times}
						value={timeValue}
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
						<SelectClearIcon size="small" primaryColor="inherit" label="clear" />
					</button>
				) : null}
			</DateTimePickerContainer>
		);
	}
}

export { DateTimePickerComponent as DateTimePickerWithoutAnalytics };

/**
 * __Date time picker__
 *
 * A date time picker allows the user to select an associated date and time.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/usage)
 */
const DateTimePicker = withAnalyticsContext({
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
	})(DateTimePickerComponent),
);

export default DateTimePicker;
