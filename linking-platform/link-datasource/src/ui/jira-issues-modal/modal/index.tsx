/* eslint-disable @atlaskit/platform/no-preconditioning */
/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
/** @jsx jsx */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { type UIAnalyticsEvent, withAnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import type { InlineCardAdf } from '@atlaskit/linking-common/types';
import type { Link } from '@atlaskit/linking-types';
import {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';

import { EVENT_CHANNEL, useDatasourceAnalyticsEvents } from '../../../analytics';
import { componentMetadata } from '../../../analytics/constants';
import type {
	AnalyticsContextAttributesType,
	AnalyticsContextType,
	ComponentMetaDataType,
} from '../../../analytics/generated/analytics.types';
import { DatasourceAction, DatasourceDisplay } from '../../../analytics/types';
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { mapSearchMethod } from '../../../analytics/utils';
import type { DisplayViewModes, JiraSearchMethod, Site } from '../../../common/types';
import { buildDatasourceAdf } from '../../../common/utils/adf';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import {
	DatasourceExperienceIdProvider,
	useDatasourceExperienceId,
} from '../../../contexts/datasource-experience-id';
import { UserInteractionsProvider, useUserInteractions } from '../../../contexts/user-interactions';
import {
	type onNextPageProps,
	useDatasourceTableState,
} from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { useAvailableSites } from '../../../services/useAvailableSites';
import { AccessRequired } from '../../common/error-state/access-required';
import { loadingErrorMessages } from '../../common/error-state/messages';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoInstancesView } from '../../common/error-state/no-instances';
import { NoResults } from '../../common/error-state/no-results';
import { InitialStateView } from '../../common/initial-state-view';
import { initialStateViewMessages } from '../../common/initial-state-view/messages';
import { CancelButton } from '../../common/modal/cancel-button';
import { ContentContainer } from '../../common/modal/content-container';
import { SmartCardPlaceholder, SmartLink } from '../../common/modal/count-view-smart-link';
import { DatasourceModal } from '../../common/modal/datasource-modal';
import { useColumnResize } from '../../common/modal/datasources-table-in-modal-preview/use-column-resize';
import { useColumnWrapping } from '../../common/modal/datasources-table-in-modal-preview/use-column-wrapping';
import { DatasourceViewModeDropDown } from '../../common/modal/mode-switcher';
import {
	DatasourceViewModeProvider,
	useViewModeContext,
} from '../../common/modal/mode-switcher/useViewModeContext';
import TableSearchCount from '../../common/modal/search-count';
import { SiteSelector } from '../../common/modal/site-selector';
import { EmptyState, IssueLikeDataTableView } from '../../issue-like-table';
import { getColumnAction } from '../../issue-like-table/utils';
import type { SelectedOptionsMap } from '../basic-filters/types';
import { availableBasicFilterTypes } from '../basic-filters/ui';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { JiraSearchContainer } from '../jira-search-container';
import type {
	JiraConfigModalProps,
	JiraIssueDatasourceParameters,
	JiraIssueDatasourceParametersQuery,
} from '../types';

import { JiraInitialStateSVG } from './jira-issues-initial-state-svg';
import { modalMessages } from './messages';
import { PlainJiraIssuesConfigModalOld } from './ModalOld';

const DEFAULT_VIEW_MODE = 'table';

const getDisplayValue = (currentViewMode: DisplayViewModes, itemCount: number) => {
	if (currentViewMode === 'table') {
		return DatasourceDisplay.DATASOURCE_TABLE;
	}
	return itemCount === 1 ? DatasourceDisplay.INLINE : DatasourceDisplay.DATASOURCE_INLINE;
};

const jqlSupportDocumentLink =
	'https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/';

const PlainJiraIssuesConfigModal = (props: JiraConfigModalProps) => {
	const {
		datasourceId,
		columnCustomSizes: initialColumnCustomSizes,
		wrappedColumnKeys: initialWrappedColumnKeys,
		onCancel,
		onInsert,
		parameters: initialParameters,
		url: urlBeingEdited,
		visibleColumnKeys: initialVisibleColumnKeys,
	} = props;

	const { currentViewMode } = useViewModeContext();
	const [cloudId, setCloudId] = useState(initialParameters?.cloudId);
	const { availableSites, selectedSite: selectedJiraSite } = useAvailableSites('jira', cloudId);
	const [jql, setJql] = useState(initialParameters?.jql);
	const [searchBarJql, setSearchBarJql] = useState<string | undefined>(initialParameters?.jql);
	const [visibleColumnKeys, setVisibleColumnKeys] = useState(initialVisibleColumnKeys);

	// analytics related parameters
	const searchCount = useRef(0);
	const userInteractions = useUserInteractions();
	const initialSearchMethod: JiraSearchMethod =
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		fg('platform.linking-platform.datasource.show-jlol-basic-filters') &&
		!isQueryTooComplex(initialParameters?.jql || '')
			? 'basic'
			: 'jql';
	const [currentSearchMethod, setCurrentSearchMethod] =
		useState<JiraSearchMethod>(initialSearchMethod);
	const searchMethodSearchedWith = useRef<JiraSearchMethod | null>(null);
	const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);
	const basicFilterSelectionsSearchedWith = useRef<SelectedOptionsMap>({});
	const isSearchedWithComplexQuery = useRef<boolean>(false);

	const parameters = useMemo<JiraIssueDatasourceParameters | undefined>(
		() =>
			!!cloudId
				? {
						cloudId,
						jql: jql || '',
					}
				: undefined,
		[cloudId, jql],
	);

	const isParametersSet = !!(jql && cloudId);

	const { columnCustomSizes, onColumnResize } = useColumnResize(initialColumnCustomSizes);

	const { wrappedColumnKeys, onWrappedColumnChange } = useColumnWrapping(initialWrappedColumnKeys);

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
		parameters: isParametersSet ? parameters : undefined,
		fieldKeys: visibleColumnKeys,
	});

	const { fireEvent } = useDatasourceAnalyticsEvents();
	const experienceId = useDatasourceExperienceId();

	const analyticsPayload = useMemo(
		() => ({
			extensionKey,
			destinationObjectTypes,
		}),
		[destinationObjectTypes, extensionKey],
	);

	const resolvedWithNoResults = status === 'resolved' && !responseItems.length;
	const jqlUrl = selectedJiraSite && jql && `${selectedJiraSite.url}/issues/?jql=${encodeURI(jql)}`;

	const isInsertDisabled =
		!isParametersSet || status === 'rejected' || status === 'unauthorized' || status === 'loading';

	const shouldShowIssueCount = !!totalCount && totalCount !== 1 && currentViewMode === 'table';

	const isDataReady = (visibleColumnKeys || []).length > 0;
	const hasNoJiraSites = availableSites && availableSites.length === 0;

	useEffect(() => {
		if (availableSites) {
			fireEvent('ui.modal.ready.datasource', {
				instancesCount: availableSites.length,
				schemasCount: null,
			});
		}
	}, [fireEvent, availableSites]);

	useEffect(() => {
		const shouldStartUfoExperience = status === 'loading';

		if (shouldStartUfoExperience) {
			startUfoExperience(
				{
					name: 'datasource-rendered',
				},
				experienceId,
			);
		}
	}, [experienceId, status]);

	useDataRenderedUfoExperience({
		status,
		experienceId: experienceId,
		itemCount: responseItems.length,
		canBeLink: currentViewMode === 'inline',
		extensionKey,
	});

	useEffect(() => {
		const newVisibleColumnKeys =
			!initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
				? defaultVisibleColumnKeys
				: initialVisibleColumnKeys;

		visibleColumnCount.current = newVisibleColumnKeys.length;
		setVisibleColumnKeys(newVisibleColumnKeys);
	}, [initialVisibleColumnKeys, defaultVisibleColumnKeys]);

	useEffect(() => {
		if (selectedJiraSite && (!cloudId || cloudId !== selectedJiraSite.cloudId)) {
			setCloudId(selectedJiraSite.cloudId);
		}
	}, [cloudId, selectedJiraSite]);

	const fireSingleItemViewedEvent = useCallback(() => {
		fireEvent('ui.link.viewed.singleItem', {
			...analyticsPayload,
			searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
		});
	}, [analyticsPayload, fireEvent]);

	const fireCountViewedEvent = useCallback(() => {
		fireEvent('ui.link.viewed.count', {
			...analyticsPayload,
			searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
			totalItemCount: totalCount || 0,
		});
	}, [analyticsPayload, fireEvent, totalCount]);

	const fireTableViewedEvent = useCallback(() => {
		if (isDataReady) {
			fireEvent('ui.table.viewed.datasourceConfigModal', {
				...analyticsPayload,
				totalItemCount: totalCount || 0,
				searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
				displayedColumnCount: visibleColumnCount.current,
			});
		}
	}, [analyticsPayload, fireEvent, totalCount, isDataReady]);

	const fireIssueViewAnalytics = useCallback(() => {
		if (!totalCount) {
			return;
		}

		if (totalCount > 1) {
			fireTableViewedEvent();
		} else if (totalCount === 1) {
			fireSingleItemViewedEvent();
		}
	}, [fireSingleItemViewedEvent, fireTableViewedEvent, totalCount]);

	useEffect(() => {
		const isResolved = status === 'resolved';
		const isIssueViewMode = currentViewMode === 'table';
		const isCountViewMode = currentViewMode === 'inline';

		if (!isResolved) {
			return;
		}

		if (isIssueViewMode) {
			fireIssueViewAnalytics();
		} else if (isCountViewMode) {
			fireCountViewedEvent();
		}
	}, [currentViewMode, status, fireIssueViewAnalytics, fireCountViewedEvent]);

	useColumnPickerRenderedFailedUfoExperience(status, experienceId);

	const onSearch = useCallback(
		(
			newParameters: JiraIssueDatasourceParametersQuery,
			{
				searchMethod,
				basicFilterSelections,
				isQueryComplex,
			}: {
				searchMethod: JiraSearchMethod;
				basicFilterSelections: SelectedOptionsMap;
				isQueryComplex: boolean;
			},
		) => {
			searchCount.current++;
			searchMethodSearchedWith.current = searchMethod;
			basicFilterSelectionsSearchedWith.current = basicFilterSelections;
			isSearchedWithComplexQuery.current = isQueryComplex;

			if (jql !== newParameters.jql) {
				userInteractions.add(DatasourceAction.QUERY_UPDATED);
			}

			setJql(newParameters.jql);
			reset({ shouldForceRequest: true });
		},
		[jql, reset, userInteractions],
	);

	const onSiteSelection = useCallback(
		(site: Site) => {
			userInteractions.add(DatasourceAction.INSTANCE_UPDATED);
			setJql('');
			setCloudId(site.cloudId);
			reset({ shouldForceRequest: true });
		},
		[reset, userInteractions],
	);

	const retrieveUrlForSmartCardRender = useCallback(() => {
		const [data] = responseItems;
		// agreement with BE that we will use `key` for rendering smartlink
		return (data?.key?.data as Link)?.url;
	}, [responseItems]);

	const onInsertPressed = useCallback(
		(e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			if (!isParametersSet || !jql || !selectedJiraSite) {
				return;
			}

			// During insertion, we want the JQL of the datasource to be whatever is in the search bar,
			// even if the user didn't previously click search
			const upToDateJql = searchBarJql ?? jql;

			const upToDateJqlUrl =
				selectedJiraSite &&
				jql &&
				`${selectedJiraSite.url}/issues/?jql=${encodeURIComponent(upToDateJql)}`;

			const filterSelectionCount = availableBasicFilterTypes.reduce(
				(current, filter) => ({
					...current,
					[`${filter}BasicFilterSelectionCount`]:
						basicFilterSelectionsSearchedWith.current[filter]?.length || 0,
				}),
				{},
			);

			const insertButtonClickedEvent = analyticsEvent.update({
				actionSubjectId: 'insert',
				attributes: {
					...analyticsPayload,
					totalItemCount: totalCount || 0,
					displayedColumnCount: visibleColumnCount.current,
					display: getDisplayValue(currentViewMode, totalCount || 0),
					searchCount: searchCount.current,
					searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
					actions: userInteractions.get(),
					isQueryComplex: isSearchedWithComplexQuery.current,
					...(searchMethodSearchedWith.current === 'basic' ? { ...filterSelectionCount } : {}),
				},
				eventType: 'ui',
			});

			// additional event for tracking in confluence against JIM
			const macroInsertedEvent = analyticsEvent.clone();
			macroInsertedEvent?.update({
				eventType: 'track',
				action: 'inserted',
				actionSubject: 'macro',
				actionSubjectId: 'jlol',
				attributes: {
					...analyticsPayload,
					totalItemCount: totalCount || 0,
					displayedColumnCount: visibleColumnCount.current,
					display: getDisplayValue(currentViewMode, totalCount || 0),
					searchCount: searchCount.current,
					searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
					actions: userInteractions.get(),
				},
			});

			const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
			insertButtonClickedEvent.fire(EVENT_CHANNEL);

			const firstIssueUrl = retrieveUrlForSmartCardRender();

			if (currentViewMode === 'inline') {
				macroInsertedEvent?.fire(EVENT_CHANNEL);
				const url = responseItems.length === 1 ? firstIssueUrl : upToDateJqlUrl;
				onInsert(
					{
						type: 'inlineCard',
						attrs: {
							url,
						},
					} as InlineCardAdf,
					consumerEvent,
				);
			} else {
				onInsert(
					buildDatasourceAdf<JiraIssueDatasourceParameters>(
						{
							id: datasourceId,
							parameters: {
								cloudId,
								jql: upToDateJql, // TODO support non JQL type
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
						upToDateJqlUrl,
					),
					consumerEvent,
				);
			}
		},
		[
			isParametersSet,
			jql,
			selectedJiraSite,
			searchBarJql,
			analyticsPayload,
			totalCount,
			currentViewMode,
			retrieveUrlForSmartCardRender,
			responseItems.length,
			onInsert,
			datasourceId,
			cloudId,
			visibleColumnKeys,
			columnCustomSizes,
			wrappedColumnKeys,
			userInteractions,
		],
	);

	const handleOnNextPage = useCallback(
		(onNextPageProps: onNextPageProps = {}) => {
			userInteractions.add(DatasourceAction.NEXT_PAGE_SCROLLED);
			onNextPage(onNextPageProps);
		},
		[onNextPage, userInteractions],
	);

	const handleVisibleColumnKeysChange = useCallback(
		(newVisibleColumnKeys: string[] = []) => {
			const columnAction = getColumnAction(visibleColumnKeys || [], newVisibleColumnKeys);
			userInteractions.add(columnAction);
			visibleColumnCount.current = newVisibleColumnKeys.length;

			setVisibleColumnKeys(newVisibleColumnKeys);
		},
		[visibleColumnKeys, userInteractions],
	);

	const issueLikeDataTableView = useMemo(
		() => (
			<ContentContainer withTableBorder>
				<IssueLikeDataTableView
					testId="jira-datasource-table"
					status={status}
					columns={columns}
					items={responseItems}
					hasNextPage={hasNextPage}
					visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
					onNextPage={handleOnNextPage}
					onLoadDatasourceDetails={loadDatasourceDetails}
					onVisibleColumnKeysChange={handleVisibleColumnKeysChange}
					extensionKey={extensionKey}
					columnCustomSizes={columnCustomSizes}
					onColumnResize={onColumnResize}
					wrappedColumnKeys={wrappedColumnKeys}
					onWrappedColumnChange={
						fg('platform.linking-platform.datasource-word_wrap') ? onWrappedColumnChange : undefined
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
			handleOnNextPage,
			loadDatasourceDetails,
			handleVisibleColumnKeysChange,
			extensionKey,
			columnCustomSizes,
			onColumnResize,
			wrappedColumnKeys,
			onWrappedColumnChange,
		],
	);

	const renderCountModeContent = useCallback(() => {
		const selectedJiraSiteUrl = selectedJiraSite?.url;
		if (status === 'unauthorized') {
			return <AccessRequired url={selectedJiraSiteUrl || urlBeingEdited} />;
		} else if (status === 'empty' || !jql || !selectedJiraSiteUrl) {
			return (
				<SmartCardPlaceholder placeholderText={modalMessages.issuesCountSmartCardPlaceholderText} />
			);
		} else {
			let url;
			if (responseItems.length === 1 && retrieveUrlForSmartCardRender()) {
				url = retrieveUrlForSmartCardRender();
			} else {
				url = `${selectedJiraSiteUrl}/issues/?jql=${encodeURIComponent(jql)}`;
			}
			return <SmartLink url={url} />;
		}
	}, [
		jql,
		selectedJiraSite?.url,
		status,
		urlBeingEdited,
		responseItems,
		retrieveUrlForSmartCardRender,
	]);

	const renderIssuesModeContent = useCallback(() => {
		const selectedJiraSiteUrl = selectedJiraSite?.url;
		if (status === 'rejected' && jqlUrl) {
			return (
				<ModalLoadingError
					errorMessage={
						jqlUrl ? (
							<FormattedMessage
								{...modalMessages.checkConnectionWithSource}
								values={{
									a: (urlText: React.ReactNode[]) => <a href={jqlUrl}>{urlText}</a>,
								}}
							/>
						) : undefined
					}
				/>
			);
		} else if (status === 'unauthorized') {
			return <AccessRequired url={selectedJiraSiteUrl || urlBeingEdited} />;
		} else if (resolvedWithNoResults || status === 'forbidden') {
			return <NoResults />;
		} else if (status === 'empty' || !columns.length) {
			// persist the empty state when making the initial /data request which contains the columns
			return (
				<ContentContainer withTableBorder={!!jql}>
					{!!jql ? (
						<EmptyState testId={`jira-datasource-modal--empty-state`} />
					) : (
						<InitialStateView
							showBeta={!fg('platform.linking-platform.datasource.show-jlol-basic-filters')}
							icon={<JiraInitialStateSVG />}
							title={modalMessages.searchJiraTitle}
							description={
								currentSearchMethod === 'jql'
									? initialStateViewMessages.searchDescriptionForJQLSearch
									: initialStateViewMessages.searchDescriptionForBasicSearch
							}
							learnMoreLink={
								currentSearchMethod === 'jql'
									? {
											href: jqlSupportDocumentLink,
											text: initialStateViewMessages.learnMoreLink,
										}
									: undefined
							}
						/>
					)}
				</ContentContainer>
			);
		}

		return issueLikeDataTableView;
	}, [
		columns.length,
		currentSearchMethod,
		issueLikeDataTableView,
		jql,
		jqlUrl,
		resolvedWithNoResults,
		selectedJiraSite?.url,
		status,
		urlBeingEdited,
	]);

	const siteSelectorLabel =
		availableSites && availableSites.length > 1
			? modalMessages.insertIssuesTitleManySites
			: modalMessages.insertIssuesTitle;

	const getCancelButtonAnalyticsPayload = useCallback(() => {
		return {
			...analyticsPayload,
			searchCount: searchCount.current,
			actions: userInteractions.get(),
		};
	}, [analyticsPayload, userInteractions]);

	return (
		<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
			<ModalTransition>
				<DatasourceModal testId="jira-datasource-modal" onClose={onCancel}>
					<ModalHeader>
						<ModalTitle>
							<SiteSelector
								availableSites={availableSites}
								onSiteSelection={onSiteSelection}
								selectedSite={selectedJiraSite}
								testId="jira-datasource-modal--site-selector"
								label={siteSelectorLabel}
							/>
						</ModalTitle>
						{!hasNoJiraSites && <DatasourceViewModeDropDown />}
					</ModalHeader>
					<ModalBody>
						{!hasNoJiraSites ? (
							<Fragment>
								<JiraSearchContainer
									setSearchBarJql={setSearchBarJql}
									searchBarJql={searchBarJql}
									isSearching={status === 'loading'}
									parameters={parameters}
									onSearch={onSearch}
									initialSearchMethod={initialSearchMethod}
									onSearchMethodChange={setCurrentSearchMethod}
									site={selectedJiraSite}
								/>
								{currentViewMode === 'inline'
									? renderCountModeContent()
									: renderIssuesModeContent()}
							</Fragment>
						) : (
							<NoInstancesView
								title={loadingErrorMessages.noAccessToJiraSitesTitle}
								description={loadingErrorMessages.noAccessToJiraSitesDescription}
								testId={`no-jira-instances-content`}
							/>
						)}
					</ModalBody>
					<ModalFooter>
						{shouldShowIssueCount && (
							<TableSearchCount
								searchCount={totalCount}
								url={jqlUrl}
								prefixTextType="issue"
								testId="jira-datasource-modal-total-issues-count"
							/>
						)}
						<CancelButton
							onCancel={onCancel}
							getAnalyticsPayload={getCancelButtonAnalyticsPayload}
							testId="jira-datasource-modal--cancel-button"
						/>
						{!hasNoJiraSites && (
							<Button
								appearance="primary"
								onClick={onInsertPressed}
								isDisabled={isInsertDisabled}
								testId="jira-datasource-modal--insert-button"
							>
								<FormattedMessage {...modalMessages.insertIssuesButtonText} />
							</Button>
						)}
					</ModalFooter>
				</DatasourceModal>
			</ModalTransition>
		</IntlMessagesProvider>
	);
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
	dataProvider: 'jira-issues',
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

export const JiraIssuesConfigModal = withAnalyticsContext(contextData)(
	(props: JiraConfigModalProps) => (
		<DatasourceExperienceIdProvider>
			<UserInteractionsProvider>
				{fg('platform-datasources-use-refactored-config-modal') ? (
					<DatasourceViewModeProvider viewMode={props.viewMode ?? DEFAULT_VIEW_MODE}>
						<PlainJiraIssuesConfigModal {...props} />
					</DatasourceViewModeProvider>
				) : (
					<PlainJiraIssuesConfigModalOld {...props}></PlainJiraIssuesConfigModalOld>
				)}
			</UserInteractionsProvider>
		</DatasourceExperienceIdProvider>
	),
);
