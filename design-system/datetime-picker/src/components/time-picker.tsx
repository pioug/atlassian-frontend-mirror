import React, {
	type CSSProperties,
	forwardRef,
	useCallback,
	useEffect,
	useReducer,
	useState,
} from 'react';

import { format, isValid } from 'date-fns';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import Select, {
	type ActionMeta,
	CreatableSelect,
	type GroupType,
	mergeStyles,
	type OptionType,
	type SelectComponentsConfig,
	type ValueType,
} from '@atlaskit/select';

import { defaultTimeFormat, defaultTimes, EmptyComponent, placeholderDatetime } from '../internal';
import { FixedLayerMenu } from '../internal/fixed-layer-menu';
import parseTime from '../internal/parse-time';
import { convertTokens } from '../internal/parse-tokens';
import { makeSingleValue } from '../internal/single-value';
import { type Appearance, type Spacing, type TimePickerBaseProps } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

interface Option {
	label: string;
	value: string;
}

const menuStyles: CSSProperties = {
	/* Need to remove default absolute positioning as that causes issues with position fixed */
	position: 'static',
	/* Need to add overflow to the element with max-height, otherwise causes overflow issues in IE11 */
	overflowY: 'auto',
	/* React-Popper has already offset the menu so we need to reset the margin, otherwise the offset value is doubled */
	margin: 0,
};

const analyticsAttributes = {
	componentName: 'timePicker',
	packageName,
	packageVersion,
};

/**
 * __Time picker__
 *
 * A time picker allows the user to select a specific time.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/time-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/time-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/time-picker/usage)
 */
