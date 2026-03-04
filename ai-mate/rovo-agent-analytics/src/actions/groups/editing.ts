/**
 * Action Group: editing
 *
 * Agent editing/mutation events — fired when an agent's configuration is saved or modified.
 * Unlike agentInteractions (user clicks), these track actual data changes.
 *
 * ## Adding a new action
 * 1. Add the action to the `AgentEditingActions` enum below with a data-portal link
 * 2. Add the corresponding attribute type in `EditingActionAttributes`
 * 3. If this action doesn't fit editing/mutation events, create a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

/** The group name sent as `attributes.actionGroup` in analytics events */
export const ACTION_GROUP = 'editing' as const;

export enum AgentEditingActions {
	/* Agent updated - https://data-portal.internal.atlassian.com/analytics/registry/97122 */
	UPDATED = 'updated',
}

export type EditingActionAttributes = {
	[AgentEditingActions.UPDATED]: BaseAgentAnalyticsAttributes & {
		agentType: string;
		field: string;
	};
};
