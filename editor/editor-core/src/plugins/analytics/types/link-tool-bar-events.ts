import { OperationalAEP } from './utils';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';

export type RecentActivitiesPerfAEP = OperationalAEP<
  ACTION.INVOKED,
  ACTION_SUBJECT.SEARCH_RESULT,
  ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
  {
    duration: number;
    startTime: number;
    count: number;
    error?: string;
    errorCode?: number;
  },
  undefined
>;

export type LinkToolBarEventPayload = RecentActivitiesPerfAEP;

export type LinkToolBarActionType = ACTION.INVOKED;
