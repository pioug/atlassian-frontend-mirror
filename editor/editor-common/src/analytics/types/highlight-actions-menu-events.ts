import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { UIAEP } from './utils';

export type HighlightActionsMenuAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
	{
		/**
		 * The page mode, which can be either 'edit' or 'view'.
		 * 'edit' mode is used in the editor, while 'view' mode is used in the renderer.
		 */
		pageMode?: 'edit' | 'view';
		source: string;
		/**
		 * Represents the node from which the comment button action originates.
		 */
		sourceNode?: string;
	},
	undefined
>;

export type HighlightActionsEventPayload = HighlightActionsMenuAEP;
