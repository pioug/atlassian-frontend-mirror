import { useCallback, useMemo } from 'react';

import { request } from '@atlaskit/linking-common';

import {
  BasicFilterFieldType,
  FieldValuesResponse,
  HydrateResponse,
} from '../ui/jira-issues-modal/basic-filters/types';

import { fieldValuesQuery, hydrateJQLQuery } from './utils';

interface GetFieldValuesProps {
  cloudId: string;
  jql: string;
  jqlTerm: BasicFilterFieldType;
  searchString: string;
  pageCursor?: string;
}

const AGG_BASE_URL = '/gateway/api/graphql';

export const useBasicFilterAGG = () => {
  const requestCall = useCallback(
    async <Response>(body: object) =>
      request<Response>(
        'post',
        AGG_BASE_URL,
        body,
        {
          'X-ExperimentalApi': 'JiraJqlBuilder',
        },
        [200, 201, 202, 203, 204],
      ),
    [],
  );

  const getHydratedJQL = useCallback(
    (cloudId: string, jql: string) =>
      requestCall<HydrateResponse>({
        variables: {
          cloudId,
          jql,
        },
        operationName: 'hydrate',
        query: hydrateJQLQuery,
      }),
    [requestCall],
  );

  const getFieldValues = useCallback(
    ({
      cloudId,
      jql = '',
      jqlTerm,
      searchString = '',
      pageCursor,
    }: GetFieldValuesProps) =>
      requestCall<FieldValuesResponse>({
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
      }),
    [requestCall],
  );

  return useMemo(
    () => ({
      getHydratedJQL,
      getFieldValues,
    }),
    [getHydratedJQL, getFieldValues],
  );
};
