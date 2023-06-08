import type { ProviderError } from '../errors/error-types';

export enum EVENT_ACTION {
  CONNECTION = 'connection',
  CATCHUP = 'catchup',
  DOCUMENT_INIT = 'documentInit',
  ADD_STEPS = 'addSteps',
  UPDATE_PARTICIPANTS = 'updateParticipants',
  COMMIT_UNCONFIRMED_STEPS = 'commitUnconfirmedSteps',
  REINITIALISE_DOCUMENT = 'reinitialiseDocument',
  ERROR = 'error',
  PUBLISH_PAGE = 'publishPage',
  GET_CURRENT_STATE = 'getCurrentState',
  INVALIDATE_TOKEN = 'invalidateToken',
  SEND_STEPS_RETRY = 'sendStepsRetry',
  CATCHUP_AFTER_MAX_SEND_STEPS_RETRY = 'catchupAfterMaxSendStepsRetry',
  DROPPED_STEPS = 'droppedStepInCatchup',
}
export enum EVENT_STATUS {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  INFO = 'INFO',
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
    errorName?: string;
    documentAri?: string;
    mappedError?: ProviderError;
  };
  nonPrivacySafeAttributes: {
    error: unknown;
  };
};

type InvalidateTokenAnalyticsEvent = {
  eventAction: EVENT_ACTION.INVALIDATE_TOKEN;
  attributes: {
    eventStatus: EVENT_STATUS.SUCCESS;
    reason?: string;
    usedCachedToken?: boolean;
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

type CatchUpDroppedStepsEvent = {
  eventAction: EVENT_ACTION.DROPPED_STEPS;
  attributes: {
    documentAri: string;
    numOfDroppedSteps: number;
  };
};

type DocumentInitSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.DOCUMENT_INIT;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
    resetReason?: string; // Record whether document init required a page reset
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

type GetCurrentStateSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.GET_CURRENT_STATE;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.SUCCESS;
    latency?: number;
  };
};

type GetCurrentStateFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.GET_CURRENT_STATE;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.FAILURE;
    latency?: number;
  };
};

type SendStepsRetryAnalyticsEvent = {
  eventAction: EVENT_ACTION.SEND_STEPS_RETRY;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.INFO;
    count: number;
  };
};

type CatchupAfterMaxSendStepsRetryAnalyticsEvent = {
  eventAction: EVENT_ACTION.CATCHUP_AFTER_MAX_SEND_STEPS_RETRY;
  attributes: {
    documentAri: string;
    eventStatus: EVENT_STATUS.INFO;
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
  | PublishPageFailureAnalyticsEvent
  | GetCurrentStateSuccessAnalyticsEvent
  | GetCurrentStateFailureAnalyticsEvent
  | InvalidateTokenAnalyticsEvent
  | SendStepsRetryAnalyticsEvent
  | CatchupAfterMaxSendStepsRetryAnalyticsEvent
  | CatchUpDroppedStepsEvent;

export const ACK_MAX_TRY = 60;

export const CONFLUENCE = 'confluence';
