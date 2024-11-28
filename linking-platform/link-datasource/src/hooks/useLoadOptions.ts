import { useEffect, useState } from 'react';

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

type LoadOptionsState<Entities> = {
	isLoading: boolean;
	options: Entities[];
	hasFailed: boolean;
};

export type LoadOptionsProps<T> = {
	fetchInputs?: AtomicActionExecuteRequest['parameters']['inputs'];
	executeFetch?: ExecuteFetch;
	emptyOption?: T;
};

export const useLoadOptions = <T>({
	fetchInputs,
	executeFetch,
	emptyOption,
}: LoadOptionsProps<T>) => {
	const [{ options, isLoading, hasFailed }, setOptions] = useState<LoadOptionsState<T>>({
		isLoading: true,
		options: [],
		hasFailed: false,
	});

	const { showErrorFlag } = useDatasourceTableFlag({ isFetchAction: true });

	useEffect(() => {
		let isMounted = true;
		loadOptions<T>(fetchInputs, executeFetch)
			.then((options) => {
				if (isMounted) {
					setOptions({
						isLoading: false,
						options: emptyOption ? [emptyOption, ...options] : options,
						hasFailed: false,
					});
				}
			})
			.catch((err) => {
				showErrorFlag();
				setOptions({ isLoading: false, options: [], hasFailed: true });
			});
		return () => {
			isMounted = false;
		};
	}, [fetchInputs, executeFetch, showErrorFlag, emptyOption]);

	return { options, isLoading, hasFailed };
};
