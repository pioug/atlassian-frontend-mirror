import React, { Fragment, type ReactNode, useMemo, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type AriaSelection, defaultAriaLiveMessages } from '../../accessibility';
import { type CommonProps, type GroupBase, type OnChangeValue, type Options } from '../../types';

import A11yText from './internal/a11y-text';

// ==============================
// Root Container
// ==============================

interface LiveRegionProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonProps<Option, IsMulti, Group> {
	children: ReactNode;
	innerProps: { className?: string };
	// Select state variables
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	ariaSelection: AriaSelection<Option, IsMulti>;
	focusedOption: Option | null;
	focusedValue: Option | null;
	selectValue: Options<Option>;
	focusableOptions: Options<Option>;
	isFocused: boolean;
	id: string;
	isAppleDevice: boolean;
}

const LiveRegion = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: LiveRegionProps<Option, IsMulti, Group>,
) => {
	const {
		ariaSelection,
		focusedOption,
		focusedValue,
		focusableOptions,
		isFocused,
		selectValue,
		selectProps,
		id,
		isAppleDevice,
	} = props;

	const {
		ariaLiveMessages,
		getOptionLabel,
		inputValue,
		isMulti,
		isOptionDisabled,
		isSearchable,
		label,
		menuIsOpen,
		options,
		screenReaderStatus,
		tabSelectsValue,
		isLoading,
	} = selectProps;
	const ariaLabel = selectProps['aria-label'] || label;
	const ariaLive = selectProps['aria-live'];

	// for safari, we will use minimum support from aria-live region
	const isA11yImprovementEnabled = fg('design_system_select-a11y-improvement') && !isAppleDevice;

	// Update aria live message configuration when prop changes
	const messages = useMemo(
		() => ({
			...defaultAriaLiveMessages,
			...(ariaLiveMessages || {}),
		}),
		[ariaLiveMessages],
	);

	// Update aria live selected option when prop changes
	const ariaSelected = useMemo(() => {
		let message = '';
		if (isA11yImprovementEnabled && menuIsOpen) {
			// we don't need to have selected message when the menu is open
			return '';
		}
		if (ariaSelection && messages.onChange) {
			const {
				option,
				options: selectedOptions,
				removedValue,
				removedValues,
				value,
			} = ariaSelection;
			// select-option when !isMulti does not return option so we assume selected option is value
			const asOption = (val: OnChangeValue<Option, IsMulti>): Option | null =>
				!Array.isArray(val) ? (val as Option) : null;

			// If there is just one item from the action then get its label
			const selected = removedValue || option || asOption(value);
			const label = selected ? getOptionLabel(selected) : '';

			// If there are multiple items from the action then return an array of labels
			const multiSelected = selectedOptions || removedValues || undefined;
			const labels = multiSelected ? multiSelected.map(getOptionLabel) : [];

			if (isA11yImprovementEnabled && !label && !labels.length) {
				// return empty string if no labels provided
				return '';
			}

			const onChangeProps = {
				// multiSelected items are usually items that have already been selected
				// or set by the user as a default value so we assume they are not disabled
				isDisabled: selected && isOptionDisabled(selected, selectValue),
				label,
				labels,
				...ariaSelection,
			};

			message = messages.onChange(onChangeProps);
		}
		return message;
	}, [
		ariaSelection,
		messages,
		isOptionDisabled,
		selectValue,
		getOptionLabel,
		isA11yImprovementEnabled,
		menuIsOpen,
	]);

	const prevInputValue = useRef('');

	const ariaFocused = useMemo(() => {
		let focusMsg = '';
		const focused = focusedOption || focusedValue;
		const isSelected = !!(focusedOption && selectValue && selectValue.includes(focusedOption));
		if (inputValue === prevInputValue.current && isA11yImprovementEnabled) {
			// only announce focus option when searching when ff is on and the input value changed
			// for safari, we will announce for all
			return '';
		}
		if (focused && messages.onFocus) {
			const onFocusProps = {
				focused,
				label: getOptionLabel(focused),
				isDisabled: isOptionDisabled(focused, selectValue),
				isSelected,
				options: focusableOptions,
				context: focused === focusedOption ? ('menu' as const) : ('value' as const),
				selectValue,
				isMulti,
			};

			focusMsg = messages.onFocus(onFocusProps);
		}
		prevInputValue.current = inputValue;

		return focusMsg;
	}, [
		inputValue,
		focusedOption,
		focusedValue,
		getOptionLabel,
		isOptionDisabled,
		messages,
		focusableOptions,
		selectValue,
		isA11yImprovementEnabled,
		isMulti,
	]);

	const ariaResults = useMemo(() => {
		let resultsMsg = '';
		if (menuIsOpen && options.length && !isLoading && messages.onFilter) {
			const resultsMessage = screenReaderStatus({
				count: focusableOptions.length,
			});

			resultsMsg = messages.onFilter({ inputValue, resultsMessage });
		}

		return resultsMsg;
	}, [focusableOptions, inputValue, menuIsOpen, messages, options, screenReaderStatus, isLoading]);

	const isInitialFocus = ariaSelection?.action === 'initial-input-focus';

	const ariaGuidance = useMemo(() => {
		if (fg('design_system_select-a11y-improvement')) {
			// don't announce guidance at all when ff is on
			return '';
		}
		let guidanceMsg = '';
		if (messages.guidance) {
			const context = focusedValue ? 'value' : menuIsOpen ? 'menu' : 'input';
			guidanceMsg = messages.guidance({
				'aria-label': ariaLabel,
				context,
				isDisabled: focusedOption && isOptionDisabled(focusedOption, selectValue),
				isMulti,
				isSearchable,
				tabSelectsValue,
				isInitialFocus,
			});
		}
		return guidanceMsg;
	}, [
		ariaLabel,
		focusedOption,
		focusedValue,
		isMulti,
		isOptionDisabled,
		isSearchable,
		menuIsOpen,
		messages,
		selectValue,
		tabSelectsValue,
		isInitialFocus,
	]);

	const ScreenReaderText = (
		<Fragment>
			<span id="aria-selection">{ariaSelected}</span>
			<span id="aria-results">{ariaResults}</span>
			{!fg('design_system_select-a11y-improvement') && (
				<>
					<span id="aria-focused">{ariaFocused}</span>
					<span id="aria-guidance">{ariaGuidance}</span>
				</>
			)}
		</Fragment>
	);

	return (
		<Fragment>
			{/* We use 'aria-describedby' linked to this component for the initial focus */}
			{/* action, then for all other actions we use the live region below */}
			<A11yText id={id}>{isInitialFocus && ScreenReaderText}</A11yText>
			<A11yText
				aria-live={ariaLive} // Should be undefined by default unless a specific use case requires it
				aria-atomic={fg('design_system_select-a11y-improvement') ? undefined : 'false'}
				aria-relevant={fg('design_system_select-a11y-improvement') ? undefined : 'additions text'}
				role={fg('design_system_select-a11y-improvement') ? 'status' : 'log'}
			>
				{isFocused && !isInitialFocus && ScreenReaderText}
			</A11yText>
		</Fragment>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default LiveRegion;
