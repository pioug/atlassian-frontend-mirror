import type {
	ExternalHistoryBlockedReason,
	ExternalHistoryRejection,
	ExternalHistoryReceiveContext,
	ExternalHistoryOwnershipOutcomeMeta,
} from '../external-history-event';
import type { HistoryState } from '../historyState';

/** Shape changes require a version bump. Build identifies the published package, not a deployment. */
export const AGENT_UNDO_DIAGNOSTIC_SCHEMA_VERSION = 3;
export const AGENT_UNDO_DIAGNOSTIC_MAX_EVENTS = 200;
export const AGENT_UNDO_DIAGNOSTIC_MAX_ALIASES = 200;

export type AgentUndoDiagnosticStage =
	| 'batch-received'
	| 'batch-selected'
	| 'batch-deduplicated'
	| 'batch-promoted'
	| 'batch-rejected'
	| 'invocation-registered'
	| 'invocation-refreshed'
	| 'invocation-released'
	| 'redo-blocked'
	| 'redo-succeeded'
	| 'undo-blocked'
	| 'undo-succeeded';

/** Items include map-only items; events are logical bookmark-bearing undo groups, per branch. */
export type AgentUndoHistoryCounts = {
	doneEvents: number;
	doneItems: number;
	undoneEvents: number;
	undoneItems: number;
};

/**
 * Optional means unavailable for this stage, never guessed. Version ranges are half-open
 * collaboration step versions; indexes address the receive transaction's transform.
 * Receive counts count steps, ownership counts count registrations. Route is the actual
 * history builder route; receive.producerRoute describes the collaboration transform.
 */
export type AgentUndoDiagnosticContext = {
	activeHistorySlice?: boolean;
	batch?: { fromVersion: number; toVersion: number };
	gate?: 'enabled-by-producer';
	history?: { after: AgentUndoHistoryCounts; before: AgentUndoHistoryCounts };
	ownership?: { reason?: 'expiry' | 'teardown'; registrationCount: number };
	preflight?: 'succeeded' | 'blocked';
	receive?: ExternalHistoryReceiveContext;
	rejectionReason?:
		| ExternalHistoryRejection['reason']
		| 'no-promotable-items'
		| 'history-slice-has-tracked-steps';
	route?: 'direct' | 'rebased';
	transactionIndexes?: readonly number[];
};

export type AgentUndoDiagnosticEvent = Omit<AgentUndoDiagnosticContext, 'transactionIndexes'> & {
	blockedReason?: ExternalHistoryBlockedReason;
	editorAlias: string;
	invocationAlias?: string;
	stage: AgentUndoDiagnosticStage;
	timestamp: number;
	transactionIndexes?: number[];
};

export type AgentUndoDiagnosticArtifact = {
	build: { packageName: string };
	events: readonly AgentUndoDiagnosticEvent[];
	schemaVersion: 3;
};

export type AgentUndoDiagnostics = {
	clear: () => void;
	disable: () => void;
	exportArtifact: () => AgentUndoDiagnosticArtifact;
	getHistoryCounts: (history: HistoryState) => AgentUndoHistoryCounts;
	isEnabled: () => boolean;
	record: (
		stage: AgentUndoDiagnosticStage,
		editorInstanceId: string,
		invocationId?: string,
		blockedReason?: ExternalHistoryBlockedReason,
		context?: AgentUndoDiagnosticContext,
	) => void;
	recordOwnership: (meta: ExternalHistoryOwnershipOutcomeMeta) => void;
};

declare global {
	interface Window {
		__EDITOR_AGENT_UNDO_DEBUG__?: boolean;
		__EDITOR_AGENT_UNDO_DEBUG_CLEAR__?: () => void;
		__EDITOR_AGENT_UNDO_DEBUG_DISABLE__?: () => void;
		__EDITOR_AGENT_UNDO_DEBUG_EXPORT__?: () => AgentUndoDiagnosticArtifact;
	}
}

let events: AgentUndoDiagnosticEvent[] = [];
let lastTimestamp = 0;
const editorAliases = new Map<string, string>();
const invocationAliases = new Map<string, string>();

/**
 * Installs the DevTools entry points on `window`, once, the first time recording is found enabled.
 * Importing this module — which every consumer of the history fork does — therefore touches no
 * globals; only a session that opts in with `window.__EDITOR_AGENT_UNDO_DEBUG__ = true` gets them.
 */
let browserGlobalsInstalled = false;
const installBrowserGlobals = (): void => {
	if (browserGlobalsInstalled || typeof window === 'undefined') {
		return;
	}
	browserGlobalsInstalled = true;
	window.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__ = exportAgentUndoDiagnostics;
	window.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__ = clearAgentUndoDiagnostics;
	window.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__ = disableAgentUndoDiagnostics;
};

const isAgentUndoDiagnosticsEnabled = (): boolean => {
	const enabled = typeof window !== 'undefined' && window.__EDITOR_AGENT_UNDO_DEBUG__ === true;
	if (enabled) {
		installBrowserGlobals();
	}
	return enabled;
};

const aliasFor = (raw: string, table: Map<string, string>, prefix: string): string => {
	const existing = table.get(raw);
	if (existing !== undefined) return existing;
	if (table.size >= AGENT_UNDO_DIAGNOSTIC_MAX_ALIASES) return `${prefix}-overflow`;
	const alias = `${prefix}-${table.size + 1}`;
	table.set(raw, alias);
	return alias;
};

