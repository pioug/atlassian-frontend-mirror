import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import { TrackAEP } from './utils';

type ExperimentalAEP<Action, ActionSubject, ActionSubjectId, Attributes> =
  TrackAEP<
    Action,
    ActionSubject,
    ActionSubjectId,
    Attributes & {
      experiment: string;
      experimentGroup: string;
    },
    undefined
  >;

export interface TextColorSelectedAttr {
  color: string;
  isNewColor: boolean;
}
export type TextColorSelectedAEP = ExperimentalAEP<
  ACTION.FORMATTED,
  ACTION_SUBJECT.TEXT,
  ACTION_SUBJECT_ID.FORMAT_COLOR,
  TextColorSelectedAttr
>;

// panel opened/closed
export interface TextColorShowPaletteToggleAttr {
  noSelect: boolean;
}
export type TextColorShowPaletteToggleAEP = ExperimentalAEP<
  ACTION.OPENED | ACTION.CLOSED,
  ACTION_SUBJECT.TOOLBAR,
  ACTION_SUBJECT_ID.FORMAT_COLOR,
  TextColorShowPaletteToggleAttr
>;

export type ExperimentalEventPayload =
  | TextColorSelectedAEP
  | TextColorShowPaletteToggleAEP;
