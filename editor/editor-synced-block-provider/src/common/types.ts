import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

import type {
	SyncBlockInstance,
	SyncBlockJiraIssueType,
	SyncBlockSourceInfo,
} from '../providers/types';

import type { SYNC_BLOCK_PRODUCTS } from './consts';

export type BlockInstanceId = string;
export type ResourceId = string;
export type SyncBlockProduct = (typeof SYNC_BLOCK_PRODUCTS)[number];
export type SyncBlockStatus = 'active' | 'deleted' | 'unpublished';

export type SyncBlockAttrs = {
	localId: BlockInstanceId;
	resourceId: ResourceId;
};

export interface SyncBlockNode extends JSONNode {
	attrs: SyncBlockAttrs;
	content?: Array<JSONNode | undefined>;
	type: 'syncBlock' | 'bodiedSyncBlock';
}

export enum SyncBlockError {
	Errored = 'errored',
	NotFound = 'not_found',
	Forbidden = 'forbidden',
	InvalidRequest = 'invalid_request',
	RateLimited = 'rate_limited',
	Conflict = 'conflict', // attempt to create block that already exists
	ServerError = 'server_error',
	InvalidContent = 'invalid_content', // content is not a valid JSON
	Offline = 'offline',
	Unpublished = 'unpublished',
	// request was aborted, typically due to client timeout
	Aborted = 'aborted',
	// block does not exist on this site (e.g. cross-site reference or hard deleted)
	EntityNotFound = 'entity_not_found',
}

export interface SyncBlockData {
	blockInstanceId: BlockInstanceId;
	content: Array<ADFEntity>;
	contentUpdatedAt?: string;
	createdAt?: string;
	createdBy?: string;
	deletionReason?: DeletionReason;
	issueType?: SyncBlockJiraIssueType;
	isSynced?: boolean;
	/**
	 * Whether the block is on the same page as the source block
	 */
	onSameDocument?: boolean;
	product?: SyncBlockProduct;
	/**
	 * The ARI of the block. E.G ari:cloud:blocks:<cloudId>:synced-block/<product>/<pageId>/<resourceId>
	 */
	resourceId: ResourceId;
	sourceAri?: string;
	sourceSubType?: string | null;
	sourceTitle?: string;
	sourceURL?: string;
	status?: SyncBlockStatus;
	updatedAt?: string;
}

export interface ReferenceSyncBlockResponse {
	blockAri: string;
	blockInstanceId?: BlockInstanceId;
	contentUpdatedAt?: string;
	createdAt?: string;
	createdBy?: string;
	documentAri: string;
}

export interface ReferenceSyncBlock extends ReferenceSyncBlockResponse {
	hasAccess: boolean;
	onSameDocument: boolean;
}

export type ReferenceSyncBlockData = {
	error?: SyncBlockError;
	references?: ReferenceSyncBlock[];
};

export type ReferencesSourceInfo = {
	error?: SyncBlockError;
	references?: Array<SyncBlockSourceInfo | undefined>;
};

export type DeletionReason =
	| 'source-block-deleted'
	| 'source-block-unsynced'
	| 'source-block-unpublished';
export type DeletionReasonResponse = DeletionReason | 'source-document-deleted';

/**
 * How a source bodiedSyncBlock removal was performed, derived from the
 * originating transaction. Distinct from {@link DeletionReason} (the outcome):
 * `mechanism` tells deliberate deletes apart from undos and accidental overwrites.
 *
 * Values name the user action that produced the removal:
 *  - `undo` / `redo` — removal came from a history undo/redo.
 *  - `deleteButton` — the explicit "Delete" control in the synced-block toolbar.
 *  - `keyboardDelete` — Backspace/Delete key on a caret or range selection.
 *  - `selectionReplaced` — the block was selected and replaced by typing or
 *    pasting over it (the accidental-overwrite path).
 *  - `other` — any non-direct removal (unsync, conversion, code-dispatched, or a
 *    structural wrap/lift/unwrap edit).
 */
export type DeletionMechanism =
	| 'undo'
	| 'redo'
	| 'deleteButton'
	| 'keyboardDelete'
	| 'selectionReplaced'
	| 'other';

export type SyncBlockPrefetchData = {
	prefetchPromise: Promise<SyncBlockInstance[] | undefined>;
	resourceIds: string[];
};

/**
 * Helpers to distinguish "data provider not ready / torn down" from a genuine
 * fetch/subscribe failure (EDITOR-7860). On Jira the provider is wired
 * asynchronously and `destroy()` nulls it on orphaned managers, so queued/
 * in-flight ops throw `Data provider not set` — previously mis-logged as a real
 * error. These let throw and catch sites agree on one non-string-matched signal
 * so the residual false errors are suppressed. Gated by
 * `platform_editor_blocks_patch_3`.
 *
 * NB: these intentionally live here rather than in a dedicated module to avoid
 * adding a downstream file to consuming Jira packages' Thunderstone complexity.
 */

/** Legacy message — kept identical for gate-off and historical events. */
export const PROVIDER_NOT_READY_MESSAGE = 'Data provider not set';

/**
 * Thrown when a fetch/subscribe runs against a manager whose provider is not
 * (yet) available or torn down. Keeps the legacy message + name so string
 * matchers still work, while new code uses {@link isProviderNotReadyError}.
 */
export class ProviderNotReadyError extends Error {
	readonly isProviderNotReadyError = true;

	constructor(message: string = PROVIDER_NOT_READY_MESSAGE) {
		super(message);
		this.name = 'ProviderNotReadyError';
		// Restore prototype chain so instanceof works after transpilation.
		Object.setPrototypeOf(this, ProviderNotReadyError.prototype);
	}
}

/**
 * True when the value is a "provider not ready / torn down" condition, not a
 * genuine failure. Recognises the tagged {@link ProviderNotReadyError} and the
 * legacy message (for errors thrown before rollout).
 */
export const isProviderNotReadyError = (error: unknown): boolean => {
	if (error instanceof ProviderNotReadyError) {
		return true;
	}
	if (
		typeof error === 'object' &&
		error !== null &&
		(error as { isProviderNotReadyError?: boolean }).isProviderNotReadyError === true
	) {
		return true;
	}
	return error instanceof Error && error.message === PROVIDER_NOT_READY_MESSAGE;
};
