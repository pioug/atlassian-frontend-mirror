import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { MODE } from './general-events';
import type { UIAEP } from './utils';

export type ViewInlineCommentsButtonEventAEP = UIAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.INLINE_COMMENT,
	{
		isDisabled: boolean;
		mode: MODE.EDITOR;
		inputMethod: INPUT_METHOD.FLOATING_TB;
	},
	undefined
>;

export type ViewEventPayload = ViewInlineCommentsButtonEventAEP;
