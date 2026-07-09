import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import type {
	RendererSyncBlockEventPayload,
	OperationalAEP,
	SyncBlockEventPayload,
} from '@atlaskit/editor-common/analytics';

import { SyncBlockError } from '../common/types';
import type { DeletionMechanism, DeletionReason } from '../common/types';

export const stringifyError = (error: unknown): string | undefined => {
	try {
		return JSON.stringify(error);
	} catch {
		return undefined;
	}
};

/**
 * PII-safe extraction of `message`/`name` from an unknown caught error, used to
 * de-opaque `errored` failures. Only ever reads `Error.message` / `Error.name` — it
 * never stringifies arbitrary objects (which could pull in node content / UGC), and
 * non-`Error` values yield `{}` so no `[object Object]` or serialized payload leaks
 * into analytics.
 */
export const getPiiSafeOriginalError = (
	error: unknown,
): { originalMessage?: string; originalName?: string } => {
	if (error instanceof Error) {
		return {
			...(error.message && { originalMessage: error.message }),
			...(error.name && { originalName: error.name }),
		};
	}
	return {};
};

/**
 * The set of categorical failure reasons emitted on synced-block operational error
 * events (EDITOR-7796). These let the analytics dashboard break delete/update/create
 * failures down by cause (Block Service / HG / Relay) instead of relying on the
 * free-text `error` blob. Mirrors the {@link SyncBlockError} enum values, plus an
 * `unknown` fallback for unclassifiable errors.
 */
export type SyncBlockErrorReason = `${SyncBlockError}` | 'unknown';

const SYNC_BLOCK_ERROR_REASONS: ReadonlySet<string> = new Set(Object.values(SyncBlockError));

/**
 * Maps a result `error` field (which may be a {@link SyncBlockError} enum value such as
 * `'not_found'`, or an arbitrary stringified blob) to a stable categorical
 * {@link SyncBlockErrorReason} for analytics grouping. Anything that is not a known
 * `SyncBlockError` value collapses to `'unknown'` so the dashboard never has to group on
 * free-text error blobs.
 */
export const classifyErrorReason = (error?: string): SyncBlockErrorReason => {
	if (error && SYNC_BLOCK_ERROR_REASONS.has(error)) {
		return error as SyncBlockErrorReason;
	}
	return 'unknown';
};

/**
 * Extra, optional analytics attributes describing WHY an operational synced-block
 * action failed. Spread conditionally so we never emit `undefined` keys (EDITOR-7796).
 */
export type ErrorAttributionAttributes = {
	/** Categorical failure cause for dashboard grouping. */
	reason?: SyncBlockErrorReason;
	/** Backend HTTP status code when the failure came from a `BlockError`. */
	statusCode?: number;
};

/**
 * Builds the {@link ErrorAttributionAttributes} for a failed synced-block operation from
 * the raw result `error` field and optional backend `statusCode`. Returns `undefined`
 * when the `platform_editor_blocks_patch_3` gate is OFF, so the new `reason`/`statusCode`
 * attributes are only emitted once the gate is rolled out (EDITOR-7796).
 *
 * `gateEnabled` is injected by the caller (the store managers evaluate `fg(...)`) so this
 * helper stays pure and trivially unit-testable for both gate states.
 */
export const buildErrorAttribution = (
	gateEnabled: boolean,
	error?: string,
	statusCode?: number,
): ErrorAttributionAttributes | undefined => {
	if (!gateEnabled) {
		return undefined;
	}
	return {
		reason: classifyErrorReason(error),
		...(statusCode !== undefined && { statusCode }),
	};
};

/**
 * The set of categorical failure reasons emitted on synced-block fetch/subscribe
 * operational error events (EDITOR-7862). Extends the write-path
 * {@link SyncBlockErrorReason} set with read-path-specific buckets so the analytics
 * dashboard can break fetch failures down by cause instead of regex-matching the
 * free-text `error` blob.
 *
 * The read path surfaces several causes the write-path `SyncBlockError` enum does not
 * model (benign source-state transitions, permission denials, WebSocket lifecycle, and
 * client-side readiness errors), so those are added here. Known `SyncBlockError` enum
 * values (`not_found`, `forbidden`, ...) still pass through unchanged.
 */
