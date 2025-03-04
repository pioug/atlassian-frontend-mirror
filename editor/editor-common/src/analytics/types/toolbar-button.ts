import type { ACTION, ACTION_SUBJECT } from './enums';
import type { UIAEP } from './utils';

export enum TOOLBAR_ACTION_SUBJECT_ID {
	FIND_REPLACE = 'findReplace',
	EMOJI = 'emoji',
	ORDERED_LIST = 'orderedList',
	BULLET_LIST = 'bulletList',
	MEDIA = 'media',
	MENTION = 'mention',
	DECISION_LIST = 'decisionList',
	TASK_LIST = 'taskList',
	TEXT_COLOR = 'color',
	BACKGROUND_COLOR = 'backgroundColor',
	TEXT_FORMATTING_STRONG = 'strong',
	TEXT_FORMATTING_ITALIC = 'italic',
	TEXT_FORMATTING_UNDERLINE = 'underline',
	UNDO = 'undo',
	REDO = 'redo',
	INDENT = 'indent',
	OUTDENT = 'outdent',
	RECORD_VIDEO = 'recordVideo',
	AI = 'atlassian-intelligence',
}

type ToolbarButtonClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.TOOLBAR_BUTTON,
	undefined,
	Object,
	undefined
>;

export type ToolbarEventPayload = ToolbarButtonClickedAEP;
