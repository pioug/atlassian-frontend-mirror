/**
 * Action Group: debug
 *
 * Actions related to the agent debug modal (viewing, copying debug data, toggling skill info).
 *
 * ## Adding a new action
 * 1. Add the action to the `AgentDebugActions` enum below with a data-portal link
 * 2. Add the corresponding attribute type in `DebugActionAttributes`
 * 3. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

/** The group name sent as `attributes.actionGroup` in analytics events */
export const ACTION_GROUP = 'debug' as const;

export enum AgentDebugActions {
	/* View debug modal - https://data-portal.internal.atlassian.com/analytics/registry/97183 */
	VIEW = 'debugView',
	/* Copy all debug data - https://data-portal.internal.atlassian.com/analytics/registry/97186 */
	COPY_ALL = 'debugCopyAll',
	/* Copy debug data - https://data-portal.internal.atlassian.com/analytics/registry/97184 */
	COPY = 'debugCopy',
	/* Toggle skill info - https://data-portal.internal.atlassian.com/analytics/registry/97185 */
	TOGGLE_SKILL_INFO = 'debugToggleSkillInfo',
}

type EmptyAttributes = {};

export type DebugActionAttributes = {
	[AgentDebugActions.COPY_ALL]: EmptyAttributes;
	[AgentDebugActions.COPY]: EmptyAttributes;
	[AgentDebugActions.TOGGLE_SKILL_INFO]: { toolId: string; isExpanded: boolean };
	[AgentDebugActions.VIEW]: EmptyAttributes;
};
