import { useCallback } from 'react';

import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import { EventType } from '@atlaskit/jql-editor-common/constants';

import {
	Action,
	ActionSubject,
	type JqlEditorAutocompleteAnalyticsEvent,
} from '../../analytics/types';
import { type GetAutocompleteSuggestions } from '../../common/types';

import { getAutocompleteSuggestionsUrl } from './getAutocompleteSuggestionsUrl';

export const useFetchFieldValues = (
	getSuggestions: GetAutocompleteSuggestions,
	createAndFireAnalyticsEvent: (payload: JqlEditorAutocompleteAnalyticsEvent) => void,
): ((field: string, query?: string, functionName?: string) => Promise<AutocompleteOptions>) => {
	return useCallback(
		async (field: string, query?: string, functionName?: string): Promise<AutocompleteOptions> => {
			// Only set when fetching values for a function argument; omitted otherwise.
			const attributes = functionName !== undefined ? { functionName } : undefined;
			try {
				const data = await getSuggestions(getAutocompleteSuggestionsUrl(field, query));

				// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- parse HTML displayName to plain text
				const div = document.createElement('div');
				const results = data.results.map((operand) => {
					// The displayName from the API includes HTML tags to bold matching text e.g. `<b>o</b>pen`
					// We set this as innerHTML so we can get the raw textContent
					div.innerHTML = operand.displayName;

					return {
						name: div.textContent ?? '',
						value: operand.value,
					};
				});

				createAndFireAnalyticsEvent({
					action: Action.SUCCESS,
					actionSubject: ActionSubject.AUTOCOMPLETE_SUGGESTIONS,
					eventType: EventType.OPERATIONAL,
					...(attributes !== undefined && { attributes }),
				});

				return results;
			} catch (error) {
				createAndFireAnalyticsEvent({
					action: Action.FAILED,
					actionSubject: ActionSubject.AUTOCOMPLETE_SUGGESTIONS,
					eventType: EventType.OPERATIONAL,
					...(attributes !== undefined && { attributes }),
				});
				throw error;
			}
		},
		[createAndFireAnalyticsEvent, getSuggestions],
	);
};
