import React, { Fragment, type ReactNode, useMemo } from 'react';

import { type AriaSelection, defaultAriaLiveMessages } from '../accessibility';
import { type CommonProps, type GroupBase, type OnChangeValue, type Options } from '../types';

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
	selectValue: Options<Option>;
	focusableOptions: Options<Option>;
	isFocused: boolean;
	id: string;
	isAppleDevice: boolean;
}

const LiveRegion = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: LiveRegionProps<Option, IsMulti, Group>,
) => {
	const { ariaSelection, focusableOptions, isFocused, selectValue, selectProps, id } = props;

	const {
		ariaLiveMessages,
		getOptionLabel,
		inputValue,
		isOptionDisabled,
		menuIsOpen,
		options,
		screenReaderStatus,
		isLoading,
	} = selectProps;
	const ariaLive = selectProps['aria-live'];

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
		if (menuIsOpen) {
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

			if (!label && !labels.length) {
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
	}, [ariaSelection, messages, isOptionDisabled, selectValue, getOptionLabel, menuIsOpen]);

	const ariaResults = useMemo(() => {
		let resultsMsg = '';
		if (isLoading) {
			resultsMsg = 'Loading. ';
		}
		if (menuIsOpen && options.length && !isLoading && messages.onFilter) {
			const resultsMessage = screenReaderStatus({
				count: focusableOptions.length,
			});

			resultsMsg = messages.onFilter({ inputValue, resultsMessage });
		}
		if (options && options.length === 0) {
			resultsMsg = 'No options. ';
		}

		return resultsMsg;
	}, [focusableOptions, inputValue, menuIsOpen, messages, options, screenReaderStatus, isLoading]);

	const isInitialFocus = ariaSelection?.action === 'initial-input-focus';

	const ScreenReaderText = (
		<Fragment>
			<span id="aria-selection">{ariaSelected}</span>
			<span id="aria-results">{ariaResults}</span>
		</Fragment>
	);

	return (
		<Fragment>
			{/* We use 'aria-describedby' linked to this component for the initial focus */}
			{/* action, then for all other actions we use the live region below */}
			<A11yText id={id}>{isInitialFocus && ScreenReaderText}</A11yText>
			<A11yText
				aria-live={ariaLive} // Should be undefined by default unless a specific use case requires it
				role="status"
			>
				{isFocused && !isInitialFocus && ScreenReaderText}
			</A11yText>
		</Fragment>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default LiveRegion;
