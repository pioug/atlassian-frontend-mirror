import { ACTION, ACTION_SUBJECT_ID, ACTION_SUBJECT } from './enums';
import { TrackAEP } from './utils';

type ExperimentalAEP<
  Action,
  ActionSubject,
  ActionSubjectId,
  Attributes
> = TrackAEP<
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
  isShowingMoreColors: boolean;
  isNewColor: boolean;
}
export type TextColorSelectedAEP = ExperimentalAEP<
  ACTION.FORMATTED,
  ACTION_SUBJECT.TEXT,
  ACTION_SUBJECT_ID.FORMAT_COLOR,
  TextColorSelectedAttr
>;

// show more/less colours
export interface TextColorShowMoreToggleAttr {
  showMoreButton: boolean;
  showLessButton: boolean;
}
export type TextColorShowMoreToggleAEP = ExperimentalAEP<
  ACTION.OPENED | ACTION.CLOSED,
  ACTION_SUBJECT.TOOLBAR,
  ACTION_SUBJECT_ID.FORMAT_COLOR,
  TextColorShowMoreToggleAttr
>;

// panel opened/closed
export interface TextColorShowPaletteToggleAttr {
  isShowingMoreColors: boolean;
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
  | TextColorShowMoreToggleAEP
  | TextColorShowPaletteToggleAEP;