export type SyncBlockFetchErrorReason =
	| SyncBlockErrorReason
	// Benign source-state transitions — the source is intentionally gone/unavailable,
	// not a genuine system failure.
	| 'source_deleted'
	| 'source_unpublished'
	| 'source_unsynced'
	| 'source_not_found'
	// Working-as-designed permission outcomes.
	| 'permission_denied'
	| 'unauthenticated'
	// Genuine system failures specific to the realtime/read path.
	| 'websocket_drop'
	| 'websocket_exhausted'
	| 'network'
	| 'data_provider_not_ready';

/**
 * Fetch reasons that represent benign (working-as-designed) outcomes rather than genuine
 * system failures. The dashboard uses this to compute a "true error rate" by excluding
 * benign reasons via the structured `reason` attribute instead of brittle free-text regex
 * (EDITOR-7862).
 */
export const FETCH_BENIGN_REASONS: ReadonlySet<SyncBlockFetchErrorReason> = new Set([
	'source_deleted',
	'source_unpublished',
	'source_unsynced',
	'source_not_found',
	'permission_denied',
	'unauthenticated',
	// Mirror the benign write-path enum equivalents so already-classified errors are
	// treated consistently.
	'not_found',
	'forbidden',
	'unpublished',
	// `offline` is an expected client connectivity state, not a read-path system failure:
	// the error component is rendered for the offline experience, so it should not inflate
	// the true error rate. It still emits `reason` (so its volume can be inspected) but is
	// excluded from true-error counts.
	'offline',
	// NOTE: `entity_not_found` is intentionally NOT benign — it is retried up to
	// ENTITY_NOT_FOUND_MAX_RETRIES (analytics are suppressed during retries); by the time
	// the error event fires, retries are exhausted and it is a genuine failure. It still
	// emits `reason` (so it can be inspected) but is counted as a true error.
]);

/**
 * Ordered list of substring matchers mapping known free-text fetch/subscribe error
 * strings to a categorical {@link SyncBlockFetchErrorReason}. Each entry is a list of
 * lowercase needles; if ANY needle is found (case-insensitively) in the raw `error`
 * string, the entry's reason is used. Order matters: more specific entries must precede
 * more general ones.
 *
 * Plain `String.includes` substring matching is used deliberately instead of `RegExp`:
 * it sidesteps the `require-unicode-regexp` lint rule AND the declaration build's lower
 * compile target (which rejects the regex `u` flag with TS1501), while being faster and
 * easier to read. Doing this classification in code (rather than in dashboard SQL) keeps
 * the buckets versioned with the source strings that produce them (EDITOR-7862).
 */
const FETCH_REASON_MATCHERS: ReadonlyArray<
	readonly [ReadonlyArray<string>, SyncBlockFetchErrorReason]
> = [
	// Benign: source-state transitions (deletionReason values + free text).
	[['source-document-deleted'], 'source_deleted'],
	[['source-block-deleted'], 'source_deleted'],
	[['source-block-unpublished'], 'source_unpublished'],
	[['source-block-unsynced'], 'source_unsynced'],
	[['does not exist'], 'source_not_found'],
	[['unpublished'], 'source_unpublished'],
	// Working-as-designed permission outcomes.
	[['unauthenticated'], 'unauthenticated'],
	[['not permitted to read synced block'], 'permission_denied'],
	[['bulk permission check failed'], 'permission_denied'],
	[['permission denied'], 'permission_denied'],
	// Genuine system failures.
	[['reconnection failed after'], 'websocket_exhausted'],
	// `reconnect to the subscription` (not a bare `reconnect`) avoids false positives on
	// unrelated DB/GraphQL "reconnect" messages while still matching the WS-drop string.
	[['websocket', 'reconnect to the subscription', 'subscription terminated'], 'websocket_drop'],
	[['429', 'rate limit', 'rate-limit', 'ratelimit'], 'rate_limited'],
	// `econnrefused`/`econnreset` (not a bare `econn`, which would also match `reconnect`).
	[['network', 'failed to fetch', 'econnrefused', 'econnreset', 'timed out', 'timeout'], 'network'],
	[['data provider not set'], 'data_provider_not_ready'],
];

