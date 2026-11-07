/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';
import { useDebouncedCallback } from 'use-debounce';

import { cssMap, jsx } from '@atlaskit/css';
import type { Jast } from '@atlaskit/jql-ast/query';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { JiraSearchMethod } from '../../../common/types';
import { BasicSearchInput } from '../../common/modal/basic-search-input';
import { basicSearchInputMessages } from '../../common/modal/basic-search-input/messages';
import {
	ModeSwitcher,
	type ModeSwitcherPropsOption,
} from '../../common/modal/mode-switcher/ModeSwitcher';
import { FILTER_SELECTION_DEBOUNCE_MS } from '../../common/modal/popup-select/constants';
import { type SelectOption } from '../../common/modal/popup-select/types';
import { useHydrateJqlQuery } from '../basic-filters/hooks/useHydrateJqlQuery';
import { type BasicFilterFieldType, type SelectedOptionsMap } from '../basic-filters/types';
import { default as BasicFilters } from '../basic-filters/ui/index';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { JiraJQLEditor } from '../jql-editor';
import { buildJQL } from './buildJQL';
import { modeSwitcherMessages } from './messages';

const styles = cssMap({
	inlineSearch: {
		flexGrow: 1,
		flexBasis: '240px',
		minWidth: 0,
	},
	inlineSwitcher: {
		flexShrink: 0,
	},
	basicSearchInputBoxStyles: {
		width: '100%',
	},
	basicSearchInputContainerStyles: {
		flexGrow: 1,
		flexWrap: 'wrap',
		rowGap: token('space.100'),
	},
	inputContainerStyles: {
		alignItems: 'flex-start',
		display: 'flex',
		minHeight: '72px',
	},
	modeSwitcherContainerStyles: {
		marginTop: token('space.050'),
	},
});

import type { SearchContainerProps } from './index';

