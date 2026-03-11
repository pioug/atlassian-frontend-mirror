import type { AgentInteractionsEventPayload } from '../actions/groups/agent-interactions';
import type { DebugEventPayload } from '../actions/groups/debug';
import type { EditingEventPayload } from '../actions/groups/editing';
import type { EvaluationEventPayload } from '../actions/groups/evaluation';
import type { ToolsEventPayload } from '../actions/groups/tools';

export type RemainingRequired<T, P extends Partial<T>> = Required<Omit<T, keyof P>>;

export type BaseAgentAnalyticsAttributes = {
	touchPoint?: string;
	agentId?: string;
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
	| DebugEventPayload
	| ToolsEventPayload
	| EvaluationEventPayload
	| ErrorEventPayload;
