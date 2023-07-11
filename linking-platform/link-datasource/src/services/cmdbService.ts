import { request } from '@atlaskit/linking-common';

import {
  AqlValidateResponse,
  FetchObjectSchemasResponse,
  GetWorkspaceDetailsResponse,
} from '../types/assets/types';

export const getWorkspaceId = async (hostname?: string) => {
  const url = `${hostname || ''}/rest/servicedesk/cmdb/latest/workspace`;

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

export const validateAql = (
  workspaceId: string,
  data: { qlQuery: string },
  hostname?: string,
) => {
  const url = `${
    hostname || ''
  }/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`;
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

export const fetchObjectSchemas = (workspaceId: string, hostname?: string) => {
  const url = `${
    hostname || ''
  }/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?maxResults=100`;
  return request<FetchObjectSchemasResponse>(
    'get',
    url,
    undefined,
    undefined,
    [200, 201, 202, 203, 204],
  );
};
