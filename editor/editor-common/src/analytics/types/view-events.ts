import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { MODE } from './general-events';
import type { UIAEP } from './utils';

export type ViewInlineCommentsButtonEventAEP = UIAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.INLINE_COMMENT,
	{
		inputMethod: INPUT_METHOD.FLOATING_TB;
		isDisabled: boolean;
		isNonTextInlineNodeInludedInComment: boolean;
		mode: MODE.EDITOR;
	},
	undefined
>;

export type ViewAIRovoButtonEventAEP = UIAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_ASK_ROVO_BUTTON,
	{
		inputMethod: INPUT_METHOD.FLOATING_TB;
		mode: MODE.EDITOR;
		selectionCharCount: number;
		selectionWordCount: number;
	},
	undefined
>;

export type ViewAIHeroPromptButtonEventAEP = UIAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_HERO_PROMPT_BUTTON,
	{
		inputMethod: INPUT_METHOD.FLOATING_TB;
		mode: MODE.EDITOR;
		selectionCharCount: number;
		selectionWordCount: number;
	},
	undefined
>;

export type ViewDefineButtonEventAEP = UIAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_DEFINITIONS_DEFINE_BUTTON,
	{
		inputMethod: INPUT_METHOD.FLOATING_TB;
		mode: MODE.EDITOR;
		selectionCharCount: number;
		selectionWordCount: number;
	},
	undefined
>;

export type ViewEventPayload =
	| ViewAIRovoButtonEventAEP
	| ViewAIHeroPromptButtonEventAEP
	| ViewDefineButtonEventAEP
	| ViewInlineCommentsButtonEventAEP;
