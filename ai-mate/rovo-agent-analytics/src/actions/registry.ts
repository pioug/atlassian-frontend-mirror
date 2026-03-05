/**
 * Action Registry
 *
 * Single source of truth for ALL action groups across the library.
 * This file composes all groups into a type-safe registry and builds the
 * runtime mapping from action values to their group names, which gets
 * automatically attached as `attributes.actionGroup` in every fired event.
 *
 * Both `useRovoAgentActionAnalytics` and `useRovoAgentCreateAnalytics` hooks
 * use `ACTION_TO_GROUP` from this registry.
 *
 * ## Adding a new action group
 * 1. Create a new file in ./groups/ following the template of existing group files
 * 2. Import the group's ACTION_GROUP, action enum, and attribute type below
 * 3. If the group is used by the actions hook, add the attribute type to `ActionAttributes`
 * 4. Add the enum + group to `ACTION_TO_GROUP` using `mapActionsToGroup`
 */
import {
	AddToolsPromptActions,
	ACTION_GROUP as ADD_TOOLS_PROMPT_GROUP,
} from './groups/add-tools-prompt';
import {
	AgentInteractionActions,
	type AgentInteractionAttributes,
	ACTION_GROUP as AGENT_INTERACTIONS_GROUP,
} from './groups/agent-interactions';
import { CreateFlowActions, ACTION_GROUP as CREATE_FLOW_GROUP } from './groups/create-flow';
import {
	AgentDebugActions,
	type DebugActionAttributes,
	ACTION_GROUP as DEBUG_GROUP,
} from './groups/debug';
import {
	AgentEditingActions,
	type EditingActionAttributes,
	ACTION_GROUP as EDITING_GROUP,
} from './groups/editing';
import {
	AgentToolActions,
	type ToolsActionAttributes,
	ACTION_GROUP as TOOLS_GROUP,
} from './groups/tools';

/**
 * Combined attribute map for action-hook groups (type-safe attributes).
 * Create-flow groups are excluded — they use a looser attribute type via the create hook.
 */
export type ActionAttributes = AgentInteractionAttributes &
	EditingActionAttributes &
	DebugActionAttributes &
	ToolsActionAttributes;

/**
 * Helper to build a Record mapping each enum value to its group name.
 */
const mapActionsToGroup = <T extends Record<string, string>>(
	actionEnum: T,
	group: string,
): Record<string, string> => {
	return Object.fromEntries(Object.values(actionEnum).map((action) => [action, group]));
};

/**
 * Runtime lookup: action value → group name.
 * Used by ALL analytics hooks to auto-inject `attributes.actionGroup`.
 *
 * When you add a new group, add it here too.
 */
export const ACTION_TO_GROUP: Record<string, string> = {
	// Action hook groups
	...mapActionsToGroup(AgentInteractionActions, AGENT_INTERACTIONS_GROUP),
	...mapActionsToGroup(AgentEditingActions, EDITING_GROUP),
	...mapActionsToGroup(AgentDebugActions, DEBUG_GROUP),
	...mapActionsToGroup(AgentToolActions, TOOLS_GROUP),
	// Create hook groups
	...mapActionsToGroup(CreateFlowActions, CREATE_FLOW_GROUP),
	...mapActionsToGroup(AddToolsPromptActions, ADD_TOOLS_PROMPT_GROUP),
};
