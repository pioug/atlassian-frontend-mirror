/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { Box, Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { JiraSearchMethod, Site } from '../../../common/types';
import { BasicSearchInput } from '../../common/modal/basic-search-input';
import { basicSearchInputMessages } from '../../common/modal/basic-search-input/messages';
import { ModeSwitcher, type ModeSwitcherPropsOption } from '../../common/modal/mode-switcher';
import { FILTER_SELECTION_DEBOUNCE_MS } from '../../common/modal/popup-select/constants';
import { type SelectOption } from '../../common/modal/popup-select/types';
import { BasicFilters } from '../basic-filters';
import { useHydrateJqlQuery } from '../basic-filters/hooks/useHydrateJqlQuery';
import { type BasicFilterFieldType, type SelectedOptionsMap } from '../basic-filters/types';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { JiraJQLEditor } from '../jql-editor';
import {
	type JiraIssueDatasourceParameters,
	type JiraIssueDatasourceParametersQuery,
} from '../types';

import { buildJQL } from './buildJQL';
import { modeSwitcherMessages } from './messages';

const styles = cssMap({
	basicSearchInputBoxStyles: {
		width: '100%',
	},
	basicSearchInputContainerStyles: {
		flexGrow: 1,
	},
	inputContainerStyles: {
		alignItems: 'flex-start',
		display: 'flex',
		minHeight: '72px',
	},
	modeSwitcherContainerStyles: {
		marginTop: token('space.050', '4px'),
	},
});

export const DEFAULT_JQL_QUERY = 'ORDER BY created DESC';
export const ALLOWED_ORDER_BY_KEYS = ['key', 'summary', 'assignee', 'status', 'created'];

export interface SearchContainerProps {
	isSearching?: boolean;
	onSearch: (
		query: JiraIssueDatasourceParametersQuery,
		{
			searchMethod,
			basicFilterSelections,
		}: {
			searchMethod: JiraSearchMethod;
			basicFilterSelections: SelectedOptionsMap;
			isQueryComplex: boolean;
		},
	) => void;
	initialSearchMethod: JiraSearchMethod;
	onSearchMethodChange: (searchMethod: JiraSearchMethod) => void;
	parameters?: JiraIssueDatasourceParameters;
	searchBarJql?: string;
	setSearchBarJql: (jql: string) => void;
	site?: Site;
}

export const JiraSearchContainer = (props: SearchContainerProps) => {
	const {
		isSearching,
		parameters,
		onSearch,
		onSearchMethodChange: onSearchMethodChangeCallback,
		initialSearchMethod,
		setSearchBarJql,
		searchBarJql = DEFAULT_JQL_QUERY,
		site,
	} = props;
	const { cloudId: currentCloudId } = parameters || {};

	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const [basicSearchTerm, setBasicSearchTerm] = useState('');
	const [currentSearchMethod, setCurrentSearchMethod] =
		useState<JiraSearchMethod>(initialSearchMethod);
	const [cloudId, setCloudId] = useState(currentCloudId);
	const [isComplexQuery, setIsComplexQuery] = useState(false);
	const [orderKey, setOrderKey] = useState<string | undefined>();
	const [orderDirection, setOrderDirection] = useState<string | undefined>();
	const [filterSelections, setFilterSelections] = useState<SelectedOptionsMap>({});

	const modeSwitcherOptionsMap: Record<
		JiraSearchMethod,
		ModeSwitcherPropsOption<JiraSearchMethod>
	> = useMemo(
		() => ({
			jql: { label: 'JQL', value: 'jql' },
			basic: {
				label: formatMessage(modeSwitcherMessages.basicTextSearchLabel),
				value: 'basic',
				disabled: isComplexQuery,
				tooltipText: isComplexQuery
					? formatMessage(modeSwitcherMessages.basicModeSwitchDisabledTooltipText)
					: '',
			},
		}),
		[formatMessage, isComplexQuery],
	);

	const modeSwitcherOptions = useMemo(
		() => [modeSwitcherOptionsMap.basic, modeSwitcherOptionsMap.jql],
		[modeSwitcherOptionsMap],
	);

	const {
		hydratedOptions,
		fetchHydratedJqlOptions,
		status: basicFilterHydrationStatus,
	} = useHydrateJqlQuery(cloudId || '', searchBarJql);
	const onSearchMethodChange = useCallback(
		(searchMethod: JiraSearchMethod) => {
			onSearchMethodChangeCallback(searchMethod);
			setCurrentSearchMethod(searchMethod);
		},
		[onSearchMethodChangeCallback],
	);

	const handleBasicSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const rawSearch = e.currentTarget.value;
			setBasicSearchTerm(rawSearch);
			setSearchBarJql(
				buildJQL({
					rawSearch,
					filterValues: filterSelections,
					orderDirection,
					orderKey,
				}),
			);
		},
		[setSearchBarJql, filterSelections, orderDirection, orderKey],
	);

	const onQueryChange = useCallback(
		(query: string) => {
			// determine if order keys have been set so they can be saved and persisted when changes occur in basic search
			const fragments =
				query
					?.split(/(^| )(order by)( |$)/i)
					.map((item) => item.trim())
					.filter(Boolean) ?? [];

			const hasOrder = fragments.at(-2)?.toLowerCase() === 'order by';
			const key = hasOrder ? fragments.at(-1)?.split(' ').at(-2) : undefined;
			const order = hasOrder ? fragments.at(-1)?.split(' ').at(-1) : undefined;

			// TODO: confirm if these are the only order keys we want to preserve - existing whiteboard logic
			if (key && ALLOWED_ORDER_BY_KEYS.includes(key)) {
				setOrderKey(key);
				setOrderDirection(order);
			}

			setSearchBarJql(query);
		},
		[setSearchBarJql],
	);

	const handleSearch = useCallback(() => {
		const isCurrentQueryComplex = isQueryTooComplex(searchBarJql);

		onSearch(
			{ jql: searchBarJql },
			{
				searchMethod: currentSearchMethod,
				basicFilterSelections: filterSelections,
				isQueryComplex: isCurrentQueryComplex,
			},
		);

		if (currentSearchMethod === 'jql') {
			fireEvent('ui.jqlEditor.searched', {
				isQueryComplex: isCurrentQueryComplex,
			});

			setIsComplexQuery(isCurrentQueryComplex);

			if (!isCurrentQueryComplex) {
				fetchHydratedJqlOptions();
			}
		}
	}, [
		currentSearchMethod,
		fetchHydratedJqlOptions,
		filterSelections,
		fireEvent,
		searchBarJql,
		onSearch,
	]);

	const [debouncedBasicFilterSelectionChange] = useDebouncedCallback(
		(filterValues: SelectedOptionsMap) => {
			const jqlWithFilterValues = buildJQL({
				rawSearch: basicSearchTerm,
				filterValues,
				orderDirection,
				orderKey,
			});

			setSearchBarJql(jqlWithFilterValues);
			const isCurrentQueryComplex = isQueryTooComplex(jqlWithFilterValues);

			onSearch(
				{
					jql: jqlWithFilterValues,
				},
				{
					searchMethod: currentSearchMethod,
					basicFilterSelections: filterSelections,
					isQueryComplex: isCurrentQueryComplex,
				},
			);
		},
		FILTER_SELECTION_DEBOUNCE_MS,
	);

	const handleBasicFilterSelectionChange = useCallback(
		(filterType: BasicFilterFieldType, options: SelectOption[]) => {
			const updatedSelection: SelectedOptionsMap = {
				...filterSelections,
				[filterType]: options,
			};

			setFilterSelections(updatedSelection);
			debouncedBasicFilterSelectionChange(updatedSelection);
		},
		[debouncedBasicFilterSelectionChange, filterSelections],
	);

	useEffect(() => {
		const isCurrentQueryComplex = isQueryTooComplex(searchBarJql);

		setIsComplexQuery(isCurrentQueryComplex);

		if (!isCurrentQueryComplex && searchBarJql !== DEFAULT_JQL_QUERY) {
			fetchHydratedJqlOptions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (basicFilterHydrationStatus === 'resolved') {
			const { basicInputTextValue, ...hydratedFilterOptions } = hydratedOptions;

			setFilterSelections(hydratedFilterOptions);
			if (basicInputTextValue) {
				setBasicSearchTerm(basicInputTextValue);
			}
		}
	}, [hydratedOptions, basicFilterHydrationStatus]);

	useEffect(() => {
		if (currentCloudId !== cloudId) {
			setBasicSearchTerm('');
			setSearchBarJql(DEFAULT_JQL_QUERY);
			setIsComplexQuery(false);
			setOrderKey(undefined);
			setOrderDirection(undefined);
			setFilterSelections({});
			setCloudId(currentCloudId);
		}
	}, [currentCloudId, cloudId, setSearchBarJql]);

	return (
		<div css={styles.inputContainerStyles} data-testid="jira-search-container">
			{currentSearchMethod === 'basic' && (
				<Box xcss={styles.basicSearchInputBoxStyles}>
					<Flex alignItems="center" xcss={styles.basicSearchInputContainerStyles}>
						<BasicSearchInput
							isSearching={isSearching}
							onChange={handleBasicSearchChange}
							onSearch={handleSearch}
							searchTerm={basicSearchTerm}
							ariaLabel={basicSearchInputMessages.basicTextSearchLabel}
							testId="jira-datasource-modal"
							fullWidth={false}
						/>
						<BasicFilters
							jql={searchBarJql}
							site={site}
							onChange={handleBasicFilterSelectionChange}
							selections={filterSelections}
							isJQLHydrating={basicFilterHydrationStatus === 'loading'}
						/>
					</Flex>

					{currentSearchMethod === 'basic' && (
						<Text size="small" color="color.text.subtlest" testId="jira-search-placeholder">
							{formatMessage(basicSearchInputMessages.basicTextSearchLabel)}
						</Text>
					)}
				</Box>
			)}
			{currentSearchMethod === 'jql' && (
				<JiraJQLEditor
					cloudId={cloudId || ''}
					isSearching={isSearching}
					onChange={onQueryChange}
					onSearch={handleSearch}
					query={searchBarJql}
				/>
			)}

			<Box xcss={styles.modeSwitcherContainerStyles}>
				<ModeSwitcher
					onOptionValueChange={onSearchMethodChange}
					selectedOptionValue={currentSearchMethod}
					options={modeSwitcherOptions}
				/>
			</Box>
		</div>
	);
};
