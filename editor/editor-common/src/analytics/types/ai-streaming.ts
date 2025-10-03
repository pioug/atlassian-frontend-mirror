import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP, UIAEP } from './utils';

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

type AIChangesAcceptButtonClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_CHANGES_ACCEPT_BUTTON,
	{
		appearance: string | undefined;
		configItemTitle: string | undefined;
		lastTriggeredFrom: string | undefined;
		product: string | undefined;
	},
	undefined
>;

type AIChangesRejectButtonClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_CHANGES_REJECT_BUTTON,
	{
		appearance: string | undefined;
		configItemTitle: string | undefined;
		lastTriggeredFrom: string | undefined;
		product: string | undefined;
	},
	undefined
>;

export type AIStreamingEventPayload =
	| AILocalIdNotFoundErrorAEP
	| AIStreamingUpdateStreamError
	| AIStreamingDiscardStreamError
	| AIChangesAcceptButtonClickedAEP
	| AIChangesRejectButtonClickedAEP;
