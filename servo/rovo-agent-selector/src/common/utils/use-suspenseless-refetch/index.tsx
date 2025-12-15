import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { fetchQuery, useRelayEnvironment } from 'react-relay';
import type { KeyType } from 'react-relay/relay-hooks/helpers';
import type { RefetchFnDynamic } from 'react-relay/relay-hooks/useRefetchableFragmentNode';
import type { Subscription } from 'relay-runtime/lib/network/RelayObservable';
import type { GraphQLTaggedNode } from 'relay-runtime/lib/query/RelayModernGraphQLTag';
import type {
	CacheConfig,
	FetchQueryFetchPolicy,
	OperationType,
	Variables,
} from 'relay-runtime/lib/util/RelayRuntimeTypes';

// Reused from jira/src/packages/issue/use-suspenseless-refetch/src/index.tsx

type SuspenselessRefetchHookStatelessOptions = {
	// isLoading state updater function, will be called to reflect the loading
	// state of the refetch function
	setIsLoading?: (newIsLoading: boolean) => void;
	// last error state updater function, will be called whenever the refetch
	// function fails, or called with null on a success
	setLastFetchError?: (errorOrNull: Error | null) => void;
	// Defaults to 'store-or-network'
	fetchPolicy?: FetchQueryFetchPolicy;
	networkCacheConfig?: CacheConfig;
};

export type SuspenselessRefetchFunction<TVariables extends Variables> = (
	variables: TVariables,
	options?: {
		onComplete?: () => void;
	},
) => Subscription;

const useInFlightRequests = <TRequest extends {}>({
	setIsLoading,
}: {
	setIsLoading?: (newIsLoading: boolean) => void;
}) => {
	const inFlightRequestsRef = useRef<TRequest[]>([]);
	return useMemo(
		() => ({
			onNewRequest: (request: TRequest) => {
				inFlightRequestsRef.current.push(request);
			},
			onRequestFinish: (
				request: TRequest,
				/**
				 * Called only if the request hasn't been superceded by a more recent request's success / failure
				 */
				onIfRequestIsRelevant?: () => void,
			) => {
				// find the first occurrence of this request
				const inFlightRequestIndex = inFlightRequestsRef.current.indexOf(request);
				// If the current request is still considered "in flight"
				if (inFlightRequestIndex !== -1) {
					onIfRequestIsRelevant?.();

					// Cut out the current and all proceeding requests from the in-flight queue
					inFlightRequestsRef.current = inFlightRequestsRef.current.slice(inFlightRequestIndex + 1);
					// Update isLoading to reflect the current number of in-flight requests
					setIsLoading?.(!!inFlightRequestsRef.current.length);
				}
			},
		}),
		[setIsLoading],
	);
};

/**
 * Given a refetch function from useRefetchableFragment or usePaginationFragment,
 * returns a new refetch function which will not trigger suspense; and will update
 * local component state for isLoading and lastFetchError as required if setters
 * are supplied.
 *
 * See unit test.js for an example usage in a Relay context.
 */
export const useSuspenselessRefetchStateless = <
	TQuery extends OperationType,
	TKey extends KeyType | null,
>(
	// Relay-generated query from the @refetchable annotation in a useRefetchableFragment
	// or usePaginationFragment
	query: GraphQLTaggedNode,
	// Refetch function from a useRefetchableFragment or usePaginationFragment
	// (which ordinarily would trigger suspense)
	refetch: RefetchFnDynamic<TQuery, TKey>,
	{
		setIsLoading,
		setLastFetchError,
		fetchPolicy = 'store-or-network',
		networkCacheConfig,
	}: SuspenselessRefetchHookStatelessOptions = {},
): SuspenselessRefetchFunction<TQuery['variables']> => {
	const environment = useRelayEnvironment();
	const isMounted = useRef(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const { onNewRequest, onRequestFinish } = useInFlightRequests({ setIsLoading });
	const [_, startTransition] = useTransition();

	return useCallback(
		(
			variables: TQuery['variables'],
			options?: {
				onComplete?: () => void;
			},
		) => {
			if (isMounted.current) {
				setIsLoading?.(true);
			}
			onNewRequest(variables);

			return fetchQuery<TQuery>(environment, query, variables, {
				fetchPolicy,
				networkCacheConfig,
			}).subscribe({
				complete() {
					if (isMounted.current) {
						if (startTransition) {
							// we need concurrent mode for useTransition to work
							startTransition(() => {
								setLastFetchError?.(null);
								onRequestFinish(variables, () => {
									refetch(variables, { fetchPolicy: 'store-only' });
									options?.onComplete?.();
								});
							});
						} else {
							setLastFetchError?.(null);
							onRequestFinish(variables, () => {
								refetch(variables, { fetchPolicy: 'store-only' });
								options?.onComplete?.();
							});
						}
					}
				},
				error(e: Error) {
					if (isMounted.current) {
						onRequestFinish(variables, () => setLastFetchError?.(e));
					}
				},
			});
		},
		[
			environment,
			fetchPolicy,
			isMounted,
			networkCacheConfig,
			onNewRequest,
			onRequestFinish,
			query,
			refetch,
			setIsLoading,
			setLastFetchError,
			startTransition,
		],
	);
};

type SuspenselessRefetchHookOptions = {
	fetchPolicy?: FetchQueryFetchPolicy;
	networkCacheConfig?: CacheConfig;
};

export type SuspenselessRefetchHookReturn<TVariables extends Variables> = [
	SuspenselessRefetchFunction<TVariables>,
	boolean,
	Error | null,
];

/**
 * Given a refetch function from useRefetchableFragment or usePaginationFragment,
 * returns a new refetch function which will not trigger suspense; Also supplies
 * component state variables:
 * - isLoading: true whenever there's a network request in-progress triggered by the resulting refetch function
 * - lastFetchError: set to any network error resulting from a failed refetch. Cleared to null on a successfull refetch.
 *
 * See unit test.js of the stateless version for an example usage in a Relay context.
 *
 * @returns a tuple (array) containing: the new refetch function, and the aformentioned component state `isLoading` and `lastFetchError`
 */
export const useSuspenselessRefetch = <TQuery extends OperationType, TKey extends KeyType | null>(
	query: GraphQLTaggedNode,
	refetch: RefetchFnDynamic<TQuery, TKey>,
	options?: SuspenselessRefetchHookOptions,
): SuspenselessRefetchHookReturn<TQuery['variables']> => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [lastFetchError, setLastFetchError] = useState<Error | null>(null);

	const refetchFunction = useSuspenselessRefetchStateless(query, refetch, {
		...options,
		setIsLoading,
		setLastFetchError,
	});

	return [refetchFunction, isLoading, lastFetchError];
};
