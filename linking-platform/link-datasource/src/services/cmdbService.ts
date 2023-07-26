import { request } from '@atlaskit/linking-common';

import {
  AqlValidateResponse,
  FetchObjectSchemaResponse,
  FetchObjectSchemasResponse,
  GetWorkspaceDetailsResponse,
} from '../types/assets/types';

export const getWorkspaceId = async () => {
  const url = '/rest/servicedesk/cmdb/latest/workspace';

  const workspaceDetailsResponse = await request<GetWorkspaceDetailsResponse>(
    'get',
    url,
    undefined,
    undefined,
    [200, 201, 202, 203, 204],
  );

  if (!workspaceDetailsResponse.results?.length) {
    throw new Error('No workspace results found');
  }

  return workspaceDetailsResponse.results[0].id;
};

export const validateAql = (workspaceId: string, data: { qlQuery: string }) => {
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`;
  return request<AqlValidateResponse>(
    'post',
    url,
    {
      qlQuery: data.qlQuery,
      context: 'SMART_LINKS',
    },
    undefined,
    [200, 201, 202, 203, 204],
  );
};

export const fetchObjectSchema = (workspaceId: string, schemaId: string) => {
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/${schemaId}`;
  return request<FetchObjectSchemaResponse>(
    'get',
    url,
    undefined,
    undefined,
    [200, 201, 202, 203, 204],
  );
};

export const fetchObjectSchemas = (workspaceId: string, query?: string) => {
  const queryParams = new URLSearchParams();
  queryParams.set('maxResults', '20');
  queryParams.set('includeCounts', 'false');
  query && queryParams.set('query', query);
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?${queryParams}`;
  return request<FetchObjectSchemasResponse>(
    'get',
    url,
    undefined,
    undefined,
    [200, 201, 202, 203, 204],
  );
};
