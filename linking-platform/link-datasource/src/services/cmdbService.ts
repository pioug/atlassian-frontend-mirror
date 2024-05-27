import { request } from '@atlaskit/linking-common';

import { type EventKey } from '../analytics/generated/analytics.types';
import type createEventPayload from '../analytics/generated/create-event-payload';
import {
  type AqlValidateResponse,
  type FetchObjectSchemaResponse,
  type FetchObjectSchemasResponse,
  type GetWorkspaceDetailsResponse,
} from '../types/assets/types';

import {
  FetchError,
  getStatusCodeGroup,
  mapFetchErrors,
  PermissionError,
} from './cmdbService.utils';

type AnalyticsFireEvent = <K extends EventKey>(
  ...params: Parameters<typeof createEventPayload<K>>
) => void;

export const getWorkspaceId = async (fireEvent?: AnalyticsFireEvent) => {
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
    fireEvent && fireEvent('operational.getWorkspaceId.success', {});
    return workspaceDetailsResponse.results[0].id;
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      fireEvent &&
        fireEvent('operational.getWorkspaceId.failed', {
          statusCodeGroup: getStatusCodeGroup(error),
        });
      // Only 429 and5xx errors will be treated as FetchErrors otherwise PermissionError
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
  fireEvent?: AnalyticsFireEvent,
) => {
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`;
  try {
    const response = await request<AqlValidateResponse>(
      'post',
      url,
      {
        qlQuery: data.qlQuery,
        context: 'SMART_LINKS',
      },
      undefined,
      [200, 201, 202, 203, 204],
    );
    fireEvent && fireEvent('operational.validateAql.success', {});
    return response;
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      fireEvent &&
        fireEvent('operational.validateAql.failed', {
          statusCodeGroup: getStatusCodeGroup(error),
        });
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
  fireEvent?: AnalyticsFireEvent,
) => {
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/${schemaId}`;
  try {
    const response = await request<FetchObjectSchemaResponse>(
      'get',
      url,
      undefined,
      undefined,
      [200, 201, 202, 203, 204],
    );
    fireEvent && fireEvent('operational.objectSchema.success', {});
    return response;
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      fireEvent &&
        fireEvent('operational.objectSchema.failed', {
          statusCodeGroup: getStatusCodeGroup(error),
        });
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
  fireEvent?: AnalyticsFireEvent,
) => {
  const queryParams = new URLSearchParams();
  queryParams.set('maxResults', '20');
  queryParams.set('includeCounts', 'false');
  query && queryParams.set('query', query);
  const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?${queryParams}`;
  try {
    const response = await request<FetchObjectSchemasResponse>(
      'get',
      url,
      undefined,
      undefined,
      [200, 201, 202, 203, 204],
    );
    fireEvent && fireEvent('operational.objectSchemas.success', {});
    return response;
  } catch (err) {
    let error = mapFetchErrors(err);
    if (error instanceof FetchError) {
      fireEvent &&
        fireEvent('operational.objectSchemas.failed', {
          statusCodeGroup: getStatusCodeGroup(error),
        });
      if (error.statusCode === 401 || error.statusCode === 403) {
        error = new PermissionError('Failed to fetch object schemas');
      }
    }
    throw error;
  }
};
