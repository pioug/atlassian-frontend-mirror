import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

type OfflineEditingAEP = TrackAEP<
	| ACTION.OFFLINE_STORAGE_TOO_MANY_RETRIES_ERROR
	| ACTION.OFFLINE_STORAGE_STEPS_DATABASE_ERROR
	| ACTION.OFFLINE_STORAGE_RESYNC_ONLINE
	| ACTION.OFFLINE_STORAGE_BROADCAST_CHANNEL_FIRST_UPDATE
	| ACTION.OFFLINE_STORAGE_FAILED_STEPS,
	ACTION_SUBJECT.OFFLINE_EDITING,
	ACTION_SUBJECT_ID.OFFLINE_EDITING,
	{
		errorMessage?: string;
		version?: number;
		stepsCount?: number;
		status?: string;
		retryCount?: number;
		disabled?: string | boolean;
		retrySource?: string;
		healthy?: boolean;
	},
	undefined
>;

export type OfflineEditingEventPayload = OfflineEditingAEP;
