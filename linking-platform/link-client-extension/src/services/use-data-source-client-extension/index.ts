import { useCallback, useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { request } from '@atlaskit/linking-common';
import type {
  DatasourceDataRequest,
  DatasourceDataResponse,
  DatasourceParameters,
  DatasourceResponse,
} from '@atlaskit/linking-types';

import { useResolverUrl } from '../use-resolver-url';

export const useDatasourceClientExtension = () => {
  const {
    connections: { client },
  } = useSmartLinkContext();
  const resolverUrl = useResolverUrl(client);

  const getDatasourceDetails = useCallback(
    (datasourceId: string, data: DatasourceParameters) =>
      request<DatasourceResponse>(
        'post',
        `${resolverUrl}/datasource/${datasourceId}/fetch/details`,
        data,
        undefined,
        [200, 201, 202, 203, 204],
      ),
    [resolverUrl],
  );

  const getDatasourceData = useCallback(
    (datasourceId: string, data: DatasourceDataRequest) =>
      request<DatasourceDataResponse>(
        'post',
        `${resolverUrl}/datasource/${datasourceId}/fetch/data`,
        data,
        undefined,
        [200, 201, 202, 203, 204],
      ),
    [resolverUrl],
  );

  return useMemo(
    () => ({ getDatasourceDetails, getDatasourceData }),
    [getDatasourceDetails, getDatasourceData],
  );
};
