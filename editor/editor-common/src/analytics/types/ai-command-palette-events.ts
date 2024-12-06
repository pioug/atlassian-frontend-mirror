import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type UIAEP } from './utils';

type PromptLinkPickerButtonClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AI_PROMPT_LINK_PICKER_BUTTON,
	{
		promptType: 'user-input' | 'interrogate';
	},
	undefined
>;

export type AICommandPaletteEventPayload = PromptLinkPickerButtonClickedAEP;
