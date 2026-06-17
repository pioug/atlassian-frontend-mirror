import { useCallback } from 'react';

import type { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

import { type OnFunctionArguments, type OnValues } from '../use-autocomplete-provider/types';

const TEAM_SEARCHABLE_FIELD_NAME = '"Team[Team]"';
const MEMBERS_OF_FUNCTION_NAME = 'membersof';

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
			if (functionName.toLowerCase() !== MEMBERS_OF_FUNCTION_NAME) {
				return empty();
			}

			return onValues(fieldValue, TEAM_SEARCHABLE_FIELD_NAME);
		},
		[onValues],
	);
};

export default useOnFunctionArguments;
