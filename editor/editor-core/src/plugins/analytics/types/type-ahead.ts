import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { UIAEP, OperationalAEP } from './utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from './enums';

type TypeAheadRenderedAEP = OperationalAEP<
  ACTION.RENDERED,
  ACTION_SUBJECT.TYPEAHEAD,
  undefined,
  {
    time?: number;
    items?: number;
    initial?: boolean;
  },
  undefined
>;

type TypeAheadItemViewedAEP = OperationalAEP<
  ACTION.VIEWED,
  ACTION_SUBJECT.TYPEAHEAD_ITEM,
  undefined,
  {
    index?: number;
    items?: number;
  },
  undefined
>;

type TypeAheadAEP<ActionSubjectID, Attributes> = UIAEP<
  ACTION.INVOKED,
  ACTION_SUBJECT.TYPEAHEAD,
  ActionSubjectID,
  Attributes,
  undefined
>;

type TypeAheadEmojiAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI | TypeAheadAvailableNodes.EMOJI,
  {
    inputMethod:
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.INSERT_MENU
      | INPUT_METHOD.QUICK_INSERT
      | INPUT_METHOD.KEYBOARD;
  }
>;

type TypeAheadLinkAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
  {
    inputMethod:
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.INSERT_MENU
      | INPUT_METHOD.QUICK_INSERT
      | INPUT_METHOD.SHORTCUT;
  }
>;

type TypeAheadMentionAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_MENTION | TypeAheadAvailableNodes.MENTION,
  {
    inputMethod:
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.INSERT_MENU
      | INPUT_METHOD.QUICK_INSERT
      | INPUT_METHOD.KEYBOARD;
  }
>;

type TypeAheadQuickInsertAEP = TypeAheadAEP<
  | ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT
  | TypeAheadAvailableNodes.QUICK_INSERT,
  {
    inputMethod:
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.INSERT_MENU
      | INPUT_METHOD.QUICK_INSERT
      | INPUT_METHOD.KEYBOARD;
  }
>;

export type TypeAheadPayload =
  | TypeAheadEmojiAEP
  | TypeAheadLinkAEP
  | TypeAheadMentionAEP
  | TypeAheadQuickInsertAEP
  | TypeAheadRenderedAEP
  | TypeAheadItemViewedAEP;
