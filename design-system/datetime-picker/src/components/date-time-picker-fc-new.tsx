/// <reference types="node" />
// for typing `process`

import React, { forwardRef, useCallback, useEffect, useReducer, useState } from 'react';

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { format, isValid, parseISO } from 'date-fns';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import SelectClearIcon from '@atlaskit/icon/core/cross-circle';
import { Box, Inline } from '@atlaskit/primitives/compiled';
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

type DateTimeState = {
	value: string;
	dateValue: string;
	timeValue: string;
	zoneValue: string;
};

/**
 * Two action types keep the reducer focused:
 *
 * - APPLY: used by user-interaction handlers. The handler computes the full
 *   next state (including the new ISO value) and applies it atomically. This
 *   guarantees a single re-render with no cascades regardless of React version.
 *
 * - SET_VALUE: used by the `providedValue` prop effect. The reducer owns all
 *   parsing logic for external value changes, including the empty-string case
 *   that the previous useState approach missed.
 */
type DateTimeAction =
	| { type: 'APPLY'; payload: DateTimeState }
	| { type: 'SET_VALUE'; payload: string };

export const datePickerDefaultAriaLabel = 'Date';
export const timePickerDefaultAriaLabel = 'Time';

const DateTimePickerNew: React.ForwardRefExoticComponent<
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
		_ref,
	) => {
		const [isFocused, setIsFocused] = useState<boolean>(false);

		/**
		 * Defined inside the component so the reducer closes over `providedParseValue`
		 * without needing to smuggle it through every action payload. React always
		 * calls the reducer from the latest render, so stale-closure is not a concern.
		 */
		const reducer = (state: DateTimeState, action: DateTimeAction): DateTimeState => {
			switch (action.type) {
				case 'APPLY':
					return action.payload;

				case 'SET_VALUE': {
					const newValue = action.payload;

					// Explicit empty-string handling: clear all sub-fields so the date
					// and time pickers visually reset when a controlled value is cleared.
					if (!newValue) {
						return { value: '', dateValue: '', timeValue: '', zoneValue: '' };
					}

					if (providedParseValue) {
						const parsed = providedParseValue(
							newValue,
							state.dateValue,
							state.timeValue,
							state.zoneValue,
						);
						return parsed
							? { value: newValue, ...parsed }
							: {
									value: newValue,
									dateValue: state.dateValue,
									timeValue: state.timeValue,
									zoneValue: state.zoneValue,
								};
					}

					const parsed = parseISO(newValue);
					return isValid(parsed)
						? {
								value: newValue,
								dateValue: format(parsed, convertTokens('YYYY-MM-DD')),
								timeValue: format(parsed, convertTokens('HH:mm')),
								zoneValue: format(parsed, convertTokens('ZZ')),
							}
						: { value: newValue, dateValue: '', timeValue: '', zoneValue: '' };
				}

				default:
					return state;
			}
		};

		const [dtState, dispatch] = useReducer(reducer, null, (): DateTimeState => {
			const initialValue = providedValue || defaultValue || '';
			const initialDate = datePickerPropsWithSelectProps?.defaultValue || '';
			const initialTime = timePickerPropsWithSelectProps?.defaultValue || '';

			if (!initialValue) {
				return { value: '', dateValue: initialDate, timeValue: initialTime, zoneValue: '' };
			}

			if (providedParseValue) {
				const parsed = providedParseValue(initialValue, initialDate, initialTime, '');
				return parsed
					? { value: initialValue, ...parsed }
					: { value: initialValue, dateValue: initialDate, timeValue: initialTime, zoneValue: '' };
			}

			const parsed = parseISO(initialValue);
			return isValid(parsed)
				? {
						value: initialValue,
						dateValue: format(parsed, convertTokens('YYYY-MM-DD')),
						timeValue: format(parsed, convertTokens('HH:mm')),
						zoneValue: format(parsed, convertTokens('ZZ')),
					}
				: { value: initialValue, dateValue: initialDate, timeValue: initialTime, zoneValue: '' };
		});

		useEffect(() => {
			if (providedValue !== undefined) {
				dispatch({ type: 'SET_VALUE', payload: providedValue });
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
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
					: {
							dateValue: dtState.dateValue,
							timeValue: dtState.timeValue,
							zoneValue: dtState.zoneValue,
						};
			},
			[providedParseValue, dtState.dateValue, dtState.timeValue, dtState.zoneValue],
		);

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

		const onDateChange = (newDateValue: string) => {
			const parsedValues = parseValue(
				dtState.value,
				newDateValue,
				dtState.timeValue,
				dtState.zoneValue,
			);
			onValueChange({
				providedDateValue: newDateValue,
				providedTimeValue: parsedValues.timeValue,
				providedZoneValue: parsedValues.zoneValue,
			});
			if (datePickerPropsWithSelectProps?.onChange) {
				datePickerPropsWithSelectProps.onChange(newDateValue);
			}
		};

		const onTimeChange = (newTimeValue: string) => {
			const parsedValues = parseValue(
				dtState.value,
				dtState.dateValue,
				newTimeValue,
				dtState.zoneValue,
			);
			onValueChange({
				providedDateValue: parsedValues.dateValue,
				providedTimeValue: newTimeValue,
				providedZoneValue: parsedValues.zoneValue,
			});
			if (timePickerPropsWithSelectProps?.onChange) {
				timePickerPropsWithSelectProps.onChange(newTimeValue);
			}
		};

		const onClear = () => {
			const parsedValues = parseValue(
				dtState.value,
				dtState.dateValue,
				dtState.timeValue,
				dtState.zoneValue,
			);
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
			if (providedDateValue && providedTimeValue) {
				const isoValue = formatDateTimeZoneIntoIso(
					providedDateValue,
					providedTimeValue,
					providedZoneValue,
				);
				const { zoneValue: parsedZone } = parseValue(
					isoValue,
					providedDateValue,
					providedTimeValue,
					providedZoneValue,
				);
				const valueWithValidZone = formatDateTimeZoneIntoIso(
					providedDateValue,
					providedTimeValue,
					parsedZone,
				);
				dispatch({
					type: 'APPLY',
					payload: {
						value: valueWithValidZone,
						dateValue: providedDateValue,
						timeValue: providedTimeValue,
						zoneValue: parsedZone,
					},
				});
				onChangePropWithAnalytics(valueWithValidZone);
				// If the date or time value was cleared when there is an existing datetime value, then clear the value.
			} else if (dtState.value) {
				dispatch({
					type: 'APPLY',
					payload: {
						value: '',
						dateValue: providedDateValue,
						timeValue: providedTimeValue,
						zoneValue: providedZoneValue,
					},
				});
				onChangePropWithAnalytics('');
			} else {
				dispatch({
					type: 'APPLY',
					payload: {
						value: '',
						dateValue: providedDateValue,
						timeValue: providedTimeValue,
						zoneValue: providedZoneValue,
					},
				});
			}
		};

		const { selectProps: datePickerSelectProps, ...datePickerProps } =
			datePickerPropsWithSelectProps;

		const datePickerAriaDescribedBy = datePickerProps['aria-describedby'] || ariaDescribedBy;
		const datePickerLabel = datePickerProps.label || 'Date';

		const mergedDatePickerSelectProps = {
			...datePickerSelectProps,
			styles: mergeStyles(styles, datePickerSelectProps?.styles),
		};

		const { selectProps: timePickerSelectProps, ...timePickerProps } =
			timePickerPropsWithSelectProps;

		const timePickerAriaDescribedBy = timePickerProps['aria-describedby'] || ariaDescribedBy;
		const timePickerLabel = timePickerProps.label || 'Time';

		const mergedTimePickerSelectProps = {
			...timePickerSelectProps,
			styles: mergeStyles(styles, timePickerSelectProps?.styles),
		};

		// Render DateTimePicker's IconContainer when a value has been filled
		// Don't use Date or TimePicker's because they can't be customised
		const isClearable = Boolean(dtState.dateValue || dtState.timeValue);

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
				<input
					name={name}
					type="hidden"
					value={dtState.value}
					data-testid={testId && `${testId}--input`}
				/>
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
						value={dtState.dateValue}
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
						value={dtState.timeValue}
					/>
				</Box>
				{isClearable && !isDisabled ? (
					<Inline xcss={compiledStyles.iconContainerStyles}>
						<IconButton
							appearance="subtle"
							label={clearControlLabel}
							icon={(iconProps) => (
								<SelectClearIcon {...iconProps} color={token('color.text.subtlest')} size="small" />
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DateTimePickerNew;
