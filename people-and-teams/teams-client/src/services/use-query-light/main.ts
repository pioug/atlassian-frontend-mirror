import { useCallback, useEffect, useRef, useState } from 'react';

import { type DocumentNode, type GraphQLError, print } from 'graphql';
import isEqual from 'lodash/isEqual';

import { fetchWithExponentialBackoff } from '../../common/utils/http';
import { logException } from '../sentry';

import {
	type FetchMoreArgs,
	type QueryOptions,
	type QueryResponse,
	type QueryResult,
	UseQueryLightError,
} from './types';

const transformError = ({
	error,
	graphQLErrors,
}: {
	error?: Error;
	graphQLErrors?: GraphQLError[];
}): UseQueryLightError => {
	const reducedGraphqlErrorMessage =
		graphQLErrors &&
		graphQLErrors.reduce(
			(acc, gqlError) => acc + (acc ? '\n' : '') + (gqlError.message ? gqlError.message : ''),
			'',
		);
	const reducedGraphqlErrorName =
		graphQLErrors &&
		graphQLErrors.reduce(
			(acc, gqlError) => acc + (acc ? '\n' : '') + (gqlError.name ? gqlError.name : ''),
			'',
		);
	return new UseQueryLightError(
		// Network error would lead to no graphqlErrors as the query would not be fired. Hence at the front.
		error?.message || reducedGraphqlErrorMessage || 'Unknown error',
		error?.name || reducedGraphqlErrorName,
		// graphQLErrors in Apollo error is empty array when there is no error.
		// So we follow the same to make sure error handlers are working as expected.
		graphQLErrors || [],
		error,
	);
};

export const useQueryLight = <TParams, TResult>(
	query: DocumentNode,
	options: QueryOptions<TParams>,
): QueryResponse<TParams, TResult> => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<UseQueryLightError | undefined>(undefined);
	const [data, setData] = useState<TResult | undefined>(undefined);
	const variablesRef = useRef<TParams | undefined>(options.variables);

	// Need this to deep compare variables to avoid infinite loops in useEffect
	if (!isEqual(variablesRef.current, options.variables)) {
		variablesRef.current = options.variables;
	}

	// Initial fetch, and refetch
	const fetchData = useCallback(async () => {
		try {
			setLoading(true);

			const response = await fetchWithExponentialBackoff(
				`${options.serviceUrl}?q=${options.operationName}`,
				{
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/json',
						...options.customHeaders,
					}),
					credentials: 'include',
					body: JSON.stringify({
						query: print(query),
						variables: {
							...variablesRef.current,
						},
					}),
				},
			);
			const responseData: QueryResult<TResult> = await response.json();

			if (response.ok) {
				if (responseData.errors) {
					setError(transformError({ graphQLErrors: responseData.errors }));
				}
				setData(responseData.data);
				setLoading(false);
			} else {
				throw new Error(`Generic fetch error within useQueryLight, status ${response.status}`);
			}
		} catch (error) {
			if (error instanceof Error) {
				setError(transformError({ error }));
			} else {
				setError(transformError({ error: new Error('Unknown error') }));
				logException(error, `useQueryLight - ${options.operationName}`);
			}
			setData(undefined);
			setLoading(false);
		}
	}, [query, options.serviceUrl, options.operationName, options.customHeaders]);

	// Fetch more
	const fetchMore = useCallback(
		async ({ variables, handleDataMerge }: FetchMoreArgs<TParams, TResult>) => {
			try {
				// reset errors to catch new ones
				setError(undefined);
				const response = await fetchWithExponentialBackoff(
					`${options.serviceUrl}?q=${options.operationName}`,
					{
						method: 'POST',
						headers: new Headers({
							'Content-Type': 'application/json',
							...options.customHeaders,
						}),
						credentials: 'include',
						body: JSON.stringify({
							query: print(query),
							variables: {
								...variablesRef.current,
								...variables,
							},
						}),
					},
				);

				const responseData: QueryResult<TResult> = await response.json();

				if (response.ok) {
					if (responseData.errors) {
						setError(transformError({ graphQLErrors: responseData.errors }));
					}
					setData((prevData) => handleDataMerge(prevData, responseData.data));
				} else {
					throw new Error(`Generic fetch error within useQueryLight, status ${response.status}`);
				}
			} catch (error) {
				if (error instanceof Error) {
					setError(transformError({ error }));
				} else {
					setError(transformError({ error: new Error('Unknown error') }));
					logException(error, `useQueryLight fetchMore - ${options.operationName}`);
				}
			}
		},
		[query, options.serviceUrl, options.operationName, options.customHeaders],
	);

	useEffect(() => {
		if (!options.skip) {
			fetchData();
		} else {
			setLoading(false);
		}
	}, [options.skip, variablesRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		loading,
		error,
		data,
		refetch: fetchData,
		fetchMore,
	};
};

export const useLazyQueryLight = <TParams, TResult>(
	query: DocumentNode,
	options: Omit<QueryOptions<TParams>, 'skip'>,
): [() => void, QueryResponse<TParams, TResult>] => {
	const [fetchTriggered, setFetchTriggered] = useState<boolean>(false);

	const { loading, error, data, refetch, fetchMore } = useQueryLight<TParams, TResult>(query, {
		...options,
		skip: !fetchTriggered,
	});

	const triggerFetch = useCallback(() => {
		setFetchTriggered(true);
	}, []);

	return [
		triggerFetch,
		{
			loading,
			error,
			data,
			refetch,
			fetchMore,
		},
	];
};