/**
 * Maps a fetch/subscribe `error` field — which may be a {@link SyncBlockError} enum
 * value, a {@link DeletionReason} value, or an arbitrary free-text/JSON blob — to a
 * stable categorical {@link SyncBlockFetchErrorReason} for analytics grouping.
 *
 * Resolution order:
 * 1. Known `SyncBlockError` enum value → passed through (via {@link classifyErrorReason}).
 * 2. Known free-text substring → mapped to a fetch-specific bucket.
 * 3. Anything else (including opaque blobs like `errored`-only payloads or
 *    `ErrorEvent: "undefined"`) → `'unknown'`, so the dashboard never groups on free text.
 *
 * Note: the bare string `'errored'` IS a `SyncBlockError` enum value and therefore
 * classifies as `'errored'` (not `'unknown'`); only genuinely unrecognised strings
 * collapse to `'unknown'`.
 */
export const classifyFetchErrorReason = (error?: string): SyncBlockFetchErrorReason => {
	const enumReason = classifyErrorReason(error);
	if (enumReason !== 'unknown') {
		return enumReason;
	}
	if (error) {
		const haystack = error.toLowerCase();
		for (const [needles, reason] of FETCH_REASON_MATCHERS) {
			if (needles.some((needle) => haystack.includes(needle))) {
				return reason;
			}
		}
	}
	return 'unknown';
};

/**
 * Extra, optional analytics attributes describing WHY a fetch/subscribe synced-block
 * action failed. Spread conditionally so we never emit `undefined` keys (EDITOR-7862).
 *
 * Adds `benign` on top of the shared {@link ErrorAttributionAttributes} so the dashboard
 * can compute a true error rate (`genuine / total`) without any free-text regex.
 */
export type FetchErrorAttributionAttributes = {
	/**
	 * Categorical fetch failure cause for dashboard grouping. Declared standalone (not via
	 * `ErrorAttributionAttributes & ...`) because intersecting two `reason?` properties
	 * narrows the type to the write-path {@link SyncBlockErrorReason}; we need the wider
	 * {@link SyncBlockFetchErrorReason} here (EDITOR-7862).
	 */
	reason?: SyncBlockFetchErrorReason;
	/** Backend HTTP status code when the failure came from a `BlockError`. */
	statusCode?: number;
	/**
	 * Whether the reason is a benign/working-as-designed outcome (not a true failure).
	 * Required (not optional) so this type structurally discriminates fetch attribution
	 * from the write-path {@link ErrorAttributionAttributes}; this lets {@link getErrorPayload}
	 * overload-resolve the correct (wider) `reason` type per path. `buildFetchErrorAttribution`
	 * always sets it, so requiring it costs nothing.
	 */
	benign: boolean;
};

/**
 * Builds the {@link FetchErrorAttributionAttributes} for a failed fetch/subscribe
 * synced-block operation from the raw `error` field and optional backend `statusCode`.
 * Returns `undefined` when the `platform_editor_blocks_patch_3` gate is OFF, so the new
 * `reason`/`statusCode`/`benign` attributes are only emitted once the gate is rolled out
 * (EDITOR-7862). The existing free-text `error` attribute is always left unchanged.
 *
 * `gateEnabled` is injected by the caller (the store managers evaluate `fg(...)`) so this
 * helper stays pure and trivially unit-testable for both gate states.
 */
export const buildFetchErrorAttribution = (
	gateEnabled: boolean,
	error?: string,
	statusCode?: number,
): FetchErrorAttributionAttributes | undefined => {
	if (!gateEnabled) {
		return undefined;
	}
	const reason = classifyFetchErrorReason(error);
	return {
		reason,
		benign: FETCH_BENIGN_REASONS.has(reason),
		...(statusCode !== undefined && { statusCode }),
	};
};

// `sourceProduct` is threaded through every helper so analytics
// events can be attributed to the source product (`confluence-page` vs `jira-work-item`).
// All helpers accept it as an optional trailing argument; the spread-only-when-truthy
// pattern below ensures we never emit `sourceProduct: undefined` (which would dirty the
// event schema with empty keys).

