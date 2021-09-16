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
  JOIN_LIST_ITEM_WITH_PARAGRAPH = 'joinListItemWithParagraph',
}

export type CommonListAnalyticsAttributes = {
  itemIndexAtSelectionStart: number;
  itemIndexAtSelectionEnd: number;
  indentLevelAtSelectionStart: number;
  indentLevelAtSelectionEnd: number;
  itemsInSelection: number;
};

type ListItemJoinedFormatAEP<Attributes> = TrackAEP<
  ACTION.LIST_ITEM_JOINED,
  ACTION_SUBJECT.LIST,
  ACTION_SUBJECT_ID.FORMAT_LIST_BULLET | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
  Attributes,
  undefined
>;

type ListItemJoinedForwardAEP = ListItemJoinedFormatAEP<{
  inputMethod: INPUT_METHOD.KEYBOARD;
  direction: DELETE_DIRECTION.FORWARD;
  scenario:
    | LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST
    | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
    | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
    | LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD
    | LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH;
}>;

type ListItemJoinedBackwardsAEP = ListItemJoinedFormatAEP<{
  inputMethod: INPUT_METHOD.KEYBOARD;
  direction: DELETE_DIRECTION.BACKWARD;
  scenario:
    | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
    | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
    | LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT;
}>;

type ListConvertedTrackAEP = TrackAEP<
  ACTION.CONVERTED,
  ACTION_SUBJECT.LIST,
  | ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
  | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER
  | ACTION_SUBJECT_ID.TEXT,
  {
    transformedFrom:
      | ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
      | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
    inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.KEYBOARD;
  } & CommonListAnalyticsAttributes,
  undefined
>;

type ListIndentedAEP = TrackAEP<
  ACTION.INDENTED,
  ACTION_SUBJECT.LIST,
  ACTION_SUBJECT_ID.FORMAT_LIST_BULLET | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
  {
    inputMethod: INPUT_METHOD;
    canSink?: boolean;
  } & CommonListAnalyticsAttributes,
  undefined
>;

type ListOutdentedAEP = TrackAEP<
  ACTION.OUTDENTED,
  ACTION_SUBJECT.LIST,
  ACTION_SUBJECT_ID.FORMAT_LIST_BULLET | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
  {
    inputMethod: INPUT_METHOD;
  } & CommonListAnalyticsAttributes,
  undefined
>;

type ListInsertedAEP = TrackAEP<
  ACTION.INSERTED,
  ACTION_SUBJECT.LIST,
  ACTION_SUBJECT_ID.FORMAT_LIST_BULLET | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
  {
    inputMethod:
      | INPUT_METHOD.FORMATTING
      | INPUT_METHOD.KEYBOARD
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.QUICK_INSERT;
  },
  undefined
>;

type ListContentSanitizedAEP = TrackAEP<
  ACTION.NODE_CONTENT_SANITIZED,
  ACTION_SUBJECT.LIST,
  ACTION_SUBJECT_ID.FORMAT_LIST_BULLET | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
  {
    inputMethod: INPUT_METHOD.FORMATTING;
    nodeSanitized: string;
    marksRemoved: string[];
  },
  undefined
>;

export type ListEventPayload =
  | ListItemJoinedForwardAEP
  | ListItemJoinedBackwardsAEP
  | ListConvertedTrackAEP
  | ListIndentedAEP
  | ListOutdentedAEP
  | ListInsertedAEP
  | ListContentSanitizedAEP;
