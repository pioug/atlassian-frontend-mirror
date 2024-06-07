import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { type ValueType } from '@atlaskit/select';

import { FilterPopupSelect } from '../../../../common/modal/popup-select';
import { SEARCH_DEBOUNCE_MS } from '../../../../common/modal/popup-select/constants';
import { type SelectOption } from '../../../../common/modal/popup-select/types';
import { useCurrentUserInfo } from '../../hooks/useCurrentUserInfo';
import useRecommendation from '../../hooks/useRecommendation';
import { CLOLBasicFilters } from '../../types';

import { editedOrCreatedByMessage } from './messages';

interface EditedOrCreatedByFilterProps {
	cloudId?: string;
	selection: SelectOption[];
	isHydrating?: boolean;
	onSelectionChange: (filterType: CLOLBasicFilters, selection: SelectOption[]) => void;
}

const filterName = `clol-basic-filter-${CLOLBasicFilters.editedOrCreatedBy}`;

const EditedOrCreatedByFilter = ({
	cloudId,
	onSelectionChange,
	selection = [],
	isHydrating = false,
}: EditedOrCreatedByFilterProps) => {
	const { user } = useCurrentUserInfo();
	const { formatMessage } = useIntl();
	const {
		status,
		filterOptions,
		fetchFilterOptions,
		errors,
		reset: resetHook,
	} = useRecommendation();
	const currentSiteCloudId = useRef<string>(cloudId || '');

	const [searchTerm, setSearchTerm] = useState('');

	const [handleDebouncedFetchFilterOptions] = useDebouncedCallback((searchTerm: string) => {
		if (cloudId && user?.accountId) {
			fetchFilterOptions({
				searchTerm,
				cloudId,
				userId: user.accountId,
			});
		}
	}, SEARCH_DEBOUNCE_MS);

	const handleInputChange = useCallback(
		async (newSearchTerm: string) => {
			setSearchTerm(newSearchTerm);
			handleDebouncedFetchFilterOptions(newSearchTerm);
		},
		[handleDebouncedFetchFilterOptions],
	);

	const handleOptionSelection = useCallback(
		(newValue: ValueType<SelectOption, true>) => {
			onSelectionChange(CLOLBasicFilters.editedOrCreatedBy, newValue as SelectOption[]);
		},
		[onSelectionChange],
	);

	const handleMenuOpen = useCallback(() => {
		if ((status === 'empty' || status === 'rejected') && cloudId && user?.accountId) {
			// if user searches and gets status as rejected, we want the dropdown to try load the request with searchString when the user reopens the dropdown
			fetchFilterOptions({
				cloudId,
				userId: user.accountId,
				searchTerm,
			});
		}
	}, [fetchFilterOptions, status, cloudId, user?.accountId, searchTerm]);

	const filterOptionsLength = filterOptions.length;
	const isError = status === 'rejected';
	const isLoading = status === 'loading' || status === 'empty';
	const isEmpty = status === 'resolved' && filterOptionsLength === 0;
	const isDisabled = !cloudId || !user?.accountId;

	useEffect(() => {
		if (cloudId && currentSiteCloudId.current !== cloudId) {
			currentSiteCloudId.current = cloudId;
			if (status === 'resolved') {
				resetHook();
			}
		}
	}, [cloudId, resetHook, status]);

	return (
		<FilterPopupSelect
			buttonLabel={formatMessage(editedOrCreatedByMessage.buttonLabel)}
			filterName={filterName}
			isDisabled={isDisabled}
			options={filterOptions}
			showLoading={isLoading}
			selectedOptions={selection}
			onSelectionChange={handleOptionSelection}
			onInputChange={handleInputChange}
			showHydrating={isHydrating}
			shouldShowFooter={false}
			status={status}
			onMenuOpen={handleMenuOpen}
			menuListProps={{
				filterName: filterName,
				errors,
				isLoading,
				isError,
				isEmpty,
			}}
		/>
	);
};

export default EditedOrCreatedByFilter;
