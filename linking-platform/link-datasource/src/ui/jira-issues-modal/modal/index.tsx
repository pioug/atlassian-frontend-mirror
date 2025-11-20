/* eslint-disable @atlaskit/platform/no-preconditioning */
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import LinkComponent from '@atlaskit/link';
import type { DatasourceParameters, Link } from '@atlaskit/linking-types';
import {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { EVENT_CHANNEL } from '../../../analytics/constants';
import { DatasourceAction, DatasourceDisplay } from '../../../analytics/types';
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { mapSearchMethod } from '../../../analytics/utils';
import type { DisplayViewModes, JiraSearchMethod, Site } from '../../../common/types';
import { RichIconSearch } from '../../../common/ui/rich-icon/search';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { useDatasourceExperienceId } from '../../../contexts/datasource-experience-id';
import { useUserInteractions } from '../../../contexts/user-interactions';
import i18nEN from '../../../i18n/en';
import { useAvailableSites } from '../../../services/useAvailableSites';
import { StoreContainer } from '../../../state';
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
import { useDatasourceContext } from '../../common/modal/datasource-context';
import { DatasourceModal } from '../../common/modal/datasource-modal';
import { createDatasourceModal } from '../../common/modal/datasource-modal/createDatasourceModal';
import DatasourcesTableInModalPreview from '../../common/modal/datasources-table-in-modal-preview';
import { InsertButton } from '../../common/modal/insert-button';
import { DatasourceViewModeDropDown } from '../../common/modal/mode-switcher';
import { useViewModeContext } from '../../common/modal/mode-switcher/useViewModeContext';
import TableSearchCount from '../../common/modal/search-count';
import { SiteSelector } from '../../common/modal/site-selector';
import { EmptyState } from '../../issue-like-table';
import type { SelectedOptionsMap } from '../basic-filters/types';
import { availableBasicFilterTypes } from '../basic-filters/ui';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { JiraSearchContainer } from '../jira-search-container';
import {
	type ConnectedJiraConfigModalProps,
	type JiraConfigModalProps,
	type JiraIssueDatasourceParameters,
	type JiraIssueDatasourceParametersQuery,
} from '../types';

import { modalMessages } from './messages';

const styles = cssMap({
	modalTitleContainer: {
		gap: token('space.200'),
		alignItems: 'center',
	},
	viewModeContainer: {
		gap: token('space.100'),
		alignItems: 'center',
	},
	flexStyles: {
		flexDirection: 'row-reverse',
		width: '100%',
	},
});

const getDisplayValue = (currentViewMode: DisplayViewModes, itemCount: number) => {
	if (currentViewMode === 'table') {
		return DatasourceDisplay.DATASOURCE_TABLE;
	}
	return itemCount === 1 ? DatasourceDisplay.INLINE : DatasourceDisplay.DATASOURCE_INLINE;
};

const jqlSupportDocumentLink =
	'https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/';

const isValidParameters = (parameters: DatasourceParameters | undefined): boolean =>
	typeof parameters?.jql === 'string' &&
	parameters.jql.length > 0 &&
	typeof parameters?.cloudId === 'string' &&
	parameters.cloudId.length > 0;

const PlainJiraIssuesConfigModal = (props: ConnectedJiraConfigModalProps) => {
	const { onCancel, url: urlBeingEdited, shouldReturnFocus } = props;

	const { visibleColumnCount, visibleColumnKeys, parameters, setParameters, tableState } =
		useDatasourceContext<JiraIssueDatasourceParameters>();

	const {
		reset,
		status,
		responseItems,
		columns,
		totalCount,
		extensionKey = null,
		destinationObjectTypes,
	} = tableState;

	const { cloudId, jql } = parameters ?? {};
	const [initialJql] = useState(jql);

	const { currentViewMode } = useViewModeContext();

	const { availableSites, selectedSite: selectedJiraSite } = useAvailableSites('jira', cloudId);

	const [searchBarJql, setSearchBarJql] = useState<string | undefined>(jql);

	// analytics related parameters
	const searchCount = useRef(0);
	const userInteractions = useUserInteractions();
	const initialSearchMethod: JiraSearchMethod = !isQueryTooComplex(initialJql || '')
		? 'basic'
		: 'jql';
	const [currentSearchMethod, setCurrentSearchMethod] =
		useState<JiraSearchMethod>(initialSearchMethod);
	const searchMethodSearchedWith = useRef<JiraSearchMethod | null>(null);
	const basicFilterSelectionsSearchedWith = useRef<SelectedOptionsMap>({});
	const isSearchedWithComplexQuery = useRef<boolean>(false);

	const { fireEvent } = useDatasourceAnalyticsEvents();
	const experienceId = useDatasourceExperienceId();

	const { formatMessage } = useIntl();

	const analyticsPayload = useMemo(
		() => ({
			extensionKey,
			destinationObjectTypes,
		}),
		[destinationObjectTypes, extensionKey],
	);

	const resolvedWithNoResults = status === 'resolved' && !responseItems.length;
	const jqlUrl = selectedJiraSite && jql && `${selectedJiraSite.url}/issues/?jql=${encodeURI(jql)}`;

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

	/**
	 * If the selected Jira site changes, update the cloudId in the parameters
	 * This is mainly useful for setting the initial cloudId after the site selection loads
	 */
	useEffect(() => {
		if (selectedJiraSite && (!cloudId || cloudId !== selectedJiraSite.cloudId)) {
			setParameters(() => ({ jql: '', cloudId: selectedJiraSite.cloudId }));
		}
	}, [cloudId, selectedJiraSite, setParameters]);

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
	}, [isDataReady, fireEvent, analyticsPayload, totalCount, visibleColumnCount]);

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
				basicFilterSelections: SelectedOptionsMap;
				isQueryComplex: boolean;
				searchMethod: JiraSearchMethod;
			},
		) => {
			searchCount.current++;
			searchMethodSearchedWith.current = searchMethod;
			basicFilterSelectionsSearchedWith.current = basicFilterSelections;
			isSearchedWithComplexQuery.current = isQueryComplex;

			if (jql !== newParameters.jql) {
				userInteractions.add(DatasourceAction.QUERY_UPDATED);
			}

			setParameters((state) =>
				state && newParameters.jql ? { cloudId: state.cloudId, jql: newParameters.jql } : undefined,
			);
			reset({ shouldForceRequest: true });
		},
		[jql, reset, userInteractions, setParameters],
	);

	const onSiteSelection = useCallback(
		(site: Site) => {
			userInteractions.add(DatasourceAction.INSTANCE_UPDATED);
			setParameters({ jql: '', cloudId: site.cloudId });
			reset({ shouldForceRequest: true });
		},
		[reset, userInteractions, setParameters],
	);

	const retrieveUrlForSmartCardRender = useCallback(() => {
		const [data] = responseItems;
		// agreement with BE that we will use `key` for rendering smartlink
		return (data?.key?.data as Link)?.url;
	}, [responseItems]);

	const renderCountModeContent = useCallback(() => {
		const selectedJiraSiteUrl = selectedJiraSite?.url;
		if (status === 'unauthorized') {
			return <AccessRequired url={selectedJiraSiteUrl || urlBeingEdited} />;
		} else if (status === 'empty' || !jql || !selectedJiraSiteUrl) {
			return (
				<SmartCardPlaceholder
					placeholderText={
						fg('confluence-issue-terminology-refresh')
							? modalMessages.issuesCountSmartCardPlaceholderTextIssueTermRefresh
							: modalMessages.issuesCountSmartCardPlaceholderText
					}
				/>
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
		const getDescriptionMessage = () => {
			if (currentSearchMethod === 'basic') {
				return initialStateViewMessages.searchDescriptionForBasicSearchSllv;
			}

			if (fg('confluence-issue-terminology-refresh')) {
				return currentSearchMethod === 'jql'
					? initialStateViewMessages.searchDescriptionForJQLSearchIssueTermRefresh
					: initialStateViewMessages.searchDescriptionForBasicSearchIssueTermRefresh;
			}

			return currentSearchMethod === 'jql'
				? initialStateViewMessages.searchDescriptionForJQLSearch
				: initialStateViewMessages.searchDescriptionForBasicSearch;
		};

		if (status === 'rejected' && jqlUrl) {
			return (
				<ModalLoadingError
					errorMessage={
						jqlUrl ? (
							<FormattedMessage
								{...(FeatureGates.getExperimentValue(
									'project-terminology-refresh',
									'isEnabled',
									false,
								)
									? modalMessages.checkConnectionWithSourceVisualRefreshSllvGalaxia
									: modalMessages.checkConnectionWithSourceVisualRefreshSllv)}
								values={{
									a: (urlText: React.ReactNode[]) => (
										<LinkComponent href={jqlUrl}>{urlText}</LinkComponent>
									),
								}}
							/>
						) : undefined
					}
					onRefresh={() => reset({ shouldForceRequest: true })}
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
							icon={
								<RichIconSearch
									alt={formatMessage(
										fg('confluence-issue-terminology-refresh')
											? modalMessages.searchJiraTitleIssueTermRefresh
											: modalMessages.searchJiraTitle,
									)}
									size={'xlarge'}
								/>
							}
							title={
								fg('confluence-issue-terminology-refresh')
									? modalMessages.searchJiraTitleIssueTermRefresh
									: modalMessages.searchJiraTitle
							}
							description={getDescriptionMessage()}
							learnMoreLink={
								currentSearchMethod === 'jql'
									? {
											href: jqlSupportDocumentLink,
											text: initialStateViewMessages.learnMoreLinkOld,
										}
									: {
											href: jqlSupportDocumentLink,
											text: initialStateViewMessages.learnMoreLink,
										}
							}
						/>
					)}
				</ContentContainer>
			);
		}

		return (
			<ContentContainer withTableBorder>
				<DatasourcesTableInModalPreview testId="jira-datasource-table" />
			</ContentContainer>
		);
	}, [
		columns.length,
		currentSearchMethod,
		formatMessage,
		jql,
		jqlUrl,
		resolvedWithNoResults,
		selectedJiraSite?.url,
		status,
		urlBeingEdited,
		reset,
	]);

	const siteSelectorLabel = useMemo(() => {
		if (fg('confluence-issue-terminology-refresh')) {
			return availableSites && availableSites.length > 1
				? modalMessages.insertIssuesTitleManySitesIssueTermRefresh
				: modalMessages.insertIssuesTitleIssueTermRefresh;
		}
		return availableSites && availableSites.length > 1
			? modalMessages.insertIssuesTitleManySites
			: modalMessages.insertIssuesTitle;
	}, [availableSites]);

	const getCancelButtonAnalyticsPayload = useCallback(() => {
		return {
			...analyticsPayload,
			searchCount: searchCount.current,
			actions: userInteractions.get(),
		};
	}, [analyticsPayload, userInteractions]);

	const filterSelectionCount = availableBasicFilterTypes.reduce(
		(current, filter) => ({
			...current,
			[`${filter}BasicFilterSelectionCount`]:
				basicFilterSelectionsSearchedWith.current[filter]?.length || 0,
		}),
		{},
	);

	const getInsertButtonAnalyticsPayload = useCallback(
		() => ({
			...analyticsPayload,
			display: getDisplayValue(currentViewMode, totalCount || 0),
			isQueryComplex: isSearchedWithComplexQuery.current,
			searchMethod: mapSearchMethod(searchMethodSearchedWith.current),
			searchCount: searchCount.current,
			actions: userInteractions.get(),
			...(searchMethodSearchedWith.current === 'basic' ? { ...filterSelectionCount } : {}),
		}),
		[analyticsPayload, currentViewMode, filterSelectionCount, totalCount, userInteractions],
	);

	const urlToInsert = useMemo(() => {
		const jql = parameters?.jql;
		if (!jql || !selectedJiraSite?.url) {
			return;
		}

		const upToDateJqlUrl = `${selectedJiraSite.url}/issues/?jql=${encodeURIComponent(jql)}`;

		return currentViewMode === 'inline' && responseItems.length === 1
			? retrieveUrlForSmartCardRender()
			: upToDateJqlUrl;
	}, [
		currentViewMode,
		parameters?.jql,
		responseItems,
		retrieveUrlForSmartCardRender,
		selectedJiraSite?.url,
	]);

	return (
		<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
			<ModalTransition>
				<DatasourceModal
					testId="jira-datasource-modal"
					onClose={onCancel}
					shouldReturnFocus={shouldReturnFocus}
				>
					<ModalHeader>
						<Flex gap="space.200" justifyContent="space-between" xcss={styles.flexStyles}>
							<Flex justifyContent="end" xcss={styles.viewModeContainer}>
								{!hasNoJiraSites && <DatasourceViewModeDropDown />}
								<CloseButton onClick={onCancel} />
							</Flex>
							<Flex justifyContent="start" xcss={styles.modalTitleContainer}>
								<ModalTitle>
									<SiteSelector
										availableSites={availableSites}
										onSiteSelection={onSiteSelection}
										selectedSite={selectedJiraSite}
										testId="jira-datasource-modal--site-selector"
										label={siteSelectorLabel}
									/>
								</ModalTitle>
							</Flex>
						</Flex>
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
								styles={{
									color: token('color.text'),
									font: token('font.heading.xxsmall'),
								}}
							/>
						)}
						<CancelButton
							onCancel={onCancel}
							getAnalyticsPayload={getCancelButtonAnalyticsPayload}
							testId="jira-datasource-modal--cancel-button"
						/>
						{!hasNoJiraSites && (
							<InsertButton<JiraIssueDatasourceParameters>
								testId="jira-datasource-modal--insert-button"
								url={urlToInsert}
								getAnalyticsPayload={getInsertButtonAnalyticsPayload}
							>
								<FormattedMessage {...modalMessages.insertIssuesButtonTextIssueTermSllv} />
							</InsertButton>
						)}
					</ModalFooter>
				</DatasourceModal>
			</ModalTransition>
		</IntlMessagesProvider>
	);
};

const ConnectedJiraIssueConfigModal = createDatasourceModal({
	isValidParameters,
	dataProvider: 'jira-issues',
	component: PlainJiraIssuesConfigModal,
});

export const JiraIssuesConfigModal = (props: JiraConfigModalProps): React.JSX.Element => {
	const onInsert = props.onInsert;
	const onInsertWithMacroAnalytics = useCallback<typeof onInsert>(
		(adf, analyticsEvent) => {
			if (analyticsEvent && adf.type === 'inlineCard') {
				const macroInsertedEvent = analyticsEvent.clone();
				macroInsertedEvent?.update({
					eventType: 'track',
					action: 'inserted',
					actionSubject: 'macro',
					actionSubjectId: 'jlol',
				});
				macroInsertedEvent?.fire(EVENT_CHANNEL);
			}
			onInsert(adf, analyticsEvent);
		},
		[onInsert],
	);

	return (
		<StoreContainer>
			<ConnectedJiraIssueConfigModal {...props} onInsert={onInsertWithMacroAnalytics} />
		</StoreContainer>
	);
};

export const JiraIssuesConfigModalNoSuspense = JiraIssuesConfigModal;
