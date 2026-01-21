import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { ExperienceEventPayload } from './experience-events';
import type { OperationalAEP } from './utils';

type SyncedBlockErrorAttributes = {
	error: string;
	resourceId?: string;
};

type SyncedBlockSuccessAttributes = {
	resourceId: string;
};

type FetchSyncedBlockSuccessAttributes = SyncedBlockSuccessAttributes & {
	blockInstanceId?: string;
	sourceProduct?: string;
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
	| ExperienceEventPayload;

export type RendererSyncBlockEventPayload =
	| SyncedBlockGetSourceInfoErrorAEP
	| SyncedBlockFetchErrorAEP
	| SyncedBlockFetchSuccessAEP
	| ReferenceSyncedBlockUpdateErrorAEP
	| ExperienceEventPayload;
