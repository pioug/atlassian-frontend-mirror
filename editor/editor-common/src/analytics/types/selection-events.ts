import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

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

export type SelectTableAEP = SelectAEP<
  ACTION_SUBJECT_ID.TABLE,
  { localId: string }
>;

export type SelectionEventPayload =
  | SelectNodeAEP
  | SelectRangeAEP
  | SelectAllAEP
  | SelectCellAEP
  | SelectTableAEP;
