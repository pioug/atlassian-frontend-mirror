import { TrackAEP } from './utils';
import { ACTION_SUBJECT_ID, ACTION, ACTION_SUBJECT } from './enums';

type SelectAEP<ActionSubjectID, Attributes> = TrackAEP<
  ACTION.SELECTED,
  ACTION_SUBJECT.DOCUMENT,
  ActionSubjectID,
  Attributes,
  undefined
>;

export type SelectNodeAEP = SelectAEP<ACTION_SUBJECT_ID.NODE, { node: string }>;

export type SelectRangeAEP = SelectAEP<
  ACTION_SUBJECT_ID.RANGE,
  {
    nodes: string[];
    from: number;
    to: number;
  }
>;

export type SelectAllAEP = SelectAEP<ACTION_SUBJECT_ID.ALL, undefined>;

export type SelectCellAEP = SelectAEP<
  ACTION_SUBJECT_ID.CELL,
  { selectedCells: number; totalCells: number }
>;

export type SelectionEventPayload =
  | SelectNodeAEP
  | SelectRangeAEP
  | SelectAllAEP
  | SelectCellAEP;