/**
 * Shared operational ERROR payload builder for synced-block events.
 *
 * Overloaded so the emitted `reason` type stays accurate per path (raised in review on
 * EDITOR-7862): fetch/subscribe callers pass a {@link FetchErrorAttributionAttributes}
 * (discriminated by its required `benign` field) and get the wider
 * {@link SyncBlockFetchErrorReason}; write-path callers pass an
 * {@link ErrorAttributionAttributes} (or nothing) and keep the narrower
 * {@link SyncBlockErrorReason}, so write-path payloads never claim to carry fetch-only
 * buckets like `source_deleted` they never emit.
 */
export function getErrorPayload<T extends ACTION_SUBJECT_ID>(
	actionSubjectId: T,
	error: string,
	resourceId: string | undefined,
	sourceProduct: string | undefined,
	attribution: FetchErrorAttributionAttributes,
): OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	T,
	{
		error: string;
		resourceId?: string;
		sourceProduct?: string;
		reason?: SyncBlockFetchErrorReason;
		statusCode?: number;
		benign?: boolean;
	}
>;
export function getErrorPayload<T extends ACTION_SUBJECT_ID>(
	actionSubjectId: T,
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: ErrorAttributionAttributes,
): OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	T,
	{
		error: string;
		resourceId?: string;
		sourceProduct?: string;
		reason?: SyncBlockErrorReason;
		statusCode?: number;
	}
>;
export function getErrorPayload<T extends ACTION_SUBJECT_ID>(
	actionSubjectId: T,
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: ErrorAttributionAttributes | FetchErrorAttributionAttributes,
): OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	T,
	{
		error: string;
		resourceId?: string;
		sourceProduct?: string;
		reason?: SyncBlockFetchErrorReason;
		statusCode?: number;
		benign?: boolean;
	}
> {
	return {
		action: ACTION.ERROR,
		actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
		actionSubjectId,
		eventType: EVENT_TYPE.OPERATIONAL,
		attributes: {
			error,
			...(resourceId && { resourceId }),
			...(sourceProduct && { sourceProduct }),
			...(attribution?.reason && { reason: attribution.reason }),
			...(attribution?.statusCode !== undefined && { statusCode: attribution.statusCode }),
			// `benign` is only present on fetch/subscribe attribution (EDITOR-7862). It is a
			// boolean (never UGC); the `'benign' in attribution` check both guards the
			// write-path attribution (which has no `benign`) and narrows the union so
			// `attribution.benign` is accessible.
			...(attribution && 'benign' in attribution && { benign: attribution.benign }),
		},
	};
}

export const fetchErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: FetchErrorAttributionAttributes,
): RendererSyncBlockEventPayload =>
	// Branch on attribution presence so each call resolves to a concrete overload: with
	// attribution it hits the fetch overload (wider `reason`); without it (gate OFF) it
	// hits the no-attribution overload. Both produce a fetch event regardless.
	attribution
		? getErrorPayload(
				ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
				error,
				resourceId,
				sourceProduct,
				attribution,
			)
		: getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH, error, resourceId, sourceProduct);
export const getSourceInfoErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_GET_SOURCE_INFO, error, resourceId, sourceProduct);
export const updateErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: ErrorAttributionAttributes,
): SyncBlockEventPayload =>
	getErrorPayload(
		ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE,
		error,
		resourceId,
		sourceProduct,
		attribution,
	);
export const updateReferenceErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: ErrorAttributionAttributes,
): RendererSyncBlockEventPayload =>
	getErrorPayload(
		ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_UPDATE,
		error,
		resourceId,
		sourceProduct,
		attribution,
	);
export const createErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: ErrorAttributionAttributes,
): SyncBlockEventPayload =>
	getErrorPayload(
		ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
		error,
		resourceId,
		sourceProduct,
		attribution,
	);
export const deleteErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
	attribution?: ErrorAttributionAttributes,
): SyncBlockEventPayload =>
	getErrorPayload(
		ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
		error,
		resourceId,
		sourceProduct,
		attribution,
	);
