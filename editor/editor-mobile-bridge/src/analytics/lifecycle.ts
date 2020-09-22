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

interface StartWebBundleCalledTwice {
  action: EditorLifecycleActions.START_WEB_BUNDLE_CALLED_TWICE;
  actionSubject: ActionSubject.EDITOR;
  eventType: EventType.OPERATIONAL;
}

interface StartWebBundleCalledBeforeLifecycleBridgeSetup {
  action: EditorLifecycleActions.START_WEB_BUNDLE_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP;
  actionSubject: ActionSubject.EDITOR;
  eventType: EventType.TRACK;
}

interface EditorError {
  action: EditorLifecycleActions.EDITOR_ERROR;
  actionSubject: ActionSubject.EDITOR;
  eventType: EventType.OPERATIONAL;
  attributes: {
    isBridgeSetup: boolean;
    errorMessage: string;
  };
}

export type EditorLifecycleAnalyticsEvents =
  | EditorReadyCalledTwice
  | EditorReadyCalledBeforeLifecycleBridgeSetup
  | StartWebBundleCalledTwice
  | StartWebBundleCalledBeforeLifecycleBridgeSetup
  | EditorError;

export enum EditorLifecycleActions {
  EDITOR_READY_CALLED_TWICE = 'editorReadyCalledTwice',
  EDITOR_READY_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP = 'editorReadyCalledBeforeLifecycleBridgeSetup',
  START_WEB_BUNDLE_CALLED_TWICE = 'startWebBundleCalledTwice',
  START_WEB_BUNDLE_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP = 'startWebBundleCalledBeforeLifecycleBridgeSetup',
  EDITOR_ERROR = 'editorError',
}
