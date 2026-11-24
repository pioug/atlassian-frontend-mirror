export const EXTERNAL_HISTORY_EVENT_META = 'externalHistoryEvent';
export const EXTERNAL_HISTORY_OUTCOME_META = 'externalHistoryOutcome';

export type ExternalHistoryBlockedReason =
	| 'inconsistent-metadata'
	| 'mapped-step-failed'
	| 'required-step-unmappable'
	| 'selection-unresolvable';

export type ExternalHistoryPartition = {
	batch: { fromVersion: number; toVersion: number };
	invocationId: string;
	/**
	 * True when this tab had already accepted an earlier batch for the same invocation. Each batch
	 * is its own history event; this only measures how often an invocation arrives in more than one
	 * batch, which is the number that would justify grouping them.
	 */
	isFollowUp?: boolean;
	transactionIndexes: readonly number[];
};

export type ExternalHistoryRejection = {
	invocationId?: string;
	rawIndexes: readonly number[];
	reason:
		| 'batch-identity-missing'
		| 'index-translation-failed'
		| 'interleaved-step'
		| 'invocation-id-missing'
		| 'not-owned'
		| 'overlapping-version';
};

export type ExternalHistoryTransactionMeta = {
	editorInstanceId: string;
	partitions: readonly ExternalHistoryPartition[];
	/** Present only with explicitly enabled debug recording. */
	receive?: ExternalHistoryReceiveContext;
	rejections: readonly ExternalHistoryRejection[];
	// Half-open transform interval [from, to).
	remoteTransformRange: { from: number; to: number };
	route: 'direct' | 'rebased';
};

export type ExternalHistoryOutcomeMeta = {
	editorInstanceId: string;
	/**
	 * Set on a blocked operation whose event was dropped from its branch because it can never be
	 * applied, so the next undo or redo reaches the event beneath it instead of being blocked again.
	 */
	eventDiscarded?: boolean;
	operation: 'undo' | 'redo';
	outcome: 'blocked' | 'succeeded';
	reason?: ExternalHistoryBlockedReason;
};

export const EXTERNAL_HISTORY_PROMOTION_META = 'externalHistoryPromotion';

export type ExternalHistoryReceiveContext = {
	fromVersion?: number;
	producerRoute: 'direct' | 'rebased';
	rawStepCount: number;
	remoteStepCount: number;
	selectedStepCount: number;
	toVersion?: number;
};

/**
 * Counts from the branch builder before depth trimming, never classification acceptance. Every
 * promoted partition starts its own event, so `promotedEventCount` is the number of new undo events.
 */
export type ExternalHistoryPromotionMeta = {
	activeHistorySlice: boolean;
	promotedEventCount: number;
	promotedItemCount: number;
	route: 'direct' | 'rebased';
};

export type ExternalHistoryOwnershipOutcomeMeta = {
	editorInstanceId: string;
	invocationId?: string;
	reason?: 'expiry' | 'teardown';
	registrationCount: number;
	transition: 'registered' | 'refreshed' | 'released';
};

export const EXTERNAL_HISTORY_OWNERSHIP_META = 'externalHistoryOwnership';
