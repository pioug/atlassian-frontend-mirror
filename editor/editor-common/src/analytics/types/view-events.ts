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

export type ViewEventPayload = ViewInlineCommentsButtonEventAEP;
