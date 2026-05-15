/**
 * Action Group: modelPreferences
 *
 * Events fired when a user changes execution tier or model selection
 * in the model preferences field.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `ModelPreferencesEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit model preferences, create a new group file instead
 *    (see other files in this directory for the template)
 */
export type ModelPreferencesEventPayload =
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/102065
			actionSubject: 'rovoAgent';
			action: 'executionTierChanged';
			attributes: {
				executionTier: string;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/102066
			actionSubject: 'rovoAgent';
			action: 'executionModelChanged';
			attributes: {
				modelId: string | null;
				executionTier: string;
			};
	  };
