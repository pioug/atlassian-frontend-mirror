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

export const stringifyError = (error: unknown): string | undefined => {
	try {
		return JSON.stringify(error);
	} catch {
		return undefined;
	}
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

// `sourceProduct` is threaded through every helper so analytics
// events can be attributed to the source product (`confluence-page` vs `jira-work-item`).
// All helpers accept it as an optional trailing argument; the spread-only-when-truthy
// pattern below ensures we never emit `sourceProduct: undefined` (which would dirty the
// event schema with empty keys).

export const getErrorPayload = <T extends ACTION_SUBJECT_ID>(
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
> => ({
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
	},
});

export const fetchErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH, error, resourceId, sourceProduct);
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

export const createSuccessPayloadNew = (resourceId: string): SyncBlockEventPayload => ({
	action: ACTION.INSERTED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId },
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

export const deleteSuccessPayload = (
	resourceId: string,
	sourceProduct?: string,
): SyncBlockEventPayload => ({
	action: ACTION.DELETED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId, ...(sourceProduct && { sourceProduct }) },
});
