import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { ExperienceEventPayload } from './experience-events';
import type { InsertSourceSyncedBlockPayload } from './insert-events';
import type { PasteSource } from './paste-events';
import type { OperationalAEP, TrackAEP } from './utils';

/**
 * Categorical failure reason emitted on synced-block operational error events.
 *
 * The write path (EDITOR-7796) emits the {@link SyncBlockError} enum values plus
 * `'unknown'`. The fetch/subscribe read path (EDITOR-7862) additionally emits
 * read-path-specific buckets (benign source-state transitions, permission outcomes,
 * WebSocket lifecycle, and client-side readiness). Kept as a string union here so the
 * analytics event schema is the single source of truth and the provider package can map
 * to it without `editor-common` depending on the provider.
 */
export type SyncedBlockErrorReasonAttribute =
	// Write-path SyncBlockError enum values + unknown fallback.
	| 'errored'
	| 'not_found'
	| 'forbidden'
	| 'invalid_request'
	| 'rate_limited'
	| 'conflict'
	| 'server_error'
	| 'invalid_content'
	| 'offline'
	| 'unpublished'
	| 'aborted'
	| 'entity_not_found'
	| 'unknown'
	// Read-path (fetch/subscribe) specific buckets (EDITOR-7862).
	| 'source_deleted'
	| 'source_unpublished'
	| 'source_unsynced'
	| 'source_not_found'
	| 'permission_denied'
	| 'unauthenticated'
	| 'websocket_drop'
	| 'websocket_exhausted'
	| 'network'
	| 'data_provider_not_ready';

type SyncedBlockErrorAttributes = {
	error: string;
	resourceId?: string;
	/**
	 * The product the source block lives in, derived from `resourceId` when present.
	 * Always optional because batch / subscription init paths fire without a `resourceId`.
	 */
	sourceProduct?: string;
	/**
	 * Categorical failure cause for dashboard grouping. Only emitted when the
	 * `platform_editor_blocks_patch_3` gate is enabled (EDITOR-7796 / EDITOR-7862).
	 */
	reason?: SyncedBlockErrorReasonAttribute;
	/** Backend HTTP status code when the failure came from a `BlockError`. */
	statusCode?: number;
	/**
	 * Whether the failure reason is a benign/working-as-designed outcome (e.g. the source
	 * was intentionally deleted/unpublished, or permission denied) rather than a genuine
	 * system failure. Lets the dashboard compute a true error rate without free-text regex.
	 * Only emitted on fetch/subscribe error events when the gate is enabled (EDITOR-7862).
	 */
	benign?: boolean;
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

/**
 * Mirrors the provider's `DeletionReason` union as a string literal so the
 * analytics schema is self-contained without `editor-common` depending on the
 * provider. Kept in sync by a compile-time guard in the provider tests.
 */
export type SyncedBlockDeletionReasonAttribute =
	| 'source-block-deleted'
	| 'source-block-unsynced'
	| 'source-block-unpublished';

/**
 * Mirrors the provider's `DeletionMechanism` union. Values name the user action:
 * `undo`/`redo` (history), `deleteButton` (toolbar Delete control),
 * `keyboardDelete` (Backspace/Delete on a caret/range), `selectionReplaced`
 * (block selected then typed/pasted over), `other` (non-direct/code-dispatched).
 */
export type SyncedBlockDeletionMechanismAttribute =
	| 'undo'
	| 'redo'
	| 'deleteButton'
	| 'keyboardDelete'
	| 'selectionReplaced'
	| 'other';

/** Delete-success enrichment, only populated behind `platform_editor_blocks_patch_4`. */
type SyncedBlockDeleteSuccessAttributes = SyncedBlockSuccessAttributes & {
	deletionReason?: SyncedBlockDeletionReasonAttribute;
	mechanism?: SyncedBlockDeletionMechanismAttribute;
};

type FetchSyncedBlockSuccessAttributes = SyncedBlockSuccessAttributes;

type SyncedBlockCopySuccessAttributes = SyncedBlockSuccessAttributes & {
	inputMethod: INPUT_METHOD;
};

type SyncedBlockCopyErrorAttributes = SyncedBlockErrorAttributes & {
	inputMethod: INPUT_METHOD;
};

type SyncedBlockEditSourceAttributes = SyncedBlockSuccessAttributes & {
	sameDocument?: boolean;
};

/**
 * Source `syncedBlockCreate` success attrs. Both optional so gate-off/legacy
 * payloads are unchanged. `inputMethod`: creating surface (enum, PII-safe).
 * `createdEmpty`: true when created from an empty selection, false when content
 * was converted into the block.
 */
type SyncedBlockCreateSuccessAttributes = SyncedBlockSuccessAttributes & {
	createdEmpty?: boolean;
	inputMethod?: INPUT_METHOD;
};

/** First-content-added attrs: join keys only (no user content, PII-safe). */
type SyncedBlockAddContentAttributes = SyncedBlockSuccessAttributes;

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
	SyncedBlockCreateSuccessAttributes
>;

/**
 * First-content-added event: fired once per source block when it first gains
 * user content, keyed by `resourceId` + `blockInstanceId` to join the funnel.
 */
export type SyncedBlockAddContentAEP = OperationalAEP<
	ACTION.ADDED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_ADD_CONTENT,
	SyncedBlockAddContentAttributes
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
	SyncedBlockDeleteSuccessAttributes
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
	SyncedBlockEditSourceAttributes
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

type SyncedBlockInsertAttemptedUnsupportedSurfaceAttributes = {
	/**
	 * The paste mechanism the content arrived through (e.g. `fabric-editor`).
	 * Controlled, enumerated value — never user-generated content.
	 */
	pasteSource?: PasteSource;
	/**
	 * The product the copied synced block reference originated from, derived from
	 * the clipboard `data-resource-id` prefix. Controlled, enumerated value
	 * (`confluence-page` | `jira-work-item`) — never user-generated content.
	 */
	sourceProduct?: 'confluence-page' | 'jira-work-item';
};

/**
 * Track event fired when a synced block reference is pasted into a surface that
 * does not support synced blocks (the destination schema dropped the node). This
 * lets us measure insertion attempts into unsupported surfaces (e.g. Bitbucket)
 * directly, rather than inferring them from "copied but never landed". See
 * EDITOR-7749.
 */
export type SyncedBlockInsertAttemptedUnsupportedSurfaceAEP = TrackAEP<
	ACTION.INSERT_ATTEMPTED,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.UNSUPPORTED_SURFACE,
	SyncedBlockInsertAttemptedUnsupportedSurfaceAttributes,
	undefined
>;

export type SyncBlockEventPayload =
	| SyncedBlockSourceURLErrorAEP
	| SyncedBlockUpdateCacheErrorAEP
	| SyncedBlockUpdateErrorAEP
	| SyncedBlockUpdateSuccessAEP
	| SyncedBlockCreateErrorAEP
	| SyncedBlockCreateSuccessAEP
	| SyncedBlockAddContentAEP
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
	| SyncedBlockInsertAttemptedUnsupportedSurfaceAEP
	| InsertSourceSyncedBlockPayload;

export type RendererSyncBlockEventPayload =
	| SyncedBlockGetSourceInfoErrorAEP
	| SyncedBlockFetchErrorAEP
	| SyncedBlockFetchSuccessAEP
	| ReferenceSyncedBlockUpdateErrorAEP
	| SyncedBlockSourceInfoOrphanedAEP
	| SyncedBlockCacheDeletionForcedAEP
	| ExperienceEventPayload;
