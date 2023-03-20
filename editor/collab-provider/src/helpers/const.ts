import type { CollabErrorPayload } from '../types';

export enum EVENT_ACTION {
  CONNECTION = 'connection',
  RECONNECTION = 'reconnection',
  CATCHUP = 'catchup',
  DOCUMENT_INIT = 'documentInit',
  ADD_STEPS = 'addSteps',
  UPDATE_PARTICIPANTS = 'updateParticipants',
  COMMIT_UNCONFIRMED_STEPS = 'commitUnconfirmedSteps',
  REINITIALISE_DOCUMENT = 'reinitialiseDocument',
  INIT_PROVIDER = 'initProvider',
  ERROR = 'error',
  MEASURE_PERFORMANCE = 'measurePerformance',
  INIT_UFO_EXPERIENCE = 'initUFOExperience',
  PUBLISH_PAGE = 'publishPage',
}
export enum EVENT_STATUS {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}
export enum ADD_STEPS_TYPE {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR',
}

export type ErrorAnalyticsEvent = {
  eventAction: EVENT_ACTION.ERROR;
  attributes: {
    errorMessage: string;
    documentAri?: string;
    mappedError?: CollabErrorPayload;
  };
  nonPrivacySafeAttributes: {
    error: unknown;
  };
};

type AddStepsSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.ADD_STEPS;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    type: ADD_STEPS_TYPE.ACCEPTED;
    latency?: number;
    stepType?: {
      [key: string]: number;
    };
  };
};

type AddStepsFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.ADD_STEPS;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    type: ADD_STEPS_TYPE.REJECTED | ADD_STEPS_TYPE.ERROR;
    latency?: number;
  };
};

type ReInitDocFailAnalyticsEvent = {
  eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    numUnconfirmedSteps: number;
  };
};

type ReInitDocSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    numUnconfirmedSteps: number;
  };
};

type ConnectionSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.CONNECTION;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
  };
};

type ConnectionFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.CONNECTION;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    latency?: number;
  };
};

type CatchUpSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.CATCHUP;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
  };
};

type CatchUpFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.CATCHUP;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    latency?: number;
  };
};

type DocumentInitSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.DOCUMENT_INIT;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
    resetReason?: string; // Record whether document init required a page reset
    ttlEnabled?: boolean; // Record whether ttl was turned on. Currently only sent for DOCUMENT_INIT type
  };
};

type UpdateParticipantsSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.UPDATE_PARTICIPANTS;
  attributes: {
    documentAri?: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    participants: number;
  };
};

type CommitUnconfirmedStepsSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
    numUnconfirmedSteps?: number;
  };
};

type CommitUnconfirmedStepsFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    latency?: number;
    numUnconfirmedSteps?: number;
  };
};

type PublishPageSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.PUBLISH_PAGE;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
  };
};

type PublishPageFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.PUBLISH_PAGE;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    latency?: number;
  };
};

export type ActionAnalyticsEvent =
  | AddStepsSuccessAnalyticsEvent
  | AddStepsFailureAnalyticsEvent
  | ReInitDocFailAnalyticsEvent
  | ReInitDocSuccessAnalyticsEvent
  | ConnectionSuccessAnalyticsEvent
  | ConnectionFailureAnalyticsEvent
  | CatchUpSuccessAnalyticsEvent
  | CatchUpFailureAnalyticsEvent
  | DocumentInitSuccessAnalyticsEvent
  | UpdateParticipantsSuccessAnalyticsEvent
  | CommitUnconfirmedStepsSuccessAnalyticsEvent
  | CommitUnconfirmedStepsFailureAnalyticsEvent
  | PublishPageSuccessAnalyticsEvent
  | PublishPageFailureAnalyticsEvent;

export const ACK_MAX_TRY = 30;

export const CONFLUENCE = 'confluence';
