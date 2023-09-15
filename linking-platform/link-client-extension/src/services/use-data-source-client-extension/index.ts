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

  const cachedRequest = async <T, R>(
    datasourceId: string,
    data: T,
    url: string,
    lruMap: LRUMap<string, Promise<R>>,
    force: boolean,
  ) => {
    const cacheKey = JSON.stringify({ datasourceId, data });
    if (force) {
      lruMap.delete(cacheKey);
    }
    let responsePromise = lruMap.get(cacheKey);
    if (responsePromise) {
      return responsePromise;
    }
    try {
      responsePromise = request<R>(
        'post',
        url,
        data,
        undefined,
        [200, 201, 202, 203, 204],
      );
      lruMap.set(cacheKey, responsePromise);
      return await responsePromise;
    } catch (e) {
      lruMap.delete(cacheKey);
      throw e;
    }
  };

  const getDatasourceDetails = useCallback(
    async (
      datasourceId: string,
      data: DatasourceDetailsRequest,
      force = false,
    ) =>
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
