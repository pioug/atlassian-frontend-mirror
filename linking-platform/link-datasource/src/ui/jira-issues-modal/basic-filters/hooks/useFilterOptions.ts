import { useCallback, useEffect, useRef, useState } from 'react';

import { type IntlShape, useIntl } from 'react-intl-next';

import type { Site } from '../../../../common/types';
import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import {
	type AvatarLabelOption,
	type SelectOption,
} from '../../../common/modal/popup-select/types';
import { type BasicFilterFieldType, type FieldValuesResponse } from '../types';
import {
	mapFieldValuesToFilterOptions,
	mapFieldValuesToPageCursor,
	mapFieldValuesToTotalCount,
} from '../utils/transformers';

import { filterOptionMessages } from './messages';

interface FilterOptionsProps {
	filterType: BasicFilterFieldType;
	site?: Site;
}

export interface FetchFilterOptionsProps {
	pageCursor?: string;
	searchString?: string;
}

export interface FilterOptionsState {
	filterOptions: SelectOption[];
	fetchFilterOptions: (prop?: FetchFilterOptionsProps) => Promise<void>;
	reset: () => void;
	totalCount: number;
	pageCursor?: string;
	status: 'empty' | 'loading' | 'resolved' | 'rejected' | 'loadingMore';
	errors: unknown[];
}

export const getAssigneeUnassignedFilterOption = (
	formatMessage: IntlShape['formatMessage'],
): AvatarLabelOption => ({
	label: formatMessage(filterOptionMessages.assigneeUnassignedFilterOption),
	optionType: 'avatarLabel',
	value: 'empty',
});

export const useFilterOptions = ({ filterType, site }: FilterOptionsProps): FilterOptionsState => {
	const { formatMessage } = useIntl();

	const [filterOptions, setFilterOptions] = useState<SelectOption[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [status, setStatus] = useState<FilterOptionsState['status']>('empty');
	const [errors, setErrors] = useState<FilterOptionsState['errors']>([]);

	const [nextPageCursor, setNextPageCursor] = useState<string | undefined>(undefined);
	const initialData = useRef<FieldValuesResponse>();
	const { cloudId, url: siteUrl } = site || {};

	const { getFieldValues } = useBasicFilterAGG();

	const fetchFilterOptions = useCallback(
		async ({ pageCursor, searchString }: FetchFilterOptionsProps = {}) => {
			if (!cloudId) {
				return;
			}

			const isNewSearch = !pageCursor;
			const isRequestLikeInitialSearch = !pageCursor && !searchString;
			const { current: initialResponseData } = initialData;

			isNewSearch ? setStatus('loading') : setStatus('loadingMore');

			try {
				const response =
					isRequestLikeInitialSearch && initialResponseData
						? initialResponseData
						: await getFieldValues({
								cloudId,
								jql: '',
								jqlTerm: filterType,
								// @ts-expect-error - Type 'string | undefined' is not assignable to type 'string'
								searchString,
								pageCursor,
							});

				if (response.errors && response.errors.length > 0) {
					setStatus('rejected');
					setErrors(response.errors);
					return;
				}

				const mappedResponse = mapFieldValuesToFilterOptions({
					...response,
					siteUrl,
				});
				let mappedTotalCount = mapFieldValuesToTotalCount(response);

				/**
				 * For assignee filter option, we want `Unassigned` as an option.
				 * Since we add it manually, we also need to update the total count by +1
				 */
				if (filterType === 'assignee' && !searchString) {
					mappedTotalCount += 1;
				}

				if (isNewSearch) {
					if (isRequestLikeInitialSearch) {
						/**
						 * The initial dataset is used in couple of paths, eg: when a user searches and clears the search text.
						 * During these times, we dont want to fetch data again and again, hence a mini cache setup to store and provide the initial dataset
						 */
						initialData.current = response;

						/**
						 * For assignee filter option, we want `Unassigned` as an option.
						 * Since `Unassigned/EMPTY` is not returned by the API, we add it manually, but only for the initial list
						 */
						if (filterType === 'assignee') {
							mappedResponse.unshift(getAssigneeUnassignedFilterOption(formatMessage));
						}
					}

					setFilterOptions(mappedResponse);
				} else {
					setFilterOptions([...filterOptions, ...mappedResponse]);
				}

				setTotalCount(mappedTotalCount);
				setNextPageCursor(mapFieldValuesToPageCursor(response));

				setStatus('resolved');
			} catch (error) {
				setStatus('rejected');
				setErrors([error]);
			}
		},
		[cloudId, filterOptions, filterType, formatMessage, getFieldValues, siteUrl],
	);

	useEffect(() => {
		if (status !== 'rejected' && errors.length !== 0) {
			setErrors([]);
		}
	}, [errors.length, status]);

	const reset = useCallback(() => {
		setStatus('empty');
		setFilterOptions([]);
		setErrors([]);
		setTotalCount(0);
		setNextPageCursor(undefined);
		initialData.current = undefined;
	}, []);

	return {
		filterOptions,
		fetchFilterOptions,
		totalCount,
		pageCursor: nextPageCursor,
		status,
		errors,
		reset,
	};
};