export const EmbeddedJiraSearchContainer = (
	props: SearchContainerProps & { allowedOrderByKeys: string[]; defaultJql: string },
): JSX.Element => {
	const {
		defaultJql: DEFAULT_JQL_QUERY,
		allowedOrderByKeys: ALLOWED_ORDER_BY_KEYS,
		isSearching,
		parameters,
		onSearch,
		onSearchMethodChange: onSearchMethodChangeCallback,
		initialSearchMethod,
		setSearchBarJql,
		searchBarJql = DEFAULT_JQL_QUERY,
		site,
		setHasJqlSyntaxErrors,
		layout = 'modal',
		initialBasicSearchTerm = '',
		allowBasicModeReset = false,
		showBasicSearchButton = true,
		textSearchField,
	} = props;
	const { cloudId: currentCloudId } = parameters || {};

	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const [basicSearchTerm, setBasicSearchTerm] = useState(initialBasicSearchTerm);
	const [currentSearchMethod, setCurrentSearchMethod] =
		useState<JiraSearchMethod>(initialSearchMethod);
	const [cloudId, setCloudId] = useState(currentCloudId);
	const [isComplexQuery, setIsComplexQuery] = useState(false);
	const [orderKey, setOrderKey] = useState<string | undefined>();
	const [orderDirection, setOrderDirection] = useState<string | undefined>();
	const [filterSelections, setFilterSelections] = useState<SelectedOptionsMap>({});
	const basicDraft = useRef({
		jql:
			initialSearchMethod === 'basic'
				? searchBarJql
				: buildJQL({ rawSearch: initialBasicSearchTerm, textSearchField }),
		term: initialBasicSearchTerm,
		selections: {} as SelectedOptionsMap,
	});
	const advancedDraft = useRef<string>();

	const modeSwitcherOptionsMap: Record<
		JiraSearchMethod,
		ModeSwitcherPropsOption<JiraSearchMethod>
	> = useMemo(
		() => ({
			jql: { label: 'JQL', value: 'jql' },
			basic: {
				label: formatMessage(modeSwitcherMessages.basicTextSearchLabel),
				value: 'basic',
				disabled: isComplexQuery && !allowBasicModeReset,
				tooltipText:
					isComplexQuery && !allowBasicModeReset
						? formatMessage(modeSwitcherMessages.basicModeSwitchDisabledTooltipText)
						: '',
			},
		}),
		[formatMessage, isComplexQuery, allowBasicModeReset],
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
			if (allowBasicModeReset) {
				if (searchMethod === 'jql') {
					basicDraft.current = {
						jql: searchBarJql,
						term: basicSearchTerm,
						selections: filterSelections,
					};
					setSearchBarJql(advancedDraft.current ?? searchBarJql);
				} else if (isQueryTooComplex(searchBarJql)) {
					advancedDraft.current = searchBarJql;
					setSearchBarJql(basicDraft.current.jql);
					setBasicSearchTerm(basicDraft.current.term);
					setFilterSelections(basicDraft.current.selections);
				}
			}
			onSearchMethodChangeCallback(searchMethod);
			setCurrentSearchMethod(searchMethod);
		},
		[
			onSearchMethodChangeCallback,
			allowBasicModeReset,
			searchBarJql,
			basicSearchTerm,
			filterSelections,
			setSearchBarJql,
		],
	);

	const handleBasicSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const rawSearch = e.currentTarget.value;
			setBasicSearchTerm(rawSearch);
			setSearchBarJql(
				buildJQL({
					rawSearch,
					textSearchField,
					filterValues: filterSelections,
					orderDirection,
					orderKey,
				}),
			);
		},
		[setSearchBarJql, filterSelections, orderDirection, orderKey, textSearchField],
	);

	const onQueryChange = useCallback(
		(query: string, jast: Jast) => {
			setHasJqlSyntaxErrors?.(jast.errors.length > 0);
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
		[setSearchBarJql, setHasJqlSyntaxErrors],
	);

	const handleSearch = useCallback(() => {
		const isCurrentQueryComplex = isQueryTooComplex(searchBarJql);
		if (currentSearchMethod === 'basic') {
			advancedDraft.current = undefined;
		}

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
				textSearchField,
				filterValues,
				orderDirection,
				orderKey,
			});

			advancedDraft.current = undefined;
			setSearchBarJql(jqlWithFilterValues);
			const isCurrentQueryComplex = isQueryTooComplex(jqlWithFilterValues);

			onSearch(
				{
					jql: jqlWithFilterValues,
				},
				{
					searchMethod: currentSearchMethod,
					basicFilterSelections: filterValues,
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
			basicDraft.current = { jql: DEFAULT_JQL_QUERY, term: '', selections: {} };
			advancedDraft.current = undefined;
			setBasicSearchTerm('');
			setSearchBarJql(DEFAULT_JQL_QUERY);
			setIsComplexQuery(false);
			setOrderKey(undefined);
			setOrderDirection(undefined);
			setFilterSelections({});
			setCloudId(currentCloudId);
		}
	}, [currentCloudId, cloudId, setSearchBarJql]);

	const searchInput =
		currentSearchMethod === 'basic' ? (
			<Box xcss={layout === 'inline' ? styles.inlineSearch : styles.basicSearchInputBoxStyles}>
				<Flex alignItems="center" xcss={styles.basicSearchInputContainerStyles}>
					<BasicSearchInput
						isCompact={layout === 'inline'}
						isSearching={isSearching}
						onChange={handleBasicSearchChange}
						onSearch={handleSearch}
						searchTerm={basicSearchTerm}
						showSearchButton={showBasicSearchButton}
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
						isInline={layout === 'inline'}
					/>
				</Flex>

				{layout !== 'inline' && (
					<Text size="small" color="color.text.subtlest" testId="jira-search-placeholder">
						{formatMessage(basicSearchInputMessages.basicTextSearchLabel)}
					</Text>
				)}
			</Box>
		) : (
			<JiraJQLEditor
				isCompact={layout === 'inline'}
				cloudId={cloudId || ''}
				autoFocus={layout !== 'inline'}
				isSearching={isSearching}
				onChange={onQueryChange}
				onSearch={handleSearch}
				query={searchBarJql}
			/>
		);
	const modeSwitcher = (
		<ModeSwitcher
			isInline={layout === 'inline'}
			onOptionValueChange={onSearchMethodChange}
			selectedOptionValue={currentSearchMethod}
			options={modeSwitcherOptions}
		/>
	);

	if (layout === 'inline') {
		return (
			<Flex alignItems="start" gap="space.100" wrap="wrap" testId="jira-search-container">
				<Box xcss={styles.inlineSwitcher}>{modeSwitcher}</Box>
				{currentSearchMethod === 'basic' ? (
					searchInput
				) : (
					<Box xcss={styles.inlineSearch}>{searchInput}</Box>
				)}
			</Flex>
		);
	}

	return (
		<div css={styles.inputContainerStyles} data-testid="jira-search-container">
			{searchInput}
			<Box xcss={styles.modeSwitcherContainerStyles}>{modeSwitcher}</Box>
		</div>
	);
};
