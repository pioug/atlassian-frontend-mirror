/// <reference types="node" />
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';
import { format, isValid, parseISO } from 'date-fns';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import SelectClearIcon from '@atlaskit/icon/core/cross-circle';
import { mergeStyles, type StylesConfig } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { formatDateTimeZoneIntoIso } from '../internal';
import { DateTimePickerContainer } from '../internal/date-time-picker-container';
import { convertTokens } from '../internal/parse-tokens';
import { type DateTimePickerBaseProps } from '../types';

import DatePicker from './date-picker';
import TimePicker from './time-picker';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

interface State {
	dateValue: string;
	isFocused: boolean;
	timeValue: string;
	value: string;
	zoneValue: string;
}

const compiledStyles = cssMap({
	// Make DatePicker 50% the width of DateTimePicker
	// If rendering an icon container, shrink the TimePicker
	datePickerContainerStyles: {
		flexBasis: '50%',
		flexGrow: 1,
		flexShrink: 0,
	},
	timePickerContainerStyles: {
		flexBasis: '50%',
		flexGrow: 1,
	},
	iconContainerStyles: {
		display: 'flex',
		alignItems: 'center',
		flexBasis: 'inherit',
		backgroundColor: 'inherit',
		border: 'none',
		color: token('color.text.subtlest'),
		marginBlockEnd: token('border.width', '1px'),
		marginBlockStart: token('border.width', '1px'),
		marginInlineEnd: token('border.width', '1px'),
		marginInlineStart: token('border.width', '1px'),
		paddingBlockEnd: token('space.075', '6px'),
		paddingBlockStart: token('space.075', '6px'),
		paddingInlineEnd: token('space.100', '8px'),
		paddingInlineStart: token('space.050', '4px'),
		transition: `color 150ms`,
		'&:hover': {
			color: token('color.text.subtle'),
		},
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

const dateTimePickerDefaultProps: DateTimePickerBaseProps = {
	// These disables are here for proper typing when used as defaults. They
	// should *not* use the `noop` function.
	/* eslint-disable @repo/internal/react/use-noop */
	onBlur: (_event: React.FocusEvent<HTMLInputElement>) => {},
	onChange: (_value: string) => {},
	onFocus: (_event: React.FocusEvent<HTMLInputElement>) => {},
	/* eslint-enable @repo/internal/react/use-noop */
	// Not including a default prop for value as it will
	// Make the component a controlled component
};

export const datePickerDefaultAriaLabel = 'Date';
export const timePickerDefaultAriaLabel = 'Time';

// eslint-disable-next-line @repo/internal/react/no-class-components
class DateTimePickerComponent extends React.Component<DateTimePickerBaseProps, State> {
	static defaultProps = dateTimePickerDefaultProps;

	state: State = {
		dateValue: this.props.datePickerProps?.defaultValue || '',
		isFocused: false,
		timeValue: this.props.timePickerProps?.defaultValue || '',
		value: this.props.defaultValue || '',
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
	getValue = (): string => this.props.value ?? this.state.value;

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

	onDateBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
		this.setState({ isFocused: false });
		this.props.onBlur?.(event);
		if (this.props.datePickerProps?.onBlur) {
			this.props.datePickerProps.onBlur(event);
		}
	};

	onTimeBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
		this.setState({ isFocused: false });
		this.props.onBlur?.(event);
		if (this.props.timePickerProps?.onBlur) {
			this.props.timePickerProps.onBlur(event);
		}
	};

	onDateFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
		this.setState({ isFocused: true });
		this.props.onFocus?.(event);
		if (this.props.datePickerProps?.onFocus) {
			this.props.datePickerProps.onFocus(event);
		}
	};

	onTimeFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
		this.setState({ isFocused: true });
		this.props.onFocus?.(event);
		if (this.props.timePickerProps?.onFocus) {
			this.props.timePickerProps.onFocus(event);
		}
	};

	onDateChange = (dateValue: string): void => {
		const parsedValues = this.getParsedValues();
		this.onValueChange({
			dateValue,
			timeValue: parsedValues.timeValue,
			zoneValue: parsedValues.zoneValue,
		});
		if (this.props.datePickerProps?.onChange) {
			this.props.datePickerProps.onChange(dateValue);
		}
	};

	onTimeChange = (timeValue: string): void => {
		const parsedValues = this.getParsedValues();
		this.onValueChange({
			dateValue: parsedValues.dateValue,
			timeValue,
			zoneValue: parsedValues.zoneValue,
		});
		if (this.props.timePickerProps?.onChange) {
			this.props.timePickerProps.onChange(timeValue);
		}
	};

	onClear = (): void => {
		const parsedValues = this.getParsedValues();
		this.onValueChange({
			dateValue: '',
			timeValue: '',
			zoneValue: parsedValues.zoneValue,
		});
		if (this.props.datePickerProps?.onChange) {
			this.props.datePickerProps.onChange('');
		}
		if (this.props.timePickerProps?.onChange) {
			this.props.timePickerProps.onChange('');
		}
	};

	onValueChange({
		dateValue,
		timeValue,
		zoneValue,
	}: {
		dateValue: string;
		timeValue: string;
		zoneValue: string;
	}): void {
		this.setState({ dateValue, timeValue, zoneValue });
		if (dateValue && timeValue) {
			const value = formatDateTimeZoneIntoIso(dateValue, timeValue, zoneValue);
			const { zoneValue: parsedZone } = this.parseValue(value, dateValue, timeValue, zoneValue);
			const valueWithValidZone = formatDateTimeZoneIntoIso(dateValue, timeValue, parsedZone);
			this.setState({ value: valueWithValidZone });
			this.props.onChange?.(valueWithValidZone);
			// If the date or time value was cleared when there is an existing datetime value, then clear the value.
		} else if (this.getValue()) {
			this.setState({ value: '' });
			this.props.onChange?.('');
		}
	}

	render() {
		const {
			'aria-describedby': ariaDescribedBy,
			appearance = 'default' as NonNullable<DateTimePickerBaseProps['appearance']>,
			autoFocus = false,
			clearControlLabel = 'clear',
			datePickerProps = {},
			id = '',
			innerProps = {},
			isDisabled = false,
			isInvalid = false,
			isRequired = false,
			locale = 'en-US',
			name = '',
			spacing = 'default' as NonNullable<DateTimePickerBaseProps['spacing']>,
			testId,
			timePickerProps = {},
		} = this.props;
		const value = this.getValue();
		const { isFocused } = this.state;
		const parsedValues = this.getParsedValues();
		const dateValue = parsedValues?.dateValue;
		const timeValue = parsedValues?.timeValue;

		const datePickerSelectProps = datePickerProps?.selectProps;
		const datePickerAriaDescribedBy = datePickerProps['aria-describedby'] || ariaDescribedBy;
		const datePickerLabel = datePickerProps.label || datePickerDefaultAriaLabel;

		const mergedDatePickerSelectProps = {
			...datePickerSelectProps,
			styles: mergeStyles(styles, datePickerSelectProps?.styles),
		};

		const timePickerSelectProps = timePickerProps?.selectProps;
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
				<div css={compiledStyles.datePickerContainerStyles}>
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
						isRequired={datePickerProps.isRequired || isRequired}
						isOpen={datePickerProps.isOpen}
						label={datePickerLabel}
						locale={datePickerProps.locale || locale}
						maxDate={datePickerProps.maxDate}
						minDate={datePickerProps.minDate}
						name={datePickerProps.name}
						nextMonthLabel={datePickerProps.nextMonthLabel}
						onBlur={this.onDateBlur}
						onChange={this.onDateChange}
						onFocus={this.onDateFocus}
						parseInputValue={datePickerProps.parseInputValue}
						placeholder={datePickerProps.placeholder}
						previousMonthLabel={datePickerProps.previousMonthLabel}
						selectProps={mergedDatePickerSelectProps}
						shouldShowCalendarButton={datePickerProps.shouldShowCalendarButton}
						spacing={datePickerProps.spacing || spacing}
						testId={(testId && `${testId}--datepicker`) || datePickerProps.testId}
						value={dateValue}
						weekStartDay={datePickerProps.weekStartDay}
					/>
				</div>
				<div css={compiledStyles.timePickerContainerStyles}>
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
						isRequired={timePickerProps.isRequired || isRequired}
						label={timePickerLabel}
						locale={timePickerProps.locale || locale}
						name={timePickerProps.name}
						onBlur={this.onTimeBlur}
						onChange={this.onTimeChange}
						onFocus={this.onTimeFocus}
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
						css={compiledStyles.iconContainerStyles}
						onClick={this.onClear}
						data-testid={testId && `${testId}--icon--container`}
						tabIndex={-1}
						type="button"
					>
						<SelectClearIcon color="currentColor" label={clearControlLabel} size="small" />{' '}
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
