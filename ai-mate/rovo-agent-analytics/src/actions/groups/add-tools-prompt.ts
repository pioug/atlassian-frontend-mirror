/**
 * Action Group: addToolsPrompt
 *
 * Events related to the "Add Tools" prompt shown during agent creation.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `AddToolsPromptEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 */

/**
 * Discriminated union payload type for add tools prompt events.
 * Use with `trackAgentEvent()`.
 */
export type AddToolsPromptEventPayload =
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/98106
			actionSubject: 'rovoAgent';
			action: 'addToolsPromptShown';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/98107
			actionSubject: 'rovoAgent';
			action: 'addToolsPromptBrowse';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/98108
			actionSubject: 'rovoAgent';
			action: 'addToolsPromptDismiss';
			attributes: {};
	  };
