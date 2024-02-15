import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import type { ACTION, ACTION_SUBJECT, INPUT_METHOD } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

type LoomInitialisedAEP = OperationalAEP<
  ACTION.INITIALISED,
  ACTION_SUBJECT.LOOM,
  undefined,
  undefined
>;

type LoomDisabledAEP = OperationalAEP<
  ACTION.ERRORED,
  ACTION_SUBJECT.LOOM,
  undefined,
  { error?: SDKUnsupportedReasons }
>;

type RecordVideoAEP = TrackAEP<
  ACTION.RECORD_VIDEO,
  ACTION_SUBJECT.LOOM,
  undefined,
  { inputMethod: INPUT_METHOD },
  undefined
>;

type RecordVideoFailedAEP = TrackAEP<
  ACTION.RECORD_VIDEO_FAILED,
  ACTION_SUBJECT.LOOM,
  undefined,
  { inputMethod: INPUT_METHOD; error?: SDKUnsupportedReasons },
  undefined
>;

type InsertVideoAEP = TrackAEP<
  ACTION.INSERT_VIDEO,
  ACTION_SUBJECT.LOOM,
  undefined,
  { duration?: number },
  undefined
>;

export type LoomEventPayload =
  | LoomInitialisedAEP
  | LoomDisabledAEP
  | RecordVideoAEP
  | RecordVideoFailedAEP
  | InsertVideoAEP;
