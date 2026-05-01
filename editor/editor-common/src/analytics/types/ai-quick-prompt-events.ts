import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP, UIAEP } from './utils';

type AIQuickPromptDisplayedAEP = UIAEP<
	ACTION.DISPLAYED,
	ACTION_SUBJECT.AI_QUICK_PROMPT,
	undefined,
	{
		experienceName: string;
	}
>;

type AIQuickPromptDismissedAEP = UIAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.AI_QUICK_PROMPT,
	undefined,
	{
		experienceName: string;
		method: string;
	}
>;

type AIQuickPromptTriggeredAEP = UIAEP<
	ACTION.TRIGGERED,
	ACTION_SUBJECT.AI_QUICK_PROMPT,
	undefined,
	{
		experienceName: string;
		method: string;
	}
>;

type AIQuickPromptApiErrorAEP = OperationalAEP<
	ACTION.API_ERROR,
	ACTION_SUBJECT.AI_QUICK_PROMPT,
	undefined,
	{
		errorMessage?: string;
		experienceName: string;
		statusCode?: number;
	}
>;

export type AIQuickPromptEventPayload =
	| AIQuickPromptDisplayedAEP
	| AIQuickPromptDismissedAEP
	| AIQuickPromptTriggeredAEP
	| AIQuickPromptApiErrorAEP;
