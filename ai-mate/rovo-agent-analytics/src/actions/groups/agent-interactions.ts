/**
 * Action Group: agentInteractions
 *
 * User-initiated interactions with an agent — typically from the overflow menu ("...")
 * or agent profile surfaces (viewing, editing, deleting, duplicating, starring, sharing, verifying).
 *
 * NOTE: This is about UI interactions, not backend "actions" (which are being replaced by "tools").
 *
 * ## Adding a new action
 * 1. Add the action to the `AgentInteractionActions` enum below with a data-portal link
 * 2. Add the corresponding attribute type in `AgentInteractionAttributes`
 * 3. If this action doesn't fit user interactions, create a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

/** The group name sent as `attributes.actionGroup` in analytics events */
export const ACTION_GROUP = 'agentInteractions' as const;

export enum AgentInteractionActions {
	/* View agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97125 */
	VIEW = 'view',
	/* Edit agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97126 */
	EDIT = 'edit',
	/* Copy link clicked - https://data-portal.internal.atlassian.com/analytics/registry/97128 */
	COPY_LINK = 'copyLink',
	/* Delete agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97129 */
	DELETE = 'delete',
	/* Duplicate agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97130 */
	DUPLICATE = 'duplicate',
	/* Star agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97133 */
	STAR = 'star',
	/* Chat with agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97095 */
	CHAT = 'chat',
	/* Verify agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97134 */
	VERIFY = 'verify',
	/* Unverify agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97135 */
	UNVERIFY = 'unverify',
}

export type AgentInteractionAttributes = {
	[AgentInteractionActions.VIEW]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.EDIT]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.COPY_LINK]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.DELETE]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.DUPLICATE]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.STAR]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.CHAT]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.VERIFY]: BaseAgentAnalyticsAttributes;
	[AgentInteractionActions.UNVERIFY]: BaseAgentAnalyticsAttributes;
};
