/**
 * Action Group: createFlow
 *
 * Create agent funnel steps — from clicking "Create agent" through to activation /
 * publish.
 *
 * See LDR for the full reasoning behind the post-versioning funnel:
 * https://hello.atlassian.net/wiki/spaces/778dcad2d8a34a91b8ebe71c18678e0c/pages/6851055849
 *
 * ## Funnel overview
 *
 * | Step                                | v1 / NL (today)         | v1 / NL + versioning            | v2 / SA (today)         | v2 / SA + versioning            |
 * |-------------------------------------|-------------------------|---------------------------------|-------------------------|---------------------------------|
 * | Intent to create                    | createFlowStart         | createFlowStart                 | saDraft                 | saDraft                         |
 * | Land in NL page                     | createLandInStudio      | createLandInStudio              | —                       | —                               |
 * | NL interaction                      | createFlowReviewNL /    | createFlowReviewNL /            | —                       | —                               |
 * |                                     | createFlowSkipNL        | createFlowSkipNL                |                         |                                 |
 * | Land on landing w/ SA modal         | —                       | —                               | createLandIn-           | createLandIn-                   |
 * |                                     |                         |                                 | AgentLandingWithSA      | AgentLandingWithSA              |
 * | Land in configure screen            | createLandInConfigure   | dropped (no FE draft anymore;   | createLandInConfigure   | createLandInConfigure           |
 * |                                     |                         | createAgentRecord replaces it)  |                         |                                 |
 * | Discard                             | createDiscard           | dropped (no FE draft)           | —                       | —                               |
 * | Agent record created (BE mutation)  | createFlowActivate      | createAgentRecord (NEW) +       | createFlowActivate      | createFlowActivate              |
 * |                                     |                         | createFlowActivate (kept until  |                         | (SA still on FE drafts pre-     |
 * |                                     |                         | rollout — RAGE-3459)            |                         | migration)                      |
 * | Published                           | —                       | published (NEW)                 | —                       | ❓ owned by SA team              |
 * | Generic error                       | createFlowError         | createFlowError                 | createFlowError         | createFlowError                 |
 *
 * Funnel completion (first publish) is derived from `published` events with
 * `agentIsPublished === false` in the attributes (i.e. the pre-mutation state).
 *
 * ## CSID (Create Session ID)
 *
 * CSID links all events in a single agent creation session.
 * - `trackCreateSessionStart()` fires `createFlowStart` with the current CSID
 * - `trackCreateSession()` uses the existing CSID (for all other steps including `saDraft`)
 *
 * With versioning the user can leave and come back days later to keep editing,
 * so the in-memory linear "session" assumption breaks. Post-mutation events
 * carry `agentId` (via `VersionedAgentAttributes`) which can be used as the
 * stable correlation key across sessions. See LDR for the full discussion.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `CreateFlowEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

import type { VersionedAgentAttributes } from '../../common/types';

export type AgentPublishAnalyticsAttributes = {
	agentId?: string;
	/**
	 * Per-source knowledge map: keys are source identifiers (e.g. 'CONFLUENCE'),
	 * values carry `enabled` flag and a comma-joined list of active 3P filter keys.
	 */
	agentKnowledge: Record<string, { enabled: boolean; filters: string }> | null;
	/**
	 * This is the total of mcpServerCount only in the base agent
	 */
	agentMcpServerCount: number;
	/**
	 * This is the total of agenticSkillCount only in the base agent
	 */
	agentSkillCount: number;
	/**
	 * This is the list of agenticSkillIds only in the base agent
	 */
	agentSkillsList: string;
	/**
	 * This is the total of toolCount only in the base agent
	 */
	agentToolCount: number;
	/**
	 * This is the list of toolIds only in the base agent
	 */
	agentToolsList: string;
	agentType: 'AgentStudioAssistant';
	agentVersionNumber: number | null;
	isFirstPublish: boolean | null;
	scenarioList: ReadonlyArray<{
		knowledge: string[] | null | undefined;
		knowledgeType: 'custom' | 'disabled' | 'all';
		mcpServerCount: number;
		skillCount: number;
		skillsList: string;
		toolCount: number;
		toolsList: string;
	}>;
	source?: string;
};

export type AgentPlanAnalyticsAttributes = Omit<
	AgentPublishAnalyticsAttributes,
	'agentId' | 'agentVersionNumber' | 'isFirstPublish'
>;

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
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/100739
			//
			// Fired when a user lands on a deprecated `/create/<subpath>` URL
			// (e.g. /create/details, /create/identity) and is redirected to the
			// NL create screen (v1 studio) or the agents landing page with the
			// SA modal open (v2 studio) because agent versioning is enabled.
			actionSubject: 'rovoAgent';
			action: 'createSubpathRedirect';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/99780
			//
			// Fired when a user lands on the agents landing page with the SA
			// modal auto-opened (e.g. "Create agent" clicked in Confluence/Jira
			// with the `?openCreateAgentModal=...` query param). v2/SA only.
			actionSubject: 'rovoAgent';
			action: 'createLandInAgentLandingWithSA';
			attributes: {};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/101157
			//
			// Fires when the BE `agentStudio_createAgent` mutation succeeds.
			// Mutually exclusive with `createFlowActivate` per call.
			actionSubject: 'rovoAgent';
			action: 'createAgentRecord';
			attributes: VersionedAgentAttributes & Record<string, unknown>;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/101158
			//
			// Fires every time an agent version is successfully published.
			// `agentIsPublished` carries the PRE-mutation value so first-publish
			// is derivable as `agentIsPublished === false`.
			// `agentVersionNumber` is the version that was just published.
			actionSubject: 'rovoAgent';
			action: 'published';
			attributes: AgentPublishAnalyticsAttributes & Record<string, unknown>;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/102957
			//
			// Fires when a plan is generated for the first time (non-historical
			// message). Used to measure plan generation volume.
			actionSubject: 'rovoAgent';
			action: 'createFlowPlanGenerated';
			attributes: AgentPlanAnalyticsAttributes & Record<string, unknown>;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/102958
			//
			// Fires every time a plan card is viewed (including historical
			// re-views). Used to measure plan impression volume.
			actionSubject: 'rovoAgent';
			action: 'createFlowPlanViewed';
			attributes: AgentPlanAnalyticsAttributes & Record<string, unknown>;
	  }
	| {
			// Fires when a newly created agent has the work-item surface
			// enabled (i.e. `workItemSurfaceEnabled` is true in the BE
			// response), making the agent assignable to Jira issues.
			actionSubject: 'setIsAgentAssignable';
			action: 'success';
			attributes: Record<string, unknown>;
	  };
