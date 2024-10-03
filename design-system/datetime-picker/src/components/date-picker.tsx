/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component, type CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { isValid, parseISO } from 'date-fns';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import Select, {
	type ActionMeta,
	type DropdownIndicatorProps,
	type GroupType,
	type InputActionMeta,
	mergeStyles,
	type OptionType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { EmptyComponent } from '../internal';
import {
	formatDate,
	getParsedISO,
	getPlaceholder,
	isDateDisabled,
	parseDate,
} from '../internal/date-picker-migration';
import { Menu } from '../internal/menu';
import { getSafeCalendarValue, getShortISOString } from '../internal/parse-date';
import { makeSingleValue } from '../internal/single-value';
import { type DatePickerBaseProps } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

type DatePickerProps = typeof datePickerDefaultProps & DatePickerBaseProps;

interface State {
	isOpen: boolean;
	/**
	 * When being cleared from the icon the DatePicker is blurred.
	 * This variable defines whether the default onSelectBlur or onSelectFocus
	 * events should behave as normal.
	 */
	isFocused: boolean;
	clearingFromIcon: boolean;
	value: string;
	calendarValue: string;
	selectInputValue: string;
	l10n: LocalizationProvider;
	locale: string;
	shouldSetFocusOnCurrentDay: boolean;
}

const datePickerDefaultProps = {
	defaultIsOpen: false,
	defaultValue: '',
	disabled: [] as string[],
	disabledDateFilter: (_: string) => false,
	locale: 'en-US',
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

class DatePickerComponent extends Component<DatePickerProps, State> {
	static defaultProps = datePickerDefaultProps;
	containerRef: HTMLElement | null = null;

	constructor(props: any) {
		super(props);

		this.state = {
			isOpen: this.props.defaultIsOpen,
			isFocused: false,
			clearingFromIcon: false,
			selectInputValue: this.props.selectProps?.inputValue || '',
			value: this.props.value || this.props.defaultValue,
			calendarValue: this.props.value || this.props.defaultValue || getShortISOString(new Date()),
			l10n: createLocalizationProvider(this.props.locale),
			locale: this.props.locale,
			shouldSetFocusOnCurrentDay: false,
		};
	}

	static getDerivedStateFromProps(nextProps: Readonly<DatePickerProps>, prevState: State) {
		if (nextProps.locale !== prevState.locale) {
			return {
				l10n: createLocalizationProvider(nextProps.locale),
				locale: nextProps.locale,
			};
		} else {
			return null;
		}
	}

	// All state needs to be accessed via this function so that the state is mapped from props
	// correctly to allow controlled/uncontrolled usage.
	getValue = () => this.props.value ?? this.state.value;
	getIsOpen = () => this.props.isOpen ?? this.state.isOpen;

	onCalendarChange = ({ iso }: { iso: string }) => {
		this.setState({ calendarValue: getParsedISO({ iso }) });
	};

	onCalendarSelect = ({ iso }: { iso: string }) => {
		this.setState({
			selectInputValue: '',
			isOpen: false,
			calendarValue: iso,
			value: iso,
		});

		this.props.onChange(iso);

		// Not ideal, and the alternative is to place a ref on the inner input of the Select
		// but that would require a lot of extra work on the Select component just for this
		// focus functionality. While that would be the 'right react' way to do it, it doesnt
		// post any other benefits; performance wise, we are only searching within the
		// container, making it quick.
		const innerCombobox: HTMLInputElement | undefined | null =
			this.containerRef?.querySelector('[role="combobox"]');
		innerCombobox?.focus();
		this.setState({ isOpen: false });
	};

	onInputClick = () => {
		if (!this.props.isDisabled && !this.getIsOpen()) {
			this.setState({ isOpen: true });
		}
	};

	onContainerBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const newlyFocusedElement = event.relatedTarget as HTMLElement;

		if (!this.containerRef?.contains(newlyFocusedElement)) {
			this.setState({ isOpen: false, shouldSetFocusOnCurrentDay: false });
			this.props.onBlur(event);
		}
	};

	onContainerFocus = () => {
		this.setState({ shouldSetFocusOnCurrentDay: false });
	};

	onSelectBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const newlyFocusedElement = event.relatedTarget as HTMLElement;

		if (this.state.clearingFromIcon) {
			// Don't close menu if blurring after the user has clicked clear
			this.setState({ clearingFromIcon: false });
		} else if (!this.containerRef?.contains(newlyFocusedElement)) {
			// Don't close menu if focus is staying within the date picker's
			// container. Makes keyboard accessibility of calendar possible
			this.setState({ isOpen: false, isFocused: false });
		}
	};

	onSelectFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		const { clearingFromIcon } = this.state;
		const value = this.getValue();

		if (clearingFromIcon) {
			// Don't open menu if focussing after the user has clicked clear
			this.setState({ clearingFromIcon: false });
		} else {
			this.setState({
				isOpen: true,
				calendarValue: value,
				isFocused: true,
			});
		}

		this.props.onFocus(event);
	};

	onTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (inputValue) {
			const parsed = parseDate(inputValue, {
				parseInputValue: this.props.parseInputValue,
				dateFormat: this.props.dateFormat,
				l10n: this.state.l10n,
			});
			// Only try to set the date if we have month & day
			if (parsed && isValid(parsed)) {
				// We format the parsed date to YYYY-MM-DD here because
				// this is the format expected by the @atlaskit/calendar component
				this.setState({ calendarValue: getShortISOString(parsed) });
			}
		}

		this.setState({ isOpen: true });
	};

	onInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		const { calendarValue } = this.state;
		const value = this.getValue();

		const keyPressed = event.key.toLowerCase();

		// If the input is focused and the calendar is not visible, handle space and enter clicks
		if (!this.state.isOpen && (keyPressed === 'enter' || keyPressed === ' ')) {
			this.setState({ isOpen: true });
		}

		switch (keyPressed) {
			case 'escape':
				// Yes, this is not ideal. The alternative is to be able to place a ref
				// on the inner input of Select itself, which would require a lot of
				// extra stuff in the Select component for only this one thing. While
				// this would be more "React-y", it doesn't seem to pose any other
				// benefits. Performance-wise, we are only searching within the
				// container, so it's quick.
				const innerCombobox: HTMLInputElement | undefined | null =
					this.containerRef?.querySelector('[role="combobox"]');
				innerCombobox?.focus();
				this.setState({ isOpen: false, shouldSetFocusOnCurrentDay: false });
				break;
			case 'backspace':
			case 'delete': {
				const inputCount = 0;

				if (
					value &&
					event.target instanceof HTMLInputElement &&
					event.target.value.length <= inputCount
				) {
					// If being cleared from keyboard, don't change behaviour
					this.setState({ clearingFromIcon: false, value: '' });
				}
				break;
			}
			case 'enter':
				if (!this.state.isOpen) {
					return;
				}
				// Prevent form submission when a date is selected
				// using enter. See https://product-fabric.atlassian.net/browse/DSP-2501
				// for more details.
				event.preventDefault();
				if (!isDateDisabled(calendarValue, { disabled: this.props.disabled })) {
					// Get a safe `calendarValue` in case the value exceeds the maximum
					// allowed by ISO 8601
					const safeCalendarValue = getSafeCalendarValue(calendarValue);
					const valueChanged = safeCalendarValue !== value;
					this.setState({
						selectInputValue: '',
						isOpen: false,
						value: safeCalendarValue,
						calendarValue: safeCalendarValue,
					});
					if (valueChanged) {
						this.props.onChange(safeCalendarValue);
					}
				}
				break;
			case 'arrowdown':
			case 'arrowup':
				if (this.state.isOpen && !this.state.shouldSetFocusOnCurrentDay) {
					this.setState({
						shouldSetFocusOnCurrentDay: true,
					});
				}
				break;
			default:
				break;
		}
	};

	onClear = () => {
		let changedState: {} = {
			value: '',
			calendarValue: this.props.defaultValue || getShortISOString(new Date()),
		};

		if (!this.props.hideIcon) {
			changedState = {
				...changedState,
				clearingFromIcon: true,
			};
		}
		this.setState(changedState);
		this.props.onChange('');
	};

	// `unknown` is used because `value` is unused so it does not matter.
	onSelectChange = (_value: unknown, action: ActionMeta) => {
		// Used for native clear event in React Select
		// Triggered when clicking ClearIndicator or backspace with no value
		if (action.action === 'clear') {
			this.onClear();
		}
	};

	handleSelectInputChange = (selectInputValue: string, actionMeta: InputActionMeta) => {
		const onInputChange = this.props.selectProps?.onInputChange;
		if (onInputChange) {
			onInputChange(selectInputValue, actionMeta);
		}
		this.setState({ selectInputValue });
	};

	getContainerRef = (ref: HTMLElement | null) => {
		const oldRef = this.containerRef;
		this.containerRef = ref;
		// Cause a re-render if we're getting the container ref for the first time
		// as the layered menu requires it for dimension calculation
		if (oldRef == null && ref != null) {
			this.forceUpdate();
		}
	};

	render() {
		const {
			appearance = 'default',
			'aria-describedby': ariaDescribedBy,
			autoFocus = false,
			disabled,
			disabledDateFilter,
			hideIcon = false,
			// TODO: Resolve this typing to be more intuitive
			icon = CalendarIcon as unknown as React.ComponentType<DropdownIndicatorProps<OptionType>>,
			id = '',
			innerProps = {},
			isDisabled = false,
			isInvalid = false,
			label = '',
			locale,
			maxDate,
			minDate,
			name = '',
			nextMonthLabel,
			previousMonthLabel,
			selectProps = {},
			spacing = 'default',
			testId,
			weekStartDay,
		} = this.props;
		const { calendarValue, selectInputValue } = this.state;
		const value = this.getValue();

		let actualSelectInputValue;

		actualSelectInputValue = selectInputValue;

		const menuIsOpen = this.getIsOpen() && !isDisabled;

		const showClearIndicator = Boolean((value || selectInputValue) && !hideIcon);

		const dropDownIcon = appearance === 'subtle' || hideIcon || showClearIndicator ? null : icon;

		const SingleValue = makeSingleValue({ lang: this.props.locale });

		const selectComponents = {
			DropdownIndicator: dropDownIcon,
			Menu,
			SingleValue,
			...(!showClearIndicator && { ClearIndicator: EmptyComponent }),
		};

		const { styles: selectStyles = {} } = selectProps;
		const disabledStyle: CSSProperties = isDisabled
			? {
					pointerEvents: 'none',
					color: token('color.icon.disabled', 'inherit'),
				}
			: {};

		const calendarProps = {
			calendarContainerRef: this.containerRef,
			calendarDisabled: disabled,
			calendarDisabledDateFilter: disabledDateFilter,
			calendarMaxDate: maxDate,
			calendarMinDate: minDate,
			calendarValue: value && getShortISOString(parseISO(value)),
			calendarView: calendarValue,
			onCalendarChange: this.onCalendarChange,
			onCalendarSelect: this.onCalendarSelect,
			calendarLocale: locale,
			calendarWeekStartDay: weekStartDay,
			shouldSetFocusOnCurrentDay: this.state.shouldSetFocusOnCurrentDay,
		};

		const mergedStyles = mergeStyles<OptionType, boolean, GroupType<OptionType>>(selectStyles, {
			control: (base: any) => ({
				...base,
				...disabledStyle,
			}),
			indicatorsContainer: (base) => ({
				...base,
				paddingLeft: token('space.025', '2px'), // ICON_PADDING = 2
				paddingRight: token('space.075', '6px'), // 8 - ICON_PADDING = 6
			}),
		});

		const initialValue = value
			? {
					label: formatDate(value, {
						formatDisplayLabel: this.props.formatDisplayLabel,
						dateFormat: this.props.dateFormat,
						l10n: this.state.l10n,
					}),
					value,
				}
			: null;

		return (
			// These event handlers must be on this element because the events come
			// from different child elements.
			<div
				{...innerProps}
				role="presentation"
				onBlur={this.onContainerBlur}
				onFocus={this.onContainerFocus}
				onClick={this.onInputClick}
				onInput={this.onTextInput}
				onKeyDown={this.onInputKeyDown}
				ref={this.getContainerRef}
				data-testid={testId && `${testId}--container`}
			>
				<input name={name} type="hidden" value={value} data-testid={testId && `${testId}--input`} />
				<Select
					appearance={this.props.appearance}
					aria-describedby={ariaDescribedBy}
					aria-label={label || undefined}
					autoFocus={autoFocus}
					closeMenuOnSelect
					components={selectComponents}
					enableAnimation={false}
					inputId={id}
					inputValue={actualSelectInputValue}
					isDisabled={isDisabled}
					menuIsOpen={menuIsOpen}
					onBlur={this.onSelectBlur}
					onChange={this.onSelectChange}
					onFocus={this.onSelectFocus}
					onInputChange={this.handleSelectInputChange}
					placeholder={getPlaceholder({
						placeholder: this.props.placeholder,
						l10n: this.state.l10n,
					})}
					styles={mergedStyles}
					value={initialValue}
					{...selectProps}
					// These are below the spread because I don't know what is in
					// selectProps or not and what wil be overwritten
					isClearable
					isInvalid={isInvalid}
					spacing={spacing}
					testId={testId}
					// These aren't part of `Select`'s API, but we're using them here.
					calendarContainerRef={calendarProps.calendarContainerRef}
					calendarDisabled={calendarProps.calendarDisabled}
					calendarDisabledDateFilter={calendarProps.calendarDisabledDateFilter}
					calendarLocale={calendarProps.calendarLocale}
					calendarMaxDate={calendarProps.calendarMaxDate}
					calendarMinDate={calendarProps.calendarMinDate}
					calendarValue={calendarProps.calendarValue}
					calendarView={calendarProps.calendarView}
					calendarWeekStartDay={calendarProps.calendarWeekStartDay}
					nextMonthLabel={nextMonthLabel}
					onCalendarChange={calendarProps.onCalendarChange}
					onCalendarSelect={calendarProps.onCalendarSelect}
					previousMonthLabel={previousMonthLabel}
					shouldSetFocusOnCurrentDay={calendarProps.shouldSetFocusOnCurrentDay}
				/>
			</div>
		);
	}
}

export { DatePickerComponent as DatePickerWithoutAnalytics };

/**
 * __Date picker__
 *
 * A date picker allows the user to select a particular date.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/date-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/date-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/date-picker/usage)
 */
const DatePicker = withAnalyticsContext({
	componentName: 'datePicker',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onChange: createAndFireEvent('atlaskit')({
			action: 'selectedDate',
			actionSubject: 'datePicker',
			attributes: {
				componentName: 'datePicker',
				packageName,
				packageVersion,
			},
		}),
	})(DatePickerComponent),
);

export default DatePicker;
