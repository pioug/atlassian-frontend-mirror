import { useCallback } from 'react';

import escapeRegExp from 'lodash/escapeRegExp';
import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { concatMap } from 'rxjs/operators/concatMap';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { toArray } from 'rxjs/operators/toArray';

import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

import { type JQLFieldResponse, type JQLFunctionResponse } from '../../common/types';
import findField$ from '../../utils/find-field-observable';
import { normalize } from '../../utils/normalize';
import { type OnFunctions } from '../use-autocomplete-provider/types';

// TO DO: https://jplat.atlassian.net/browse/EM-13390 Remove once agentSessions[agent] field
// has a separate from other User fields, and we can use it to determine what functions to show from the BE
const shouldSuppressFunctionsForField = (field: JQLFieldResponse): boolean =>
	normalize(field.value).toLowerCase() === 'agentsessions[agent]';

const useOnFunctions = (
	jqlSearchableFields$: Observable<JQLFieldResponse>,
	jqlFunctions$: Observable<JQLFunctionResponse>,
): ((
	query?: string,
	field?: string,
	isListOperator?: boolean,
) => Observable<AutocompleteOptions>) => {
	return useCallback<OnFunctions>(
		(query?: string, field?: string, isListOperator?: boolean): Observable<AutocompleteOptions> => {
			if (typeof field !== 'string' || field === '') {
				return empty<AutocompleteOptions>();
			}

			const filterRegex =
				typeof query === 'string' && query !== ''
					? new RegExp(`^${escapeRegExp(query)}[^$]`, 'i')
					: undefined;

			const field$ = findField$(jqlSearchableFields$, field);

			// Find all functions that match our query with a type that intersects our field types
			return field$.pipe(
				concatMap((matchingField) => {
					if (
						expVal('jira_filter_by_agent_and_agent_state', 'isEnabled', false) &&
						shouldSuppressFunctionsForField(matchingField)
					) {
						return empty<AutocompleteOptions>();
					}

					return jqlFunctions$.pipe(
						filter((func) => !filterRegex || func.displayName.match(filterRegex) !== null),
						filter(
							(func) =>
								// Do not include functions that return a list unless we are using a list operator
								!!isListOperator || func.isList !== 'true',
						),
						filter(
							(func) =>
								// Include functions with a type that intersects our field types
								func.types.filter((type) => matchingField.types.includes(type)).length > 0,
						),
						map((func) => ({
							name: func.displayName,
							value: func.value,
							isListFunction:
								func.isList === 'true' || func.supportsListAndSingleValueOperators === 'true',
						})),
						toArray(),
					);
				}),
				// We can filter out empty arrays as there is nothing to consume
				filter((operands) => operands.length > 0),
			);
		},
		[jqlSearchableFields$, jqlFunctions$],
	);
};

export default useOnFunctions;
