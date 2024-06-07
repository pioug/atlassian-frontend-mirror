import { useCallback } from 'react';

import escapeRegExp from 'lodash/escapeRegExp';
import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { concatMap } from 'rxjs/operators/concatMap';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { toArray } from 'rxjs/operators/toArray';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

import { type JQLFieldResponse } from '../../common/types';
import findField$ from '../../utils/find-field-observable';
import { type OnOperators } from '../use-autocomplete-provider/types';

const useOnOperators = (jqlSearchableFields$: Observable<JQLFieldResponse>) => {
	return useCallback<OnOperators>(
		(query?: string, field?: string): Observable<AutocompleteOptions> => {
			if (typeof field !== 'string' || field === '') {
				return empty();
			}

			const filterRegex =
				typeof query === 'string' && query !== ''
					? new RegExp(`^${escapeRegExp(query)}[^$]`, 'i')
					: undefined;

			// Find operators for matching field
			return findField$(jqlSearchableFields$, field).pipe(
				concatMap(({ operators }) => operators),
				// Filter operators that match query
				filter((operator) => !filterRegex || operator.match(filterRegex) !== null),
				map((operator) => {
					const value = operator.toUpperCase();
					return {
						name: value,
						value,
					};
				}),
				toArray(),
				// We can filter out empty arrays as there is nothing to consume
				filter((operators) => operators.length > 0),
			);
		},
		[jqlSearchableFields$],
	);
};

export default useOnOperators;
