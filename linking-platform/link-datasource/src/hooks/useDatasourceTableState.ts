import { useCallback, useEffect, useRef, useState } from 'react';

import isEqual from 'lodash/isEqual';

import {
	DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
	useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import {
	type DatasourceDataRequest,
	type DatasourceDataResponseItem,
	type DatasourceDataSchema,
	type DatasourceMeta,
	type DatasourceParameters,
	type DatasourceResponseSchemaProperty,
	type DatasourceTableStatusType,
} from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { useDatasourceActions } from '../state';
import { useDiscoverActions } from '../state/actions';

import useErrorLogger from './useErrorLogger';

export interface onNextPageProps {
	isSchemaFromData?: boolean;
	shouldRequestFirstPage?: boolean;
	shouldForceRequest?: boolean;
}

export type NextPageType = (requestInfo?: onNextPageProps) => void;

interface ResetOptions {
	/** Used to force a request to be made even if a cache already exists for it */
	shouldForceRequest?: boolean;
	/** Resets current column data from a datasource table when issuing the new request */
	shouldResetColumns?: boolean;
}

export interface DatasourceTableState {
	/** The current status of the table for rendering of the different UI states (e.g.: loading, error, etc). */
	status: DatasourceTableStatusType;
	/** Requests the available data with pagination and also sets column headers if not already available */
	onNextPage: NextPageType;
	/** Resets state of the hook to be as if it is a first time it is being called. */
	reset: (options?: ResetOptions) => void;
	/** Requests the available column schemas that can be displayed within the table */
	loadDatasourceDetails: () => void;
	/** Item ids to be hydrated from a store by consumers [NOTE: They must be in the same order as responseItems] */
	responseItemIds: string[];
	/** Items to be rendered within the table */
	responseItems: DatasourceDataResponseItem[];
	/** Indicates whether there is still more data that can be paginated */
	hasNextPage: boolean;
	/** All available columns for a datasource table to display */
	columns: DatasourceResponseSchemaProperty[];
	/** The keys belonging to all of the currently visible columns in a table */
	defaultVisibleColumnKeys: string[];
	/** Total count of response items available for pagination in a query */
	totalCount?: number;
	/** List of objects types that will be included in the reponse (e.g. 'issues' for Jira) */
	destinationObjectTypes: string[];
	/** Used as an indicated of which provider type is being used - originates from ORS */
	extensionKey?: string;
	/** Indicates which provider name is being used - originates from ORS */
	providerName?: string;
	/** Auth info used to connect to the provider account. */
	authDetails?: DatasourceMeta['auth'];
}

export interface DatasourceTableStateProps {
	/** Unique identifier for which type of datasource is being rendered and for making its requests */
	datasourceId: string;
	/** Parameters for making the data requests necessary to render data within the table */
	parameters?: DatasourceParameters;
	/** Keys for each of the columns to be shown in the table */
	fieldKeys?: string[];
}

export const useDatasourceTableState = ({
	datasourceId,
	parameters,
	fieldKeys = [],
}: DatasourceTableStateProps): DatasourceTableState => {
	const { fireEvent } = useDatasourceAnalyticsEvents();
	const { captureError } = useErrorLogger({ datasourceId });
	const { onAddItems } = useDatasourceActions();
	const { discoverActions } = useDiscoverActions();

	const idFieldCount = 1;
	const keyFieldCount = 1;

	const [initialEmptyArray] = useState([]);
	const [defaultVisibleColumnKeys, setDefaultVisibleColumnKeys] = useState<
		DatasourceTableState['defaultVisibleColumnKeys']
	>([]);
	const [lastRequestedFieldKeys, setLastRequestedFieldKeys] = useState<string[]>([]);
	const [fullSchema, setFullSchema] = useState<DatasourceDataSchema>({
		properties: [],
	});
	const [status, setStatus] = useState<DatasourceTableState['status']>('empty');
	const [authDetails, setAuthDetails] = useState<DatasourceTableState['authDetails']>([]);
	const [responseItems, setResponseItems] =
		useState<DatasourceTableState['responseItems']>(initialEmptyArray);
	const [responseItemIds, setResponseItemIds] = useState<string[]>(initialEmptyArray);
	const [hasNextPage, setHasNextPage] = useState<DatasourceTableState['hasNextPage']>(true);
	const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
	const [columns, setColumns] = useState<DatasourceTableState['columns']>([]);
	const [totalCount, setTotalCount] = useState<DatasourceTableState['totalCount']>(undefined);
	const [shouldForceRequest, setShouldForceRequest] = useState<boolean>(false);
	const [destinationObjectTypes, setDestinationObjectTypes] = useState<
		DatasourceTableState['destinationObjectTypes']
	>([]);
	const [extensionKey, setExtensionKey] = useState<DatasourceTableState['extensionKey']>();
	const [providerName, setProviderName] = useState<DatasourceTableState['providerName']>(undefined);
	const abortController = useRef(new AbortController());

	const { getDatasourceData, getDatasourceDetails } = useDatasourceClientExtension();

	const loadDatasourceDetails = useCallback(async () => {
		if (!parameters) {
			return;
		}

		try {
			const {
				meta: { access, auth },
				data: { schema },
			} = await getDatasourceDetails(datasourceId, {
				parameters,
			});

			if (access === 'unauthorized' || access === 'forbidden') {
				setStatus(access);
				setAuthDetails(auth || initialEmptyArray);
				return;
			}

			const isColumnNotPresentInCurrentColumnsList = (col: DatasourceResponseSchemaProperty) =>
				!columns.find((column) => column.key === col.key);

			const allColumns = schema.properties;
			const newColumns = allColumns.filter(isColumnNotPresentInCurrentColumnsList);

			newColumns.length > 0 && setColumns([...columns, ...newColumns]);
		} catch (e) {
			captureError('loadDatasourceDetails', e);

			if (e instanceof Response && e.status === 401) {
				setStatus('unauthorized');
				return;
			}

			if (e instanceof Response && e.status === 403) {
				setStatus('forbidden');
				return;
			}

			setStatus('rejected');
		}
	}, [captureError, columns, datasourceId, getDatasourceDetails, parameters, initialEmptyArray]);

	const applySchemaProperties = useCallback(
		(schema: DatasourceDataSchema, fieldKeys: string[]) => {
			let { properties, defaultProperties = [] } = schema;
			let propertiesToBeUsed = properties;
			const propertyKeysToBeUsed =
				Array.isArray(fieldKeys) && fieldKeys.length > 0 ? fieldKeys : defaultProperties;
			if (fieldKeys.length > 0 || defaultProperties.length > 0) {
				propertiesToBeUsed = properties.filter((property) => {
					return propertyKeysToBeUsed.includes(property.key);
				});
			}

			/*Jira adds identifier fields like id and key to all data responses
      Since defaultProperties already send back the keyField, we are accounting only
      for the idField when we are using defaultProperties
      */
			if (
				properties.length > fieldKeys.length + idFieldCount + keyFieldCount &&
				properties.length > defaultProperties.length + idFieldCount
			) {
				setFullSchema(schema);
			}
			if (!isEqual(columns, propertiesToBeUsed)) {
				setColumns(propertiesToBeUsed);
			}

			const newProperties = propertiesToBeUsed.map((prop) => prop.key);

			// when loading for the first time, we will need to set default visible props as /data does not give you that info
			// also, since we dont pass any fields, we will need to set this info as lastRequestedFieldKeys
			if (!isEqual(defaultVisibleColumnKeys, newProperties)) {
				setDefaultVisibleColumnKeys(newProperties);
			}

			if (!isEqual(lastRequestedFieldKeys, newProperties)) {
				setLastRequestedFieldKeys(newProperties);
			}
		},
		[columns, defaultVisibleColumnKeys, lastRequestedFieldKeys],
	);

	const onNextPage = useCallback(
		async (requestInfo: onNextPageProps = {}) => {
			let currentAbortController: AbortController | undefined;
			/**
			 * Abort whichever request was made before this one.
			 */
			abortController.current.abort();
			/**
			 * Setup new abort controller for this request.
			 */
			abortController.current = new AbortController();
			currentAbortController = abortController.current;

			if (!parameters) {
				return;
			}
			const {
				isSchemaFromData = true,
				shouldRequestFirstPage,
				shouldForceRequest = false,
			} = requestInfo;

			const isFullSchemaLoaded = fullSchema.properties.length > 0;
			const datasourceDataRequest: DatasourceDataRequest = {
				parameters,
				pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
				pageCursor: shouldRequestFirstPage ? undefined : nextCursor,
				fields: fieldKeys,
				includeSchema: isFullSchemaLoaded ? false : isSchemaFromData,
			};

			setStatus('loading');

			try {
				const {
					meta: { access, destinationObjectTypes, product, extensionKey, auth, providerName },
					data: { items, nextPageCursor, totalCount, schema },
				} = await getDatasourceData(datasourceId, datasourceDataRequest, shouldForceRequest);
				/**
				 * Let the response finish and store in cache, but throw error if signal is aborted
				 */
				if (currentAbortController?.signal.aborted) {
					throw new Error('Aborted');
				}

				setExtensionKey(extensionKey);
				setProviderName(providerName);

				if (access === 'unauthorized' || access === 'forbidden') {
					setStatus(access);
					setAuthDetails(auth || initialEmptyArray);
					return;
				}
				setDestinationObjectTypes(destinationObjectTypes);
				setTotalCount(totalCount);
				setNextCursor(nextPageCursor);
				setResponseItems((currentResponseItems) => {
					if (shouldRequestFirstPage) {
						return items;
					}
					return [...currentResponseItems, ...items];
				});

				if (fg('enable_datasource_react_sweet_state')) {
					/**
					 * Product is typed as any.
					 */
					const integrationKey: unknown = product;
					const newIds = onAddItems(
						items,
						typeof integrationKey === 'string' ? integrationKey : undefined,
					);
					setResponseItemIds((currentIds) => [...currentIds, ...newIds]);

					if (fg('platform-datasources-enable-two-way-sync')) {
						if (typeof integrationKey === 'string') {
							const aris = items.reduce<string[]>(
								(acc, item) => (typeof item.ari?.data === 'string' ? [...acc, item.ari.data] : acc),
								[],
							);

							if (aris.length) {
								discoverActions({ aris, integrationKey, fieldKeys });
							}
						}
					}
				}

				setHasNextPage(Boolean(nextPageCursor));

				if (fieldKeys.length > 0) {
					setLastRequestedFieldKeys(fieldKeys);
				}

				if (
					((isSchemaFromData && schema) || fullSchema.properties.length > 0) &&
					items.length > 0
				) {
					applySchemaProperties(schema || fullSchema, fieldKeys);
				}

				const isUserLoadingNextPage = responseItems.length !== 0 && !shouldRequestFirstPage;
				if (isUserLoadingNextPage) {
					const currentLoadedItemCount = responseItems.length;
					const newlyLoadedItemCount = items?.length || 0;

					fireEvent('track.nextItem.loaded', {
						extensionKey,
						destinationObjectTypes,
						loadedItemCount: currentLoadedItemCount + newlyLoadedItemCount,
					});
				}
				setStatus('resolved');
			} catch (e: any) {
				if (e.message === 'Aborted') {
					/**
					 * If the request was aborted, we don't want to change the status of the table
					 * as we are already loading the next request attempt
					 *
					 * Is not an exceptional state, do not need to captureError
					 */
					return;
				}

				captureError('onNextPage', e);

				if (e instanceof Response && e.status === 401) {
					setStatus('unauthorized');
					return;
				}

				if (e instanceof Response && e.status === 403) {
					setStatus('forbidden');
					return;
				}

				setStatus('rejected');
			}
		},
		[
			captureError,
			parameters,
			fieldKeys,
			nextCursor,
			responseItems,
			setResponseItemIds,
			onAddItems,
			getDatasourceData,
			datasourceId,
			applySchemaProperties,
			fireEvent,
			fullSchema,
			initialEmptyArray,
			discoverActions,
		],
	);

	const reset = useCallback(
		(options?: ResetOptions) => {
			setResponseItems(initialEmptyArray);
			setResponseItemIds(initialEmptyArray);
			setHasNextPage(true);
			setNextCursor(undefined);
			setTotalCount(undefined);
			setLastRequestedFieldKeys(initialEmptyArray);
			setAuthDetails(initialEmptyArray);
			setFullSchema({ properties: initialEmptyArray });
			setShouldForceRequest(options?.shouldForceRequest || false);
			if (options?.shouldResetColumns) {
				setColumns(initialEmptyArray);
				setDefaultVisibleColumnKeys(initialEmptyArray);
			}

			// setting the status earlier is triggering useEffects without all reset state values, hence placing this as the last state reset item
			setStatus('empty');
		},
		[initialEmptyArray],
	);

	// this takes care of requesting /data initially
	useEffect(() => {
		const isEmptyState =
			Object.keys(parameters || {}).length > 0 &&
			lastRequestedFieldKeys.length === 0 &&
			status === 'empty';

		if (isEmptyState) {
			void onNextPage({
				shouldForceRequest,
			});
			setShouldForceRequest(false);
		}
	}, [lastRequestedFieldKeys, onNextPage, parameters, shouldForceRequest, status]);

	// this takes care of requesting /data when user selects/unselects a column
	useEffect(() => {
		const canHaveNewColumns = fieldKeys.length > 0 && lastRequestedFieldKeys.length > 0;

		if (canHaveNewColumns) {
			const hasNewColumns = fieldKeys.some((key) => !lastRequestedFieldKeys.includes(key));

			if (!hasNewColumns) {
				return;
			}

			// check if each fieldKey already appears at least once in the object keys of each response item
			const hasDataForColumns = responseItems.some((responseItem) => {
				const responseItemKeys = Object.keys(responseItem);
				return fieldKeys.every((key) => responseItemKeys.includes(key));
			});

			if (!hasDataForColumns) {
				reset();
				void onNextPage({
					isSchemaFromData: false,
					shouldRequestFirstPage: true,
				});
			}
		}
	}, [fieldKeys, lastRequestedFieldKeys, responseItems, reset, onNextPage]);

	useEffect(() => {
		return () => abortController.current.abort();
	}, []);

	return {
		status,
		onNextPage,
		responseItems,
		responseItemIds,
		reset,
		loadDatasourceDetails,
		hasNextPage,
		columns,
		defaultVisibleColumnKeys,
		totalCount,
		extensionKey,
		providerName,
		destinationObjectTypes,
		authDetails,
	};
};
