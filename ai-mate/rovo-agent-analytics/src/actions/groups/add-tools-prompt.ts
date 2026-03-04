/**
 * Action Group: addToolsPrompt
 *
 * Add tools prompt modal — shown when a user tries to activate/publish an agent that has no tools.
 * The user can browse tools or dismiss and proceed without them.
 *
 * This group is intentionally flow-agnostic so the action values stay stable
 * regardless of whether the prompt fires from the create flow or a future publish flow.
 *
 * ## Adding a new action
 * 1. Add the action to the `AddToolsPromptActions` enum below with a data-portal link
 * 2. Register this group in ../registry.ts (if this is a new group file)
 *
 */

/** The group name sent as `attributes.actionGroup` in analytics events */
export const ACTION_GROUP = 'addToolsPrompt' as const;

export enum AddToolsPromptActions {
	/* Add tools prompt shown (agent has no tools) - https://data-portal.internal.atlassian.com/analytics/registry/98106 */
	SHOWN = 'addToolsPromptShown',
	/* User clicked "Browse skills" on the add tools prompt - https://data-portal.internal.atlassian.com/analytics/registry/98107 */
	BROWSE = 'addToolsPromptBrowse',
	/* User dismissed the add tools prompt ("No thanks") and proceeded anyway - https://data-portal.internal.atlassian.com/analytics/registry/98108 */
	DISMISS = 'addToolsPromptDismiss',
}
