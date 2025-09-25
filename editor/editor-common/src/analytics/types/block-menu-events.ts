import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { UIAEP, TrackAEP } from './utils';

export type BlockMenuActionSubjectId =
	| ACTION_SUBJECT_ID.COPY_LINK_TO_BLOCK
	| ACTION_SUBJECT_ID.MOVE_UP_BLOCK
	| ACTION_SUBJECT_ID.MOVE_DOWN_BLOCK
	| ACTION_SUBJECT_ID.DELETE_BLOCK
	| ACTION_SUBJECT_ID.COPY_BLOCK
	| ACTION_SUBJECT_ID.FORMAT_MENU;

export type BlockMenuOpenedAEP = UIAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.BLOCK_MENU,
	undefined,
	{ inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD },
	undefined
>;

export type BlockMenuItemClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BLOCK_MENU_ITEM,
	BlockMenuActionSubjectId,
	{ inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD },
	undefined
>;

interface ElementConvertedAttr {
	from: string;
	to: string;
	inputMethod: INPUT_METHOD.BLOCK_MENU;
}

type ElementConvertedAEP = TrackAEP<
	ACTION.CONVERTED,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	ElementConvertedAttr,
	undefined
>;

export type BlockMenuEventPayload =
	| BlockMenuOpenedAEP
	| BlockMenuItemClickedAEP
	| ElementConvertedAEP;
