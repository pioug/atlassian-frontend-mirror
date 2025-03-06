import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type DropdownIndicatorProps, type OptionType, type SelectProps } from '@atlaskit/select';

export type Appearance = 'default' | 'subtle' | 'none';
export type Spacing = 'compact' | 'default';

// Similar to {...A, ...B}
// 1. Remove all overlapping types from First
// 2. Add properties from Second
// https://codesandbox.io/s/native-button-with-nested-elementsclick-bnpjg?file=/src/index.ts
/* This type is intentionally not exported to prevent it from being explicitly referenced in the resulting button types. The alternative would
 * be making this public API and re-exporting from the root */
type Combine<First, Second> = Omit<First, keyof Second> & Second;

/**
 * Props to apply to the select. These include all of [the props from our
 * `Select` component](/components/select). For the following properties, use
 * the top-level prop alternatives:
 *
 * - `aria-describedby`, use `aria-describedby` prop
 * - `aria-label`, use `label` prop
 * - `inputId`, use `id` prop
 * - `placeholder`, use `placeholder` prop
 *
 * Example:
 *
 * ```tsx
 * // Don't do this
 * <DatePicker selectProps={{
 *   'aria-describedby': 'helper-id'
 * }} />
 *
 * // Do this
 * <DatePicker aria-describedby="helper-id" />
 * ```
 */
// This hack makes the types actually work. Don't ask why, we don't know.
// See DSP-20292 for more information.
export type DateTimePickerSelectProps = Combine<
	SelectProps<OptionType>,
	{
		/**
		 * Use the `aria-describedby` prop on the picker..
		 */
		'aria-describedby'?: never;
		/**
		 * Use the `label` prop on the picker..
		 */
		'aria-label'?: never;
		/**
		 * Use the `id` prop on the picker.`.
		 */
		inputId?: never;
		/**
		 * Use the `placeholder` prop on the picker.
		 */
		placeholder?: never;
	}
>;

interface PickerSelectProps {
	selectProps?: DateTimePickerSelectProps;
}

export interface DatePickerBaseProps extends WithAnalyticsEventsProps, PickerSelectProps {
	/**
	 * Set the appearance of the picker.
	 * `subtle` will remove the borders, background, and icon.
	 * **NOTE:** Appearance values will be ignored if styles are parsed through `selectProps`.
	 *
	 * @deprecated
	 */
	appearance?: Appearance;
	/**
	 * Used to associate accessible descriptions to the date picker.
	 */
	'aria-describedby'?: string;
	/**
	 * Set the picker to autofocus on mount.
	 */
	autoFocus?: boolean;
	/**
	 * Set the `aria-label` for the clear button.
	 * Add the word "Clear" at the beginning of the clearControlLabel.
	 * For instance, for a field to set an appointment, use "Clear appointment date and time".
	 */
	clearControlLabel?: string;
	/**
	 * The default for `isOpen`. Will be `false` if not provided.
	 *
	 * @deprecated
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	defaultIsOpen?: boolean;
	/**
	 * The default for `value`.
	 */
	defaultValue?: string;
	/**
	 * An array of ISO dates that should be disabled on the calendar. This does not affect what users can type into the picker.
	 */
	disabled?: string[];
	/**
	 * A filter function for disabling dates on the calendar. This does not affect what users can type into the picker.
	 *
	 * The function is called with a date string in the format `YYYY-MM-DD` and should return `true` if the date should be disabled.
	 */
	disabledDateFilter?: (date: string) => boolean;
	/**
	 * Accessible name for the Date Picker Select, rendered as `aria-label`. This will override any other method of providing a label.
	 */
	label?: string;
	/**
	 * The latest enabled date. Dates after this are disabled on the calendar. This does not affect what users can type into the picker.
	 */
	maxDate?: string;
	/**
	 * The earliest enabled date. Dates before this are disabled on the calendar. This does not affect what users can type into the picker.
	 */
	minDate?: string;
	/**
	 * The icon shown in the picker.
	 *
	 * @deprecated
	 */
	icon?: React.ComponentType<DropdownIndicatorProps<OptionType>>;
	/**
	 * Set the id of the field.
	 * Associates a `<label></label>` with the field.
	 */
	id?: string;
	/**
	 * Props to apply to the container.
	 *
	 * @deprecated If you are looking to set your width, use a `Box` from
	 * `@atlaskit/primitives` around the picker to achieve the same effect.
	 */
	innerProps?: React.AllHTMLAttributes<HTMLElement>;
	/**
	 * Set if the picker is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Set if the picker is open.
	 */
	isOpen?: boolean;

	/**
	 * Set the field as required.
	 */
	isRequired?: boolean;

