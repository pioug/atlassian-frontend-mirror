/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { type DatasourceParameters } from '@atlaskit/linking-types';
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { componentMetadata } from '../../../analytics/constants';
import {
	type AnalyticsContextAttributesType,
	type AnalyticsContextType,
	type ComponentMetaDataType,
} from '../../../analytics/generated/analytics.types';
import { DatasourceAction, DatasourceSearchMethod } from '../../../analytics/types';
import { type Site } from '../../../common/types';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { DatasourceExperienceIdProvider } from '../../../contexts/datasource-experience-id';
import { UserInteractionsProvider, useUserInteractions } from '../../../contexts/user-interactions';
import i18nEN from '../../../i18n/en';
import { useAvailableSites } from '../../../services/useAvailableSites';
import { StoreContainer } from '../../../state';
import { AccessRequired } from '../../common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { NoInstancesView } from '../../common/error-state/no-instances';
import { NoResults } from '../../common/error-state/no-results';
import { InitialStateView } from '../../common/initial-state-view';
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
import { type DateRangeType } from '../../common/modal/popup-select/types';
import TableSearchCount from '../../common/modal/search-count';
import { SiteSelector } from '../../common/modal/site-selector';
import { EmptyState } from '../../issue-like-table';
import { type SelectedOptionsMap } from '../basic-filters/types';
import ConfluenceSearchContainer from '../confluence-search-container';
import {
	type ConfluenceSearchConfigModalProps,
	type ConfluenceSearchDatasourceParameters,
	type ConnectedConfluenceSearchConfigModalProps,
} from '../types';

import { ConfluenceSearchInitialStateSVG } from './confluence-search-initial-state-svg';
import { confluenceSearchModalMessages } from './messages';
import { PlainConfluenceSearchConfigModal as PlainConfluenceSearchConfigModalOld } from './ModalOld';

const inputContainerStyles = xcss({
	alignItems: 'baseline',
	display: 'flex',
	minHeight: '72px',
});

const isValidParameters = (parameters: DatasourceParameters | undefined): boolean =>
	!!(
		parameters &&
		parameters.cloudId &&
		(parameters.searchString !== undefined ||
			parameters.contributorAccountIds?.length ||
			parameters.lastModified ||
			parameters.lastModifiedFrom ||
			parameters.lastModifiedTo)
	);

const useUpdateParametersOnFormUpdate = (
	cloudId: string | undefined,
	searchString: string | undefined,
	lastModified: { value: DateRangeType | undefined; from?: string; to?: string } | undefined,
	contributorAccountIds: string[],
	overrideParameters: Partial<ConfluenceSearchDatasourceParameters> | undefined,
) => {
	const { setParameters } = useDatasourceContext<ConfluenceSearchDatasourceParameters>();

	useEffect(() => {
		setParameters((parameters) => {
			return {
				...parameters,
				cloudId: cloudId || '',
				searchString,
				lastModified: lastModified?.value,
				lastModifiedFrom: lastModified?.from,
				lastModifiedTo: lastModified?.to,
				contributorAccountIds: contributorAccountIds.length > 0 ? contributorAccountIds : undefined,
				...(overrideParameters ?? {}),
			};
		});
	}, [
		cloudId,
		searchString,
		lastModified,
		contributorAccountIds,
		setParameters,
		overrideParameters,
	]);
};

export const PlainConfluenceSearchConfigModal = (
	props: ConnectedConfluenceSearchConfigModalProps,
) => {
	const {
		onCancel,
		url: urlBeingEdited,
		disableDisplayDropdown = false,
		overrideParameters,
	} = props;

	const { currentViewMode } = useViewModeContext();

	const {
		visibleColumnKeys,
		tableState: {
			reset,
			status,
			responseItems,
			extensionKey = null,
			destinationObjectTypes,
			totalCount,
			columns,
		},
		visibleColumnCount,
		parameters,
	} = useDatasourceContext<ConfluenceSearchDatasourceParameters>();

	const [cloudId, setCloudId] = useState(parameters?.cloudId);
	const { availableSites, selectedSite: selectedConfluenceSite } = useAvailableSites(
		'confluence',
		cloudId,
	);
	const [searchString, setSearchString] = useState<string | undefined>(parameters?.searchString);
	const [contributorAccountIds, setContributorAccountIds] = useState<string[]>(
		parameters?.contributorAccountIds || [],
	);
	const [lastModified, setLastModified] = useState(
		parameters?.lastModified
			? {
					value: parameters?.lastModified,
					from: parameters?.lastModifiedFrom,
					to: parameters?.lastModifiedTo,
				}
			: undefined,
	);

	// analytics related parameters
	const searchCount = useRef(0);
	const userInteractions = useUserInteractions();

	useUpdateParametersOnFormUpdate(
		cloudId,
		searchString,
		lastModified,
		contributorAccountIds,
		overrideParameters,
	);

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

	const siteSelectorLabel =
		availableSites && availableSites.length > 1
			? confluenceSearchModalMessages.insertIssuesTitleManySites
			: confluenceSearchModalMessages.insertIssuesTitle;

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
	}, [isDataReady, fireEvent, analyticsPayload, totalCount, visibleColumnCount]);

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
		return (
			<ContentContainer withTableBorder>
				<DatasourcesTableInModalPreview testId="confluence-search-datasource-table" />
			</ContentContainer>
		);
	}, [
		columns.length,
		selectedConfluenceSiteUrl,
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

	const getButtonAnalyticsPayload = useCallback(() => {
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
					{!hasNoConfluenceSites && !disableDisplayDropdown && <DatasourceViewModeDropDown />}
				</ModalHeader>
				<ModalBody>
					{!hasNoConfluenceSites ? (
						<Fragment>
							<Box xcss={inputContainerStyles}>
								<ConfluenceSearchContainer
									isSearching={status === 'loading'}
									onSearch={onSearch}
									parameters={parameters ?? { cloudId: '' }}
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
						getAnalyticsPayload={getButtonAnalyticsPayload}
						testId="confluence-search-modal--cancel-button"
					/>
					{!hasNoConfluenceSites && (
						<InsertButton<ConfluenceSearchDatasourceParameters>
							testId="confluence-search-datasource-modal--insert-button"
							url={confluenceSearchUrl}
							getAnalyticsPayload={getButtonAnalyticsPayload}
						>
							<FormattedMessage {...confluenceSearchModalMessages.insertResultsButtonText} />
						</InsertButton>
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

const ConnectedConfluenceSearchConfigModal =
	createDatasourceModal<ConfluenceSearchDatasourceParameters>({
		isValidParameters,
		dataProvider: 'confluence-search',
		component: PlainConfluenceSearchConfigModal,
	});

export const ConfluenceSearchConfigModal = (props: ConfluenceSearchConfigModalProps) => {
	if (fg('platform-datasources-use-refactored-config-modal')) {
		return (
			<StoreContainer>
				<ConnectedConfluenceSearchConfigModal {...props} />
			</StoreContainer>
		);
	}

	return (
		<StoreContainer>
			<AnalyticsContext data={contextData}>
				<DatasourceExperienceIdProvider>
					<UserInteractionsProvider>
						<PlainConfluenceSearchConfigModalOld {...props} />
					</UserInteractionsProvider>
				</DatasourceExperienceIdProvider>
			</AnalyticsContext>
		</StoreContainer>
	);
};
