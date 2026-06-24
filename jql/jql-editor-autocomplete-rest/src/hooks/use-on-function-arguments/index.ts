import { useCallback } from 'react';

import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { map } from 'rxjs/operators/map';

import { type AutocompleteOption, type AutocompleteOptions } from '@atlaskit/jql-editor-common';
import { type GroupKey } from '@atlaskit/jql-editor-common/autocomplete/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { type OnFunctionArguments, type OnValues } from '../use-autocomplete-provider/types';

const TEAM_SEARCHABLE_FIELD_NAME = '"Team[Team]"';
const MEMBERS_OF_FUNCTION_NAME = 'membersof';

/**
 * Returns the group key which later will be used inside autocomplete dropdown component to display the group title.
 */
function getGroupKey(functionName: string): GroupKey | undefined {
	switch (functionName) {
		case MEMBERS_OF_FUNCTION_NAME:
			return 'team';
		default:
			return undefined;
	}
}

/**
 * A map from lowercase function name to a transform function that rewrites the inserted `value`
 * for each autocomplete option. This lets individual JQL functions control the exact text that
 * gets written into the query when the user picks a suggestion from the dropdown.
 *
 * Example: `membersOf` requires team IDs to be prefixed with `"id:"` so the JQL parser can
 * distinguish team IDs from team display-names (e.g. `membersOf("id:abc-123")`).
 */
const FUNCTION_VALUE_TRANSFORMS: Record<
	string,
	((option: AutocompleteOption) => AutocompleteOption) | undefined
> = {
	[MEMBERS_OF_FUNCTION_NAME]: (option) => ({
		...option,
		value: option.value.startsWith('id:') ? option.value : `id:${option.value}`,
	}),
};

/**
 * Returns a callback that is invoked when a function argument position is detected in the JQL
 * editor. When the function is `membersOf`, it delegates to `onValues` using the searchable
 * `Team[Team]` field value so we reuse the same fetching, tagging, and caching logic as the Team
 * field autocomplete flow.
 *
 * For all other functions it returns an empty Observable (no-op).
 */
const useOnFunctionArguments = (onValues: OnValues): OnFunctionArguments => {
	return useCallback<OnFunctionArguments>(
		(
			_fieldName: string,
			fieldValue: string,
			functionName: string,
		): Observable<AutocompleteOptions> => {
			const lowerCaseFunctionName = functionName.toLowerCase();
			if (
				!fg('enable-jql-membersof-autocomplete') ||
				lowerCaseFunctionName !== MEMBERS_OF_FUNCTION_NAME
			) {
				return empty();
			}

			const transformValue = FUNCTION_VALUE_TRANSFORMS[lowerCaseFunctionName];

			return onValues(fieldValue, TEAM_SEARCHABLE_FIELD_NAME).pipe(
				map((options) =>
					options.map((option) => {
						const transformedOption = transformValue ? transformValue(option) : option;
						return {
							...transformedOption,
							groupKey: getGroupKey(lowerCaseFunctionName),
						};
					}),
				),
			);
		},
		[onValues],
	);
};

export default useOnFunctionArguments;