const cloneCounts = (counts: AgentUndoHistoryCounts): AgentUndoHistoryCounts => ({
	doneItems: counts.doneItems,
	doneEvents: counts.doneEvents,
	undoneItems: counts.undoneItems,
	undoneEvents: counts.undoneEvents,
});

/** Explicit allowlist at every nested boundary; never spread arbitrary producer metadata. */
const cloneContext = (
	context: AgentUndoDiagnosticContext,
): Omit<AgentUndoDiagnosticContext, 'transactionIndexes'> & { transactionIndexes?: number[] } => {
	const result: Omit<AgentUndoDiagnosticContext, 'transactionIndexes'> & {
		transactionIndexes?: number[];
	} = {};
	if (context.gate === 'enabled-by-producer') result.gate = context.gate;
	if (context.batch)
		result.batch = { fromVersion: context.batch.fromVersion, toVersion: context.batch.toVersion };
	if (context.receive) {
		result.receive = {
			rawStepCount: context.receive.rawStepCount,
			selectedStepCount: context.receive.selectedStepCount,
			remoteStepCount: context.receive.remoteStepCount,
			producerRoute: context.receive.producerRoute,
		};
		if (context.receive.fromVersion !== undefined)
			result.receive.fromVersion = context.receive.fromVersion;
		if (context.receive.toVersion !== undefined)
			result.receive.toVersion = context.receive.toVersion;
	}
	if (context.transactionIndexes) result.transactionIndexes = [...context.transactionIndexes];
	if (context.route !== undefined) result.route = context.route;
	if (context.activeHistorySlice !== undefined)
		result.activeHistorySlice = context.activeHistorySlice;
	if (context.rejectionReason !== undefined) result.rejectionReason = context.rejectionReason;
	if (context.preflight !== undefined) result.preflight = context.preflight;
	if (context.history)
		result.history = {
			before: cloneCounts(context.history.before),
			after: cloneCounts(context.history.after),
		};
	if (context.ownership) {
		result.ownership = { registrationCount: context.ownership.registrationCount };
		if (context.ownership.reason !== undefined) result.ownership.reason = context.ownership.reason;
	}
	return result;
};

/** Callers construct diagnostic context only inside an isEnabled guard. */
const recordAgentUndoDiagnostic: AgentUndoDiagnostics['record'] = (
	stage,
	editorInstanceId,
	invocationId,
	blockedReason,
	context,
) => {
	if (!isAgentUndoDiagnosticsEnabled()) return;
	lastTimestamp = Math.max(Date.now(), lastTimestamp + 1);
	const event: AgentUndoDiagnosticEvent = {
		editorAlias: aliasFor(editorInstanceId, editorAliases, 'editor'),
		stage,
		timestamp: lastTimestamp,
	};
	if (invocationId !== undefined)
		event.invocationAlias = aliasFor(invocationId, invocationAliases, 'invocation');
	if (blockedReason !== undefined) event.blockedReason = blockedReason;
	if (context) Object.assign(event, cloneContext(context));
	events.push(event);
	if (events.length > AGENT_UNDO_DIAGNOSTIC_MAX_EVENTS) events.shift();
};

const exportAgentUndoDiagnostics = (): AgentUndoDiagnosticArtifact => ({
	build: { packageName: '@atlaskit/prosemirror-history' },
	events: events.map((event) => ({
		...cloneContext(event),
		editorAlias: event.editorAlias,
		stage: event.stage,
		timestamp: event.timestamp,
		...(event.invocationAlias === undefined ? {} : { invocationAlias: event.invocationAlias }),
		...(event.blockedReason === undefined ? {} : { blockedReason: event.blockedReason }),
	})),
	schemaVersion: AGENT_UNDO_DIAGNOSTIC_SCHEMA_VERSION,
});

const clearAgentUndoDiagnostics = (): void => {
	events = [];
	lastTimestamp = 0;
	editorAliases.clear();
	invocationAliases.clear();
};

const disableAgentUndoDiagnostics = (): void => {
	if (typeof window !== 'undefined') window.__EDITOR_AGENT_UNDO_DEBUG__ = false;
	clearAgentUndoDiagnostics();
};

/** O(1), no document inspection. Call only inside a diagnostics-enabled guard. */
const getAgentUndoHistoryCounts = (history: HistoryState): AgentUndoHistoryCounts => ({
	doneItems: history.done.items.length,
	doneEvents: history.done.eventCount,
	undoneItems: history.undone.items.length,
	undoneEvents: history.undone.eventCount,
});

/** Ownership sends typed content-free outcomes to the same recorder as history. */
const recordAgentUndoOwnership = (meta: ExternalHistoryOwnershipOutcomeMeta): void => {
	if (!isAgentUndoDiagnosticsEnabled()) return;
	recordAgentUndoDiagnostic(
		meta.transition === 'registered'
			? 'invocation-registered'
			: meta.transition === 'refreshed'
				? 'invocation-refreshed'
				: 'invocation-released',
		meta.editorInstanceId,
		meta.invocationId,
		undefined,
		{
			gate: 'enabled-by-producer',
			ownership: { registrationCount: meta.registrationCount, reason: meta.reason },
		},
	);
};

export const agentUndoDiagnostics: AgentUndoDiagnostics = {
	getHistoryCounts: getAgentUndoHistoryCounts,
	recordOwnership: recordAgentUndoOwnership,
	clear: clearAgentUndoDiagnostics,
	disable: disableAgentUndoDiagnostics,
	exportArtifact: exportAgentUndoDiagnostics,
	isEnabled: isAgentUndoDiagnosticsEnabled,
	record: recordAgentUndoDiagnostic,
};
