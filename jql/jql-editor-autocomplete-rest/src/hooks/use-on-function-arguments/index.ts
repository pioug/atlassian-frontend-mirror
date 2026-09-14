import { useCallback } from 'react';

import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { map } from 'rxjs/operators/map';

import type {
	GroupKey,
	AutocompleteOption,
	AutocompleteOptions,
} from '@atlaskit/jql-editor-common/autocomplete/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	type OnFunctionArguments,
	type OnValuesWithFunctionName,
} from '../use-autocomplete-provider/types';

const TEAM_SEARCHABLE_FIELD_NAME = '"Team[Team]"';
const MEMBERS_OF_FUNCTION_NAME = 'membersof';
const DESCENDANTS_OF_TEAM_FUNCTION_NAME = 'descendantsofteam';

/**
 * Returns whether the given function should suggest team names as arguments, taking the relevant
 * feature gate for each function into account.
 */
function isTeamArgumentFunctionEnabled(lowerCaseFunctionName: string): boolean {
	switch (lowerCaseFunctionName) {
		case MEMBERS_OF_FUNCTION_NAME:
			return fg('enable-jql-membersof-autocomplete');
		case DESCENDANTS_OF_TEAM_FUNCTION_NAME:
			return fg('jira-descendants-of-team-jql-function');
		default:
			return false;
	}
}

/**
 * Returns the group key which later will be used inside autocomplete dropdown component to display the group title.
 */
function getGroupKey(functionName: string): GroupKey | undefined {
	switch (functionName) {
		case MEMBERS_OF_FUNCTION_NAME:
		case DESCENDANTS_OF_TEAM_FUNCTION_NAME:
			return 'team';
		default:
			return undefined;
	}
}

/**
 * Rewrites the inserted `value` so team IDs are prefixed with `"id:"`, allowing the JQL parser to
 * distinguish team IDs from team display-names (e.g. `membersOf("id:abc-123")`).
 */
const prefixTeamIdValue = (option: AutocompleteOption): AutocompleteOption => ({
	...option,
	value: option.value.startsWith('id:') ? option.value : `id:${option.value}`,
});

/**
 * A map from lowercase function name to a transform function that rewrites the inserted `value`
 * for each autocomplete option. This lets individual JQL functions control the exact text that
 * gets written into the query when the user picks a suggestion from the dropdown.
 *
 * Both `membersOf` and `descendantsOfTeam` require team IDs to be prefixed with `"id:"`.
 */
const FUNCTION_VALUE_TRANSFORMS: Record<
	string,
	((option: AutocompleteOption) => AutocompleteOption) | undefined
> = {
	[MEMBERS_OF_FUNCTION_NAME]: prefixTeamIdValue,
	[DESCENDANTS_OF_TEAM_FUNCTION_NAME]: prefixTeamIdValue,
};

/**
 * Returns a callback that is invoked when a function argument position is detected in the JQL
 * editor. When the function is one that suggests team names (`membersOf` or `descendantsOfTeam`),
 * it delegates to `onValues` using the searchable `Team[Team]` field value so we reuse the same
 * fetching, tagging, and caching logic as the Team field autocomplete flow.
 *
 * For all other functions it returns an empty Observable (no-op).
 */
const useOnFunctionArguments = (onValues: OnValuesWithFunctionName): OnFunctionArguments => {
	return useCallback<OnFunctionArguments>(
		(
			_fieldName: string,
			fieldValue: string,
			functionName: string,
		): Observable<AutocompleteOptions> => {
			const lowerCaseFunctionName = functionName.toLowerCase();
			if (!isTeamArgumentFunctionEnabled(lowerCaseFunctionName)) {
				return empty();
			}

			const transformValue = FUNCTION_VALUE_TRANSFORMS[lowerCaseFunctionName];

			// Pass the function name through for analytics.
			return onValues(fieldValue, TEAM_SEARCHABLE_FIELD_NAME, lowerCaseFunctionName).pipe(
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
