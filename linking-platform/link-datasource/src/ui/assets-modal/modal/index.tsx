/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { type UIAnalyticsEvent, withAnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { type Link } from '@atlaskit/linking-types';
import {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

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
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useColumnPickerRenderedFailedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useColumnPickerRenderedFailedUfoExperience';
import { useDataRenderedUfoExperience } from '../../../analytics/ufoExperiences/hooks/useDataRenderedUfoExperience';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import { buildDatasourceAdf } from '../../../common/utils/schema-utils';
import {
	DatasourceExperienceIdProvider,
	useDatasourceExperienceId,
} from '../../../contexts/datasource-experience-id';
import { UserInteractionsProvider, useUserInteractions } from '../../../contexts/user-interactions';
import { useAssetsClient } from '../../../hooks/useAssetsClient';
import { useDatasourceTableState } from '../../../hooks/useDatasourceTableState';
import i18nEN from '../../../i18n/en';
import { PermissionError } from '../../../services/cmdbService.utils';
import { StoreContainer } from '../../../state';
import { AccessRequired } from '../../../ui/common/error-state/access-required';
import { ModalLoadingError } from '../../common/error-state/modal-loading-error';
import { CancelButton } from '../../common/modal/cancel-button';
import { DatasourceModal } from '../../common/modal/datasource-modal';
import { AssetsSearchContainer } from '../search-container';
import { AssetsSearchContainerLoading } from '../search-container/loading-state';
import { type AssetsConfigModalProps, type AssetsDatasourceParameters } from '../types';

import { modalMessages } from './messages';
import { RenderAssetsContent } from './render-assets-content';

type ErrorState = 'permission' | 'network';

const VERSION_TWO = '2';

const modalBodyErrorWrapperStyles = css({
	alignItems: 'center',
	display: 'grid',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	height: 420,
});

const AssetsModalTitle = (
	<ModalTitle>
		<FormattedMessage {...modalMessages.insertObjectsTitle} />
	</ModalTitle>
);

const PlainAssetsConfigModal = (props: AssetsConfigModalProps) => {
	const {
		datasourceId,
		parameters: initialParameters,
		onCancel,
		onInsert,
		visibleColumnKeys: initialVisibleColumnKeys,
	} = props;
	const [aql, setAql] = useState(initialParameters?.aql);
	const [schemaId, setSchemaId] = useState(initialParameters?.schemaId);
	const apiVersion = initialParameters?.version;
	const [visibleColumnKeys, setVisibleColumnKeys] = useState(
		apiVersion !== VERSION_TWO ? [] : initialVisibleColumnKeys,
	);
	const [isNewSearch, setIsNewSearch] = useState<boolean>(false);
	const [errorState, setErrorState] = useState<ErrorState | undefined>();
	const { fireEvent } = useDatasourceAnalyticsEvents();
	const experienceId = useDatasourceExperienceId();

	const {
		workspaceId,
		workspaceError,
		existingObjectSchema,
		existingObjectSchemaError,
		objectSchemas,
		objectSchemasError,
		totalObjectSchemas,
		assetsClientLoading,
	} = useAssetsClient(initialParameters as AssetsDatasourceParameters | undefined);

	/* ------------------------------ PERMISSIONS ------------------------------ */
	useEffect(() => {
		if (workspaceError) {
			// If a workspaceError occurs this is a critical error
			if (workspaceError instanceof PermissionError) {
				setErrorState('permission');
			} else {
				setErrorState('network');
			}
		}
	}, [workspaceError]);

	useEffect(() => {
		if (objectSchemasError) {
			// We only care about permission errors for objectSchemas fetching as the user can retry this action
			if (objectSchemasError instanceof PermissionError) {
				setErrorState('permission');
			}
		}
	}, [objectSchemasError]);

	useEffect(() => {
		if (existingObjectSchemaError) {
			// We only care about permission errors for existingObjectSchema fetching as the user can retry this action
			if (existingObjectSchemaError instanceof PermissionError) {
				setErrorState('permission');
			}
		}
	}, [existingObjectSchemaError]);
	/* ------------------------------ END PERMISSIONS ------------------------------ */

	const parameters = useMemo<AssetsDatasourceParameters>(
		() => ({
			aql: aql || '',
			schemaId: schemaId || '',
			workspaceId: workspaceId || '',
			version: VERSION_TWO,
		}),
		[aql, schemaId, workspaceId],
	);

	const isParametersSet = !!(aql && workspaceId && schemaId);
	const {
		status,
		onNextPage,
		responseItems,
		responseItemIds,
		reset,
		loadDatasourceDetails,
		hasNextPage,
		columns,
		defaultVisibleColumnKeys,
		extensionKey = null,
		destinationObjectTypes,
		totalCount,
	} = useDatasourceTableState({
		datasourceId,
		parameters: isParametersSet ? parameters : undefined,
		fieldKeys: isNewSearch ? [] : visibleColumnKeys,
	});

	/* ------------------------------ OBSERVABILITY ------------------------------ */
	const searchCount = useRef(0);
	const userInteractions = useUserInteractions();
	const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);
	const isDataReady = (visibleColumnKeys || []).length > 0;

	const analyticsPayload = useMemo(() => {
		return {
			extensionKey: extensionKey,
			destinationObjectTypes: destinationObjectTypes,
		};
	}, [destinationObjectTypes, extensionKey]);

	useEffect(() => {
		// We only want to send modal ready event once after we've fetched the schema count
		if (totalObjectSchemas !== undefined) {
			fireEvent('ui.modal.ready.datasource', {
				schemasCount: totalObjectSchemas,
				instancesCount: null,
			});
		}
	}, [fireEvent, totalObjectSchemas]);

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

		if (!isResolved || !totalCount) {
			return;
		}

		if (totalCount > 1) {
			fireTableViewedEvent();
		}
	}, [fireTableViewedEvent, status, totalCount]);

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
		canBeLink: false,
		extensionKey,
	});

	useColumnPickerRenderedFailedUfoExperience(status, experienceId);
	/* ------------------------------ END OBSERVABILITY ------------------------------ */

	const onVisibleColumnKeysChange = useCallback((visibleColumnKeys: string[]) => {
		setVisibleColumnKeys(visibleColumnKeys);
		setIsNewSearch(false);
	}, []);

	useEffect(() => {
		const newVisibleColumnKeys =
			initialVisibleColumnKeys && initialVisibleColumnKeys.length > 0 && apiVersion === VERSION_TWO
				? initialVisibleColumnKeys
				: defaultVisibleColumnKeys;
		setVisibleColumnKeys(newVisibleColumnKeys);
	}, [initialVisibleColumnKeys, defaultVisibleColumnKeys, apiVersion]);

	useEffect(() => {
		if (isNewSearch) {
			setVisibleColumnKeys(defaultVisibleColumnKeys);
		}
	}, [defaultVisibleColumnKeys, isNewSearch]);

	useEffect(() => {
		visibleColumnCount.current = (visibleColumnKeys ?? []).length;
	}, [visibleColumnKeys]);

	const isDisabled =
		!!errorState || status !== 'resolved' || assetsClientLoading || !aql || !schemaId;

	const isEditingExistingTable = !!(
		initialParameters?.aql &&
		initialParameters?.schemaId &&
		initialParameters?.workspaceId
	);

	const retrieveUrlForSmartCardRender = useCallback(() => {
		const [data] = responseItems;
		// agreement with BE that we will use `key` for rendering smartlink
		return (data?.key?.data as Link)?.url;
	}, [responseItems]);

	const onInsertPressed = useCallback(
		(e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			if (!aql || !schemaId || !workspaceId) {
				return;
			}

			const insertButtonClickedEvent = analyticsEvent.update({
				actionSubjectId: 'insert',
				attributes: {
					...analyticsPayload,
					totalItemCount: totalCount || 0,
					displayedColumnCount: visibleColumnCount.current,
					display: DatasourceDisplay.DATASOURCE_TABLE,
					searchCount: searchCount.current,
					searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
					actions: userInteractions.get(),
				},
				eventType: 'ui',
			});
			const consumerEvent = insertButtonClickedEvent.clone() ?? undefined;
			insertButtonClickedEvent.fire(EVENT_CHANNEL);

			const firstAssetUrl = retrieveUrlForSmartCardRender();
			if (responseItems.length === 1 && firstAssetUrl) {
				onInsert(
					{
						type: 'inlineCard',
						attrs: {
							url: firstAssetUrl,
						},
					},
					consumerEvent,
				);
			} else {
				onInsert(
					buildDatasourceAdf({
						id: datasourceId,
						parameters: {
							workspaceId,
							aql,
							schemaId,
							version: VERSION_TWO,
						},
						views: [
							{
								type: 'table',
								properties: {
									columns: (visibleColumnKeys ?? []).map((key) => ({ key })),
								},
							},
						],
					}),
					consumerEvent,
				);
			}
		},
		[
			aql,
			schemaId,
			workspaceId,
			analyticsPayload,
			totalCount,
			userInteractions,
			retrieveUrlForSmartCardRender,
			responseItems.length,
			onInsert,
			datasourceId,
			visibleColumnKeys,
		],
	);

	const handleOnSearch = useCallback(
		(searchAql: string, searchSchemaId: string) => {
			if (schemaId !== searchSchemaId || aql !== searchAql || status === 'rejected') {
				searchCount.current++;
				if (schemaId !== searchSchemaId) {
					userInteractions.add(DatasourceAction.SCHEMA_UPDATED);
				}
				if (aql !== searchAql) {
					userInteractions.add(DatasourceAction.QUERY_UPDATED);
				}
				setAql(searchAql);
				setSchemaId(searchSchemaId);
				setVisibleColumnKeys([]);
				setIsNewSearch(true);
				reset({ shouldForceRequest: true, shouldResetColumns: true });
			}
		},
		[aql, reset, schemaId, status, userInteractions],
	);

	const renderErrorState = useCallback(() => {
		if (errorState) {
			switch (errorState) {
				case 'permission':
					return <AccessRequired />;
				case 'network':
					return <ModalLoadingError />;
				default:
					return <ModalLoadingError />;
			}
		}
	}, [errorState]);

	const renderModalTitleContent = useCallback(() => {
		if (errorState) {
			return undefined;
		} else {
			if (!workspaceId || assetsClientLoading) {
				return <AssetsSearchContainerLoading modalTitle={AssetsModalTitle} />;
			}
			return (
				<AssetsSearchContainer
					workspaceId={workspaceId}
					initialSearchData={{
						aql: initialParameters?.aql,
						objectSchema: existingObjectSchema,
						objectSchemas,
					}}
					onSearch={handleOnSearch}
					modalTitle={AssetsModalTitle}
					isSearching={status === 'loading'}
					onCancel={onCancel}
				/>
			);
		}
	}, [
		errorState,
		workspaceId,
		assetsClientLoading,
		initialParameters?.aql,
		existingObjectSchema,
		objectSchemas,
		handleOnSearch,
		status,
		onCancel,
	]);

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
				<DatasourceModal testId="asset-datasource-modal" onClose={onCancel}>
					<ModalHeader>{renderModalTitleContent()}</ModalHeader>
					<ModalBody>
						{errorState ? (
							<div css={modalBodyErrorWrapperStyles}>{renderErrorState()}</div>
						) : (
							<RenderAssetsContent
								isFetchingInitialData={assetsClientLoading}
								status={status}
								responseItems={responseItems}
								responseItemIds={responseItemIds}
								visibleColumnKeys={visibleColumnKeys}
								onVisibleColumnKeysChange={onVisibleColumnKeysChange}
								datasourceId={datasourceId}
								aql={aql}
								schemaId={schemaId}
								onNextPage={onNextPage}
								hasNextPage={hasNextPage}
								loadDatasourceDetails={loadDatasourceDetails}
								columns={columns}
								defaultVisibleColumnKeys={defaultVisibleColumnKeys}
							/>
						)}
					</ModalBody>
					<ModalFooter>
						<CancelButton
							onCancel={onCancel}
							getAnalyticsPayload={getCancelButtonAnalyticsPayload}
							testId={'asset-datasource-modal--cancel-button'}
						/>
						<Button
							appearance="primary"
							onClick={onInsertPressed}
							isDisabled={isDisabled}
							testId={'assets-datasource-modal--insert-button'}
						>
							<FormattedMessage
								{...(isEditingExistingTable
									? modalMessages.updateObjectsButtonText
									: modalMessages.insertIssuesButtonText)}
								values={{
									objectsCount: responseItems.length,
								}}
							/>
						</Button>
					</ModalFooter>
				</DatasourceModal>
			</ModalTransition>
		</IntlMessagesProvider>
	);
};

const analyticsContextAttributes: AnalyticsContextAttributesType = {
	dataProvider: 'jsm-assets',
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

export const AssetsConfigModal = withAnalyticsContext(contextData)(
	(props: AssetsConfigModalProps) => (
		<StoreContainer>
			<DatasourceExperienceIdProvider>
				<UserInteractionsProvider>
					<PlainAssetsConfigModal {...props} />
				</UserInteractionsProvider>
			</DatasourceExperienceIdProvider>
		</StoreContainer>
	),
);
