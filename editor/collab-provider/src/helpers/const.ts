import { ErrorPayload } from '../types';

export const ATTRIBUTES_PACKAGE = 'collabProvider';

export const EVENT_SUBJECT = 'collab';
export enum EVENT_ACTION {
  CONNECTION = 'connection',
  CATCHUP = 'catchup',
  DOCUMENT_INIT = 'documentInit',
  ADD_STEPS = 'addSteps',
  CONVERT_PM_TO_ADF = 'convertPMToADF',
}
export enum EVENT_STATUS {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export type AnalyticsEvent = {
  eventAction: EVENT_ACTION;
  attributes: {
    eventStatus: EVENT_STATUS;
    meetsSLO?: boolean;
    latency?: number;
    error?: ErrorPayload;
  };
};

export const ACK_MAX_TRY = 10;