	/**
	 * The name of the field.
	 */
	name?: string;
	/**
	 * The aria-label attribute associated with the next-month arrow.
	 */
	nextMonthLabel?: string;
	/**
	 * Called when the field is blurred.
	 */
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	/**
	 * Called when the value changes. The only argument is an ISO time or empty string.
	 */
	onChange?: (value: string) => void;
	/**
	 * Called when the field is focused.
	 */
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	/**
	 * The name of the input, used when `shouldShowCalendarButton` is true. See `shouldShowCalendarButton` description for more details.
	 *
	 * @default 'Date picker'
	 */
	inputLabel?: string;
	/**
	 * The ID of the label for the input, used when `shouldShowCalendarButton` is
	 * true. See `shouldShowCalendarButton` description for more details.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	inputLabelId?: string;
	/**
	 * The label associated with the button to open the calendar, rendered via the
	 * `shouldShowCalendarButton` prop. If a `label` prop is provided, this
	 * calendar button label will be prefixed by the value of `label`. If no
	 * `label` prop is provided, this prefix should be manually added. For
	 * example,
	 *
	 * ```tsx
	 * <label id="label" htmlFor="datepicker">Desired Appointment Date</label>
	 * <DatePicker
	 * 	id="datepicker"
	 * 	shouldShowCalendarButton
	 * 	inputLabel="Desired Appointment Date"
	 * 	openCalendarLabel="open calendar"
	 * />
	 * ```
	 *
	 * @default 'open calendar'
	 */
	openCalendarLabel?: string;
	/**
	 * A function for parsing input characters and transforming them into a Date object.
	 * By default parses the date string based off the locale. Note that this does
	 * not affect how the resulting value is displayed in the input. Use the
	 * `dateFormat` or `formatDisplayLabel` prop to handle how the value is
	 * displayed.
	 */
	parseInputValue?: (date: string, dateFormat: string) => Date;
	/**
	 * A function for formatting the date displayed in the input. By default composes together [`date-fns`'s parse method](https://date-fns.org/v1.29.0/docs/parse) and [`date-fns`'s format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string.
	 *
	 * Note that this does not affect how the input is parsed. This must be done using the `parseInputValue` prop.
	 */
	formatDisplayLabel?: (value: string, dateFormat: string) => string;
	/**
	 * The aria-label attribute associated with the previous-month arrow.
	 */
	previousMonthLabel?: string;
	/**
	 * Provides a functional calendar button that opens the calendar picker that
	 * lives on the right side of the date picker.
	 *
	 * The accessible name for this button is caculated using either the `label`,
	 * `inputLabel`, or `inputLabelId` props, along with the `openCalendarLabel`
	 * prop.
	 *
	 * @default false
	 */
	shouldShowCalendarButton?: boolean;
	/**
	 * The spacing for the select control.
	 *
	 * Compact is `gridSize() * 4`, default is `gridSize * 5`.
	 */
	spacing?: Spacing;
	/**
	 * The ISO time used as the input value.
	 */
	value?: string;
	/**
	 * Set if the picker has an invalid value.
	 */
	isInvalid?: boolean;
	/**
	 * Hides icon for dropdown indicator.
	 *
	 * @deprecated
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	hideIcon?: boolean;
	/**
	 * Format the date with a string that is accepted by [date-fns's format
	 * function](https://date-fns.org/v1.29.0/docs/format). **This does not affect
	 * how the input is parsed.** This must be done using the `parseInputValue`
	 * prop.
	 *
	 * Note that though we are using `date-fns` version 2, we use [the tokens from
	 * `date-fns` version 1](https://date-fns.org/v1.30.1/docs/format) under the
	 * hood.
	 */
	dateFormat?: string;
	/**
	 * Placeholder text displayed in input.
	 */
	placeholder?: string;
	/**
	 * Locale used to format the date and calendar. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
	 */
	locale?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 *  - `{testId}--container` wrapping element of date-picker
	 *  - `{testId}--calendar--container` nested calendar component
	 */
	testId?: string;
	/**
	 * Start day of the week for the calendar.
	 * - `0` sunday (default value)
	 * - `1` monday
	 * - `2` tuesday
	 * - `3` wednesday
	 * - `4` thursday
	 * - `5` friday
	 * - `6` saturday
	 */
	weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	/**
	 * This overrides the inner wrapper the Calendar.
	 * @private Please use this with extreme caution, this API may be changed in the future.
	 */
	menuInnerWrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export interface TimePickerBaseProps extends WithAnalyticsEventsProps, PickerSelectProps {
	/**
	 * Set the appearance of the picker.
	 * `subtle` will remove the borders, background, and icon.
	 *
	 * __NOTE:__ Appearance values will be ignored if styles are parsed through `selectProps`.
	 *
	 * @deprecated
	 */
	appearance?: Appearance;
	/**
	 * Used to associate accessible descriptions to the time picker.
	 */
	'aria-describedby'?: string;
	/**
	 * Set the picker to autofocus on mount.
	 */
	autoFocus?: boolean;
	/**
	 * Set the `aria-label` for the clear button.
	 * Add the word "Clear" at the beginning of the clearControlLabel.
	 * For instance, for a field to set an appointment, use "Clear appointment date and time".
	 */
	clearControlLabel?: string;
	/**
	 * The default for `isOpen`.
	 *
	 * @deprecated
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	defaultIsOpen?: boolean;
	/**
	 * The default for `value`.
	 */
	defaultValue?: string;
	/**
	 * A function for formatting the displayed time value in the input. By default
	 * parses with an internal time parser, and formats using the [date-fns format
	 * function]((https://date-fns.org/v1.29.0/docs/format)).
	 *
	 * Note that this does not affect how the input is parsed. This must be done
	 * using the `parseInputValue` prop.
	 */
	formatDisplayLabel?: (time: string, timeFormat: string) => string;
	/**
	 * Set the id of the field.
	 * Associates a `<label></label>` with the field.
	 */
	id?: string;
	/**
	 * Props to apply to the container.
	 *
	 * @deprecated If you are looking to set your width, use a `Box` from
	 * `@atlaskit/primitives` around the picker to achieve the same effect.
	 */
	innerProps?: React.AllHTMLAttributes<HTMLElement>;
	/**
	 * Set if the field is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Set if the dropdown is open. Will be `false` if not provided.
	 */
	isOpen?: boolean;
	/**
	 * Set the field as required.
	 */
	isRequired?: boolean;
	/**
	 * Accessible name for the Time Picker Select, rendered as `aria-label`. This will override any other method of providing a label.
	 */
	label?: string;
	/**
	 * The name of the field.
	 */
	name?: string;
	/**
	 * Called when the field is blurred.
	 */
	onBlur?: React.FocusEventHandler<HTMLElement>;
	/**
	 * Called when the value changes. The only argument is an ISO time or empty string.
	 */
	onChange?: (value: string) => void;
	/**
	 * Called when the field is focused.
	 */
	onFocus?: React.FocusEventHandler<HTMLElement>;
	/**
	 * A function for parsing input characters and transforming them into either a
	 * string or a Date object. By default parses the string based off the locale.
	 * Note that this does not affect how the resulting value is displayed in the
	 * input. To handle this, use either the `timeFormat` or `formatDisplayLabel`
	 * prop.
	 */
	parseInputValue?: (time: string, timeFormat: string) => string | Date;

	/**
	 * The spacing for the select control.
	 *
	 * Compact is `gridSize() * 4`, default is `gridSize * 5`.
	 */
	spacing?: Spacing;
	/**
	 * The times shown in the dropdown.
	 */
	times?: string[];
	/**
	 * Set if users can edit the input, allowing them to add custom times.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	timeIsEditable?: boolean;
	/**
	 * The ISO time that should be used as the input value.
	 */
	value?: string;
	/**
	 * Set if the picker has an invalid value.
	 */
	isInvalid?: boolean;
	/**
	 * Hides icon for dropdown indicator.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	hideIcon?: boolean;
	/**
	 * Format the time with a string that is accepted by [date-fns's format
	 * function](https://date-fns.org/v1.29.0/docs/format). **This does not affect
	 * how the input is parsed.** This must be done using the `parseInputValue`
	 * prop.
	 *
	 * Note that though we are using `date-fns` version 2, we use [the tokens from
	 * `date-fns` version 1](https://date-fns.org/v1.30.1/docs/format) under the
	 * hood.
	 */
	timeFormat?: string;
	/**
	 * Placeholder text displayed in input.
	 */
	placeholder?: string;
	/**
	 * Locale used to format the time. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
	 */
	locale?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests:
	 *  - `{testId}--container` wrapping element of time-picker
	 */
	testId?: string;
}

export interface DateTimePickerBaseProps extends WithAnalyticsEventsProps {
	/**
	 * Set the appearance of the picker.
	 *
	 * `subtle` will remove the borders and background.
	 *
	 * @deprecated
	 */
	appearance?: Appearance;
	/**
	 * Used to associate accessible descriptions to both the date and time
	 * picker. If you want to associate individual accessible descriptions, this
	 * should be done through the `aria-describedby` props on the
	 * `datePickerProps` and `timePickerProps`.
	 */
	'aria-describedby'?: string;
	/**
	 * Set the picker to autofocus on mount.
	 */
	autoFocus?: boolean;
	/**
	 * Set the `aria-label` for the clear button.
	 * Add the word "Clear" at the beginning of the clearControlLabel.
	 * For instance, for a field to set an appointment, use "Clear appointment date and time".
	 */
	clearControlLabel?: string;
	/**
	 * The default for `value`.
	 */
	defaultValue?: string;
	/**
	 * Set the id of the field.
	 */
	id?: string;
	/**
	 * Props to apply to the container.
	 *
	 * @deprecated If you are looking to set your width, use a `Box` from
	 * `@atlaskit/primitives` around the picker to achieve the same effect.
	 */
	innerProps?: React.AllHTMLAttributes<HTMLElement>;
	/**
	 * Set if the field is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Set the field as required.
	 */
	isRequired?: boolean;
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
	 * Set if the picker has an invalid value.
	 */
	isInvalid?: boolean;
	/**
	 * Props applied to the `DatePicker`.
	 */
	datePickerProps?: DatePickerBaseProps;
	/**
	 * Props applied to the `TimePicker`.
	 */
	timePickerProps?: TimePickerBaseProps;
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
