import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP } from './utils';

type SyncedBlockErrorAttributes = {
	error: string;
};

export type SyncedBlockErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.SYNCED_BLOCK,
	ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_URL,
	SyncedBlockErrorAttributes
>;

export type SyncBlockEventPayload = SyncedBlockErrorAEP;
