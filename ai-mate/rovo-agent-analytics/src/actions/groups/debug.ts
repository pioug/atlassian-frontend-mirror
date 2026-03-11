/**
 * Action Group: debug
 *
 * Actions related to the agent debug modal (viewing, copying debug data, toggling skill info).
 *
 * ## Adding a new action
 * 1. Add a new variant to the `DebugEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

/**
 * Discriminated union payload type for debug events.
 * Use with `trackAgentEvent()`.
 */
export type DebugEventPayload =
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97183
			actionSubject: 'rovoAgent';
			action: 'debugView';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97186
			actionSubject: 'rovoAgent';
			action: 'debugCopyAll';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97184
			actionSubject: 'rovoAgent';
			action: 'debugCopy';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97185
			actionSubject: 'rovoAgent';
			action: 'debugToggleSkillInfo';
			attributes: { toolId: string; isExpanded: boolean };
	  };
