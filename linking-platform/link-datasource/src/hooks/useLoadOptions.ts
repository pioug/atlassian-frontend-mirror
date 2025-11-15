import { useEffect, useReducer } from 'react';

import {
	ActionOperationStatus,
	type AtomicActionExecuteRequest,
	type AtomicActionExecuteResponse,
} from '@atlaskit/linking-types';

import type { ExecuteFetch } from '../state/actions';

import { useDatasourceTableFlag } from './useDatasourceTableFlag';

const loadOptions = async <T>(
	fetchInputs: AtomicActionExecuteRequest['parameters']['inputs'] = {},
	executeFetch?: ExecuteFetch,
): Promise<T[]> => {
	if (!executeFetch) {
		return [];
	}

	const result = await executeFetch<AtomicActionExecuteResponse<T>>(fetchInputs);

	const { operationStatus, entities } = result;

	if (operationStatus === ActionOperationStatus.FAILURE) {
		throw new Error('Failed to fetch status options');
	}

	return entities ?? [];
};

type LoadOptionsState<E> = {
	hasFailed: boolean;
	isLoading: boolean;
	options: E[];
};

const reducer = <T>(state: LoadOptionsState<T>, payload: Partial<LoadOptionsState<T>>) => {
	return { ...state, ...payload };
};

export type LoadOptionsProps<T> = {
	emptyOption?: T;
	executeFetch?: ExecuteFetch;
	fetchInputs?: AtomicActionExecuteRequest['parameters']['inputs'];
};

export const useLoadOptions = <T>({
	fetchInputs,
	executeFetch,
	emptyOption,
}: LoadOptionsProps<T>) => {
	const [{ options, isLoading, hasFailed }, dispatch] = useReducer(reducer<T>, {
		isLoading: true,
		options: [],
		hasFailed: false,
	});

	const { showErrorFlag } = useDatasourceTableFlag({ isFetchAction: true });

	useEffect(() => {
		let isMounted = true;
		// Set the loading state before sending the request
		dispatch({ isLoading: true });
		// Query the options
		loadOptions<T>(fetchInputs, executeFetch)
			.then((options) => {
				if (isMounted) {
					dispatch({
						isLoading: false,
						options: emptyOption ? [emptyOption, ...options] : options,
						hasFailed: false,
					});
				}
			})
			.catch((_err) => {
				showErrorFlag();
				dispatch({ isLoading: false, options: [], hasFailed: true });
			});
		return () => {
			isMounted = false;
		};
	}, [fetchInputs, executeFetch, showErrorFlag, emptyOption]);

	return { options, isLoading, hasFailed };
};
