/// <reference types="node" />
// for typing `process`

import React, { forwardRef, useCallback, useEffect, useState } from 'react';

import { format, isValid, parseISO } from 'date-fns';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import SelectClearIcon from '@atlaskit/icon/core/migration/cross-circle--select-clear';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { mergeStyles, type StylesConfig } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { formatDateTimeZoneIntoIso } from '../internal';
import { DateTimePickerContainer } from '../internal/date-time-picker-container';
import { componentWithCondition } from '../internal/ff-component';
import { convertTokens } from '../internal/parse-tokens';
import { type DateTimePickerBaseProps } from '../types';

import DatePickerOld from './date-picker-class';
import DatePickerNew from './date-picker-fc';
import TimePicker from './time-picker';

const DatePicker = componentWithCondition(
	() => fg('dst-date-picker-use-functional-component'),
	DatePickerNew,
	DatePickerOld,
);
const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const analyticsAttributes = {
	componentName: 'dateTimePicker',
	packageName,
	packageVersion,
};

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

export const datePickerDefaultAriaLabel = 'Date';
export const timePickerDefaultAriaLabel = 'Time';

/**
 * __Date time picker__
 *
 * A date time picker allows the user to select an associated date and time.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/usage)
 */
const DateTimePicker: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<DateTimePickerBaseProps> & React.RefAttributes<HTMLElement>
> = forwardRef(
	(
		{
			'aria-describedby': ariaDescribedBy,
			appearance = 'default',
			autoFocus = false,
			clearControlLabel = 'clear',
			datePickerProps: datePickerPropsWithSelectProps = {},
			defaultValue = '',
			id = '',
			innerProps = {},
			isDisabled = false,
			isInvalid = false,
			isRequired = false,
			name = '',
			// These disables are here for proper typing when used as defaults. They
			// should *not* use the `noop` function.
			/* eslint-disable @repo/internal/react/use-noop */
			onBlur = (_event: React.FocusEvent<HTMLInputElement>) => {},
			onChange: onChangeProp = (_value: string) => {},
			onFocus = (_event: React.FocusEvent<HTMLInputElement>) => {},
			/* eslint-enable @repo/internal/react/use-noop */
			parseValue: providedParseValue,
			spacing = 'default' as NonNullable<DateTimePickerBaseProps['spacing']>,
			locale = 'en-US',
			testId,
			timePickerProps: timePickerPropsWithSelectProps = {},
			value: providedValue,
		}: DateTimePickerBaseProps,
		ref,
	) => {
		const [dateValue, setDateValue] = useState<string>(
			datePickerPropsWithSelectProps?.defaultValue || '',
		);
		const [isFocused, setIsFocused] = useState<boolean>(false);
		const [timeValue, setTimeValue] = useState<string>(
			timePickerPropsWithSelectProps?.defaultValue || '',
		);
		const [value, setValue] = useState<string>(defaultValue || '');
		const [zoneValue, setZoneValue] = useState<string>('');

		useEffect(() => {
			if (providedValue) {
				setValue(providedValue);
			}
		}, [providedValue]);

		const parseValue = useCallback(
			(
				value: string,
				providedDateValue: string,
				providedTimeValue: string,
				providedZoneValue: string,
			): { dateValue: string; timeValue: string; zoneValue: string } => {
				if (providedParseValue) {
					const parsedFromFn = providedParseValue(
						value,
						providedDateValue,
						providedTimeValue,
						providedZoneValue,
					);
					// This handles cases found in Jira where the parse function actually does
					// nothing and returns undefined. The previous `getSafeState` function
					// just spread the values over the state, but if it returned `undefined`,
					// it would just rely on the previous state values. Considering this is
					// what is input to this function anyway, this is a safe way to handle
					// this, colocate the behavior, and not rely on `getSafeState`.
					return (
						parsedFromFn || {
							dateValue: providedDateValue,
							timeValue: providedTimeValue,
							zoneValue: providedZoneValue,
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
			},
			[providedParseValue, dateValue, timeValue, zoneValue],
		);

		useEffect(() => {
			const parsedValues = parseValue(value, dateValue, timeValue, zoneValue);
			setDateValue(parsedValues.dateValue);
			setTimeValue(parsedValues.timeValue);
			setZoneValue(parsedValues.zoneValue);
		}, [value, dateValue, timeValue, zoneValue, parseValue]);

		const onDateBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onBlur(event);
			if (datePickerPropsWithSelectProps?.onBlur) {
				datePickerPropsWithSelectProps.onBlur(event);
			}
		};

		const onTimeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onBlur(event);
			if (timePickerPropsWithSelectProps?.onBlur) {
				timePickerPropsWithSelectProps.onBlur(event);
			}
		};

		const onDateFocus = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onFocus(event);
			if (datePickerPropsWithSelectProps?.onFocus) {
				datePickerPropsWithSelectProps.onFocus(event);
			}
		};

		const onTimeFocus = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onFocus(event);
			if (timePickerPropsWithSelectProps?.onFocus) {
				timePickerPropsWithSelectProps.onFocus(event);
			}
		};

		const onDateChange = (dateValue: string) => {
			const parsedValues = parseValue(value, dateValue, timeValue, zoneValue);
			onValueChange({
				providedDateValue: dateValue,
				providedTimeValue: parsedValues.timeValue,
				providedZoneValue: parsedValues.zoneValue,
			});
			if (datePickerPropsWithSelectProps?.onChange) {
				datePickerPropsWithSelectProps.onChange(dateValue);
			}
		};

		const onTimeChange = (timeValue: string) => {
			const parsedValues = parseValue(value, dateValue, timeValue, zoneValue);
			onValueChange({
				providedDateValue: parsedValues.dateValue,
				providedTimeValue: timeValue,
				providedZoneValue: parsedValues.zoneValue,
			});
			if (timePickerPropsWithSelectProps?.onChange) {
				timePickerPropsWithSelectProps.onChange(timeValue);
			}
		};

		const onClear = () => {
			const parsedValues = parseValue(value, dateValue, timeValue, zoneValue);
			onValueChange({
				providedDateValue: '',
				providedTimeValue: '',
				providedZoneValue: parsedValues.zoneValue,
			});
			if (datePickerPropsWithSelectProps?.onChange) {
				datePickerPropsWithSelectProps.onChange('');
			}
			if (timePickerPropsWithSelectProps?.onChange) {
				timePickerPropsWithSelectProps.onChange('');
			}
		};

		const onChangePropWithAnalytics = usePlatformLeafEventHandler({
			fn: onChangeProp,
			action: 'selectedDate',
			actionSubject: 'datePicker',
			...analyticsAttributes,
		});

		const onValueChange = ({
			providedDateValue,
			providedTimeValue,
			providedZoneValue,
		}: {
			providedDateValue: string;
			providedTimeValue: string;
			providedZoneValue: string;
		}) => {
			setDateValue(providedDateValue);
			setTimeValue(providedTimeValue);
			setZoneValue(providedZoneValue);
			if (providedDateValue && providedTimeValue) {
				const value = formatDateTimeZoneIntoIso(
					providedDateValue,
					providedTimeValue,
					providedZoneValue,
				);
				const { zoneValue: parsedZone } = parseValue(
					value,
					providedDateValue,
					providedTimeValue,
					providedZoneValue,
				);
				const valueWithValidZone = formatDateTimeZoneIntoIso(
					providedDateValue,
					providedTimeValue,
					parsedZone,
				);
				setValue(valueWithValidZone);
				onChangePropWithAnalytics(valueWithValidZone);
				// If the date or time value was cleared when there is an existing datetime value, then clear the value.
			} else if (value) {
				setValue('');
				onChangePropWithAnalytics('');
			}
		};

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
				{/* since this input is a type=hidden, we do not need to use the textfield component */}
				<input name={name} type="hidden" value={value} data-testid={testId && `${testId}--input`} />
				<Box xcss={compiledStyles.datePickerContainerStyles}>
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
						inputLabel={datePickerProps.inputLabel}
						inputLabelId={datePickerProps.inputLabelId}
						isDisabled={datePickerProps.isDisabled || isDisabled}
						isInvalid={datePickerProps.isInvalid || isInvalid}
						isOpen={datePickerProps.isOpen}
						isRequired={datePickerProps.isRequired || isRequired}
						label={datePickerLabel}
						locale={datePickerProps.locale || locale}
						maxDate={datePickerProps.maxDate}
						minDate={datePickerProps.minDate}
						name={datePickerProps.name}
						nextMonthLabel={datePickerProps.nextMonthLabel}
						onBlur={onDateBlur}
						onChange={onDateChange}
						onFocus={onDateFocus}
						openCalendarLabel={datePickerProps.openCalendarLabel}
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
				</Box>
				<Box xcss={compiledStyles.timePickerContainerStyles}>
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
						onBlur={onTimeBlur}
						onChange={onTimeChange}
						onFocus={onTimeFocus}
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
				</Box>
				{isClearable && !isDisabled ? (
					<Inline xcss={compiledStyles.iconContainerStyles}>
						<IconButton
							appearance="subtle"
							label={clearControlLabel}
							icon={(iconProps) => (
								<SelectClearIcon
									{...iconProps}
									color={token('color.text.subtlest')}
									LEGACY_size="small"
									size="small"
								/>
							)}
							onClick={onClear}
							testId={testId && `${testId}--icon--container`}
							tabIndex={-1}
						/>
					</Inline>
				) : null}
			</DateTimePickerContainer>
		);
	},
);

export default DateTimePicker;
