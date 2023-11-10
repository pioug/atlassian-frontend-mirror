import { request } from '@atlaskit/linking-common';

import {
  AqlValidateResponse,
  FetchObjectSchemaResponse,
  FetchObjectSchemasResponse,
  GetWorkspaceDetailsResponse,
} from '../types/assets/types';

import {
  FetchError,
  getStatusCodeGroup,
  mapFetchErrors,
  PermissionError,
} from './cmdbService.utils';

export const getWorkspaceId = async () => {
  const url = '/rest/servicedesk/cmdb/latest/workspace';

  try {
    const workspaceDetailsResponse = await request<GetWorkspaceDetailsResponse>(
      'get',
      url,
      undefined,
      undefined,
      [200, 201, 202, 203, 204],
    );
    if (!workspaceDetailsResponse.results?.length) {
      throw new PermissionError('No workspace results found');
    }
    return workspaceDetailsResponse.results[0].id;
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      // TODO Fire error operational event for workspace here before remapping to PermissionError
      // Only 429 and 5xx errors will be treated as FetchErrors otherwise PermissionError
      if (getStatusCodeGroup(error) !== '5xx' && error.statusCode !== 429) {
        error = new PermissionError('Failed to fetch workspace');
      }
    }
    throw error;
  }
};

export const validateAql = async (
  workspaceId: string,
  data: { qlQuery: string },
) => {
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`;
  try {
    return await request<AqlValidateResponse>(
      'post',
      url,
      {
        qlQuery: data.qlQuery,
        context: 'SMART_LINKS',
      },
      undefined,
      [200, 201, 202, 203, 204],
    );
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      // TODO Fire error operational event for aql here before remapping to PermissionError
      if (error.statusCode === 401 || error.statusCode === 403) {
        error = new PermissionError('Failed to fetch object schemas');
      }
    }
    throw error;
  }
};

export const fetchObjectSchema = async (
  workspaceId: string,
  schemaId: string,
) => {
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/${schemaId}`;
  try {
    return await request<FetchObjectSchemaResponse>(
      'get',
      url,
      undefined,
      undefined,
      [200, 201, 202, 203, 204],
    );
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      // TODO Fire error operational event for object schema here before remapping to PermissionError
      if (error.statusCode === 401 || error.statusCode === 403) {
        error = new PermissionError('Failed to fetch object schemas');
      }
    }
    throw error;
  }
};

export const fetchObjectSchemas = async (
  workspaceId: string,
  query?: string,
) => {
  const queryParams = new URLSearchParams();
  queryParams.set('maxResults', '20');
  queryParams.set('includeCounts', 'false');
  query && queryParams.set('query', query);
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?${queryParams}`;
  try {
    return await request<FetchObjectSchemasResponse>(
      'get',
      url,
      undefined,
      undefined,
      [200, 201, 202, 203, 204],
    );
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      // TODO Fire error operational event for object schemas here before remapping to PermissionError
      if (error.statusCode === 401 || error.statusCode === 403) {
        error = new PermissionError('Failed to fetch object schemas');
      }
    }
    throw error;
  }
};
