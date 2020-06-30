import { ActionSubject, ActionSubjectID, EventType } from './enums';

interface InvalidCollabEvent {
  action: CollabActions.INVALID_COLLAB_EVENT_WITHOUT_SOCKET;
  actionSubject: ActionSubject.EDITOR;
  actionSubjectId: ActionSubjectID.COLLAB;
  attributes: {
    eventName: string;
    payload: string;
  };
  eventType: EventType.TRACK;
}

interface InvalidCollabPayload {
  action: CollabActions.INVALID_COLLAB_EVENT_PAYLOAD;
  actionSubject: ActionSubject.EDITOR;
  actionSubjectId: ActionSubjectID.COLLAB;
  attributes: {
    eventName: string;
    payload: string;
    error: string;
  };
  eventType: EventType.TRACK;
}

interface InvalidAccessToSocketId {
  action: CollabActions.INVALID_ACCESS_TO_SOCKET_ID;
  actionSubject: ActionSubject.EDITOR;
  actionSubjectId: ActionSubjectID.COLLAB;
  eventType: EventType.TRACK;
}

export type CollabAnalyticsEvents =
  | InvalidCollabEvent
  | InvalidCollabPayload
  | InvalidAccessToSocketId;

export enum CollabActions {
  INVALID_COLLAB_EVENT_WITHOUT_SOCKET = 'invalidCollabEventWithoutSocket',
  INVALID_COLLAB_EVENT_PAYLOAD = 'invalidCollabEventPayload',
  INVALID_ACCESS_TO_SOCKET_ID = 'invalidAccessToSocketId',
}
