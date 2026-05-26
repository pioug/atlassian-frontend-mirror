/**
 * Action Group: editing
 *
 * Agent editing/mutation events — fired when an agent's configuration is saved or modified.
 * Unlike agentInteractions (user clicks), these track actual data changes.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `EditingEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit editing/mutation events, create a new group file instead
 *    (see other files in this directory for the template)
 */
import type { VersionedAgentAttributes } from '../../common/types';

export type EditingEventPayload = {
	// https://data-portal.internal.atlassian.com/analytics/registry/97122
	actionSubject: 'rovoAgent';
	action: 'updated';
	attributes: VersionedAgentAttributes & {
		agentType?: string;
		field: string;
		/**
		 * Identifies the subagent (formerly "scenario") whose configuration was updated.
		 * Pass the scenario/subagent id when the analytics event is fired at the
		 * scenario/subagent level. Pass `null` when the event is fired at the agent
		 * level (i.e. not scoped to any specific subagent).
		 */
		subagentId: string | null;
	};
};
