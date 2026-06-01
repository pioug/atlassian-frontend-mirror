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

export const stringifyError = (error: unknown): string | undefined => {
	try {
		return JSON.stringify(error);
	} catch {
		return undefined;
	}
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
): OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	T,
	{ error: string; resourceId?: string; sourceProduct?: string }
> => ({
	action: ACTION.ERROR,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		error,
		...(resourceId && { resourceId }),
		...(sourceProduct && { sourceProduct }),
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
): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE, error, resourceId, sourceProduct);
export const updateReferenceErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): RendererSyncBlockEventPayload =>
	getErrorPayload(
		ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_UPDATE,
		error,
		resourceId,
		sourceProduct,
	);
export const createErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE, error, resourceId, sourceProduct);
export const deleteErrorPayload = (
	error: string,
	resourceId?: string,
	sourceProduct?: string,
): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE, error, resourceId, sourceProduct);
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
