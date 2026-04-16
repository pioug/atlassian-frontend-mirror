/**
 * Action Group: insights
 *
 * Actions related to the insights page (viewing, filtering, sorting data).
 *
 * ## Adding a new action
 * 1. Add a new variant to the `InsightsEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

/**
 * Discriminated union payload type for insights events.
 * Use with `trackAgentEvent()`.
 */
export type InsightsEventPayload = {
	// https://data-portal.internal.atlassian.com/analytics/registry/100622
	actionSubject: 'rovoAgent';
	action: 'insightsDateFilterChanged';
	attributes: {
		filterType: 'preset' | 'custom';
		days?: number;
	};
};
