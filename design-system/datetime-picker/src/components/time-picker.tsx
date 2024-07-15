import React, { type CSSProperties } from 'react';

// eslint-disable-next-line no-restricted-imports
import { format, isValid } from 'date-fns';
import pick from 'lodash/pick';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import Select, {
	type ActionMeta,
	CreatableSelect,
	mergeStyles,
	type OptionType,
	type SelectComponentsConfig,
	type ValueType,
} from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

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

type TimePickerProps = typeof timePickerDefaultProps & TimePickerBaseProps;

interface State {
	isOpen: boolean;
	/**
	 * When being cleared from the icon the TimePicker is blurred.
	 * This variable defines whether the default onMenuOpen or onMenuClose
	 * events should behave as normal
	 */
	clearingFromIcon: boolean;
	value: string;
	isFocused: boolean;
}

const menuStyles: CSSProperties = {
	/* Need to remove default absolute positioning as that causes issues with position fixed */
	position: 'static',
	/* Need to add overflow to the element with max-height, otherwise causes overflow issues in IE11 */
	overflowY: 'auto',
	/* React-Popper has already offset the menu so we need to reset the margin, otherwise the offset value is doubled */
	margin: 0,
};

const timePickerDefaultProps = {
	appearance: 'default' as Appearance,
	autoFocus: false,
	defaultIsOpen: false,
	defaultValue: '',
	hideIcon: false,
	id: '',
	innerProps: {},
	isDisabled: false,
	isInvalid: false,
	label: '',
	name: '',
	// These disables are here for proper typing when used as defaults. They
	// should *not* use the `noop` function.
	/* eslint-disable @repo/internal/react/use-noop */
	onBlur: (_event: React.FocusEvent<HTMLInputElement>) => {},
	onChange: (_value: string) => {},
	onFocus: (_event: React.FocusEvent<HTMLInputElement>) => {},
	/* eslint-enable @repo/internal/react/use-noop */
	parseInputValue: (time: string, _timeFormat: string) => parseTime(time),
	selectProps: {},
	spacing: 'default' as Spacing,
	times: defaultTimes,
	timeIsEditable: false,
	locale: 'en-US',
	// Not including a default prop for value as it will
	// Make the component a controlled component
};
class TimePickerComponent extends React.Component<TimePickerProps, State> {
	containerRef: HTMLElement | null = null;

	static defaultProps = timePickerDefaultProps;

	state = {
		isOpen: this.props.defaultIsOpen,
		clearingFromIcon: false,
		value: this.props.defaultValue,
		isFocused: false,
	};

	// All state needs to be accessed via this function so that the state is mapped from props
	// correctly to allow controlled/uncontrolled usage.
	getSafeState = (): State => {
		return {
			...this.state,
			...pick(this.props, ['value', 'isOpen']),
		};
	};

	onChange = (newValue: ValueType<OptionType> | string, action?: ActionMeta<OptionType>): void => {
		const rawValue = newValue ? (newValue as OptionType).value || newValue : '';
		const value = rawValue.toString();
		let changedState: {} = { value };

		if (action && action.action === 'clear') {
			changedState = {
				...changedState,
				clearingFromIcon: true,
			};
		}

		this.setState(changedState);
		this.props.onChange(value);
	};

	/**
	 * Only allow custom times if timeIsEditable prop is true
	 */
	onCreateOption = (inputValue: string): void => {
		if (this.props.timeIsEditable) {
			const { parseInputValue, timeFormat } = this.props;

			let sanitizedInput;
			try {
				sanitizedInput = parseInputValue(inputValue, timeFormat || defaultTimeFormat) as Date;
			} catch (e) {
				return; // do nothing, the main validation should happen in the form
			}

			const includesSeconds = !!(timeFormat && /[:.]?(s|ss)/.test(timeFormat));

			const formatFormat = includesSeconds ? 'HH:mm:ss' : 'HH:mm';
			const formattedValue = format(sanitizedInput, formatFormat) || '';

			this.setState({ value: formattedValue });
			this.props.onChange(formattedValue);
		} else {
			this.onChange(inputValue);
		}
	};

	onMenuOpen = () => {
		// Don't open menu after the user has clicked clear
		if (this.getSafeState().clearingFromIcon) {
			this.setState({ clearingFromIcon: false });
		} else {
			this.setState({ isOpen: true });
		}
	};

