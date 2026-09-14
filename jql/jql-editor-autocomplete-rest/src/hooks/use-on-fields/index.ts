import { useCallback } from 'react';

import unescape from 'lodash/unescape';
import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { take } from 'rxjs/operators/take';
import { toArray } from 'rxjs/operators/toArray';

import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import type { JQLClause } from '@atlaskit/jql-autocomplete/jql-autocomplete/types';

import { type JQLFieldResponse } from '../../common/types';
import { filterJqlValue } from '../../utils/filter-jql-value';
import { normalize } from '../../utils/normalize';
import { type OnFields } from '../use-autocomplete-provider/types';

import { getFieldType } from './getFieldType';

// Hard coded limit to prevent excessive number of options being rendered in the autocomplete dropdown.
export const MAX_VISIBLE_OPTIONS = 20;

const useOnFields = (
	jqlSearchableFields$: Observable<JQLFieldResponse>,
	jqlOrderableFields$: Observable<JQLFieldResponse>,
): ((query?: string, clause?: JQLClause) => Observable<AutocompleteOptions>) => {
	// Returns an Observable of the fields to render for the provided query string
	return useCallback<OnFields>(
		(query?: string, clause?: JQLClause): Observable<AutocompleteOptions> => {
			if (clause === undefined) {
				return empty();
			}

			const jqlFields$ = clause === 'orderBy' ? jqlOrderableFields$ : jqlSearchableFields$;

			return jqlFields$.pipe(
				filter((field) => filterJqlValue(field, query)),
				// Limit the result to MAX_VISIBLE_OPTIONS
				take(MAX_VISIBLE_OPTIONS),
				map((field) => {
					const fieldType = getFieldType(field);
					if (fieldType !== null) {
						const name = unescape(field.displayName).replace(` - ${normalize(field.value)}`, '');
						return {
							name,
							value: field.value,
							fieldType,
							isDeprecated: field.deprecated === 'true',
							deprecatedSearcherKey: field.deprecatedSearcherKey,
						};
					}
					return {
						name: unescape(field.displayName),
						value: field.value,
						isDeprecated: field.deprecated === 'true',
						deprecatedSearcherKey: field.deprecatedSearcherKey,
					};
				}),
				toArray(),
				// We can filter out empty arrays as there is nothing to consume
				filter((fields) => fields.length > 0),
			);
		},
		[jqlSearchableFields$, jqlOrderableFields$],
	);
};

export default useOnFields;
