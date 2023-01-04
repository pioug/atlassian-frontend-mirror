import { ErrorPayload } from '../types';

export const EVENT_SUBJECT = 'collab';
export enum COLLAB_SERVICE {
  NCS = 'ncs',
  SYNCHRONY = 'synchrony',
}
export enum EVENT_ACTION {
  CONNECTION = 'connection',
  CATCHUP = 'catchup',
  DOCUMENT_INIT = 'documentInit',
  ADD_STEPS = 'addSteps',
  CONVERT_PM_TO_ADF = 'convertPMToADF',
  UPDATE_PARTICIPANTS = 'updateParticipants',
  COMMIT_UNCONFIRMED_STEPS = 'commitUnconfirmedSteps',
  REINITIALISE_DOCUMENT = 'reinitialiseDocument',
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

type AddStepsSuccessAnalyticsEvent = {
  eventAction: EVENT_ACTION.ADD_STEPS;
  attributes: {
    eventStatus: EVENT_STATUS.SUCCESS;
    type: ADD_STEPS_TYPE.ACCEPTED;
    documentAri: string;
    latency?: number;
    stepType?: {
      [key: string]: number;
    };
  };
};

type AddStepsFailureAnalyticsEvent = {
  eventAction: EVENT_ACTION.ADD_STEPS;
  attributes: {
    eventStatus: EVENT_STATUS.FAILURE;
    type: ADD_STEPS_TYPE.REJECTED | ADD_STEPS_TYPE.ERROR;
    documentAri: string;
    latency?: number;
    error: ErrorPayload;
  };
};

export type AnalyticsEvent =
  | {
      eventAction:
        | EVENT_ACTION.CONNECTION
        | EVENT_ACTION.CATCHUP
        | EVENT_ACTION.DOCUMENT_INIT
        | EVENT_ACTION.CONVERT_PM_TO_ADF
        | EVENT_ACTION.UPDATE_PARTICIPANTS
        | EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS
        | EVENT_ACTION.REINITIALISE_DOCUMENT; // TODO: Split these up in discriminated unions
      attributes: {
        documentAri?: string;
        eventStatus?: EVENT_STATUS;
        meetsSLO?: boolean;
        latency?: number;
        error?: ErrorPayload;
        participants?: number;
        numUnconfirmedSteps?: number;
      };
    }
  | AddStepsSuccessAnalyticsEvent
  | AddStepsFailureAnalyticsEvent;

export const ACK_MAX_TRY = 30;
