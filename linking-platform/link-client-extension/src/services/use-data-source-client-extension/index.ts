import { useCallback, useMemo } from 'react';

import { LRUMap } from 'lru_map';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { request } from '@atlaskit/linking-common';
import type {
	DatasourceDataRequest,
	DatasourceDataResponse,
	DatasourceDetailsRequest,
	DatasourceDetailsResponse,
} from '@atlaskit/linking-types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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

export const DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE = 20;

export const useDatasourceClientExtension = () => {
	const {
		connections: { client },
	} = useSmartLinkContext();
	const resolverUrl = useResolverUrl(client);

	const cachedRequest = async <R>(
		datasourceId: string,
		data: DatasourceDetailsRequest | DatasourceDataRequest,
		url: string,
		lruMap: LRUMap<string, Promise<R>>,
		force: boolean,
	) => {
		const cacheKeyData = {
			...data,
			// Sort fields to use cached version of response regardless of the order
			...('fields' in data ? { fields: [...(data.fields || [])].sort() } : {}),
		};
		const cacheKey = JSON.stringify({ datasourceId, cacheKeyData });
		if (force) {
			lruMap.delete(cacheKey);
		}
		let responsePromise = lruMap.get(cacheKey);
		if (responsePromise) {
			return responsePromise;
		}

		const headers = getBooleanFF('platform.linking-platform.datasource.add-timezone-header')
			? {
					/**
					 * This header exist to enable the backend to process relative time, eg: "today", with respect to user timezone.
					 * eg: used in "confluence-object-provider" to process confluence SLLV requests to filter data for relative time.
					 */
					'origin-timezone': Intl?.DateTimeFormat().resolvedOptions().timeZone,
				}
			: undefined;

		try {
			responsePromise = request<R>('post', url, data, headers, [200, 201, 202, 203, 204]);
			lruMap.set(cacheKey, responsePromise);
			return await responsePromise;
		} catch (e) {
			lruMap.delete(cacheKey);
			throw e;
		}
	};

	const getDatasourceDetails = useCallback(
		async (datasourceId: string, data: DatasourceDetailsRequest, force = false) =>
			cachedRequest(
				datasourceId,
				data,
				`${resolverUrl}/datasource/${datasourceId}/fetch/details`,
				datasourceDetailsResponsePromiseCache,
				force,
			),
		[resolverUrl],
	);

	const getDatasourceData = useCallback(
		async (datasourceId: string, data: DatasourceDataRequest, force = false) =>
			cachedRequest(
				datasourceId,
				data,
				`${resolverUrl}/datasource/${datasourceId}/fetch/data`,
				datasourceDataResponsePromiseCache,
				force,
			),
		[resolverUrl],
	);

	return useMemo(
		() => ({ getDatasourceDetails, getDatasourceData }),
		[getDatasourceDetails, getDatasourceData],
	);
};
