import type { ACTION, ACTION_SUBJECT } from './enums';
import type { UIAEP } from './utils';

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

export type AIQuickPromptEventPayload =
	| AIQuickPromptDisplayedAEP
	| AIQuickPromptDismissedAEP
	| AIQuickPromptTriggeredAEP;
