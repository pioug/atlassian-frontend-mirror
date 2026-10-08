/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type CSSProperties,
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useReducer,
	useState,
} from 'react';

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { format, isValid } from 'date-fns';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import ClockIcon from '@atlaskit/icon/core/clock';
import {
	createLocalizationProvider,
	type LocalizationProvider,
} from '@atlaskit/locale/localization-provider';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { mergeStyles } from '@atlaskit/react-select/styles';
import CreatableSelect from '@atlaskit/select/creatable-select';
import Select from '@atlaskit/select/default';
import type {
	ActionMeta,
	GroupType,
	InputActionMeta,
	OptionType,
	SelectComponentsConfig,
	ValueType,
} from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { defaultTimes } from '../internal/default-times';
import { EmptyComponent } from '../internal/empty-component';
import { FixedLayerMenu } from '../internal/fixed-layer-menu';
import { FixedLayerMenuTopLayer } from '../internal/fixed-layer-menu-top-layer';
import parseTime from '../internal/parse-time';
import { convertTokens } from '../internal/parse-tokens';
import { PickerButtonContainer } from '../internal/picker-button-container';
import { placeholderDatetime } from '../internal/placeholder-date-time';
import { makeSingleValue } from '../internal/single-value';
import { type Appearance, type Spacing, type TimePickerBaseProps } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const defaultTimeFormat = 'h:mma';

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

const styles = cssMap({
	pickerContainer: {
		position: 'relative',
	},
});

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
const TimePicker: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TimePickerBaseProps> & React.RefAttributes<unknown>
> = forwardRef(
	(
		{
			'aria-describedby': ariaDescribedBy,
			appearance = 'default' as Appearance,
			autoFocus = false,
			clearControlLabel = 'clear timepicker',
			defaultIsOpen = false,
			defaultValue = '',
			formatDisplayLabel,
			hideIcon = false,
			id = '',
			innerProps = {},
			isDisabled = false,
			isInvalid = false,
			isRequired = false,
			isOpen: providedIsOpen,
			label = '',
			locale = 'en-US',
			name = '',
			openTimeLabel = 'Open time picker',
			onBlur: providedOnBlur = __noop,
			onChange: providedOnChange = __noop,
			onFocus: providedOnFocus = __noop,
			parseInputValue = (time: string, _timeFormat: string) => parseTime(time),
			placeholder,
			selectProps = {},
			shouldShowTimeButton = false,
			spacing = 'default' as Spacing,
			testId,
			timeFormat,
			timeIsEditable = false,
			times = defaultTimes,
			value: providedValue,
		}: TimePickerBaseProps,
		_ref,
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
		const [shouldFocusTimeInput, setShouldFocusTimeInput] = useState(false);
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

		useEffect(() => {
			if (!isOpen || !shouldFocusTimeInput) {
				return;
			}

			const innerCombobox: HTMLInputElement | undefined | null =
				containerRef?.querySelector('[role="combobox"]');
			innerCombobox?.focus();
			setShouldFocusTimeInput(false);
		}, [containerRef, isOpen, shouldFocusTimeInput]);

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
				} catch {
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

		const onTimeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			const nextIsOpen = !isOpen;
			setIsOpen(nextIsOpen);
			if (nextIsOpen) {
				otherSelectProps.onMenuOpen?.();
			} else {
				otherSelectProps.onMenuClose?.();
			}
			event.stopPropagation();
		};

		const onTimeButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (!isOpen && (event.key === ' ' || event.key === 'Enter')) {
				setShouldFocusTimeInput(true);
			}
		};

		const ICON_PADDING = 2;
		const GRID_SIZE = 8;
		const l10n: LocalizationProvider = createLocalizationProvider(locale);
		const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;
		const SelectComponent = timeIsEditable ? CreatableSelect : Select;

		const onInputChange = (inputValue: string, actionMeta: InputActionMeta) => {
			otherSelectProps.onInputChange?.(inputValue, actionMeta);

			// Keep the menu-opening behavior aligned with DatePicker: entering text
			// opens the available options, even when the optional time button disables
			// opening on focus.
			if (actionMeta.action === 'input-change') {
				setIsOpen(true);
			}
		};

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

		const valueId = useId();
		const SingleValue = makeSingleValue({ id: valueId, lang: locale });

		const selectComponents: SelectComponentsConfig<OptionType> = {
			DropdownIndicator: EmptyComponent,
			Menu: fg('platform-dst-top-layer') ? FixedLayerMenuTopLayer : FixedLayerMenu,
			SingleValue,
			...(hideIcon && { ClearIndicator: EmptyComponent }),
		};

		const renderIconContainer = Boolean(!hideIcon && value);
		const fullOpenTimeLabel = label ? `${label}, ${openTimeLabel}` : openTimeLabel;

		const isInputMotionEnabled = fg('platform-dst-motion-uplift-input');

		const mergedStyles = mergeStyles<OptionType, boolean, GroupType<OptionType>>(selectStyles, {
			control: (base) => ({
				...base,
				...(isInputMotionEnabled && !isDisabled
					? { transition: base.transition ?? token('motion.input') }
					: {}),
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
				css={styles.pickerContainer}
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
					aria-describedby={ariaDescribedBy ? `${ariaDescribedBy} ${valueId}` : valueId}
					aria-label={label || undefined}
					appearance={appearance}
					autoFocus={autoFocus}
					clearControlLabel={clearControlLabel}
					components={selectComponents}
					inputId={id}
					isClearable
					isDisabled={isDisabled}
					isRequired={isRequired}
					menuIsOpen={isOpen && !isDisabled}
					menuPlacement="auto"
					openMenuOnFocus={!shouldShowTimeButton}
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
					fixedLayerRef={containerRef}
					isInvalid={isInvalid}
					testId={testId}
					{...otherSelectProps}
					onInputChange={onInputChange}
				/>
				{shouldShowTimeButton && !isDisabled ? (
					<PickerButtonContainer hasClearIndicator={renderIconContainer}>
						<IconButton
							appearance="subtle"
							label={fullOpenTimeLabel}
							icon={(iconProps) => <ClockIcon {...iconProps} color={token('color.icon')} />}
							onClick={onTimeButtonClick}
							onKeyDown={onTimeButtonKeyDown}
							testId={testId && `${testId}--open-time-button`}
						/>
					</PickerButtonContainer>
				) : null}
			</div>
		);
	},
);

export default TimePicker;
