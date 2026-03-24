/**
 * Action Group: createFlow
 *
 * Create agent funnel steps — from clicking "Create agent" through to activation or discard.
 *
 * ## Funnel overview
 *
 * | Step                  | v1 (NL flow) event     | v2 (SA flow) event     | CSID behavior                    |
 * |-----------------------|------------------------|------------------------|----------------------------------|
 * | Intent to create      | createFlowStart        | saDraft                | Uses existing CSID                                        |
 * | Land in NL page       | createLandInStudio     | (skipped)              | Uses existing CSID               |
 * | NL interaction        | REVIEW_NL / SKIP_NL    | (skipped)              | Uses existing CSID               |
 * | Land in configure     | createLandInConfigure  | createLandInConfigure  | Uses existing CSID               |
 * | Activate agent        | createFlowActivate     | createFlowActivate     | Uses existing CSID               |
 *
 * ## CSID (Create Session ID)
 *
 * CSID links all events in a single agent creation session.
 * - `trackCreateSessionStart()` fires `createFlowStart` with the current CSID
 * - `trackCreateSession()` uses the existing CSID (for all other steps including `saDraft`)
 *
 * ## Adding a new action
 * 1. Add a new variant to the `CreateFlowEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

/**
 * Discriminated union payload type for create flow events.
 * Use with `trackAgentEvent()`.
 */
export type CreateFlowEventPayload =
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97089
			actionSubject: 'rovoAgent';
			action: 'createFlowStart';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97127
			actionSubject: 'rovoAgent';
			action: 'createFlowSkipNL';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97124
			actionSubject: 'rovoAgent';
			action: 'createFlowReviewNL';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97123
			actionSubject: 'rovoAgent';
			action: 'createFlowActivate';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97131
			actionSubject: 'rovoAgent';
			action: 'createFlowRestart';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97132
			actionSubject: 'rovoAgent';
			action: 'createFlowError';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97136
			actionSubject: 'rovoAgent';
			action: 'createLandInStudio';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97137
			actionSubject: 'rovoAgent';
			action: 'createDiscard';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97924
			actionSubject: 'rovoAgent';
			action: 'saDraft';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/98639
			actionSubject: 'rovoAgent';
			action: 'createLandInConfigure';
			attributes: {};
	  };
