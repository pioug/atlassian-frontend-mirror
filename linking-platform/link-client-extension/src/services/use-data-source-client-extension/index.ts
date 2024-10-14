import { useCallback, useMemo } from 'react';

import { LRUMap } from 'lru_map';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { request } from '@atlaskit/linking-common';
import type {
	ActionsDiscoveryRequest,
	ActionsDiscoveryResponse,
	ActionsServiceDiscoveryResponse,
	AtomicActionExecuteRequest,
	AtomicActionExecuteResponse,
	DatasourceDataRequest,
	DatasourceDataResponse,
	DatasourceDetailsRequest,
	DatasourceDetailsResponse,
} from '@atlaskit/linking-types';

import { useResolverUrl } from '../use-resolver-url';

const URL_RESPONSE_CACHE_SIZE = 50;

export const datasourceDetailsResponsePromiseCache = new LRUMap<
	string,
	Promise<DatasourceDetailsResponse>
>(URL_RESPONSE_CACHE_SIZE);

export const datasourceDataResponsePromiseCache = new LRUMap<
	string,
	Promise<DatasourceDataResponse>
>(URL_RESPONSE_CACHE_SIZE);

export const datasourceActionsPermissionsPromiseCache = new LRUMap<
	string,
	Promise<ActionsServiceDiscoveryResponse>
>(URL_RESPONSE_CACHE_SIZE);

export const DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE = 20;

export const useDatasourceClientExtension = () => {
	const {
		connections: { client },
	} = useSmartLinkContext();
	const resolverUrl = useResolverUrl(client);

	const cachedRequest = async <R>(
		cacheKeyId: string,
		data: DatasourceDetailsRequest | DatasourceDataRequest | ActionsDiscoveryRequest,
		url: string,
		lruMap: LRUMap<string, Promise<R>>,
		force: boolean,
	) => {
		const cacheKeyData = {
			...data,
			// Sort fields to use cached version of response regardless of the order
			...('fields' in data ? { fields: [...(data.fields || [])].sort() } : {}),
			...('fieldKeys' in data ? { fieldKeys: [...(data.fieldKeys || [])].sort() } : {}),
		};
		const cacheKey = JSON.stringify({ cacheKeyId, cacheKeyData });
		if (force) {
			lruMap.delete(cacheKey);
		}
		let responsePromise = lruMap.get(cacheKey);
		if (responsePromise) {
			return responsePromise;
		}

		const headers = {
			/**
			 * This header exists to enable the backend to process relative time, eg: "today", with respect to user timezone.
			 * eg: used in "confluence-object-provider" to process confluence SLLV requests to filter data for relative time.
			 */
			'origin-timezone': Intl?.DateTimeFormat().resolvedOptions().timeZone,
		};

		try {
			responsePromise = request<R>('post', url, data, headers, [200, 201, 202, 203, 204]);
			lruMap.set(cacheKey, responsePromise);
			return await responsePromise;
		} catch (e) {
			lruMap.delete(cacheKey);
			throw e;
		}
	};

	const uncachedRequest = async <R>(data: AtomicActionExecuteRequest, url: string) => {
		const responsePromise = request<R>('post', url, data, undefined, [200, 201, 202, 203, 204]);
		return responsePromise;
	};

	const getDatasourceDetails = useCallback(
		async (datasourceId: string, data: DatasourceDetailsRequest, force: boolean = false) =>
			cachedRequest<DatasourceDetailsResponse>(
				datasourceId,
				data,
				`${resolverUrl}/datasource/${datasourceId}/fetch/details`,
				datasourceDetailsResponsePromiseCache,
				force,
			),
		[resolverUrl],
	);

	const getDatasourceData = useCallback(
		async (datasourceId: string, data: DatasourceDataRequest, force: boolean = false) =>
			cachedRequest<DatasourceDataResponse>(
				datasourceId,
				data,
				`${resolverUrl}/datasource/${datasourceId}/fetch/data`,
				datasourceDataResponsePromiseCache,
				force,
			),
		[resolverUrl],
	);

	const getDatasourceActionsAndPermissions = useCallback(
		async (data: ActionsDiscoveryRequest, force: boolean = false) => {
			const resolvedCacheIdKey = 'datasourceId' in data ? data.datasourceId : data.integrationKey;
			// This is just to prevent empty string being passed up to ORS and causing issues.
			if (!resolvedCacheIdKey) {
				throw new Error('No target was supplied to retrieve actions for');
			}
			return cachedRequest<ActionsDiscoveryResponse>(
				resolvedCacheIdKey,
				data,
				`${resolverUrl}/actions`,
				datasourceActionsPermissionsPromiseCache,
				force,
			);
		},
		[resolverUrl],
	);

	const executeAtomicAction = useCallback(
		async (data: AtomicActionExecuteRequest) =>
			uncachedRequest<AtomicActionExecuteResponse>(data, `${resolverUrl}/actions/execute`),
		[resolverUrl],
	);

	const invalidateDatasourceDataCacheByAri = useCallback((ari: string) => {
		datasourceDataResponsePromiseCache.forEach(async (value, key) => {
			const response = await value;
			const targetFound = response.data.items.some((item) => {
				return item['ari']?.data === ari;
			});
			if (targetFound) {
				datasourceDataResponsePromiseCache.delete(key);
			}
		});
	}, []);

	return useMemo(
		() => ({
			getDatasourceDetails,
			getDatasourceData,
			getDatasourceActionsAndPermissions,
			executeAtomicAction,
			invalidateDatasourceDataCacheByAri,
		}),
		[
			getDatasourceDetails,
			getDatasourceData,
			getDatasourceActionsAndPermissions,
			executeAtomicAction,
			invalidateDatasourceDataCacheByAri,
		],
	);
};