const TimePicker = forwardRef(
	(
		{
			'aria-describedby': ariaDescribedBy,
			appearance = 'default' as Appearance,
			autoFocus = false,
			defaultIsOpen = false,
			defaultValue = '',
			formatDisplayLabel,
			hideIcon = false,
			id = '',
			innerProps = {},
			isDisabled = false,
			isInvalid = false,
			isOpen: providedIsOpen,
			label = '',
			locale = 'en-US',
			name = '',
			onBlur: providedOnBlur = __noop,
			onChange: providedOnChange = __noop,
			onFocus: providedOnFocus = __noop,
			parseInputValue = (time: string, _timeFormat: string) => parseTime(time),
			placeholder,
			selectProps = {},
			spacing = 'default' as Spacing,
			testId,
			timeFormat,
			timeIsEditable = false,
			times = defaultTimes,
			value: providedValue,
		}: TimePickerBaseProps,
		ref,
	) => {
		const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
		/**
		 * When being cleared from the icon the TimePicker is blurred.
		 * This variable defines whether the default onMenuOpen or onMenuClose
		 * events should behave as normal
		 */
		const [clearingFromIcon, setClearingFromIcon] = useState<boolean>(false);
		// TODO: Remove isFocused? Does it do anything?
		const [_, setIsFocused] = useState<boolean>(false);
		const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);
		const [value, setValue] = useState<string>(defaultValue);

		// Hack to force update: https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
		const [, forceUpdate] = useReducer((x) => x + 1, 0);

		const providedOnChangeWithAnalytics = usePlatformLeafEventHandler({
			fn: providedOnChange,
			action: 'selectedTime',
			...analyticsAttributes,
		});

		useEffect(() => {
			if (providedValue) {
				setValue(providedValue);
			}
		}, [providedValue]);

		useEffect(() => {
			if (providedIsOpen) {
				setIsOpen(providedIsOpen);
			}
		}, [providedIsOpen]);

		const onChange = useCallback(
			(newValue: ValueType<OptionType> | string, action?: ActionMeta<OptionType>) => {
				const rawValue = newValue ? (newValue as OptionType).value || newValue : '';
				const finalValue = rawValue.toString();
				setValue(finalValue);

				if (action && action.action === 'clear') {
					setClearingFromIcon(true);
				}

				providedOnChangeWithAnalytics(finalValue);
			},
			[providedOnChangeWithAnalytics],
		);

		/**
		 * Only allow custom times if timeIsEditable prop is true
		 */
		const onCreateOption = (inputValue: string): void => {
			if (timeIsEditable) {
				let sanitizedInput;

				try {
					sanitizedInput = parseInputValue(inputValue, timeFormat || defaultTimeFormat) as Date;
				} catch (e) {
					return; // do nothing, the main validation should happen in the form
				}

				const includesSeconds = !!(timeFormat && /[:.]?(s|ss)/.test(timeFormat));

				const formatFormat = includesSeconds ? 'HH:mm:ss' : 'HH:mm';
				const formattedValue = format(sanitizedInput, formatFormat) || '';

				setValue(formattedValue);
				providedOnChangeWithAnalytics(formattedValue);
			} else {
				providedOnChangeWithAnalytics(inputValue);
			}
		};

		const onMenuOpen = () => {
			// Don't open menu after the user has clicked clear
			if (clearingFromIcon) {
				setClearingFromIcon(false);
			} else {
				setIsOpen(true);
			}
		};

		const onMenuClose = () => {
			// Don't close menu after the user has clicked clear
			if (clearingFromIcon) {
				setClearingFromIcon(false);
			} else {
				setIsOpen(false);
			}
		};

		const setInternalContainerRef = (ref: HTMLElement | null) => {
			const oldRef = containerRef;
			setContainerRef(ref);
			// Cause a re-render if we're getting the container ref for the first time
			// as the layered menu requires it for dimension calculation
			if (oldRef === null && ref !== null) {
				forceUpdate();
			}
		};

		const onBlur = (event: React.FocusEvent<HTMLElement>) => {
			setIsFocused(false);
			providedOnBlur(event);
		};

		const onFocus = (event: React.FocusEvent<HTMLElement>) => {
			setIsFocused(true);
			providedOnFocus(event);
		};

		const onSelectKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			const { key } = event;
			const keyPressed = key.toLowerCase();
			if (clearingFromIcon && (keyPressed === 'backspace' || keyPressed === 'delete')) {
				// If being cleared from keyboard, don't change behaviour
				setClearingFromIcon(false);
			}
		};

		const ICON_PADDING = 2;
		const GRID_SIZE = 8;
		const l10n: LocalizationProvider = createLocalizationProvider(locale);
		const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;
		const SelectComponent = timeIsEditable ? CreatableSelect : Select;

		/**
		 * There are multiple props that can change how the time is formatted.
		 * The priority of props used is:
		 *   1. formatDisplayLabel
		 *   2. timeFormat
		 *   3. locale
		 */
		const formatTime = (time: string): string => {
			if (formatDisplayLabel) {
				return formatDisplayLabel(time, timeFormat || defaultTimeFormat);
			}

			const date = parseTime(time);

			if (!(date instanceof Date)) {
				return '';
			}

			if (!isValid(date)) {
				return time;
			}

			if (timeFormat) {
				return format(date, convertTokens(timeFormat));
			}

			return l10n.formatTime(date);
		};

		const options: Array<Option> = times.map((time: string): Option => {
			return {
				label: formatTime(time),
				value: time,
			};
		});

		let initialValue;
		if (providedValue !== null && providedValue !== undefined && providedValue !== '') {
			initialValue = {
				label: formatTime(providedValue),
				value: providedValue,
			};
		} else if (providedValue !== '' && value) {
			initialValue = {
				label: formatTime(value),
				value: value,
			};
		} else {
			initialValue = null;
		}

		const SingleValue = makeSingleValue({ lang: locale });

		const selectComponents: SelectComponentsConfig<OptionType> = {
			DropdownIndicator: EmptyComponent,
			Menu: FixedLayerMenu,
			SingleValue,
			...(hideIcon && { ClearIndicator: EmptyComponent }),
		};

		const renderIconContainer = Boolean(!hideIcon && value);
		// @ts-ignore - https://product-fabric.atlassian.net/browse/DSP-21000
		const mergedStyles = mergeStyles<OptionType, boolean, GroupType<OptionType>>(selectStyles, {
			control: (base) => ({
				...base,
			}),
			menu: (base: any) => ({
				...base,
				...menuStyles,
				// Fixed positioned elements no longer inherit width from their parent, so we must explicitly set the
				// menu width to the width of our container
				width: containerRef ? containerRef.getBoundingClientRect().width : 'auto',
			}),
			indicatorsContainer: (base) => ({
				...base,
				paddingLeft: renderIconContainer ? ICON_PADDING : 0,
				paddingRight: renderIconContainer ? GRID_SIZE - ICON_PADDING : 0,
			}),
		});

		return (
			<div
				{...innerProps}
				ref={setInternalContainerRef}
				data-testid={testId && `${testId}--container`}
			>
				<input
					name={name}
					type="hidden"
					value={value}
					data-testid={testId && `${testId}--input`}
					onKeyDown={onSelectKeyDown}
				/>
				<SelectComponent
					aria-describedby={ariaDescribedBy}
					aria-label={label || undefined}
					appearance={appearance}
					autoFocus={autoFocus}
					components={selectComponents}
					inputId={id}
					isClearable
					isDisabled={isDisabled}
					menuIsOpen={isOpen && !isDisabled}
					menuPlacement="auto"
					openMenuOnFocus
					onBlur={onBlur}
					onCreateOption={onCreateOption}
					onChange={onChange}
					options={options}
					onFocus={onFocus}
					onMenuOpen={onMenuOpen}
					onMenuClose={onMenuClose}
					placeholder={placeholder || l10n.formatTime(placeholderDatetime)}
					styles={mergedStyles}
					value={initialValue}
					spacing={spacing}
					// We need this to get things to work, even though it's not supported.
					// @ts-ignore - https://product-fabric.atlassian.net/browse/DSP-21000
					fixedLayerRef={containerRef}
					isInvalid={isInvalid}
					testId={testId}
					{...otherSelectProps}
				/>
			</div>
		);
	},
);

export default TimePicker;
