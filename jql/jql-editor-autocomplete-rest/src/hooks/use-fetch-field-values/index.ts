import { useCallback } from 'react';

import { type AutocompleteOptions, EventType } from '@atlaskit/jql-editor-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { Action, ActionSubject, type JqlEditorAutocompleteAnalyticsEvent } from '../../analytics';
import { type GetAutocompleteSuggestions } from '../../common/types';

export const getAutocompleteSuggestionsUrl = (field: string, query?: string) =>
	fg('empanada_jql_editor_uri_encode_suggestions_params')
		? `/rest/api/latest/jql/autocompletedata/suggestions?fieldName=${encodeURIComponent(field)}&fieldValue=${encodeURIComponent(query ?? '')}`
		: `/rest/api/latest/jql/autocompletedata/suggestions?fieldName=${field}&fieldValue=${query ?? ''}`;

export const useFetchFieldValues = (
	getSuggestions: GetAutocompleteSuggestions,
	createAndFireAnalyticsEvent: (payload: JqlEditorAutocompleteAnalyticsEvent) => void,
) => {
	return useCallback(
		async (field: string, query?: string): Promise<AutocompleteOptions> => {
			try {
				const data = await getSuggestions(getAutocompleteSuggestionsUrl(field, query));

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
				});

				return results;
			} catch (error) {
				createAndFireAnalyticsEvent({
					action: Action.FAILED,
					actionSubject: ActionSubject.AUTOCOMPLETE_SUGGESTIONS,
					eventType: EventType.OPERATIONAL,
				});
				throw error;
			}
		},
		[createAndFireAnalyticsEvent, getSuggestions],
	);
};
