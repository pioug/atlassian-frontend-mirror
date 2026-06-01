import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { ExperienceEventPayload } from './experience-events';
import type { InsertSourceSyncedBlockPayload } from './insert-events';
import type { OperationalAEP } from './utils';

type SyncedBlockErrorAttributes = {
	error: string;
	resourceId?: string;
	/**
	 * The product the source block lives in, derived from `resourceId` when present.
	 * Always optional because batch / subscription init paths fire without a `resourceId`.
	 */
	sourceProduct?: string;
};

type SyncedBlockSuccessAttributes = {
	blockInstanceId?: string;
	resourceId: string;
	/**
	 * The product the source block lives in, derived from `resourceId`.
	 * Always optional because batch / subscription init paths fire without a `resourceId`.
	 */
	sourceProduct?: string;
};

type FetchSyncedBlockSuccessAttributes = SyncedBlockSuccessAttributes;

type SyncedBlockCopySuccessAttributes = SyncedBlockSuccessAttributes & {
	inputMethod: INPUT_METHOD;
};

type SyncedBlockCopyErrorAttributes = SyncedBlockErrorAttributes & {
	inputMethod: INPUT_METHOD;
};

export type SyncedBlockSourceURLErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_URL,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockUpdateCacheErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE_CACHE,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockUpdateErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE,
	SyncedBlockErrorAttributes
>;

export type ReferenceSyncedBlockUpdateErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_UPDATE,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockCreateErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockDeleteErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockGetSourceInfoErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_GET_SOURCE_INFO,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockFetchErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockFetchReferencesErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH_REFERENCES,
	SyncedBlockErrorAttributes
>;

export type SyncedBlockFetchSuccessAEP = OperationalAEP<
	ACTION.FETCHED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
	FetchSyncedBlockSuccessAttributes
>;

export type SyncedBlockCreateSuccessAEP = OperationalAEP<
	ACTION.INSERTED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
	SyncedBlockSuccessAttributes
>;

export type SyncedBlockUpdateSuccessAEP = OperationalAEP<
	ACTION.UPDATED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE,
	SyncedBlockSuccessAttributes
>;

export type SyncedBlockDeleteSuccessAEP = OperationalAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
	SyncedBlockSuccessAttributes
>;

export type ReferenceSyncedBlockCreateSuccessAEP = OperationalAEP<
	ACTION.INSERTED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_CREATE,
	SyncedBlockSuccessAttributes
>;

export type ReferenceSyncedBlockDeleteSuccessAEP = OperationalAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_DELETE,
	SyncedBlockSuccessAttributes
>;

export type SyncedBlockEditSourceAEP = OperationalAEP<
	ACTION.SYNCED_BLOCK_EDIT_SOURCE,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_URL,
	SyncedBlockSuccessAttributes
>;

export type SyncedBlockCopyAEP = OperationalAEP<
	ACTION.COPIED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_COPY,
	SyncedBlockCopySuccessAttributes
>;

export type SyncedBlockCopyErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_COPY,
	SyncedBlockCopyErrorAttributes
>;

export type SyncedLocationClickAEP = OperationalAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_CLICK_SYNCED_LOCATION,
	SyncedBlockSuccessAttributes
>;

type SyncedBlockSSRErrorAttributes = {
	code: string;
	errorMessage?: string;
	errorName?: string;
	isBlog?: boolean;
	missingSyncedBlocksCount?: number;
	syncedBlocksCount?: number;
};

export type SyncedBlockSSRErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_SSR_ERROR,
	SyncedBlockSSRErrorAttributes
>;

type SyncedBlockSourceInfoOrphanedAttributes = {
	hasPendingDeletion?: boolean;
	hasSubscribers?: boolean;
	resourceId?: string;
	sourceProduct?: string;
};

/**
 * Operational event fired when `updateCacheWithSourceInfo` runs but the
 * underlying cache entry for the resource has been deleted while the source-info
 * request was in flight. With the hardened cache deletion guards introduced in
 * `platform_synced_block_patch_14` this should be unreachable in practice — if
 * this event fires in production it indicates an unhandled race condition
 * that needs investigation (e.g. EDITOR-7403).
 */
export type SyncedBlockSourceInfoOrphanedAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_INFO_ORPHANED,
	SyncedBlockSourceInfoOrphanedAttributes
>;

type SyncedBlockCacheDeletionForcedAttributes = {
	rescheduleCount: number;
	resourceId?: string;
	sourceProduct?: string;
};

/**
 * Operational event fired when the cache deletion timer has been rescheduled
 * the maximum number of times (because some guard — subscribers, in-flight
 * source-info, in-flight batch fetch — was always positive at fire time) and we
 * force the deletion to prevent unbounded memory growth. Indicates a stuck
 * in-flight flag that needs investigation.
 */
export type SyncedBlockCacheDeletionForcedAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_CACHE_DELETION_FORCED,
	SyncedBlockCacheDeletionForcedAttributes
>;

export type SyncBlockEventPayload =
	| SyncedBlockSourceURLErrorAEP
	| SyncedBlockUpdateCacheErrorAEP
	| SyncedBlockUpdateErrorAEP
	| SyncedBlockUpdateSuccessAEP
	| SyncedBlockCreateErrorAEP
	| SyncedBlockCreateSuccessAEP
	| SyncedBlockDeleteErrorAEP
	| SyncedBlockDeleteSuccessAEP
	| SyncedBlockGetSourceInfoErrorAEP
	| SyncedBlockFetchErrorAEP
	| SyncedBlockFetchSuccessAEP
	| ReferenceSyncedBlockUpdateErrorAEP
	| SyncedBlockFetchReferencesErrorAEP
	| ExperienceEventPayload
	| ReferenceSyncedBlockCreateSuccessAEP
	| ReferenceSyncedBlockDeleteSuccessAEP
	| SyncedBlockEditSourceAEP
	| SyncedBlockCopyAEP
	| SyncedBlockCopyErrorAEP
	| SyncedLocationClickAEP
	| SyncedBlockSSRErrorAEP
	| SyncedBlockSourceInfoOrphanedAEP
	| SyncedBlockCacheDeletionForcedAEP
	| InsertSourceSyncedBlockPayload;

export type RendererSyncBlockEventPayload =
	| SyncedBlockGetSourceInfoErrorAEP
	| SyncedBlockFetchErrorAEP
	| SyncedBlockFetchSuccessAEP
	| ReferenceSyncedBlockUpdateErrorAEP
	| SyncedBlockSourceInfoOrphanedAEP
	| SyncedBlockCacheDeletionForcedAEP
	| ExperienceEventPayload;
