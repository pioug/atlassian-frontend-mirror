import { TrackAEP } from './utils';
import { ACTION, ACTION_SUBJECT } from './enums';

type CopyAEP = TrackAEP<
  ACTION.COPIED,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    content: string[];
  },
  undefined
>;

type CutAEP = TrackAEP<
  ACTION.CUT,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    content: string[];
  },
  undefined
>;

export type CutCopyEventPayload = CutAEP | CopyAEP;
