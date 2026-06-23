import { useCallback } from 'react';

import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { map } from 'rxjs/operators/map';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';
import { type GroupKey } from '@atlaskit/jql-editor-common/autocomplete/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { type OnFunctionArguments, type OnValues } from '../use-autocomplete-provider/types';

const TEAM_SEARCHABLE_FIELD_NAME = '"Team[Team]"';
const MEMBERS_OF_FUNCTION_NAME = 'membersof';

/**
 * Returns the group key which later will be used inside autocomplete dropdown component to display the group title.
 */
function getGroupKey(functionName: string): GroupKey | undefined {
	switch (functionName.toLowerCase()) {
		case MEMBERS_OF_FUNCTION_NAME:
			return 'team';
		default:
			return undefined;
	}
}

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
			if (!fg('enable-jql-membersof-autocomplete')) {
				return empty();
			}

			if (functionName.toLowerCase() !== MEMBERS_OF_FUNCTION_NAME) {
				return empty();
			}

			return onValues(fieldValue, TEAM_SEARCHABLE_FIELD_NAME).pipe(
				map((options) =>
					options.map((option) => ({
						...option,
						groupKey: getGroupKey(functionName),
					})),
				),
			);
		},
		[onValues],
	);
};

export default useOnFunctionArguments;
