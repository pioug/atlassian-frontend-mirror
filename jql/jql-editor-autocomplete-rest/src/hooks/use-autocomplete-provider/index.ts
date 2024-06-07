import { useEffect, useMemo } from 'react';

import { type AutocompleteProvider } from '@atlaskit/jql-editor-common';

import { useJqlEditorAutocompleteAnalytics } from '../../analytics';
import {
	type GetAutocompleteInitialData,
	type GetAutocompleteSuggestions,
} from '../../common/types';
import {
	useJqlAutocompleteActions,
	useJqlFunctionsObservable,
	useJqlOrderableFieldsObservable,
	useJqlSearchableFieldsObservable,
} from '../../state';
import useOnFields from '../use-on-fields';
import useOnFunctions from '../use-on-functions';
import useOnOperators from '../use-on-operators';
import useOnValues from '../use-on-values';

export const useAutocompleteProvider = (
	/**
	 * Page/experience where the hook is being rendered. Used to correlate JQL analytics events to a given consumer.
	 */
	analyticsSource: string,
	/**
	 * Fetch initial autocomplete data for fields and functions using the [Get field reference data API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/#api-rest-api-3-jql-autocompletedata-post).
	 * Consumers can implement this method to configure which JS API will be used to make the request, e.g. Connect apps may
	 * wish to use the [AP.request API](https://developer.atlassian.com/cloud/jira/software/jsapi/request/).
	 */
	getInitialData: GetAutocompleteInitialData,
	/**
	 * Fetch autocomplete suggestions for field values using the [Get field autocomplete suggestions API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/#api-rest-api-3-jql-autocompletedata-suggestions-get).
	 * Consumers can implement this method to configure which JS API will be used to make the request, e.g. Connect apps may
	 * wish to use the [AP.request API](https://developer.atlassian.com/cloud/jira/software/jsapi/request/).
	 */
	getSuggestions: GetAutocompleteSuggestions,
): AutocompleteProvider => {
	const { createAndFireAnalyticsEvent } = useJqlEditorAutocompleteAnalytics(analyticsSource);
	const [, { load }] = useJqlAutocompleteActions();
	const [jqlSearchableFields$] = useJqlSearchableFieldsObservable();
	const [jqlOrderableFields$] = useJqlOrderableFieldsObservable();
	const [jqlFunctions$] = useJqlFunctionsObservable();

	const onFields = useOnFields(jqlSearchableFields$, jqlOrderableFields$);
	const onOperators = useOnOperators(jqlSearchableFields$);
	const onFunctions = useOnFunctions(jqlSearchableFields$, jqlFunctions$);
	const onValues = useOnValues(jqlSearchableFields$, getSuggestions, createAndFireAnalyticsEvent);

	useEffect(() => {
		// Load autocomplete data on mount
		load(getInitialData, createAndFireAnalyticsEvent);
	}, [createAndFireAnalyticsEvent, getInitialData, load]);

	return useMemo(
		() => ({ onFields, onOperators, onFunctions, onValues }),
		[onFields, onOperators, onFunctions, onValues],
	);
};
