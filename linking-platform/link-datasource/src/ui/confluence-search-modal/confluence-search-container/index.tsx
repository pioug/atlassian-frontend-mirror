import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex, xcss } from '@atlaskit/primitives';

import { BasicSearchInput } from '../../common/modal/basic-search-input';
import { FILTER_SELECTION_DEBOUNCE_MS } from '../../common/modal/popup-select/constants';
import { type SelectOption } from '../../common/modal/popup-select/types';
import BasicFilters from '../basic-filters';
import { useBasicFilterHydration } from '../basic-filters/hooks/useBasicFilterHydration';
import { CLOLBasicFilters, type SelectedOptionsMap } from '../basic-filters/types';
import { type ConfluenceSearchDatasourceParameters } from '../types';

import { searchMessages } from './messages';

interface Props {
	parameters: ConfluenceSearchDatasourceParameters;
	isSearching: boolean;
	onSearch: (searchTerm: string, filters?: SelectedOptionsMap) => void;
}

const basicSearchInputContainerStyles = xcss({
	flexGrow: 1,
});

const ConfluenceSearchContainer = ({
	parameters: {
		cloudId,
		searchString: initialSearchValue,
		lastModified,
		lastModifiedFrom,
		lastModifiedTo,
		contributorAccountIds,
	},
	isSearching,
	onSearch,
}: Props) => {
	const {
		hydrateUsersFromAccountIds,
		users,
		status,
		reset: resetHydrationHook,
	} = useBasicFilterHydration();
	const currentCloudId = useRef(cloudId);
	const [initialContributorAccountIds, setInitialContributorAccountIds] = useState(
		contributorAccountIds ?? [],
	);
	const [searchBarSearchString, setSearchBarSearchString] = useState(initialSearchValue ?? '');
	const [filterSelections, setFilterSelections] = useState<SelectedOptionsMap>(() =>
		lastModified
			? {
					lastModified: [
						{
							optionType: 'dateRange',
							label: lastModified,
							value: lastModified,
							from: lastModifiedFrom,
							to: lastModifiedTo,
						},
					],
				}
			: {},
	);

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const rawSearch = e.currentTarget.value;
		setSearchBarSearchString(rawSearch);
	}, []);

	const [debouncedBasicFilterSelectionChange] = useDebouncedCallback(
		(filterValues: SelectedOptionsMap) => {
			onSearch(searchBarSearchString, filterValues);
		},
		FILTER_SELECTION_DEBOUNCE_MS,
	);

	const handleBasicFilterSelectionChange = useCallback(
		(filterType: CLOLBasicFilters, options: SelectOption | SelectOption[]) => {
			const updatedSelection: SelectedOptionsMap = {
				...filterSelections,
				[filterType]: Array.isArray(options) ? options : [options],
			};

			setFilterSelections(updatedSelection);

			if (filterType === CLOLBasicFilters.lastModified) {
				onSearch(searchBarSearchString, updatedSelection);
			} else {
				debouncedBasicFilterSelectionChange(updatedSelection);
			}
		},
		[debouncedBasicFilterSelectionChange, filterSelections, onSearch, searchBarSearchString],
	);

	// TODO: further refactoring in EDM-9573
	// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6827913
	useEffect(() => {
		if (currentCloudId.current !== cloudId) {
			setInitialContributorAccountIds([]);
			resetHydrationHook();
			setSearchBarSearchString('');
			setFilterSelections({});
			currentCloudId.current = cloudId;
		}
	}, [cloudId, resetHydrationHook]);

	const showBasicFilters = useMemo(() => {
		if (getBooleanFF('platform.linking-platform.datasource.show-clol-basic-filters')) {
			return true;
		}
		return false;
	}, []);

	useEffect(() => {
		const hasAccountIds = initialContributorAccountIds?.length > 0;

		if (hasAccountIds && status === 'empty' && showBasicFilters) {
			hydrateUsersFromAccountIds(initialContributorAccountIds);
		}
	}, [hydrateUsersFromAccountIds, initialContributorAccountIds, showBasicFilters, status]);

	useEffect(() => {
		if (status === 'resolved') {
			setFilterSelections({
				lastModified: filterSelections.lastModified,
				editedOrCreatedBy: users,
			});
		}
	}, [users, status, filterSelections.lastModified]);

	return (
		<Flex alignItems="center" xcss={basicSearchInputContainerStyles}>
			<BasicSearchInput
				testId="confluence-search-datasource-modal"
				isSearching={isSearching}
				onChange={handleSearchChange}
				onSearch={onSearch}
				searchTerm={searchBarSearchString}
				placeholder={searchMessages.searchLabel}
				fullWidth={!showBasicFilters}
			/>
			{showBasicFilters && (
				<BasicFilters
					cloudId={cloudId}
					selections={filterSelections}
					onChange={handleBasicFilterSelectionChange}
					isHydrating={status === 'loading'}
				/>
			)}
		</Flex>
	);
};

export default ConfluenceSearchContainer;
