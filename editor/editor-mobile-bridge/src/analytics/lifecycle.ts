import { ActionSubject, EventType } from './enums';

interface EditorReadyCalledTwice {
  action: EditorLifecycleActions.EDITOR_READY_CALLED_TWICE;
  actionSubject: ActionSubject.EDITOR;
  eventType: EventType.OPERATIONAL;
}

interface EditorReadyCalledBeforeLifecycleBridgeSetup {
  action: EditorLifecycleActions.EDITOR_READY_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP;
  actionSubject: ActionSubject.EDITOR;
  eventType: EventType.TRACK;
}

export type EditorLifecycleAnalyticsEvents =
  | EditorReadyCalledTwice
  | EditorReadyCalledBeforeLifecycleBridgeSetup;

export enum EditorLifecycleActions {
  EDITOR_READY_CALLED_TWICE = 'editorReadyCalledTwice',
  EDITOR_READY_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP = 'editorReadyCalledBeforeLifecycleBridgeSetup',
}
