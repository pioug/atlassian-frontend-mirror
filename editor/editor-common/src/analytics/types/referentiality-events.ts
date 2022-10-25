import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from './enums';
import { OperationalAEP } from './utils';

type InitialiseFragmentMarks = OperationalAEP<
  ACTION.INITIALISED,
  ACTION_SUBJECT.DOCUMENT,
  ACTION_SUBJECT_ID.FRAGMENT_MARKS,
  {
    duration: number;
    docSize: number;
    count: number;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type ReferentialityEventPayload = InitialiseFragmentMarks;
