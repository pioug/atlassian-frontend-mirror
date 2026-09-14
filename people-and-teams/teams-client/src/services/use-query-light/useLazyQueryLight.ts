import { useCallback, useState } from 'react';

import { type DocumentNode } from 'graphql';

import { type QueryOptions, type QueryResponse } from './types';
import { useQueryLight } from './useQueryLight';

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
