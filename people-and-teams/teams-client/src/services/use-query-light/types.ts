/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { type GraphQLError } from 'graphql';

import type { UseQueryLightError } from './UseQueryLightError';

export interface QueryOptions<TParams> {
	serviceUrl: string;
	variables?: TParams;
	operationName: string;
	skip?: boolean;
	customHeaders?: Record<string, string>;
}

export enum ErrorCategory {
	NotFound = 'NotFound',
	NotPermitted = 'NotPermitted',
	MalformedInput = 'MalformedInput',
	Internal = 'Internal',
}

export interface QueryStatus<TResult> {
	loading: boolean;
	data?: TResult;
	error?: UseQueryLightError;
}

export interface QueryResponse<TParams, TResult> extends QueryStatus<TResult> {
	loading: boolean;
	data?: TResult;
	error?: UseQueryLightError;
	refetch: () => void;
	fetchMore: (args: FetchMoreArgs<TParams, TResult>) => void;
}

export interface QueryResult<TResult> {
	data?: TResult;
	extensions: {
		errorNumber: number;
	};
	errors?: GraphQLError[];
}

export interface FetchMoreArgs<TParams, TResult> {
	variables: Partial<TParams>;
	handleDataMerge: (
		prevData: TResult | undefined,
		newData: TResult | undefined,
	) => TResult | undefined;
}

/**
 * @deprecated Use `import { ActualGraphQLError } from '@atlaskit/teams-client/actual-graph-ql-error'` instead.
 */
export { ActualGraphQLError } from './ActualGraphQLError';
/**
 * @deprecated Use `import { UseQueryLightError } from '@atlaskit/teams-client/use-query-light-error'` instead.
 */
export { UseQueryLightError } from './UseQueryLightError';
