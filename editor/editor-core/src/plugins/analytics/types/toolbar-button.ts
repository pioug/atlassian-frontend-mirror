import { UIAEP } from './utils';
import { ACTION, ACTION_SUBJECT } from './enums';

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
  TEXT_FORMATTING_STRONG = 'strong',
  TEXT_FORMATTING_ITALIC = 'italic',
  UNDO = 'undo',
  REDO = 'redo',
}

type ToolbarButtonClickedAEP = UIAEP<
  ACTION.CLICKED,
  ACTION_SUBJECT.TOOLBAR_BUTTON,
  undefined,
  {},
  undefined
>;

export type ToolbarEventPayload = ToolbarButtonClickedAEP;
