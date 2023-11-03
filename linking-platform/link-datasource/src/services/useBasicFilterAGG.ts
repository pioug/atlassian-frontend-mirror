import { useCallback, useMemo } from 'react';

import { EnvironmentsKeys, useSmartLinkContext } from '@atlaskit/link-provider';
import { getBaseUrl } from '@atlaskit/linking-common';

import {
  BasicFilterFieldType,
  FieldValuesResponse,
  HydrateResponse,
} from '../ui/jira-issues-modal/basic-filters/types';

import { fieldValuesQuery, hydrateJQLQuery } from './utils';

const getGraphqlUrl = (envKey?: EnvironmentsKeys, baseUrlOverride?: string) => {
  const baseUrl = baseUrlOverride || getBaseUrl(envKey);
  return baseUrl ? `${baseUrl}/graphql` : '/gateway/api/graphql';
};

export const useBasicFilterAGG = () => {
  const {
    connections: { client },
  } = useSmartLinkContext();

  const gatewayGraphqlUrl = getGraphqlUrl(
    client.envKey as EnvironmentsKeys,
    client.baseUrlOverride,
  );

  const aggHeaders = useMemo(() => {
    return new Headers({
      'Content-Type': 'application/json',
      'X-ExperimentalApi': 'JiraJqlBuilder',
    });
  }, []);

  const getHydratedJQL = useCallback(
    async (cloudId: string, jql: string): Promise<HydrateResponse> => {
      const body = JSON.stringify({
        variables: {
          cloudId,
          jql,
        },
        operationName: 'hydrate',
        query: hydrateJQLQuery,
      });

      const request = new Request(gatewayGraphqlUrl, {
        method: 'POST',
        headers: aggHeaders,
        body,
      });
      try {
        const response = await fetch(request);
        return response.json();
      } catch (e: any) {
        throw new Error(e);
      }
    },
    [gatewayGraphqlUrl, aggHeaders],
  );

  const getFieldValues = useCallback(
    async (
      cloudId: string,
      jql: string,
      jqlTerm: BasicFilterFieldType,
      searchString: string,
      pageCursor?: string,
    ): Promise<FieldValuesResponse> => {
      const body = JSON.stringify({
        variables: {
          cloudId,
          jql,
          first: 10,
          jqlTerm,
          searchString,
          after: pageCursor,
        },
        operationName: 'fieldValues',
        query: fieldValuesQuery,
      });

      const request = new Request(gatewayGraphqlUrl, {
        method: 'POST',
        headers: aggHeaders,
        body,
      });

      try {
        const response = await fetch(request);
        return await response.json();
      } catch (e: any) {
        throw new Error(e);
      }
    },
    [gatewayGraphqlUrl, aggHeaders],
  );

  return useMemo(
    () => ({
      getHydratedJQL,
      getFieldValues,
    }),
    [getHydratedJQL, getFieldValues],
  );
};