export const updateCacheErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE_CACHE, error, resourceId, sourceProduct);
/**
 * Payload for `SYNCED_BLOCK_SOURCE_INFO_ORPHANED`. Fired when source-info
 * resolves into a cache that has already been deleted — should be unreachable
 * under `platform_synced_block_patch_14`.
 */
export const sourceInfoOrphanedPayload = (
	resourceId?: string,
	sourceProduct?: string,
	context?: { hasPendingDeletion?: boolean; hasSubscribers?: boolean },
): RendererSyncBlockEventPayload => ({
	action: ACTION.ERROR,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_INFO_ORPHANED,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		...(resourceId && { resourceId }),
		...(sourceProduct && { sourceProduct }),
		...(context?.hasPendingDeletion !== undefined && {
			hasPendingDeletion: context.hasPendingDeletion,
		}),
		...(context?.hasSubscribers !== undefined && { hasSubscribers: context.hasSubscribers }),
	},
});

/**
 * Payload for `SYNCED_BLOCK_CACHE_DELETION_FORCED`. Fired when the cache
 * deletion timer has been rescheduled `MAX_RESCHEDULE_COUNT` times and we force
 * the deletion to avoid leaking memory. Indicates a stuck in-flight flag.
 */
export const cacheDeletionForcedPayload = (
	rescheduleCount: number,
	resourceId?: string,
	sourceProduct?: string,
): RendererSyncBlockEventPayload => ({
	action: ACTION.ERROR,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CACHE_DELETION_FORCED,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		rescheduleCount,
		...(resourceId && { resourceId }),
		...(sourceProduct && { sourceProduct }),
	},
});

export const fetchReferencesErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): SyncBlockEventPayload =>
	getErrorPayload(
		ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH_REFERENCES,
		error,
		resourceId,
		sourceProduct,
	);

// Success payloads
export const fetchSuccessPayload = (
	resourceId: string,
	blockInstanceId?: string,
	sourceProduct?: string,
): RendererSyncBlockEventPayload => ({
	action: ACTION.FETCHED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId, blockInstanceId, ...(sourceProduct && { sourceProduct }) },
});

export const createSuccessPayload = (
	resourceId: string,
	sourceProduct?: string,
): SyncBlockEventPayload => {
	return {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.BODIED_SYNCED_BLOCK,
		eventType: EVENT_TYPE.TRACK,
		attributes: { resourceId, ...(sourceProduct && { sourceProduct }) },
	};
};

/**
 * Operational `syncedBlockCreate` success event (previously only error rows
 * existed, so dashboards had no create denominator). Fired behind
 * `platform_editor_blocks_patch_4` with the `blockInstanceId` join key.
 */
export const createSuccessOperationalPayload = (
	resourceId: string,
	blockInstanceId?: string,
	sourceProduct?: string,
): SyncBlockEventPayload => ({
	action: ACTION.INSERTED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		resourceId,
		...(blockInstanceId && { blockInstanceId }),
		...(sourceProduct && { sourceProduct }),
	},
});

export const updateSuccessPayload = (
	resourceId: string,
	hasReference?: boolean,
	sourceProduct?: string,
): SyncBlockEventPayload => ({
	action: ACTION.UPDATED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		resourceId,
		...(hasReference !== undefined && { hasReference }),
		...(sourceProduct && { sourceProduct }),
	},
});

/**
 * Optional enrichment for the `syncedBlockDelete` success event behind
 * `platform_editor_blocks_patch_4`. All fields optional so the gate-off payload
 * is unchanged; `blockInstanceId` is the bare-uuid join key.
 */
export type DeleteSuccessEnrichment = {
	blockInstanceId?: string;
	deletionReason?: DeletionReason;
	mechanism?: DeletionMechanism;
};

export const deleteSuccessPayload = (
	resourceId: string,
	sourceProduct?: string,
	enrichment?: DeleteSuccessEnrichment,
): SyncBlockEventPayload => ({
	action: ACTION.DELETED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		resourceId,
		...(sourceProduct && { sourceProduct }),
		...(enrichment?.blockInstanceId && { blockInstanceId: enrichment.blockInstanceId }),
		...(enrichment?.deletionReason && { deletionReason: enrichment.deletionReason }),
		...(enrichment?.mechanism && { mechanism: enrichment.mechanism }),
	},
});
