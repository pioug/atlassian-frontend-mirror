import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type OperationalAEP, type UIAEP } from './utils';

type CommonAttributes = {
	readingAidsSessionId: string;
};

type DefineButtonClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_DEFINITIONS_DEFINE_BUTTON,
	CommonAttributes & {
		wordCount: number;
	},
	undefined
>;

type AutoHighlightClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.DECORATION,
	ACTION_SUBJECT_ID.AI_DEFINITIONS_AUTO_HIGHLIGHT,
	CommonAttributes,
	undefined
>;

type AIDefinitionsErrorAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.AI_DEFINITIONS,
	ACTION_SUBJECT_ID,
	{
		componentStack?: string;
		errorMessage?: string;
	}
>;

export type AIDefinitionsEventPayload =
	| DefineButtonClickedAEP
	| AutoHighlightClickedAEP
	| AIDefinitionsErrorAEP;