	onMenuClose = () => {
		// Don't close menu after the user has clicked clear
		if (this.getSafeState().clearingFromIcon) {
			this.setState({ clearingFromIcon: false });
		} else {
			this.setState({ isOpen: false });
		}
	};

	setContainerRef = (ref: HTMLElement | null) => {
		const oldRef = this.containerRef;
		this.containerRef = ref;
		// Cause a re-render if we're getting the container ref for the first time
		// as the layered menu requires it for dimension calculation
		if (oldRef == null && ref != null) {
			this.forceUpdate();
		}
	};

	onBlur = (event: React.FocusEvent<HTMLElement>) => {
		this.setState({ isFocused: false });
		this.props.onBlur(event);
	};

	onFocus = (event: React.FocusEvent<HTMLElement>) => {
		this.setState({ isFocused: true });
		this.props.onFocus(event);
	};

	onSelectKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const { key } = event;
		const keyPressed = key.toLowerCase();
		if (
			this.getSafeState().clearingFromIcon &&
			(keyPressed === 'backspace' || keyPressed === 'delete')
		) {
			// If being cleared from keyboard, don't change behaviour
			this.setState({ clearingFromIcon: false });
		}
	};

	render() {
		const {
			appearance,
			autoFocus,
			formatDisplayLabel,
			hideIcon,
			id,
			innerProps,
			isDisabled,
			label,
			locale,
			name,
			placeholder,
			selectProps,
			spacing,
			testId,
			isInvalid,
			timeIsEditable,
			timeFormat,
			times,
		} = this.props;
		const ICON_PADDING = 2;

		const l10n: LocalizationProvider = createLocalizationProvider(locale);

		const { value = '', isOpen } = this.getSafeState();

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

		const labelAndValue = value && {
			label: formatTime(value),
			value,
		};

		const SingleValue = makeSingleValue({ lang: this.props.locale });

		const selectComponents: SelectComponentsConfig<OptionType> = {
			DropdownIndicator: EmptyComponent,
			Menu: FixedLayerMenu,
			SingleValue,
			...(hideIcon && { ClearIndicator: EmptyComponent }),
		};

		const renderIconContainer = Boolean(!hideIcon && value);

		const mergedStyles = mergeStyles(selectStyles, {
			control: (base) => ({
				...base,
			}),
			menu: (base: any) => ({
				...base,
				...menuStyles,
				// Fixed positioned elements no longer inherit width from their parent, so we must explicitly set the
				// menu width to the width of our container
				width: this.containerRef ? this.containerRef.getBoundingClientRect().width : 'auto',
			}),
			indicatorsContainer: (base) => ({
				...base,
				paddingLeft: renderIconContainer ? ICON_PADDING : 0,
				paddingRight: renderIconContainer ? gridSize() - ICON_PADDING : 0,
			}),
		});

		return (
			<div
				{...innerProps}
				ref={this.setContainerRef}
				data-testid={testId && `${testId}--container`}
			>
				<input
					name={name}
					type="hidden"
					value={value}
					data-testid={testId && `${testId}--input`}
					onKeyDown={this.onSelectKeyDown}
				/>
				<SelectComponent
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
					onBlur={this.onBlur}
					onCreateOption={this.onCreateOption}
					onChange={this.onChange}
					options={options}
					onFocus={this.onFocus}
					onMenuOpen={this.onMenuOpen}
					onMenuClose={this.onMenuClose}
					placeholder={placeholder || l10n.formatTime(placeholderDatetime)}
					styles={mergedStyles}
					value={labelAndValue}
					spacing={spacing}
					// @ts-ignore caused by prop not part of @atlaskit/select
					fixedLayerRef={this.containerRef}
					isInvalid={isInvalid}
					testId={testId}
					{...otherSelectProps}
				/>
			</div>
		);
	}
}

export { TimePickerComponent as TimePickerWithoutAnalytics };

/**
 * __Time picker__
 *
 * A time picker allows the user to select a specific time.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/time-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/time-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/time-picker/usage)
 */
const TimePicker = withAnalyticsContext({
	componentName: 'timePicker',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onChange: createAndFireEvent('atlaskit')({
			action: 'selectedTime',
			actionSubject: 'timePicker',

			attributes: {
				componentName: 'timePicker',
				packageName,
				packageVersion,
			},
		}),
	})(TimePickerComponent),
);

export default TimePicker;
