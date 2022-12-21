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

export type AnalyticsEvent = {
  eventAction: EVENT_ACTION;
  attributes: {
    documentAri?: string;
    eventStatus?: EVENT_STATUS;
    meetsSLO?: boolean;
    latency?: number;
    error?: ErrorPayload;
    participants?: number;
    numUnconfirmedSteps?: number;
  };
};

export const ACK_MAX_TRY = 30;
