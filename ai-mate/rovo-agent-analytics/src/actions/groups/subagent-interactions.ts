/**
 * Action Group: agentInteractions
 *
 * User-initiated interactions with an agent — typically from the overflow menu ("...")
 * or agent profile surfaces (viewing, editing, deleting, duplicating, starring, sharing, verifying).
 *
 * NOTE: This is about UI interactions, not backend "actions" (which are being replaced by "tools").
 *
 * ## Adding a new action
 * 1. Add a new variant to the `AgentInteractionsEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit user interactions, create a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

/**
 * Discriminated union payload type for agent interaction events.
 * Use with `trackAgentEvent()`.
 */
export type SubagentInteractionsEventPayload =
	| {
			actionSubject: 'rovoAgent';
			action: 'subagentCreate';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'subagentDelete';
			attributes: BaseAgentAnalyticsAttributes;
	  };
