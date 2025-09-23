import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP } from './utils';

type AILocalIdNotFoundErrorAEP = OperationalAEP<
	ACTION.LOCAL_ID_NOT_FOUND,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{ docSize: number | undefined; localId: string }
>;

type AIStreamingUpdateStreamError = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.UPDATE_STREAM,
	{
		docSize: number;
		errorMessage?: string;
		errorStack: string;
		fragmentSize: number;
		isFinalStream: boolean;
	}
>;

type AIStreamingDiscardStreamError = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.DISCARD_STREAM,
	{ errorMessage?: string; errorStack: string }
>;

export type AIStreamingEventPayload =
	| AILocalIdNotFoundErrorAEP
	| AIStreamingUpdateStreamError
	| AIStreamingDiscardStreamError;
