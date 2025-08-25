import { useCallback, useMemo } from 'react';

import { request } from '@atlaskit/linking-common';

import {
	type UserHydrationAGGResponse,
	type UserInfoAGGResponse,
} from '../ui/confluence-search-modal/basic-filters/types';
import {
	type BasicFilterFieldType,
	type FieldValuesResponse,
	type HydrateResponse,
} from '../ui/jira-issues-modal/basic-filters/types';

import { fieldValuesQuery, hydrateJQLQuery, userHydration, userQuery } from './utils';

interface GetFieldValuesProps {
	cloudId: string;
	jql: string;
	jqlTerm: BasicFilterFieldType;
	pageCursor?: string;
	searchString: string;
}

const AGG_BASE_URL = '/gateway/api/graphql';

export const useBasicFilterAGG = () => {
	const requestCall = useCallback(
		async <Response>(body: object, headers?: HeadersInit) =>
			request<Response>('post', AGG_BASE_URL, body, headers, [200, 201, 202, 203, 204]),
		[],
	);

	const getHydratedJQL = useCallback(
		(cloudId: string, jql: string) =>
			requestCall<HydrateResponse>(
				{
					variables: {
						cloudId,
						jql,
					},
					operationName: 'hydrate',
					query: hydrateJQLQuery,
				},
				{
					'X-ExperimentalApi': 'JiraJqlBuilder',
				},
			),
		[requestCall],
	);

	const getFieldValues = useCallback(
		({ cloudId, jql = '', jqlTerm, searchString = '', pageCursor }: GetFieldValuesProps) =>
			requestCall<FieldValuesResponse>(
				{
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
				},
				{
					'X-ExperimentalApi': 'JiraJqlBuilder',
				},
			),
		[requestCall],
	);

	const getCurrentUserInfo = useCallback(
		() =>
			requestCall<UserInfoAGGResponse>({
				operationName: 'userQuery',
				query: userQuery,
			}),
		[requestCall],
	);

	const getUsersFromAccountIDs = useCallback(
		(accountIds: string[]) =>
			requestCall<UserHydrationAGGResponse>({
				variables: { accountIds },
				operationName: 'userHydration',
				query: userHydration,
			}),
		[requestCall],
	);

	return useMemo(
		() => ({
			getHydratedJQL,
			getFieldValues,
			getCurrentUserInfo,
			getUsersFromAccountIDs,
		}),
		[getHydratedJQL, getFieldValues, getCurrentUserInfo, getUsersFromAccountIDs],
	);
};
