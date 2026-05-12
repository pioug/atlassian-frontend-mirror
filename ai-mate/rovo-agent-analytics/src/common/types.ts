import type { AgentInteractionsEventPayload } from '../actions/groups/agent-interactions';
import type { DebugEventPayload } from '../actions/groups/debug';
import type { EditingEventPayload } from '../actions/groups/editing';
import type { EvaluationEventPayload } from '../actions/groups/evaluation';
import type { InsightsEventPayload } from '../actions/groups/insights';
import type { KnowledgeFiltersEventPayload } from '../actions/groups/knowledge-filters';
import type { SubagentInteractionsEventPayload } from '../actions/groups/subagent-interactions';
import type { ToolsEventPayload } from '../actions/groups/tools';

export type RemainingRequired<T, P extends Partial<T>> = Required<Omit<T, keyof P>>;

export type BaseAgentAnalyticsAttributes = {
	touchPoint?: string;
	agentId?: string;
};

/**
 * Common attributes for events scoped to a single versioned agent.
 *
 * Extends `BaseAgentAnalyticsAttributes` with versioning state so DS can
 * distinguish first-publish vs republish, edits-on-draft vs edits-after-publish,
 * etc. without needing a separate event per state.
 *
 * - `agentIsPublished` — sourced from the BE `AgentStudioAssistant.isPublished`
 *   field. Whether the agent has at least one published version.
 * - `agentVersionNumber` — the version number the event relates to (e.g. the
 *   version being edited or published). Sourced from the BE
 *   `AgentStudioAssistant.version.versionNumber` field.
 *
 * Apply to every event scoped to a single agent (CRUD, publish, AND usage events).
 * Pre-mutation create-flow events stay attribute-free — no `agentId` exists yet.
 */
export type VersionedAgentAttributes = BaseAgentAnalyticsAttributes & {
	agentIsPublished?: boolean | null;
	agentVersionNumber?: number | null;
};

/** Common library attribute injected into all events */
export const LIBRARY_ATTRIBUTE = 'agents-analytics' as const;

/**
 * Generic error event payload type.
 * Use with `trackAgentEvent()` to track error events.
 */
export type ErrorEventPayload = {
	actionSubject: 'rovoAgentError';
	action: string;
	attributes: {
		error: { message: string };
		[key: string]: unknown;
	};
};

/**
 * Union of all event payload types.
 * Use with `trackAgentEvent()` for typed event tracking.
 */
export type EventPayload =
	| EditingEventPayload
	| AgentInteractionsEventPayload
	| SubagentInteractionsEventPayload
	| DebugEventPayload
	| ToolsEventPayload
	| EvaluationEventPayload
	| InsightsEventPayload
	| ErrorEventPayload
	| KnowledgeFiltersEventPayload;
