import { TrackAEP } from './utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from './enums';

export enum DELETE_DIRECTION {
  BACKWARD = 'backward',
  FORWARD = 'forward',
}

export enum LIST_TEXT_SCENARIOS {
  JOIN_SIBLINGS = 'joinSiblings',
  JOIN_DESCENDANT_TO_PARENT = 'joinDescendantToParent',
  JOIN_TO_SIBLING_DESCENDANT = 'joinToSiblingDescendant',
  JOIN_PARAGRAPH_WITH_LIST = 'joinParagraphWithList',
  JOIN_PARENT_SIBLING_TO_PARENT_CHILD = 'joinParentSiblingToParentChild',
}

type ListTextDeleteFormatAEP<Attributes> = TrackAEP<
  ACTION.DELETED,
  ACTION_SUBJECT.TEXT,
  ACTION_SUBJECT_ID.FORMAT_LIST_BULLET | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
  Attributes,
  undefined
>;

type ListTextDeleteForwardAEP = ListTextDeleteFormatAEP<{
  inputMethod: INPUT_METHOD.KEYBOARD;
  direction: DELETE_DIRECTION.FORWARD;
  scenario:
    | LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST
    | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
    | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
    | LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD;
}>;

type ListTextDeleteBackwardsAEP = ListTextDeleteFormatAEP<{
  inputMethod: INPUT_METHOD.KEYBOARD;
  direction: DELETE_DIRECTION.BACKWARD;
  scenario:
    | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
    | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
    | LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT;
}>;

export type ListEventPayload =
  | ListTextDeleteForwardAEP
  | ListTextDeleteBackwardsAEP;
