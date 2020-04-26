import { UIAEP, TrackAEP } from './utils';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, TRIGGER_METHOD } from './enums';

type ActivateAEP = UIAEP<
  ACTION.ACTIVATED,
  ACTION_SUBJECT.FIND_REPLACE_DIALOG,
  undefined,
  {
    inputMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.PREFILL;
    triggerMethod: TRIGGER_METHOD.SHORTCUT | TRIGGER_METHOD.TOOLBAR;
  },
  undefined
>;

type DeactivateAEP = UIAEP<
  ACTION.DEACTIVATED,
  ACTION_SUBJECT.FIND_REPLACE_DIALOG,
  undefined,
  {
    triggerMethod:
      | TRIGGER_METHOD.KEYBOARD
      | TRIGGER_METHOD.TOOLBAR
      | TRIGGER_METHOD.BUTTON;
  },
  undefined
>;

type FindAEP = TrackAEP<
  ACTION.FIND_PERFORMED,
  ACTION_SUBJECT.TEXT,
  undefined,
  undefined,
  undefined
>;

type FindNextAEP = TrackAEP<
  ACTION.FIND_NEXT_PERFORMED,
  ACTION_SUBJECT.TEXT,
  undefined,
  {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
  },
  undefined
>;

type FindPrevAEP = TrackAEP<
  ACTION.FIND_PREV_PERFORMED,
  ACTION_SUBJECT.TEXT,
  undefined,
  {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
  },
  undefined
>;

type ReplaceTextChangeAEP = TrackAEP<
  ACTION.CHANGED_REPLACEMENT_TEXT,
  ACTION_SUBJECT.FIND_REPLACE_DIALOG,
  undefined,
  undefined,
  undefined
>;

type ReplaceOneAEP = TrackAEP<
  ACTION.REPLACED_ONE,
  ACTION_SUBJECT.TEXT,
  undefined,
  {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
  },
  undefined
>;

type ReplaceAllAEP = TrackAEP<
  ACTION.REPLACED_ALL,
  ACTION_SUBJECT.TEXT,
  undefined,
  undefined,
  undefined
>;

export type FindReplaceEventPayload =
  | ActivateAEP
  | DeactivateAEP
  | FindAEP
  | FindNextAEP
  | FindPrevAEP
  | ReplaceTextChangeAEP
  | ReplaceOneAEP
  | ReplaceAllAEP;
