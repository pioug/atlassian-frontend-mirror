/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex, xcss } from '@atlaskit/primitives';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { JiraSearchMethod, Site } from '../../../common/types';
import { BasicSearchInput } from '../../common/modal/basic-search-input';
import { basicSearchInputMessages } from '../../common/modal/basic-search-input/messages';
import { FILTER_SELECTION_DEBOUNCE_MS } from '../../common/modal/popup-select/constants';
import { type SelectOption } from '../../common/modal/popup-select/types';
import { BasicFilters } from '../basic-filters';
import { useHydrateJqlQuery } from '../basic-filters/hooks/useHydrateJqlQuery';
import { type BasicFilterFieldType, type SelectedOptionsMap } from '../basic-filters/types';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { JiraJQLEditor } from '../jql-editor';
import { ModeSwitcher, type ModeSwitcherPropsOption } from '../mode-switcher';
import {
	type JiraIssueDatasourceParameters,
	type JiraIssueDatasourceParametersQuery,
} from '../types';

import { buildJQL } from './buildJQL';
import { modeSwitcherMessages } from './messages';

const inputContainerStyles = css({
	alignItems: 'baseline',
	display: 'flex',
	minHeight: '72px',
});

const basicSearchInputContainerStyles = xcss({
	flexGrow: 1,
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

	const showBasicFilters = useMemo(() => {
		if (getBooleanFF('platform.linking-platform.datasource.show-jlol-basic-filters')) {
			return true;
		}
		return false;
	}, []);

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
		() =>
			showBasicFilters
				? [modeSwitcherOptionsMap.basic, modeSwitcherOptionsMap.jql]
				: [modeSwitcherOptionsMap.jql, modeSwitcherOptionsMap.basic],
		[modeSwitcherOptionsMap, showBasicFilters],
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

			if (showBasicFilters && !isCurrentQueryComplex) {
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
		showBasicFilters,
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

		if (showBasicFilters && !isCurrentQueryComplex && searchBarJql !== DEFAULT_JQL_QUERY) {
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
		<div css={inputContainerStyles} data-testid="jira-search-container">
			{currentSearchMethod === 'basic' && (
				<Flex alignItems="center" xcss={basicSearchInputContainerStyles}>
					<BasicSearchInput
						isSearching={isSearching}
						onChange={handleBasicSearchChange}
						onSearch={handleSearch}
						searchTerm={basicSearchTerm}
						placeholder={basicSearchInputMessages.basicTextSearchLabel}
						testId="jira-datasource-modal"
						fullWidth={!showBasicFilters}
					/>
					{showBasicFilters && (
						<BasicFilters
							jql={searchBarJql}
							site={site}
							onChange={handleBasicFilterSelectionChange}
							selections={filterSelections}
							isJQLHydrating={basicFilterHydrationStatus === 'loading'}
						/>
					)}
				</Flex>
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
			<ModeSwitcher
				onOptionValueChange={onSearchMethodChange}
				selectedOptionValue={currentSearchMethod}
				options={modeSwitcherOptions}
			/>
		</div>
	);
};
