/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/// <reference types="node" />
import { Component, createRef, type CSSProperties } from 'react';

import { isValid, parseISO } from 'date-fns';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { IdProvider } from '@atlaskit/ds-lib/use-id';
import CalendarIcon from '@atlaskit/icon/core/migration/calendar';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Select, {
	type ActionMeta,
	type DropdownIndicatorProps,
	type GroupType,
	type IndicatorsContainerProps,
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
import { IndicatorsContainer } from '../internal/indicators-container';
import { Menu } from '../internal/menu';
import { getSafeCalendarValue, getShortISOString } from '../internal/parse-date';
import { makeSingleValue } from '../internal/single-value';
import { type DatePickerBaseProps } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

type DatePickerProps = typeof datePickerDefaultProps & DatePickerBaseProps;

interface State {
	isKeyDown: boolean;
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
	wasOpenedFromCalendarButton: boolean;
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

const styles = cssMap({
	pickerContainerStyles: {
		position: 'relative',
	},
	iconContainerStyles: {
		display: 'flex',
		height: '100%',
		position: 'absolute',
		alignItems: 'center',
		flexBasis: 'inherit',
		color: token('color.text.subtlest'),
		insetBlockStart: token('space.0'),
		insetInlineEnd: token('space.0'),
		transition: `color 150ms`,
		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
	iconSpacingWithClearButtonStyles: {
		marginInlineEnd: token('space.400'),
	},
	iconSpacingWithoutClearButtonStyles: {
		marginInlineEnd: token('space.050'),
	},
	dropdownIndicatorStyles: {
		minWidth: '1.5rem',
		minHeight: '1.5rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

// eslint-disable-next-line @repo/internal/react/no-class-components
class DatePickerComponent extends Component<DatePickerProps, State> {
	static defaultProps = datePickerDefaultProps;
	containerRef: HTMLElement | null = null;
	calendarRef: React.RefObject<HTMLDivElement | null> = createRef();
	calendarButtonRef: React.RefObject<HTMLButtonElement> = createRef();

	constructor(props: any) {
		super(props);

		this.state = {
			isKeyDown: false,
			isOpen: this.props.defaultIsOpen,
			isFocused: false,
			clearingFromIcon: false,
			selectInputValue: this.props.selectProps?.inputValue || '',
			value: this.props.value || this.props.defaultValue,
			calendarValue: this.props.value || this.props.defaultValue || getShortISOString(new Date()),
			l10n: createLocalizationProvider(this.props.locale),
			locale: this.props.locale,
			shouldSetFocusOnCurrentDay: false,
			wasOpenedFromCalendarButton: false,
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
			wasOpenedFromCalendarButton: false,
		});

		this.props.onChange(iso);

		// Yes, this is not ideal. The alternative is to be able to place a ref
		// on the inner input of Select itself, which would require a lot of
		// extra stuff in the Select component for only this one thing. While
		// this would be more "React-y", it doesn't seem to pose any other
		// benefits. Performance-wise, we are only searching within the
		// container, so it's quick.
		if (this.state.wasOpenedFromCalendarButton) {
			this.calendarButtonRef.current?.focus();
		} else {
			const innerCombobox: HTMLInputElement | undefined | null =
				this.containerRef?.querySelector('[role="combobox"]');
			innerCombobox?.focus();
		}
		this.setState({ isOpen: false });
	};

	onInputClick = () => {
		if (!this.props.isDisabled && !this.getIsOpen()) {
			this.setState({ isOpen: true, wasOpenedFromCalendarButton: false });
		}
	};

	onContainerBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const newlyFocusedElement = event.relatedTarget as HTMLElement;

		if (!this.containerRef?.contains(newlyFocusedElement)) {
			this.setState({
				isOpen: false,
				shouldSetFocusOnCurrentDay: false,
				wasOpenedFromCalendarButton: false,
			});
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
			this.setState({ isOpen: false, isFocused: false, wasOpenedFromCalendarButton: false });
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
				// Don't open when focused into via keyboard if the calendar button is present
				isOpen: !this.props.shouldShowCalendarButton,
				calendarValue: value,
				isFocused: true,
				wasOpenedFromCalendarButton: false,
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

		this.setState({ isOpen: true, wasOpenedFromCalendarButton: false });
	};

	onInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		const { calendarValue } = this.state;
		const value = this.getValue();

		const keyPressed = event.key.toLowerCase();

		// If the input is focused and the calendar is not visible, handle space and enter clicks
		if (!this.state.isOpen && (keyPressed === 'enter' || keyPressed === ' ')) {
			this.setState({ isOpen: true, wasOpenedFromCalendarButton: false });
		}

		switch (keyPressed) {
			case 'escape':
				// Yes, this is not ideal. The alternative is to be able to place a ref
				// on the inner input of Select itself, which would require a lot of
				// extra stuff in the Select component for only this one thing. While
				// this would be more "React-y", it doesn't seem to pose any other
				// benefits. Performance-wise, we are only searching within the
				// container, so it's quick.
				if (this.state.wasOpenedFromCalendarButton) {
					this.calendarButtonRef.current?.focus();
				} else {
					const innerCombobox: HTMLInputElement | undefined | null =
						this.containerRef?.querySelector('[role="combobox"]');
					innerCombobox?.focus();
				}
				this.setState({
					isOpen: false,
					shouldSetFocusOnCurrentDay: false,
					wasOpenedFromCalendarButton: false,
				});
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
						wasOpenedFromCalendarButton: false,
					});
					if (valueChanged) {
						this.props.onChange(safeCalendarValue);
					}
				}
				break;
			case 'arrowdown':
			case 'arrowup':
				if (!this.state.shouldSetFocusOnCurrentDay) {
					this.setState({
						isOpen: true,
						shouldSetFocusOnCurrentDay: true,
					});
				}
				break;
			default:
				break;
		}
	};

	onCalendarButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		// Don't allow an arrow up or down to open the menu, since the input key
		// down handler is actually on the parent.
		if (e.type === 'keydown' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			e.stopPropagation();
		}
		// We want to stop this from triggering other keydown events, particularly
		// for space and enter presses. Otherwise, it opens and then closes
		// immediately.
		if (e.type === 'keydown' && (e.key === ' ' || e.key === 'Enter')) {
			e.stopPropagation();
			this.setState({ isKeyDown: true, wasOpenedFromCalendarButton: true });
		}
	};

	// This event handler is triggered from both keydown and click. It's weird.
	onCalendarButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({ isOpen: !this.state.isOpen, wasOpenedFromCalendarButton: true }, () => {
			// We don't want the focus to move if this is a click event
			if (!this.state.isKeyDown) {
				return;
			}

			this.setState({ isKeyDown: false });

			// Focus on the first button within the calendar
			this.calendarRef?.current?.querySelector('button')?.focus();
		});

		e.stopPropagation();
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
			clearControlLabel = 'Clear',
			hideIcon = false,
			openCalendarLabel = 'Open calendar',
			disabled,
			disabledDateFilter,
			icon: Icon = CalendarIcon as unknown as React.ComponentType<
				DropdownIndicatorProps<OptionType>
			>,
			id = '',
			innerProps = {},
			inputLabel = 'Date picker',
			inputLabelId,
			isDisabled = false,
			isInvalid = false,
			isRequired = false,
			label = '',
			locale,
			maxDate,
			minDate,
			name = '',
			nextMonthLabel,
			previousMonthLabel,
			selectProps = {},
			shouldShowCalendarButton,
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

		let clearIndicator = Icon;

		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		if (fg('platform-visual-refresh-icons')) {
			clearIndicator = (props: DropdownIndicatorProps<OptionType>) => (
				<Box xcss={styles.dropdownIndicatorStyles}>
					<Icon {...props} />
				</Box>
			);
		}

		const dropDownIcon =
			appearance === 'subtle' || hideIcon || showClearIndicator ? null : clearIndicator;

		const SingleValue = makeSingleValue({ lang: this.props.locale });

		const selectComponents = {
			DropdownIndicator: shouldShowCalendarButton ? EmptyComponent : dropDownIcon,
			// Only use this new container component if the calendar button is shown.
			// Otherwise, it throws errors downstream for some reason
			...(shouldShowCalendarButton
				? {
						IndicatorsContainer: (props: IndicatorsContainerProps<any>) => (
							<IndicatorsContainer {...props} showClearIndicator={showClearIndicator} />
						),
					}
				: {}),
			Menu,
			SingleValue,
			...(!showClearIndicator && { ClearIndicator: EmptyComponent }),
			...selectProps.components,
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
			calendarRef: this.calendarRef,
			calendarValue: value && getShortISOString(parseISO(value)),
			calendarView: calendarValue,
			onCalendarChange: this.onCalendarChange,
			onCalendarSelect: this.onCalendarSelect,
			calendarLocale: locale,
			calendarWeekStartDay: weekStartDay,
			shouldSetFocusOnCurrentDay: this.state.shouldSetFocusOnCurrentDay,
			menuInnerWrapper: this.props.menuInnerWrapper,
		};

		// @ts-ignore -- Argument of type 'StylesConfig<OptionType, false, GroupBase<OptionType>>' is not assignable to parameter of type 'StylesConfig<OptionType, boolean, GroupBase<OptionType>>'.
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

		// `label` takes precedence of the `inputLabel`
		const fullopenCalendarLabel =
			label || inputLabel ? `${label || inputLabel}, ${openCalendarLabel}` : openCalendarLabel;

		return (
			// These event handlers must be on this element because the events come
			// from different child elements.
			// Until innerProps is removed, it must remain a div rather than a primitive component.
			// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
			<div
				{...innerProps}
				css={styles.pickerContainerStyles}
				// Since the onclick, onfocus are passed down, adding role="presentation" prevents typecheck errors.
				role="presentation"
				onBlur={this.onContainerBlur}
				onFocus={this.onContainerFocus}
				onClick={this.onInputClick}
				onInput={this.onTextInput}
				onKeyDown={this.onInputKeyDown}
				ref={this.getContainerRef}
				data-testid={testId && `${testId}--container`}
			>
				{/* Because this is ia hidden input field, it does not need to be Textfield component. */}
				<input name={name} type="hidden" value={value} data-testid={testId && `${testId}--input`} />
				<Select
					appearance={this.props.appearance}
					aria-describedby={ariaDescribedBy}
					label={label || undefined}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={autoFocus}
					clearControlLabel={clearControlLabel}
					closeMenuOnSelect
					enableAnimation={false}
					inputId={id}
					inputValue={actualSelectInputValue}
					isDisabled={isDisabled}
					isRequired={isRequired}
					menuIsOpen={menuIsOpen}
					onBlur={this.onSelectBlur}
					onChange={this.onSelectChange}
					onFocus={this.onSelectFocus}
					onInputChange={this.handleSelectInputChange}
					placeholder={getPlaceholder({
						placeholder: this.props.placeholder,
						l10n: this.state.l10n,
					})}
					// @ts-ignore -- Argument of type 'StylesConfig<OptionType, false, GroupBase<OptionType>>' is not assignable to parameter of type 'StylesConfig<OptionType, boolean, GroupBase<OptionType>>'
					styles={mergedStyles}
					value={initialValue}
					{...selectProps}
					// For some reason, this and the below `styles` type error _only_ show
					// up when you alter some of the properties in the `selectComponents`
					// object. These errors are still present, and I suspect have always
					// been present, without changing the unrelated code. Ignoring as the
					// component still works as expected despite this error. And also
					// because the select refresh team may solve it later.
					components={selectComponents}
					// These are below the spread because I don't know what is in
					// selectProps or not and what wil be overwritten
					isClearable
					isInvalid={isInvalid}
					spacing={spacing}
					testId={testId}
					// These aren't part of `Select`'s API, but we're using them here.
					// @ts-ignore --  Property 'calendarContainerRef' does not exist on type 'IntrinsicAttributes & LibraryManagedAttributes<(<Option extends unknown = OptionType, IsMulti extends boolean = false>(props: AtlaskitSelectProps<Option, IsMulti> & { ...; }) => Element), AtlaskitSelectProps<...> & { ...; }>'.
					calendarContainerRef={calendarProps.calendarContainerRef}
					calendarDisabled={calendarProps.calendarDisabled}
					calendarDisabledDateFilter={calendarProps.calendarDisabledDateFilter}
					calendarLocale={calendarProps.calendarLocale}
					calendarMaxDate={calendarProps.calendarMaxDate}
					calendarMinDate={calendarProps.calendarMinDate}
					calendarRef={calendarProps.calendarRef}
					calendarValue={calendarProps.calendarValue}
					calendarView={calendarProps.calendarView}
					calendarWeekStartDay={calendarProps.calendarWeekStartDay}
					nextMonthLabel={nextMonthLabel}
					onCalendarChange={calendarProps.onCalendarChange}
					onCalendarSelect={calendarProps.onCalendarSelect}
					previousMonthLabel={previousMonthLabel}
					shouldSetFocusOnCurrentDay={calendarProps.shouldSetFocusOnCurrentDay}
					menuInnerWrapper={calendarProps.menuInnerWrapper}
				/>
				{shouldShowCalendarButton && !isDisabled ? (
					<IdProvider prefix="open-calendar-label--">
						{({ id: openCalendarLabelId }) => (
							<Box
								xcss={cx(
									styles.iconContainerStyles,
									value && !hideIcon
										? styles.iconSpacingWithClearButtonStyles
										: styles.iconSpacingWithoutClearButtonStyles,
								)}
							>
								<IconButton
									appearance="subtle"
									label={!inputLabelId ? fullopenCalendarLabel : openCalendarLabel}
									aria-labelledby={
										inputLabelId ? `${inputLabelId} ${openCalendarLabelId}` : undefined
									}
									id={openCalendarLabelId}
									icon={(iconProps) => <CalendarIcon {...iconProps} color={token('color.icon')} />}
									onClick={this.onCalendarButtonClick}
									onKeyDown={this.onCalendarButtonKeyDown}
									ref={this.calendarButtonRef}
									testId={testId && `${testId}--open-calendar-button`}
								/>
							</Box>
						)}
					</IdProvider>
				) : null}
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
