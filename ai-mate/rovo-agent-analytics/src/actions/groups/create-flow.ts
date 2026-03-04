/**
 * Action Group: createFlow
 *
 * Create agent funnel steps — from clicking "Create agent" through to activation or discard,
 *
 * ## Adding a new action
 * 1. Add the action to the `CreateFlowActions` enum below with a data-portal link
 * 2. Register this group in ../registry.ts (if this is a new group file)
 */

/** The group name sent as `attributes.actionGroup` in analytics events */
export const ACTION_GROUP = 'createFlow' as const;

export enum CreateFlowActions {
	/* Start create flow when user clicks on "Create agent" button - https://data-portal.internal.atlassian.com/analytics/registry/97089 */
	START = 'createFlowStart',
	/* Skip natural language - https://data-portal.internal.atlassian.com/analytics/registry/97127 */
	SKIP_NL = 'createFlowSkipNL',
	/* Review natural language - https://data-portal.internal.atlassian.com/analytics/registry/97124 */
	REVIEW_NL = 'createFlowReviewNL',
	/* Activate agent - https://data-portal.internal.atlassian.com/analytics/registry/97123 */
	ACTIVATE = 'createFlowActivate',
	/* Restart create flow - https://data-portal.internal.atlassian.com/analytics/registry/97131 */
	RESTART = 'createFlowRestart',
	/* Error occurred - https://data-portal.internal.atlassian.com/analytics/registry/97132 */
	ERROR = 'createFlowError',
	/* Land in studio - https://data-portal.internal.atlassian.com/analytics/registry/97136 */
	LAND = 'createLandInStudio',
	/* Discard agent - https://data-portal.internal.atlassian.com/analytics/registry/97137 */
	DISCARD = 'createDiscard',
	/* Draft created from solution architect plan card - https://data-portal.internal.atlassian.com/analytics/registry/97924 */
	SA_DRAFT = 'saDraft',
}
