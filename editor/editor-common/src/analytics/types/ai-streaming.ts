import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP, UIAEP } from './utils';

type AILocalIdNotFoundErrorAEP = OperationalAEP<
	ACTION.LOCAL_ID_NOT_FOUND,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{
		docSize: number | undefined;
		localIdLength: number;
		localIdStatus: string;
		localIdStatusSize: number;
		scrubbedLocalId: string;
	}
>;

type AIStreamingNoDocChangeAEP = OperationalAEP<
	ACTION.NO_DOC_CHANGE_FOUND,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{
		command: string;
		isSameDoc: boolean;
		isSameDocIgnoreAttrs: boolean;
	}
>;

type AIStreamingInvalidCommandAEP = OperationalAEP<
	ACTION.INVALID_COMMAND_FOUND,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{
		ancestors?: string[];
		// Disable for now #hot-122604
		// command: Record<string, unknown>;
		errorMessage?: string;
		errorStack?: string;
		fragments?: string[];
		repaired: boolean;
		success: boolean;
	}
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
	| AIStreamingNoDocChangeAEP
	| AIStreamingInvalidCommandAEP
	| AIStreamingUpdateStreamError
	| AIStreamingDiscardStreamError
	| AIChangesAcceptButtonClickedAEP
	| AIChangesRejectButtonClickedAEP;
