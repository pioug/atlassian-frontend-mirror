import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import LinkComponent from '@atlaskit/link';
import { type DatasourceParameters } from '@atlaskit/linking-types';
import {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { DatasourceAction, DatasourceSearchMethod } from '../../../analytics/types';
import { type Site } from '../../../common/types';
import { RichIconSearch } from '../../../common/ui/rich-icon/search';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { useUserInteractions } from '../../../contexts/user-interactions';
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

import { confluenceSearchModalMessages } from './messages';

const styles = cssMap({
	inputContainerStyles: {
		alignItems: 'baseline',
		display: 'flex',
		minHeight: '72px',
	},
	modalTitleContainer: {
		gap: token('space.200'),
		alignItems: 'center',
	},
	flexStyles: {
		flexDirection: 'row-reverse',
		width: '100%',
	},
	viewModeContainer: {
		gap: token('space.100'),
		alignItems: 'center',
	},
});

const isValidParameters = (parameters: DatasourceParameters | undefined): boolean =>
	!!(
		parameters &&
		parameters.cloudId &&
		Object.values(parameters).filter((v) => v !== undefined).length > 1
	);

export const PlainConfluenceSearchConfigModal = (
	props: ConnectedConfluenceSearchConfigModalProps,
): React.JSX.Element => {
	const { onCancel, url: urlBeingEdited, overrideParameters, disableSiteSelector } = props;

	const { currentViewMode } = useViewModeContext();

	const { formatMessage } = useIntl();

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
		setParameters,
	} = useDatasourceContext<ConfluenceSearchDatasourceParameters>();

	const { availableSites, selectedSite: selectedConfluenceSite } = useAvailableSites(
		'confluence',
		parameters?.cloudId,
	);

	// analytics related parameters
	const searchCount = useRef(0);
	const userInteractions = useUserInteractions();

	const setParametersWithOverrides = useCallback(
		(
			setStateAction:
				| ConfluenceSearchDatasourceParameters
				| undefined
				| ((
						prev: ConfluenceSearchDatasourceParameters | undefined,
				  ) => Partial<ConfluenceSearchDatasourceParameters>),
		) => {
			if (typeof setStateAction !== 'function') {
				setParameters({
					...setStateAction,
					cloudId: setStateAction?.cloudId || '',
					...overrideParameters,
				});
			} else {
				setParameters((prev) => ({
					...prev,
					cloudId: prev?.cloudId || '',
					...setStateAction(prev),
					...overrideParameters,
				}));
			}
		},
		[setParameters, overrideParameters],
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
		if (
			selectedConfluenceSite &&
			(!parameters?.cloudId || parameters?.cloudId !== selectedConfluenceSite.cloudId)
		) {
			/**
			 * This code is primarily to set the cloudId in the parameters when the site selector loads a default value
			 * but there is no "onChange" emitted from the site picker
			 */
			setParameters((prev) => ({ ...prev, cloudId: selectedConfluenceSite.cloudId }));
		}
	}, [parameters, setParameters, selectedConfluenceSite]);

	// TODO: further refactoring in EDM-9573
	// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6829171
	const onSiteSelection = useCallback(
		(site: Site) => {
			userInteractions.add(DatasourceAction.INSTANCE_UPDATED);

			/**
			 * Clear the state of the form filters when the site is changed
			 */
			setParameters((prev) => ({
				...prev,
				searchString: undefined,
				lastModified: undefined,
				lastModifiedFrom: undefined,
				lastModifiedTo: undefined,
				contributorAccountIds: undefined,
				cloudId: site.cloudId,
			}));

			reset({ shouldForceRequest: true });
		},
		[reset, setParameters, userInteractions],
	);

	let siteSelectorLabel;
	if (disableSiteSelector) {
		siteSelectorLabel = confluenceSearchModalMessages.insertIssuesTitle;
	} else {
		siteSelectorLabel =
			availableSites && availableSites.length > 1
				? confluenceSearchModalMessages.insertIssuesTitleManySites
				: confluenceSearchModalMessages.insertIssuesTitle;
	}
	const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

	const hasConfluenceSearchParams = selectedConfluenceSite && parameters?.searchString;

	const selectedConfluenceSiteUrl = selectedConfluenceSite?.url;
	const confluenceSearchUrl = useMemo(() => {
		if (!selectedConfluenceSiteUrl || parameters?.searchString === undefined) {
			return undefined;
		}

		const params = new URLSearchParams();
		// we are appending "text" without checking searchString as we need the url to have "text" when a user does an empty search)
		params.append('text', parameters?.searchString || '');

		if (parameters?.contributorAccountIds?.length) {
			params.append('contributors', parameters.contributorAccountIds.join(','));
		}

		if (parameters?.lastModified) {
			params.append('lastModified', parameters.lastModified);
		}
		if (parameters?.lastModifiedFrom) {
			params.append('from', parameters.lastModifiedFrom);
		}
		if (parameters?.lastModifiedTo) {
			params.append('to', parameters.lastModifiedTo);
		}

		return `${selectedConfluenceSiteUrl}/wiki/search?${params.toString()}`;
	}, [parameters, selectedConfluenceSiteUrl]);

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
			if (selectedConfluenceSite) {
				return (
					<ModalLoadingError
						errorMessage={
							<FormattedMessage
								{...(FeatureGates.getExperimentValue(
									'project-terminology-refresh',
									'isEnabled',
									false,
								)
									? confluenceSearchModalMessages.checkConnectionWithSourceGalaxia
									: confluenceSearchModalMessages.checkConnectionWithSource)}
								values={{
									a: (urlText: React.ReactNode[]) => (
										<LinkComponent href={selectedConfluenceSite.url}>{urlText}</LinkComponent>
									),
								}}
							/>
						}
						onRefresh={() => reset({ shouldForceRequest: true })}
					/>
				);
			}

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
						icon={
							<RichIconSearch
								size="xlarge"
								alt={formatMessage(confluenceSearchModalMessages.initialViewSearchTitle)}
							/>
						}
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
		status,
		resolvedWithNoResults,
		columns.length,
		selectedConfluenceSiteUrl,
		urlBeingEdited,
		hasConfluenceSearchParams,
		formatMessage,
		reset,
		selectedConfluenceSite,
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
						setParametersWithOverrides((prev) => ({
							...prev,
							lastModified: updatedDateRangeOption.value,
							lastModifiedFrom: updatedDateRangeOption.from,
							lastModifiedTo: updatedDateRangeOption.to,
						}));
					}
				}

				if (editedOrCreatedBy) {
					const accountIds = editedOrCreatedBy.map((user) => user.value);
					setParametersWithOverrides((prev) => ({
						...prev,
						contributorAccountIds: accountIds,
					}));
				}
			}

			setParametersWithOverrides((prev) => ({
				...prev,
				searchString: newSearchString,
			}));

			reset({ shouldForceRequest: true });
		},
		[reset, userInteractions, setParametersWithOverrides],
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
					<Flex gap="space.200" justifyContent="space-between" xcss={styles.flexStyles}>
						<Flex justifyContent="end" xcss={styles.viewModeContainer}>
							{!hasNoConfluenceSites && <DatasourceViewModeDropDown />}
							<CloseButton onClick={onCancel} />
						</Flex>
						<Flex justifyContent="start" xcss={styles.modalTitleContainer}>
							<ModalTitle>
								<SiteSelector
									availableSites={availableSites}
									onSiteSelection={onSiteSelection}
									selectedSite={selectedConfluenceSite}
									testId="confluence-search-datasource-modal--site-selector"
									label={siteSelectorLabel}
									disableSiteSelector={disableSiteSelector}
								/>
							</ModalTitle>
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody>
					{!hasNoConfluenceSites ? (
						<Fragment>
							<Box xcss={styles.inputContainerStyles}>
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
							styles={{
								color: token('color.text'),
								font: token('font.heading.xxsmall'),
							}}
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

const ConnectedConfluenceSearchConfigModal =
	createDatasourceModal<ConfluenceSearchDatasourceParameters>({
		isValidParameters,
		dataProvider: 'confluence-search',
		component: PlainConfluenceSearchConfigModal,
	});

export const ConfluenceSearchConfigModal = (
	props: ConfluenceSearchConfigModalProps,
): React.JSX.Element => {
	return (
		<StoreContainer>
			<ConnectedConfluenceSearchConfigModal
				{...props}
				/**
				 * If the intial parameters are not valid, we will not initialise the modal state
				 * with `overrideParameters`. This is to allow the modal to be opened without
				 * any initial parameters and require the user to perform a search.
				 */
				parameters={
					props.overrideParameters && isValidParameters(props.parameters)
						? { ...props.parameters, ...props.overrideParameters }
						: props.parameters
				}
			/>
		</StoreContainer>
	);
};
