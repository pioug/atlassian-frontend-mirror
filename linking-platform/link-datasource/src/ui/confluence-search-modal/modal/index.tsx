/** @jsx jsx */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { type UIAnalyticsEvent, withAnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { type InlineCardAdf } from '@atlaskit/linking-common/types';
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

import { EVENT_CHANNEL, useDatasourceAnalyticsEvents } from '../../../analytics';
import { componentMetadata } from '../../../analytics/constants';
import type {
	AnalyticsContextAttributesType,
	AnalyticsContextType,
	ComponentMetaDataType,
} from '../../../analytics/generated/analytics.types';
import {
	DatasourceAction,
	DatasourceDisplay,
	DatasourceSearchMethod,
} from '../../../analytics/types';
import { type DisplayViewModes, type Site } from '../../../common/types';
import { buildDatasourceAdf } from '../../../common/utils/adf';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { DatasourceExperienceIdProvider } from '../../../contexts/datasource-experience-id';
import { UserInteractionsProvider, useUserInteractions } from '../../../contexts/user-interactions';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { useAvailableSites } from '../../../services/useAvailableSites';
import { AccessRequired } from '../../common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoInstancesView } from '../../common/error-state/no-instances';
import { NoResults } from '../../common/error-state/no-results';
import { InitialStateView } from '../../common/initial-state-view';
import { CancelButton } from '../../common/modal/cancel-button';
import { ContentContainer } from '../../common/modal/content-container';
import { SmartCardPlaceholder, SmartLink } from '../../common/modal/count-view-smart-link';
import { DatasourceModal } from '../../common/modal/datasource-modal';
import { DisplayViewDropDown } from '../../common/modal/display-view-dropdown/display-view-drop-down';
import TableSearchCount from '../../common/modal/search-count';
import { SiteSelector } from '../../common/modal/site-selector';
import { EmptyState, IssueLikeDataTableView } from '../../issue-like-table';
import { useColumnResize } from '../../issue-like-table/use-column-resize';
import { useColumnWrapping } from '../../issue-like-table/use-column-wrapping';
import { getColumnAction } from '../../issue-like-table/utils';
import { type SelectedOptionsMap } from '../basic-filters/types';
import ConfluenceSearchContainer from '../confluence-search-container';
import {
	type ConfluenceSearchConfigModalProps,
	type ConfluenceSearchDatasourceParameters,
} from '../types';

import { ConfluenceSearchInitialStateSVG } from './confluence-search-initial-state-svg';
import { confluenceSearchModalMessages } from './messages';

const inputContainerStyles = xcss({
	alignItems: 'baseline',
	display: 'flex',
	minHeight: '72px',
});

export const PlainConfluenceSearchConfigModal = (props: ConfluenceSearchConfigModalProps) => {
	const {
		datasourceId,
		columnCustomSizes: initialColumnCustomSizes,
		wrappedColumnKeys: initialWrappedColumnKeys,
		onCancel,
		onInsert,
		viewMode = 'table',
		parameters: initialParameters,
		url: urlBeingEdited,
		visibleColumnKeys: initialVisibleColumnKeys,
		disableDisplayDropdown = false,
		overrideParameters,
	} = props;
	const [currentViewMode, setCurrentViewMode] = useState<DisplayViewModes>(viewMode);
	const [cloudId, setCloudId] = useState(initialParameters?.cloudId);
	const { availableSites, selectedSite: selectedConfluenceSite } = useAvailableSites(
		'confluence',
		cloudId,
	);
	const [searchString, setSearchString] = useState<string | undefined>(
		initialParameters?.searchString,
	);
	const [visibleColumnKeys, setVisibleColumnKeys] = useState(initialVisibleColumnKeys);
	const [contributorAccountIds, setContributorAccountIds] = useState<string[]>(
		initialParameters?.contributorAccountIds || [],
	);
	const [lastModified, setLastModified] = useState(
		initialParameters?.lastModified
			? {
					value: initialParameters?.lastModified,
					from: initialParameters?.lastModifiedFrom,
					to: initialParameters?.lastModifiedTo,
				}
			: undefined,
	);

	// analytics related parameters
	const searchCount = useRef(0);
	const userInteractions = useUserInteractions();
	const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);

	const parameters = useMemo(
		() => ({
			...initialParameters,
			cloudId: cloudId || '',
			searchString,
			lastModified: lastModified?.value,
			lastModifiedFrom: lastModified?.from,
			lastModifiedTo: lastModified?.to,
			contributorAccountIds: contributorAccountIds?.length > 0 ? contributorAccountIds : undefined,
		}),
		[initialParameters, cloudId, searchString, lastModified, contributorAccountIds],
	);

	const isParametersSet = useMemo(
		() => !!cloudId && Object.values(parameters ?? {}).filter((v) => v !== undefined).length > 1,
		[cloudId, parameters],
	);

	const parametersToSend = useMemo(() => {
		if (!isParametersSet) {
			return undefined;
		}
		return { ...parameters, ...(overrideParameters ?? {}) };
	}, [parameters, overrideParameters, isParametersSet]);

	const {
		reset,
		status,
		onNextPage,
		responseItems,
		hasNextPage,
		columns,
		defaultVisibleColumnKeys,
		loadDatasourceDetails,
		totalCount,
		extensionKey = null,
		destinationObjectTypes,
	} = useDatasourceTableState({
		datasourceId,
		parameters: parametersToSend,
		fieldKeys: visibleColumnKeys,
	});

	const { fireEvent } = useDatasourceAnalyticsEvents();

	const hasNoConfluenceSites = availableSites && availableSites.length === 0;

	useEffect(() => {
		if (availableSites) {
			fireEvent('ui.modal.ready.datasource', {
				instancesCount: availableSites.length,
				schemasCount: null,
			});
		}
	}, [fireEvent, availableSites]);

	// TODO: further refactoring in EDM-9573
	// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828283
	useEffect(() => {
		if (selectedConfluenceSite && (!cloudId || cloudId !== selectedConfluenceSite.cloudId)) {
			setCloudId(selectedConfluenceSite.cloudId);
		}
	}, [cloudId, selectedConfluenceSite]);

	// TODO: further refactoring in EDM-9573
	// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6829171
	const onSiteSelection = useCallback(
		(site: Site) => {
			userInteractions.add(DatasourceAction.INSTANCE_UPDATED);
			setSearchString(undefined);
			setLastModified(undefined);
			setContributorAccountIds([]);
			setCloudId(site.cloudId);
			reset({ shouldForceRequest: true });
		},
		[reset, userInteractions],
	);

	useEffect(() => {
		const newVisibleColumnKeys =
			!initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
				? defaultVisibleColumnKeys
				: initialVisibleColumnKeys;

		visibleColumnCount.current = newVisibleColumnKeys.length;
		setVisibleColumnKeys(newVisibleColumnKeys);
	}, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

	const siteSelectorLabel =
		availableSites && availableSites.length > 1
			? confluenceSearchModalMessages.insertIssuesTitleManySites
			: confluenceSearchModalMessages.insertIssuesTitle;

	const { columnCustomSizes, onColumnResize } = useColumnResize(initialColumnCustomSizes);

	const { wrappedColumnKeys, onWrappedColumnChange } = useColumnWrapping(initialWrappedColumnKeys);

	// TODO: common functionality of all modals refactor in EDM-9573
	const handleVisibleColumnKeysChange = useCallback(
		(newVisibleColumnKeys: string[] = []) => {
			const columnAction = getColumnAction(visibleColumnKeys || [], newVisibleColumnKeys);
			userInteractions.add(columnAction);
			visibleColumnCount.current = newVisibleColumnKeys.length;

			setVisibleColumnKeys(newVisibleColumnKeys);
		},
		[visibleColumnKeys, userInteractions],
	);

	// TODO: further refactoring in EDM-9573
	// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6798258
	const confluenceSearchTable = useMemo(
		() => (
			<ContentContainer withTableBorder>
				<IssueLikeDataTableView
					testId="confluence-search-datasource-table"
					status={status}
					columns={columns}
					items={responseItems}
					hasNextPage={hasNextPage}
					visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
					onNextPage={onNextPage}
					onLoadDatasourceDetails={loadDatasourceDetails}
					onVisibleColumnKeysChange={handleVisibleColumnKeysChange}
					extensionKey={extensionKey}
					columnCustomSizes={columnCustomSizes}
					onColumnResize={onColumnResize}
					wrappedColumnKeys={wrappedColumnKeys}
					onWrappedColumnChange={
						getBooleanFF('platform.linking-platform.datasource-word_wrap')
							? onWrappedColumnChange
							: undefined
					}
				/>
			</ContentContainer>
		),
		[
			status,
			columns,
			responseItems,
			hasNextPage,
			visibleColumnKeys,
			defaultVisibleColumnKeys,
			onNextPage,
			loadDatasourceDetails,
			handleVisibleColumnKeysChange,
			extensionKey,
			columnCustomSizes,
			onColumnResize,
			wrappedColumnKeys,
			onWrappedColumnChange,
		],
	);

	const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

	const hasConfluenceSearchParams = selectedConfluenceSite && searchString;

	const selectedConfluenceSiteUrl = selectedConfluenceSite?.url;
	const confluenceSearchUrl = useMemo(() => {
		if (!selectedConfluenceSiteUrl || searchString === undefined) {
			return undefined;
		}

		const params = new URLSearchParams();
		// we are appending "text" without checking searchString as we need the url to have "text" when a user does an empty search
		params.append('text', searchString);

		if (contributorAccountIds.length > 0) {
			params.append('contributors', contributorAccountIds.join(','));
		}

		if (lastModified?.value) {
			params.append('lastModified', lastModified.value);
		}
		if (lastModified?.from) {
			params.append('from', lastModified?.from);
		}
		if (lastModified?.to) {
			params.append('to', lastModified?.to);
		}

		return `${selectedConfluenceSiteUrl}/wiki/search?${params.toString()}`;
	}, [contributorAccountIds, lastModified, searchString, selectedConfluenceSiteUrl]);

	const analyticsPayload = useMemo(
		() => ({
			extensionKey,
			destinationObjectTypes,
			searchCount: searchCount.current,
			actions: userInteractions.get(),
		}),
		[destinationObjectTypes, extensionKey, userInteractions],
	);

	const isDataReady = (visibleColumnKeys || []).length > 0;

	const fireInlineViewedEvent = useCallback(() => {
		fireEvent('ui.link.viewed.count', {
			...analyticsPayload,
			searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
			totalItemCount: totalCount || 0,
		});
	}, [analyticsPayload, fireEvent, totalCount]);

	const fireTableViewedEvent = useCallback(() => {
		if (isDataReady) {
			fireEvent('ui.table.viewed.datasourceConfigModal', {
				...analyticsPayload,
				totalItemCount: totalCount || 0,
				searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
				displayedColumnCount: visibleColumnCount.current,
			});
		}
	}, [analyticsPayload, fireEvent, totalCount, isDataReady]);

	useEffect(() => {
		const isResolved = status === 'resolved';
		const isTableViewMode = currentViewMode === 'table';
		const isInlineViewMode = currentViewMode === 'inline';

		if (!isResolved) {
			return;
		}

		if (isTableViewMode) {
			fireTableViewedEvent();
		} else if (isInlineViewMode) {
			fireInlineViewedEvent();
		}
	}, [currentViewMode, fireInlineViewedEvent, fireTableViewedEvent, status]);

	const renderTableModalContent = useCallback(() => {
		if (status === 'rejected') {
			return <ModalLoadingError />;
		} else if (status === 'unauthorized') {
			return <AccessRequired url={selectedConfluenceSiteUrl || urlBeingEdited} />;
		} else if (resolvedWithNoResults || status === 'forbidden') {
			return <NoResults />;
		} else if (status === 'empty' || !columns.length) {
			// persist the empty state when making the initial /data request which contains the columns
			if (hasConfluenceSearchParams !== undefined) {
				return <EmptyState testId={`confluence-search-datasource-modal--empty-state`} />;
			}
			return (
				<ContentContainer>
					<InitialStateView
						icon={<ConfluenceSearchInitialStateSVG />}
						title={confluenceSearchModalMessages.initialViewSearchTitle}
						description={confluenceSearchModalMessages.initialViewSearchDescription}
					/>
				</ContentContainer>
			);
		}
		return confluenceSearchTable;
	}, [
		columns.length,
		selectedConfluenceSiteUrl,
		confluenceSearchTable,
		resolvedWithNoResults,
		status,
		urlBeingEdited,
		hasConfluenceSearchParams,
	]);

	const renderInlineLinkModalContent = useCallback(() => {
		if (status === 'unauthorized') {
			return <AccessRequired url={selectedConfluenceSiteUrl || urlBeingEdited} />;
		} else if (status === 'empty' || !selectedConfluenceSiteUrl) {
			return (
				<SmartCardPlaceholder
					placeholderText={confluenceSearchModalMessages.resultsCountSmartCardPlaceholderText}
				/>
			);
		} else {
			return confluenceSearchUrl && <SmartLink url={confluenceSearchUrl} />;
		}
	}, [confluenceSearchUrl, selectedConfluenceSiteUrl, status, urlBeingEdited]);

	const shouldShowResultsCount = !!totalCount && currentViewMode === 'table';

	const onInsertPressed = useCallback(
		(e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			if (!isParametersSet || !cloudId || !confluenceSearchUrl) {
				return;
			}

			const insertButtonClickedEvent = analyticsEvent.update({
				actionSubjectId: 'insert',
				attributes: {
					...analyticsPayload,
					totalItemCount: totalCount || 0,
					displayedColumnCount: visibleColumnCount.current,
					display:
						currentViewMode === 'inline'
							? DatasourceDisplay.DATASOURCE_INLINE
							: DatasourceDisplay.DATASOURCE_TABLE,
					searchCount: searchCount.current,
					searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
					actions: userInteractions.get(),
				},
				eventType: 'ui',
			});

			const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
			insertButtonClickedEvent.fire(EVENT_CHANNEL);

			if (currentViewMode === 'inline') {
				onInsert(
					{
						type: 'inlineCard',
						attrs: {
							url: confluenceSearchUrl,
						},
					} as InlineCardAdf,
					consumerEvent,
				);
			} else {
				onInsert(
					buildDatasourceAdf<ConfluenceSearchDatasourceParameters>(
						{
							id: datasourceId,
							parameters: {
								...parametersToSend,
								cloudId,
							},
							views: [
								{
									type: 'table',
									properties: {
										columns: (visibleColumnKeys || []).map((key) => {
											const width = columnCustomSizes?.[key];
											const isWrapped = wrappedColumnKeys?.includes(key);
											return {
												key,
												...(width ? { width } : {}),
												...(isWrapped ? { isWrapped } : {}),
											};
										}),
									},
								},
							],
						},
						confluenceSearchUrl,
					),
					consumerEvent,
				);
			}
		},
		[
			isParametersSet,
			cloudId,
			analyticsPayload,
			totalCount,
			currentViewMode,
			onInsert,
			confluenceSearchUrl,
			datasourceId,
			parametersToSend,
			visibleColumnKeys,
			columnCustomSizes,
			wrappedColumnKeys,
			userInteractions,
		],
	);

	const handleViewModeChange = (selectedMode: DisplayViewModes) => {
		userInteractions.add(DatasourceAction.DISPLAY_VIEW_CHANGED);
		setCurrentViewMode(selectedMode);
	};

	const onSearch = useCallback(
		(newSearchString: string, filters?: SelectedOptionsMap) => {
			searchCount.current++;
			userInteractions.add(DatasourceAction.QUERY_UPDATED);

			if (filters) {
				const { editedOrCreatedBy, lastModified: lastModifiedList } = filters;

				if (lastModifiedList) {
					const updatedDateRangeOption = lastModifiedList.find((range) => range.value);

					if (updatedDateRangeOption?.optionType === 'dateRange') {
						setLastModified({
							value: updatedDateRangeOption.value,
							from: updatedDateRangeOption.from,
							to: updatedDateRangeOption.to,
						});
					}
				}

				if (editedOrCreatedBy) {
					const accountIds = editedOrCreatedBy.map((user) => user.value);
					setContributorAccountIds(accountIds);
				}
			}

			setSearchString(newSearchString);
			reset({ shouldForceRequest: true });
		},
		[reset, userInteractions],
	);

	const isInsertDisabled =
		!isParametersSet || status === 'rejected' || status === 'unauthorized' || status === 'loading';

	const getCancelButtonAnalyticsPayload = useCallback(() => {
		return {
			extensionKey,
			destinationObjectTypes,
			searchCount: searchCount.current,
			actions: userInteractions.get(),
		};
	}, [destinationObjectTypes, extensionKey, userInteractions]);

	return (
		<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
			<DatasourceModal testId="confluence-search-datasource-modal" onClose={onCancel}>
				<ModalHeader>
					<ModalTitle>
						<SiteSelector
							availableSites={availableSites}
							onSiteSelection={onSiteSelection}
							selectedSite={selectedConfluenceSite}
							testId="confluence-search-datasource-modal--site-selector"
							label={siteSelectorLabel}
						/>
					</ModalTitle>
					{!hasNoConfluenceSites && !disableDisplayDropdown && (
						<DisplayViewDropDown
							onViewModeChange={handleViewModeChange}
							viewMode={currentViewMode}
						/>
					)}
				</ModalHeader>
				<ModalBody>
					{!hasNoConfluenceSites ? (
						<Fragment>
							<Box xcss={inputContainerStyles}>
								<ConfluenceSearchContainer
									isSearching={status === 'loading'}
									onSearch={onSearch}
									parameters={parameters}
								/>
							</Box>
							{currentViewMode === 'inline'
								? renderInlineLinkModalContent()
								: renderTableModalContent()}
						</Fragment>
					) : (
						<NoInstancesView
							title={confluenceSearchModalMessages.noAccessToConfluenceSitesTitle}
							description={confluenceSearchModalMessages.noAccessToConfluenceSitesDescription}
							testId={'no-confluence-instances-content'}
						/>
					)}
				</ModalBody>
				<ModalFooter>
					{shouldShowResultsCount && confluenceSearchUrl && (
						<TableSearchCount
							searchCount={totalCount}
							url={confluenceSearchUrl}
							prefixTextType="result"
							testId="confluence-search-datasource-modal-total-results-count"
						/>
					)}
					<CancelButton
						onCancel={onCancel}
						getAnalyticsPayload={getCancelButtonAnalyticsPayload}
						testId="confluence-search-modal--cancel-button"
					/>
					{!hasNoConfluenceSites && (
						<Button
							appearance="primary"
							onClick={onInsertPressed}
							isDisabled={isInsertDisabled}
							testId="confluence-search-datasource-modal--insert-button"
						>
							<FormattedMessage {...confluenceSearchModalMessages.insertResultsButtonText} />
						</Button>
					)}
				</ModalFooter>
			</DatasourceModal>
		</IntlMessagesProvider>
	);
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
	dataProvider: 'confluence-search',
};

const analyticsContextData: AnalyticsContextType & ComponentMetaDataType = {
	...componentMetadata.configModal,
	source: 'datasourceConfigModal',
};

const contextData = {
	...analyticsContextData,
	attributes: {
		...analyticsContextAttributes,
	},
};

export const ConfluenceSearchConfigModal = withAnalyticsContext(contextData)(
	(props: ConfluenceSearchConfigModalProps) => (
		<DatasourceExperienceIdProvider>
			<UserInteractionsProvider>
				<PlainConfluenceSearchConfigModal {...props} />
			</UserInteractionsProvider>
		</DatasourceExperienceIdProvider>
	),
);
