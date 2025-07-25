import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { Box, Flex, Text } from '@atlaskit/primitives/compiled';

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

const styles = cssMap({
	basicSearchInputBoxStyles: {
		width: '100%',
	},
	basicSearchInputContainerStyles: {
		flexGrow: 1,
	},
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
	const { formatMessage } = useIntl();

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

	useEffect(() => {
		const hasAccountIds = initialContributorAccountIds?.length > 0;

		if (hasAccountIds && status === 'empty') {
			hydrateUsersFromAccountIds(initialContributorAccountIds);
		}
	}, [hydrateUsersFromAccountIds, initialContributorAccountIds, status]);

	useEffect(() => {
		if (status === 'resolved') {
			setFilterSelections({
				lastModified: filterSelections.lastModified,
				editedOrCreatedBy: users,
			});
		}
	}, [users, status, filterSelections.lastModified]);

	return (
		<Box xcss={styles.basicSearchInputBoxStyles}>
			<Flex alignItems="center" xcss={styles.basicSearchInputContainerStyles}>
				<BasicSearchInput
					testId="confluence-search-datasource-modal"
					isSearching={isSearching}
					onChange={handleSearchChange}
					onSearch={onSearch}
					searchTerm={searchBarSearchString}
					ariaLabel={searchMessages.searchLabel}
					fullWidth={false}
				/>
				<BasicFilters
					cloudId={cloudId}
					selections={filterSelections}
					onChange={handleBasicFilterSelectionChange}
					isHydrating={status === 'loading'}
				/>
			</Flex>
			<Text size="small" color="color.text.subtlest" testId="confluence-search-placeholder">
				{formatMessage(searchMessages.searchLabel)}
			</Text>
		</Box>
	);
};

export default ConfluenceSearchContainer;
