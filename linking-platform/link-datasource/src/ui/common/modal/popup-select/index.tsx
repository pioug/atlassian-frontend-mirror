import React, { useCallback, useEffect, useRef, useState } from 'react';

import isEqual from 'lodash/isEqual';
import { useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	CheckboxOption,
	type InputActionMeta,
	PopupSelect,
	type ValueType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';

import { CheckboxOptionVisualRefreshSllv } from './checkbox-option-visual-refresh-sllv';
import CustomControl from './control';
import CustomDropdownIndicator from './dropdownIndicator';
import PopupFooter from './footer';
import formatOptionLabel from './formatOptionLabel';
import CustomMenuList, { type CustomMenuListProps } from './menu-list';
import { asyncPopupSelectMessages } from './messages';
import PopupTrigger from './trigger';
import { type SelectOption } from './types';

// Needed to disable filtering from react-select
const noFilterOptions = () => true;

export interface FilterPopupSelectProps {
	buttonLabel: string;
	/**
	 * This attribute is only consumed and used when the fg
	 * `platform-linking-visual-refresh-sllv` is enabled
	 */
	searchPlaceholder?: string;
	totalCount?: number;
	filterName: string;
	isDisabled: boolean;
	showLoading: boolean;
	showHydrating: boolean;
	shouldShowFooter: boolean;
	status: 'empty' | 'loading' | 'resolved' | 'rejected' | 'loadingMore';
	menuListProps: CustomMenuListProps;
	options: ValueType<SelectOption, true>;
	selectedOptions: ValueType<SelectOption, true>;
	onSelectionChange: (newValue: ValueType<SelectOption, true>) => void;
	onInputChange: (newValue: string, actionMeta: InputActionMeta) => void;
	onMenuOpen?: () => void;
	onMenuClose?: () => void;
}

export const FilterPopupSelect = ({
	filterName,
	totalCount = 0,
	status,
	buttonLabel,
	searchPlaceholder,
	showLoading = false,
	isDisabled = false,
	showHydrating = false,
	shouldShowFooter = true,
	menuListProps,
	options,
	selectedOptions,
	onSelectionChange,
	onInputChange,
	onMenuClose,
	onMenuOpen,
}: FilterPopupSelectProps) => {
	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();
	const [searchTerm, setSearchTerm] = useState('');
	const [sortedOptions, setSortedOptions] = useState<readonly SelectOption[]>([]);
	const sortPaginatedResults = useRef(false); // this is to track pagination for sorting purpose

	const sortOptionsOnPopupOpen = useCallback(() => {
		if (selectedOptions.length === 0) {
			return setSortedOptions(options);
		}

		const nonSelectedOptions = options.filter(
			(option) => !selectedOptions.find((selectedOption) => selectedOption.value === option.value),
		);

		const newOptions = [...selectedOptions, ...nonSelectedOptions];

		if (!isEqual(newOptions, sortedOptions)) {
			setSortedOptions(newOptions);
		}
	}, [selectedOptions, options, sortedOptions]);

	const sortOptionsOnResolve = useCallback(() => {
		// when the user is searching, we want the search result to be displayed as it is, and the select component will take care of marking the selected items
		if (searchTerm) {
			sortPaginatedResults.current = false; // set to false to indicate pagination resolve action is completed from the sorting perspective
			return setSortedOptions(options);
		}

		// sortedOptions is empty initially, this will take care of setting the initial value and bring the selected items to the top
		if (sortedOptions.length === 0) {
			return sortOptionsOnPopupOpen();
		}

		// this block handles the pagination, where on pagination, we will just append newOptions to the current list
		if (sortPaginatedResults.current) {
			const newOptions = options.filter(
				(option) => !sortedOptions.find((sortedOption) => sortedOption.value === option.value),
			);
			if (newOptions.length > 0) {
				setSortedOptions([...sortedOptions, ...newOptions]);
			}

			sortPaginatedResults.current = false; // set to false to indicate pagination resolve action is completed from the sorting perspective
			return;
		}

		sortPaginatedResults.current = false; // set to false to indicate pagination resolve action is completed from the sorting perspective
		sortOptionsOnPopupOpen();
	}, [options, searchTerm, sortOptionsOnPopupOpen, sortedOptions]);

	const handleMenuOpen = useCallback(() => {
		if (status === 'resolved') {
			sortOptionsOnPopupOpen();
		}

		fireEvent('ui.dropdown.opened.basicSearchDropdown', {
			filterName,
			selectionCount: selectedOptions.length,
		});

		onMenuOpen?.();
	}, [filterName, fireEvent, onMenuOpen, selectedOptions.length, sortOptionsOnPopupOpen, status]);

	const handleMenuClose = useCallback(() => {
		/**
		 * Clearing the search is to ensure that the sortOptionsOnPopupOpen logic does not mess up.
		 * Without this, when the user opens, sortOptionsOnPopupOpen will inject the selected options to the list and the list count and values will be off
		 */
		if (searchTerm) {
			setSearchTerm('');
			onInputChange('', {
				action: 'input-change',
				prevInputValue: searchTerm,
			});
		}

		onMenuClose?.();

		fireEvent('ui.dropdown.closed.basicSearchDropdown', {
			filterName,
			selectionCount: selectedOptions.length,
		});
	}, [filterName, fireEvent, onInputChange, onMenuClose, searchTerm, selectedOptions.length]);

	const handleInputChange = useCallback(
		async (newSearchTerm: string, actionMeta: InputActionMeta) => {
			if (actionMeta.action === 'input-change' && newSearchTerm !== searchTerm) {
				setSearchTerm(newSearchTerm);
				onInputChange(newSearchTerm, actionMeta);
			}
		},
		[onInputChange, searchTerm],
	);

	useEffect(() => {
		if (status === 'resolved') {
			sortOptionsOnResolve();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]); // we only want the sortOptionsOnResolve to run when there is a status change

	useEffect(() => {
		if (status === 'loadingMore') {
			sortPaginatedResults.current = true;
		}
	}, [status]);

	return (
		<PopupSelect<SelectOption, true>
			isMulti
			maxMenuWidth={300}
			minMenuWidth={300}
			testId={`${filterName}-popup-select`}
			inputId={`${filterName}-popup-select--input`}
			/*
        this threshold controls the display of the search control (input field for search)
        if this threshold is less than 0, when typing a search string that returns no results it will not remove the search control
        if this threshold is 0 or higher, it will remove the search control when there are no results, the user will be unable to clear the search to see more results
      */
			searchThreshold={-1}
			inputValue={searchTerm}
			closeMenuOnSelect={false}
			shouldCloseMenuOnTab={false}
			hideSelectedOptions={false}
			isLoading={showLoading}
			placeholder={
				searchPlaceholder && fg('platform-linking-visual-refresh-sllv')
					? searchPlaceholder
					: formatMessage(asyncPopupSelectMessages.selectPlaceholder)
			}
			// @ts-ignore - https://product-fabric.atlassian.net/browse/DSP-21000
			menuListProps={menuListProps}
			components={{
				Option: fg('platform-linking-visual-refresh-sllv')
					? CheckboxOptionVisualRefreshSllv
					: CheckboxOption,
				Control: CustomControl,
				MenuList: CustomMenuList,
				DropdownIndicator: CustomDropdownIndicator,
				LoadingIndicator: undefined, // disables the three ... indicator in the searchbox when picker is loading
			}}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			styles={
				fg('platform-linking-visual-refresh-sllv')
					? {
							container: (base) => ({
								...base,
								paddingTop: token('space.075'),
								paddingBottom: 0,
							}),
							menuList: (base) => ({
								...base,
								paddingTop: token('space.050'),
								paddingBottom: 0,
							}),
						}
					: undefined
			}
			options={sortedOptions}
			value={selectedOptions}
			filterOption={noFilterOptions}
			formatOptionLabel={formatOptionLabel}
			onChange={onSelectionChange}
			onInputChange={handleInputChange}
			onOpen={handleMenuOpen}
			onClose={handleMenuClose}
			target={({ isOpen, ...triggerProps }) => (
				<PopupTrigger
					{...triggerProps}
					label={buttonLabel}
					selectedOptions={selectedOptions}
					isSelected={isOpen}
					isDisabled={isDisabled}
					isLoading={showHydrating}
					testId={filterName}
				/>
			)}
			footer={
				shouldShowFooter && (
					<PopupFooter
						currentDisplayCount={options.length}
						totalCount={totalCount}
						filterName={filterName}
					/>
				)
			}
		/>
	);
};
