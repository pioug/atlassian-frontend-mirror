import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { UIAEP } from './utils';

export type HighlightActionsMenuAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
	{
		source: string;
	},
	undefined
>;

export type HighlightActionsEventPayload = HighlightActionsMenuAEP;
