import type { JqlAnalyticsEvent } from '@atlaskit/jql-editor-common/analytics/types';

export enum Action {
	FAILED = 'failed',
	SUCCESS = 'success',
}

export enum ActionSubject {
	AUTOCOMPLETE_INITIAL_DATA = 'autocompleteInitialData',
	AUTOCOMPLETE_SUGGESTIONS = 'autocompleteSuggestions',
}

export enum ActionSubjectId {}

export type JqlEditorAutocompleteAnalyticsEvent = JqlAnalyticsEvent<
	Action,
	ActionSubject,
	ActionSubjectId
>;
